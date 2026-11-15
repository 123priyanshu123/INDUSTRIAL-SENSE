from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.feature_store_and_publisher.store import store

router = APIRouter()


@router.get("/machines/{machine_id}/readings")
def get_readings(machine_id: str):
    # compatibility with existing frontend sensorService.getLatestReadings
    if not any(m.get("id") == machine_id for m in store.machines):
        # allow if readings exist
        if machine_id not in store.readings_latest:
            raise HTTPException(status_code=404, detail="Machine not found")
    latest = store.get_latest(machine_id)
    # also provide sound/temperature/pressure keys for compatibility where possible
    compat = dict(latest)
    if "acoustic" in latest and "sound" not in compat:
        compat["sound"] = latest["acoustic"]
    if "temperature" not in compat:
        compat["temperature"] = None
    if "pressure" not in compat:
        compat["pressure"] = None
    return compat


@router.get("/machines/{machine_id}/history")
def get_history(machine_id: str, range: str = Query(default="24h"), channel: Optional[str] = Query(default=None), limit: int = Query(default=200)):
    hist = store.get_history(machine_id, channel=channel, limit=limit)
    # compatibility shape: return array of points; frontend often expects series-like data
    points = []
    for r in hist:
        points.append({
            "time": round(float(r.get("windowStartSec", 0)), 3),
            "windowStartSec": r.get("windowStartSec"),
            "windowEndSec": r.get("windowEndSec"),
            "channel": r.get("channel"),
            "sensorType": r.get("sensorType"),
            "value": r.get("value"),
            "unit": r.get("unit"),
            "state": r.get("state"),
            "anomalyScoreRaw": r.get("anomalyScoreRaw"),
            "anomalyDecision": r.get("anomalyDecision"),
            "quality": r.get("quality"),
            # legacy fields for existing charts where possible
            "sound": r.get("value") if r.get("channel") == "acoustic" else None,
            "vibration": r.get("value") if r.get("channel") == "vibration" else None,
            "temperature": None,
            "pressure": None,
            "healthIndex": None,
        })
    return {"machineId": machine_id, "range": range, "points": points}
