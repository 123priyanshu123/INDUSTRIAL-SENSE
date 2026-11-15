from __future__ import annotations

from typing import Optional, Tuple

import numpy as np
from scipy import signal


def to_1d_float(x: np.ndarray) -> np.ndarray:
    return np.asarray(x, dtype=np.float64).ravel()


def resample_to(x: np.ndarray, orig_sr: float, target_sr: int) -> Tuple[np.ndarray, float]:
    """Resample to canonical sample rate; preserves deterministic behavior for given input."""
    x = to_1d_float(x)
    if orig_sr is None or orig_sr <= 0:
        orig_sr = float(target_sr)
    if int(round(orig_sr)) == int(target_sr):
        return x.copy(), float(target_sr)
    # Use polyphase resampling for quality/determinism
    # Convert rates to integer ratio
    from math import gcd
    up = int(target_sr)
    down = int(round(orig_sr))
    g = gcd(up, down)
    up //= g
    down //= g
    y = signal.resample_poly(x, up=up, down=down)
    return np.asarray(y, dtype=np.float64), float(target_sr)


def detrend_and_normalize(x: np.ndarray) -> np.ndarray:
    x = to_1d_float(x)
    if x.size == 0:
        return x
    x = signal.detrend(x, type="constant")
    std = float(np.std(x))
    if std > 1e-12:
        x = x / std
    return x


def butter_bandpass_10_4500(sr: int, low_hz: float = 10.0, high_hz: float = 4500.0, order: int = 4):
    nyq = 0.5 * sr
    low = max(low_hz / nyq, 1e-6)
    high = min(high_hz / nyq, 0.999999)
    if high <= low:
        high = min(low + 0.1, 0.999999)
    sos = signal.butter(order, [low, high], btype="bandpass", output="sos")
    return sos


def apply_vibration_conditioning(x: np.ndarray, sr: int, low_hz: float, high_hz: float) -> np.ndarray:
    x = to_1d_float(x)
    if x.size < 10:
        return x
    sos = butter_bandpass_10_4500(sr, low_hz=low_hz, high_hz=high_hz, order=4)
    # sosfiltfilt for zero-phase; deterministic for same input
    try:
        y = signal.sosfiltfilt(sos, x)
    except Exception:
        y = signal.sosfilt(sos, x)
    return np.asarray(y, dtype=np.float64)
