from __future__ import annotations

import json
import hashlib
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np

from app.core.config import settings


@dataclass
class ProcessedReading:
    machine_id: str
    channel: str
    timestamp_start_sec: float
    timestamp_end_sec: float
    sequence: int
    value_summary: float
    display_unit: str
    source_metadata: Dict[str, Any]
    features: Dict[str, Any]
    quality: Dict[str, Any]
    anomaly_score_raw: Optional[float] = None
    anomaly_decision: Optional[str] = None
    anomaly_reason: Optional[str] = None

    def to_api_reading(self) -> Dict[str, Any]:
        label = "acoustic level (uncalibrated)" if self.channel == "acoustic" else "vibration level (uncalibrated)"
        if self.anomaly_decision == "anomalous":
            state = "warning"
        elif self.quality.get("isValid"):
            state = "online"
        else:
            state = "invalid"
        return {
            "id": f"rdg-{self.machine_id}-{self.channel}-{self.sequence}",
            "sensorId": f"SNS-{self.machine_id}-{self.channel}",
            "machineId": self.machine_id,
            "sensorType": "sound" if self.channel == "acoustic" else "vibration",
            "channel": self.channel,
            "value": float(self.value_summary),
            "unit": self.display_unit,
            "label": label,
            "timestamp": None,
            "windowStartSec": self.timestamp_start_sec,
            "windowEndSec": self.timestamp_end_sec,
            "state": state,
            "sourceMetadata": self.source_metadata,
            "features": self.features,
            "quality": self.quality,
            "anomalyScoreRaw": self.anomaly_score_raw,
            "anomalyDecision": self.anomaly_decision,
            "anomalyReason": self.anomaly_reason,
        }


class InMemoryStore:
    def __init__(self):
        self.machines: List[Dict[str, Any]] = []
        self.readings_latest: Dict[str, Dict[str, ProcessedReading]] = {}  # machine_id -> channel -> reading
        self.readings_history: Dict[str, Dict[str, List[ProcessedReading]]] = {}
        self.anomalies: List[Dict[str, Any]] = []
        self.inspection: Dict[str, Any] = {}
        self.pipeline_status: Dict[str, Any] = {"ready": False, "anomalyDetection": "unavailable", "notes": []}

    def set_machines(self, machines: List[Dict[str, Any]]):
        self.machines = machines

    def upsert_reading(self, reading: ProcessedReading):
        self.readings_latest.setdefault(reading.machine_id, {})[reading.channel] = reading
        self.readings_history.setdefault(reading.machine_id, {}).setdefault(reading.channel, []).append(reading)
        # cap history in memory
        hist = self.readings_history[reading.machine_id][reading.channel]
        if len(hist) > 500:
            del hist[: len(hist) - 500]

    def get_latest(self, machine_id: str) -> Dict[str, Any]:
        ch_map = self.readings_latest.get(machine_id, {})
        return {ch: r.to_api_reading() for ch, r in ch_map.items()}

    def get_history(self, machine_id: str, channel: Optional[str] = None, limit: int = 200) -> List[Dict[str, Any]]:
        out = []
        m = self.readings_history.get(machine_id, {})
        channels = [channel] if channel else list(m.keys())
        for ch in channels:
            for r in m.get(ch, [])[-limit:]:
                out.append(r.to_api_reading())
        out.sort(key=lambda x: (x.get("windowStartSec", 0), x.get("channel", "")))
        return out

    def cache_key(self, payload: Any) -> str:
        s = json.dumps(payload, sort_keys=True, default=str).encode("utf-8")
        return hashlib.sha256(s).hexdigest()

    def save_cache(self, name: str, obj: Any):
        path = settings.cache_path / name
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(obj, f, default=str)
        except Exception:
            pass


store = InMemoryStore()
