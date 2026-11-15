from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional, Protocol

import numpy as np


@dataclass
class FeatureVector:
    """Clean ML interface schema for one processed window."""
    machine_id: str
    channel: str  # 'acoustic' | 'vibration'
    window_start_sec: float
    window_end_sec: float
    canonical_sample_rate_hz: int
    vector: np.ndarray
    feature_names: list[str]
    features: Dict[str, Any]
    quality: Dict[str, Any]
    source_metadata: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "machineId": self.machine_id,
            "channel": self.channel,
            "windowStartSec": self.window_start_sec,
            "windowEndSec": self.window_end_sec,
            "canonicalSampleRateHz": self.canonical_sample_rate_hz,
            "vector": [float(x) for x in self.vector.tolist()],
            "featureNames": self.feature_names,
            "features": self.features,
            "quality": self.quality,
            "sourceMetadata": self.source_metadata,
        }


class AnomalyScorer(Protocol):
    available: bool

    def score(self, channel: str, vec: np.ndarray) -> tuple[Optional[float], Optional[str], Optional[str]]:
        """Return (raw_score, decision_label, reason). Raw score is NOT a probability."""
        ...


def feature_names_for_channel(channel: str, features: Dict[str, Any]) -> list[str]:
    if channel == "acoustic":
        base = ["rms", "peakAbs", "peakToPeak", "std", "kurtosis", "skewness", "crestFactor", "spectralCentroidHz", "dominantFrequencyHz"]
        mel_n = len(features.get("melBandMeansLog10", []))
        return base + [f"melBandMeanLog10_{i}" for i in range(mel_n)]
    if channel == "vibration":
        return ["rms", "peakAbs", "peakToPeak", "std", "kurtosis", "skewness", "crestFactor", "spectralCentroidHz", "dominantFrequencyHz", "bandEnergy_10_100Hz", "bandEnergy_100_1000Hz", "bandEnergy_1000_4500Hz"]
    return []
