from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
from scipy import signal

from app.core.config import settings


def _hz_to_mel(hz: np.ndarray) -> np.ndarray:
    return 2595.0 * np.log10(1.0 + hz / 700.0)


def _mel_to_hz(mel: np.ndarray) -> np.ndarray:
    return 700.0 * (10 ** (mel / 2595.0) - 1.0)


def mel_filterbank(sr: int, n_fft: int, n_mels: int, fmin: float = 0.0, fmax: float | None = None) -> np.ndarray:
    if fmax is None:
        fmax = sr / 2.0
    n_freqs = n_fft // 2 + 1
    mels = np.linspace(_hz_to_mel(np.array([fmin]))[0], _hz_to_mel(np.array([fmax]))[0], n_mels + 2)
    hz = _mel_to_hz(mels)
    bins = np.floor((n_fft + 1) * hz / sr).astype(int)
    bins = np.clip(bins, 0, n_freqs - 1)
    fb = np.zeros((n_mels, n_freqs), dtype=np.float64)
    for i in range(1, n_mels + 1):
        l, c, r = bins[i - 1], bins[i], bins[i + 1]
        if c > l:
            fb[i - 1, l:c] = (np.arange(l, c) - l) / float(max(c - l, 1))
        if r > c:
            fb[i - 1, c:r] = (r - np.arange(c, r)) / float(max(r - c, 1))
    # normalize
    enorm = 2.0 / (hz[2:n_mels + 2] - hz[:n_mels])
    fb *= enorm[:, np.newaxis]
    return fb


def time_domain_features(x: np.ndarray) -> Dict[str, Any]:
    x = np.asarray(x, dtype=np.float64)
    finite = x[np.isfinite(x)]
    if finite.size == 0:
        return {}
    rms = float(np.sqrt(np.mean(finite ** 2)))
    peak = float(np.max(np.abs(finite)))
    mean = float(np.mean(finite))
    std = float(np.std(finite))
    var = float(np.var(finite))
    # kurtosis (Fisher) and skewness
    if std > 1e-12:
        centered = finite - mean
        m4 = float(np.mean(centered ** 4))
        m3 = float(np.mean(centered ** 3))
        kurt = float(m4 / (var ** 2) - 3.0)
        skew = float(m3 / (std ** 3))
        crest = float(peak / rms) if rms > 1e-12 else None
    else:
        kurt = 0.0
        skew = 0.0
        crest = None
    ptp = float(np.ptp(finite))
    return {
        "rms": rms,
        "peakAbs": peak,
        "peakToPeak": ptp,
        "mean": mean,
        "std": std,
        "kurtosis": kurt,
        "skewness": skew,
        "crestFactor": crest,
    }


def acoustic_features(x: np.ndarray, sr: int) -> Dict[str, Any]:
    """Acoustic: 64 Mel bands, n_fft=1024, hop_length=256 over 1s window at 16 kHz."""
    x = np.asarray(x, dtype=np.float64)
    n_fft = settings.acoustic_n_fft
    hop = settings.acoustic_hop_length
    n_mels = settings.acoustic_mel_bands
    # STFT magnitude/power
    if x.size < n_fft:
        pad = n_fft - x.size
        x = np.pad(x, (0, pad))
    noverlap = n_fft - hop
    f, t, Zxx = signal.stft(x, fs=sr, nperseg=n_fft, noverlap=noverlap, nfft=n_fft, boundary=None, padded=False)
    power = (np.abs(Zxx) ** 2)
    fb = mel_filterbank(sr, n_fft, n_mels)
    mel = np.dot(fb, power)  # (n_mels, frames)
    mel_db_like = np.log10(np.maximum(mel, 1e-12))  # relative log scale, uncalibrated
    mel_band_means = mel_db_like.mean(axis=1)
    mel_band_max = mel_db_like.max(axis=1)
    # summary spectral features
    freqs = f
    psd_mean = power.mean(axis=1) if power.ndim == 2 else power
    psd_sum = float(np.sum(psd_mean)) + 1e-12
    centroid = float(np.sum(freqs * psd_mean) / psd_sum)
    dom_idx = int(np.argmax(psd_mean))
    dominant = float(freqs[dom_idx]) if freqs.size else None
    feats = time_domain_features(x)
    feats.update({
        "spectralCentroidHz": centroid,
        "dominantFrequencyHz": dominant,
        "melBandMeansLog10": [float(v) for v in mel_band_means],
        "melBandMaxLog10": [float(v) for v in mel_band_max],
        "nFft": n_fft,
        "hopLength": hop,
        "melBands": n_mels,
    })
    return feats


def vibration_features(x: np.ndarray, sr: int) -> Dict[str, Any]:
    """Vibration: STFT 256-sample Hann window, 128-sample hop."""
    x = np.asarray(x, dtype=np.float64)
    nperseg = settings.vibration_stft_nperseg
    hop = settings.vibration_stft_hop
    noverlap = nperseg - hop
    window = signal.get_window("hann", nperseg, fftbins=True)
    if x.size < nperseg:
        x = np.pad(x, (0, nperseg - x.size))
    f, t, Zxx = signal.stft(x, fs=sr, window=window, nperseg=nperseg, noverlap=noverlap, boundary=None, padded=False)
    mag = np.abs(Zxx)
    power = mag ** 2
    psd_mean = power.mean(axis=1) if power.ndim == 2 else power
    psd_sum = float(np.sum(psd_mean)) + 1e-12
    freqs = f
    centroid = float(np.sum(freqs * psd_mean) / psd_sum)
    dom_idx = int(np.argmax(psd_mean))
    dominant = float(freqs[dom_idx]) if freqs.size else None
    # band energies in conditioned range
    def band_energy(lo, hi):
        mask = (freqs >= lo) & (freqs < hi)
        return float(np.sum(psd_mean[mask])) if np.any(mask) else 0.0
    feats = time_domain_features(x)
    feats.update({
        "spectralCentroidHz": centroid,
        "dominantFrequencyHz": dominant,
        "stftWindow": "hann",
        "stftNperseg": nperseg,
        "stftHop": hop,
        "bandEnergy_10_100Hz": band_energy(10, 100),
        "bandEnergy_100_1000Hz": band_energy(100, 1000),
        "bandEnergy_1000_4500Hz": band_energy(1000, 4500),
        "stftMagMeanShape": [int(mag.shape[0]), int(mag.shape[1])] if mag.ndim == 2 else list(mag.shape),
    })
    return feats


def vectorize_features(channel: str, feats: Dict[str, Any]) -> np.ndarray:
    if channel == "acoustic":
        base = [feats.get(k, 0.0) for k in ["rms", "peakAbs", "peakToPeak", "std", "kurtosis", "skewness", "crestFactor", "spectralCentroidHz", "dominantFrequencyHz"]]
        mel = feats.get("melBandMeansLog10", [])
        vec = np.array([0.0 if v is None else float(v) for v in base] + [float(v) for v in mel], dtype=np.float64)
        return vec
    if channel == "vibration":
        base = [feats.get(k, 0.0) for k in ["rms", "peakAbs", "peakToPeak", "std", "kurtosis", "skewness", "crestFactor", "spectralCentroidHz", "dominantFrequencyHz", "bandEnergy_10_100Hz", "bandEnergy_100_1000Hz", "bandEnergy_1000_4500Hz"]]
        vec = np.array([0.0 if v is None else float(v) for v in base], dtype=np.float64)
        return vec
    return np.array([], dtype=np.float64)
