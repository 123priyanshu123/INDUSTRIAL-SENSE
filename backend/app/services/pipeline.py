from __future__ import annotations

from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np

from app.core.config import settings
from app.dsp_conditioning_engine.conditioning import apply_vibration_conditioning, detrend_and_normalize, resample_to, to_1d_float
from app.feature_and_tensor_extractor.extract import acoustic_features, vectorize_features, vibration_features
from app.feature_store_and_publisher.store import ProcessedReading, store
from app.ingestion_adapters.kaist_mat import LoadedSignal, load_selected_recordings
from app.schema_and_quality_gate.quality import assess_window, clean_window
from app.stream_synchronizer.windows import WindowSpec, iter_windows


class BasicHealthyBaselineDetector:
    """Basic healthy-baseline anomaly detection (not a calibrated probability).
    Trains only on provided verified healthy feature vectors.
    """
    def __init__(self):
        self.available = False
        self.channel_stats: Dict[str, Dict[str, Any]] = {}
        self.threshold: float = 3.0  # robust z threshold in std units (configurable/simple)

    def fit(self, vectors_by_channel: Dict[str, np.ndarray]):
        stats = {}
        for ch, X in vectors_by_channel.items():
            if X.size == 0 or X.shape[0] < 1:
                continue
            mean = np.mean(X, axis=0)
            std = np.std(X, axis=0)
            std = np.where(std < 1e-9, 1.0, std)
            stats[ch] = {"mean": mean, "std": std, "n": int(X.shape[0])}
        self.channel_stats = stats
        self.available = len(stats) > 0

    def score(self, channel: str, vec: np.ndarray) -> Tuple[Optional[float], Optional[str], Optional[str]]:
        if not self.available or channel not in self.channel_stats:
            return None, None, "anomaly_detection_unavailable_no_verified_healthy_baseline"
        st = self.channel_stats[channel]
        z = (vec - st["mean"]) / st["std"]
        # raw anomaly score: mean absolute standardized deviation (not a probability)
        score = float(np.mean(np.abs(z))) if z.size else 0.0
        if score >= self.threshold:
            decision = "anomalous"
        elif score >= (self.threshold * 0.7):
            decision = "elevated"
        else:
            decision = "normal"
        reason = f"distance_from_healthy_baseline_raw_score (n_baseline_windows={st['n']}, threshold={self.threshold})"
        return score, decision, reason


detector = BasicHealthyBaselineDetector()


def _machine_id_for_signal(sig: LoadedSignal, idx: int) -> str:
    meta = sig.metadata
    base = Path(meta.relative_path).stem.replace(" ", "_") or f"recording_{idx}"
    ch = meta.channel if meta.channel in ("acoustic", "vibration") else "sig"
    ch_info = getattr(meta, "channel_info", None) or {}
    ch_key = str(ch_info.get("key") or ch_info.get("label") or ch_info.get("index") or "").replace(" ", "_")
    suffix = f"-{ch_key}" if ch_key else ""
    return f"kaist-{base}-{ch}{suffix}-{idx}"


def process_signal(sig: LoadedSignal, machine_id: str, collect_vectors: bool = False) -> Tuple[List[ProcessedReading], List[np.ndarray]]:
    meta = sig.metadata
    ch = meta.channel if meta.channel in ("acoustic", "vibration") else "acoustic"
    orig_sr = meta.source_sample_rate_hz or (settings.acoustic_canonical_sr if ch == "acoustic" else settings.vibration_canonical_sr)
    target_sr = settings.acoustic_canonical_sr if ch == "acoustic" else settings.vibration_canonical_sr
    x, canon_sr_f = resample_to(sig.data, float(orig_sr), target_sr)
    canon_sr = int(round(canon_sr_f))

    if ch == "vibration":
        spec = WindowSpec(canon_sr, settings.vibration_window_sec, settings.vibration_hop_sec)
    else:
        spec = WindowSpec(canon_sr, settings.acoustic_window_sec, settings.acoustic_hop_sec)

    readings: List[ProcessedReading] = []
    vectors: List[np.ndarray] = []
    seq = 0
    for frame in iter_windows(x, spec):
        w = clean_window(frame.data)
        q = assess_window(w)
        source_meta = {
            "sourcePath": meta.relative_path,
            "sourceKey": meta.source_key,
            "modality": getattr(meta, "modality", ch),
            "channel": ch,
            "sourceUnit": meta.source_unit,
            "calibrationState": meta.calibration_state,
            "sourceSampleRateHz": meta.source_sample_rate_hz,
            "samplingRateSource": getattr(meta, "sampling_rate_source", None),
            "canonicalSampleRateHz": canon_sr,
            "originalShape": list(meta.original_shape) if meta.original_shape else None,
            "timeAxis": getattr(meta, "time_axis", None),
            "channelInfo": getattr(meta, "channel_info", None),
            "recordingInfo": getattr(meta, "recording_info", None),
            "notes": meta.notes,
        }
        features: Dict[str, Any] = {}
        anomaly_score = None
        anomaly_decision = None
        anomaly_reason = None
        value_summary = 0.0
        if q.is_valid:
            if ch == "vibration":
                wc = apply_vibration_conditioning(w, canon_sr, settings.vibration_bp_low_hz, settings.vibration_bp_high_hz)
                wc = detrend_and_normalize(wc)
                features = vibration_features(wc, canon_sr)
                value_summary = float(features.get("rms", 0.0))
            else:
                wc = detrend_and_normalize(w)
                features = acoustic_features(wc, canon_sr)
                value_summary = float(features.get("rms", 0.0))
            features["pipeline"] = {
                "windowSec": spec.window_sec,
                "hopSec": spec.hop_sec,
                "canonicalSampleRateHz": canon_sr,
                "identicalForOfflineAndPlayback": True,
            }
            vec = vectorize_features(ch, features)
            if collect_vectors and vec.size:
                vectors.append(vec)
            if vec.size:
                anomaly_score, anomaly_decision, anomaly_reason = detector.score(ch, vec)
        else:
            features = {"pipeline": {"windowSec": spec.window_sec, "hopSec": spec.hop_sec, "canonicalSampleRateHz": canon_sr}}

        display_unit = meta.source_unit or "unknown (unit not found in verified metadata)"
        reading = ProcessedReading(
            machine_id=machine_id,
            channel=ch,
            timestamp_start_sec=float(frame.start_sec),
            timestamp_end_sec=float(frame.end_sec),
            sequence=seq,
            value_summary=value_summary,
            display_unit=display_unit,
            source_metadata=source_meta,
            features=features,
            quality=q.to_dict(),
            anomaly_score_raw=anomaly_score,
            anomaly_decision=anomaly_decision,
            anomaly_reason=anomaly_reason,
        )
        readings.append(reading)
        seq += 1
    return readings, vectors


def run_pipeline() -> Dict[str, Any]:
    signals, report = load_selected_recordings()
    store.inspection = report
    store.readings_latest.clear()
    store.readings_history.clear()
    store.anomalies.clear()
    store.machines = []

    notes: List[str] = []
    counts = report.get("counts", {}) or {}
    if not signals:
        store.pipeline_status = {
            "ready": False,
            "anomalyDetection": "unavailable",
            "notes": report.get("warnings", []) + (["No signals ingested/loaded for processing."] if counts.get("discovered", 0) > 0 else ["No signals loaded. Set KAIST_DATA_ROOT to a local/Google Drive for Desktop path containing KAIST .mat files."]),
            "dsp": "configured_per_blueprint_pending_data",
            "counts": counts,
        }
        store.save_cache("inspection_report.json", report)
        return {"status": store.pipeline_status, "inspection": report}

    # Determine verified healthy baseline recordings by configured relative paths
    healthy_rel = set(settings.healthy_baseline_files)

    # First pass: collect healthy vectors if configured
    healthy_vectors: Dict[str, List[np.ndarray]] = {"acoustic": [], "vibration": []}
    precomputed: List[Tuple[str, LoadedSignal, List[ProcessedReading], List[np.ndarray]]] = []
    for i, sig in enumerate(signals):
        machine_id = _machine_id_for_signal(sig, i)
        is_healthy = sig.metadata.relative_path in healthy_rel if healthy_rel else False
        readings, vecs = process_signal(sig, machine_id, collect_vectors=is_healthy)
        precomputed.append((machine_id, sig, readings, vecs))
        if is_healthy:
            healthy_vectors.setdefault(sig.metadata.channel, []).extend(vecs)

    # Fit detector only on verified healthy baseline windows
    vectors_by_channel = {ch: np.vstack(vs) for ch, vs in healthy_vectors.items() if len(vs) > 0}
    if vectors_by_channel:
        detector.fit(vectors_by_channel)
        notes.append(f"Basic healthy-baseline anomaly detection trained on verified healthy windows: {{ {', '.join([f'{k}:{v.shape[0]}' for k,v in vectors_by_channel.items()])} }}")
    else:
        detector.available = False
        detector.channel_stats = {}
        if healthy_rel:
            notes.append("KAIST_HEALTHY_BASELINE_FILES configured but no matching loaded recordings/windows found; anomaly detection unavailable.")
        else:
            notes.append("No verified healthy baseline recordings configured (KAIST_HEALTHY_BASELINE_FILES empty); anomaly detection unavailable. Provide verified healthy recordings to enable baseline scoring.")

    # Second pass: if detector became available and we didn't score during collect (we only collected for healthy), rescore all windows
    for machine_id, sig, readings, _ in precomputed:
        if detector.available:
            rescored: List[ProcessedReading] = []
            # re-run lightweight scoring by recomputing vectors for valid readings? easier: reprocess without collect
            readings, _ = process_signal(sig, machine_id, collect_vectors=False)
        for r in readings:
            store.upsert_reading(r)
            if r.anomaly_decision == "anomalous" and r.quality.get("isValid"):
                store.anomalies.append({
                    "id": f"anm-{r.machine_id}-{r.channel}-{r.sequence}",
                    "machineId": r.machine_id,
                    "machineName": machine_id,
                    "sensorType": "sound" if r.channel == "acoustic" else "vibration",
                    "channel": r.channel,
                    "anomalyScoreRaw": r.anomaly_score_raw,
                    "decision": r.anomaly_decision,
                    "severity": "warning",
                    "confidence": None,
                    "confidenceNote": "Not a calibrated probability; raw distance-from-healthy-baseline score.",
                    "detectionWindow": {"startSec": r.timestamp_start_sec, "endSec": r.timestamp_end_sec},
                    "explanation": r.anomaly_reason,
                    "model": "basic_healthy_baseline_distance_v1",
                    "status": "active",
                    "sourceMetadata": r.source_metadata,
                })
        latest = store.get_latest(machine_id)
        health = 100
        if any(a.get("machineId") == machine_id for a in store.anomalies):
            health = 72
        ch_info = getattr(sig.metadata, "channel_info", None) or {}
        rec_info = getattr(sig.metadata, "recording_info", None) or {}
        store.machines.append({
            "id": machine_id,
            "code": machine_id.upper()[:16],
            "name": f"KAIST {Path(sig.metadata.relative_path).stem} ({sig.metadata.channel}{' ' + str(ch_info.get('key')) if ch_info.get('key') else ''})",
            "category": "Rotating Equipment (KAIST)",
            "industry": "KAIST Rotating-Machine Dataset",
            "status": "warning" if health < 90 else "running",
            "healthScore": health,
            "supportedSensors": sorted(list(latest.keys())) or [sig.metadata.channel],
            "supportedChannels": sorted(list(latest.keys())) or [sig.metadata.channel],
            "source": {
                "relativePath": sig.metadata.relative_path,
                "sourceKey": sig.metadata.source_key,
                "modality": getattr(sig.metadata, "modality", sig.metadata.channel),
                "sourceUnit": sig.metadata.source_unit,
                "calibrationState": sig.metadata.calibration_state,
                "sourceSampleRateHz": sig.metadata.source_sample_rate_hz,
                "samplingRateSource": getattr(sig.metadata, "sampling_rate_source", None),
                "channelInfo": ch_info,
                "recordingInfo": rec_info,
            },
            "lastUpdated": "processed",
            "activeAlertCount": len([a for a in store.anomalies if a.get("machineId") == machine_id]),
            "animationAvailable": False,
            "components": [],
            "sensorLocations": [],
        })

    store.pipeline_status = {
        "ready": True,
        "anomalyDetection": "enabled" if detector.available else "unavailable",
        "notes": notes + report.get("warnings", []),
        "dsp": {
            "acoustic": {"canonicalSampleRateHz": settings.acoustic_canonical_sr, "windowSec": settings.acoustic_window_sec, "hopSec": settings.acoustic_hop_sec, "melBands": settings.acoustic_mel_bands, "nFft": settings.acoustic_n_fft, "hopLength": settings.acoustic_hop_length},
            "vibration": {"canonicalSampleRateHz": settings.vibration_canonical_sr, "windowSec": settings.vibration_window_sec, "hopSec": settings.vibration_hop_sec, "bandpassHz": [settings.vibration_bp_low_hz, settings.vibration_bp_high_hz], "stftWindow": "hann", "stftNperseg": settings.vibration_stft_nperseg, "stftHop": settings.vibration_stft_hop},
            "quality": {"maxNanRatio": settings.max_nan_ratio, "flatlineDetection": True, "clippingDetection": True},
            "identicalForOfflineAndPlayback": True,
        },
        "signalsLoaded": len(signals),
        "machines": len(store.machines),
        "counts": report.get("counts", {}),
    }
    store.save_cache("inspection_report.json", report)
    store.save_cache("pipeline_status.json", store.pipeline_status)
    return {"status": store.pipeline_status, "inspection": report}


def get_status() -> Dict[str, Any]:
    return {"status": store.pipeline_status, "inspection": store.inspection}
