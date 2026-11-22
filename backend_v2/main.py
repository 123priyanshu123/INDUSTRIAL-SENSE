from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from inference import engine


class PredictionRequest(BaseModel):
    machine_id: str = Field(default="machine-01")
    features: Dict[str, float]


class BatchPredictionRequest(BaseModel):
    samples: List[PredictionRequest]


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        engine.load()
    except Exception:
        pass
    yield


app = FastAPI(
    title="IndustrialSense Inference API",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health():
    return {
        "ok": engine.ready,
        "error": engine.error,
        "model_version": engine.metadata.get("model_version"),
        "dataset": engine.metadata.get("dataset"),
        "input_dim": len(engine.feature_columns),
        "anomaly_threshold_mse": engine.threshold_mse,
    }


@app.get("/api/v1/features")
def get_feature_schema():
    """Lets the frontend dynamically build input forms using the exact 42 feature names."""
    return {
        "count": len(engine.feature_columns),
        "features": engine.feature_columns,
        "default_values": {col: 0.0 for col in engine.feature_columns},
    }


@app.post("/api/v1/predict")
def predict(payload: PredictionRequest):
    """Receives feature values from frontend, runs ONNX model, returns prediction."""
    try:
        return engine.predict(payload.machine_id, payload.features)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))


@app.post("/api/v1/predict/batch")
def predict_batch(payload: BatchPredictionRequest):
    try:
        results = [engine.predict(s.machine_id, s.features) for s in payload.samples]
        return {"count": len(results), "results": results}
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))