from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load .env from backend working dir if present
load_dotenv()

from app.api.v1.analytics import router as analytics_router
from app.api.v1.features import router as features_router
from app.api.v1.machines import router as machines_router
from app.api.v1.telemetry import router as telemetry_router
from app.services.pipeline import get_status, run_pipeline


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run processing on startup (loads selected KAIST .mat recordings, caches features in memory/disk cache)
    try:
        run_pipeline()
    except Exception as e:
        # keep app up and expose error
        from app.feature_store_and_publisher.store import store
        store.pipeline_status = {"ready": False, "anomalyDetection": "unavailable", "notes": [f"Startup pipeline error: {e}"]}
    yield


app = FastAPI(title="IndustrialSense MVP Backend", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
def health():
    return {"ok": True, **get_status()}


@app.get("/api/v1/inspection")
def inspection():
    s = get_status()
    return s.get("inspection", {})


@app.post("/api/v1/pipeline/run")
def rerun_pipeline():
    return run_pipeline()


# Compatibility mounts
app.include_router(machines_router, prefix="/api/v1", tags=["machines"])
app.include_router(telemetry_router, prefix="/api/v1", tags=["telemetry"])
app.include_router(analytics_router, prefix="/api/v1", tags=["analytics"])
app.include_router(features_router, prefix="/api/v1", tags=["features"])
