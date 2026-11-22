from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

import joblib
import numpy as np
import onnxruntime as ort

BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"


class IndustrialSenseInference:
    def __init__(self, artifacts_dir: Path = ARTIFACTS_DIR) -> None:
        self.artifacts_dir = artifacts_dir
        self.ready: bool = False
        self.error: str | None = None
        self.feature_columns: List[str] = []
        self.metadata: Dict[str, Any] = {}
        self.scaler = None
        self.session: ort.InferenceSession | None = None
        self.input_name: str = ""
        self.output_name: str = ""
        self.threshold_mse: float = 0.0

    def load(self) -> None:
        try:
            with open(self.artifacts_dir / "feature_columns.json", "r", encoding="utf-8") as f:
                self.feature_columns = json.load(f)

            with open(self.artifacts_dir / "model_metadata.json", "r", encoding="utf-8") as f:
                self.metadata = json.load(f)

            self.scaler = joblib.load(self.artifacts_dir / "robust_scaler.joblib")
            self.session = ort.InferenceSession(
                str(self.artifacts_dir / "industrialsense_ae.onnx"),
                providers=["CPUExecutionProvider"],
            )

            self.input_name = self.session.get_inputs()[0].name
            self.output_name = self.session.get_outputs()[0].name
            self.threshold_mse = float(self.metadata["anomaly_threshold_mse"])
            self.ready = True
            self.error = None
        except Exception as exc:
            self.ready = False
            self.error = str(exc)
            raise

    def validate_and_vectorize(self, features: Dict[str, float]) -> np.ndarray:
        if not self.ready:
            raise RuntimeError(f"Inference engine not ready: {self.error}")

        missing = [col for col in self.feature_columns if col not in features]
        if missing:
            raise ValueError(f"Missing {len(missing)} required features: {missing}")

        ordered = [float(features[col]) for col in self.feature_columns]
        vec = np.array([ordered], dtype=np.float64)

        if not np.all(np.isfinite(vec)):
            raise ValueError("All feature values must be finite numbers (no NaN or Inf).")

        return vec

    def predict(self, machine_id: str, features: Dict[str, float]) -> Dict[str, Any]:
        raw_vec = self.validate_and_vectorize(features)

        # 1. Scale using healthy baseline RobustScaler
        scaled = self.scaler.transform(raw_vec).astype(np.float32)

        # 2. Run ONNX Autoencoder reconstruction
        reconstructed = self.session.run(
            [self.output_name],
            {self.input_name: scaled},
        )[0]

        # 3. Compute reconstruction error (MSE) & compare to threshold
        per_feature_mse = np.mean((scaled - reconstructed) ** 2, axis=0)
        mse = float(np.mean(per_feature_mse))
        is_anomaly = bool(mse > self.threshold_mse)
        anomaly_ratio = float(mse / self.threshold_mse) if self.threshold_mse > 0 else 0.0

        # 4. Health score (0-100) & severity tier for frontend display
        health_score = float(np.clip(100.0 * (1.0 - (anomaly_ratio / 2.0)), 0.0, 100.0))
        if anomaly_ratio >= 1.5:
            severity = "critical"
            recommendation = "Immediate physical inspection recommended: severe spectral/vibration deviation detected."
        elif is_anomaly:
            severity = "warning"
            recommendation = "Schedule preventive inspection: early abnormal pattern exceeds healthy baseline."
        else:
            severity = "normal"
            recommendation = "Operating within verified healthy baseline."

        # 5. Rank top contributing features for explainability
        top_indices = np.argsort(per_feature_mse)[::-1][:5]
        top_contributors = [
            {
                "feature": self.feature_columns[int(idx)],
                "mse": round(float(per_feature_mse[int(idx)]), 6),
                "input_value": round(float(raw_vec[0, int(idx)]), 6),
            }
            for idx in top_indices
        ]

        return {
            "machine_id": machine_id,
            "is_anomaly": is_anomaly,
            "severity": severity,
            "health_score": round(health_score, 2),
            "mse": round(mse, 6),
            "anomaly_threshold_mse": round(self.threshold_mse, 6),
            "anomaly_ratio": round(anomaly_ratio, 4),
            "top_contributors": top_contributors,
            "recommendation": recommendation,
            "model_version": self.metadata.get("model_version", "v0.1.0-alpha"),
        }


# Singleton instance imported by FastAPI routes
engine = IndustrialSenseInference()