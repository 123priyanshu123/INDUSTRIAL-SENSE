from fastapi import APIRouter, HTTPException

from app.feature_store_and_publisher.store import store

router = APIRouter()


@router.get("/machines/{machine_id}/features")
def get_features(machine_id: str):
    """Processed feature windows for ML/frontend coordination (FeatureVector schema embedded in readings/features)."""
    hist = store.get_history(machine_id, limit=500)
    vectors = []
    for r in hist:
        features = r.get("features") or {}
        # extract numeric vector if present in features summary is not stored separately; expose feature payload + key stats
        vectors.append({
            "machineId": machine_id,
            "channel": r.get("channel"),
            "windowStartSec": r.get("windowStartSec"),
            "windowEndSec": r.get("windowEndSec"),
            "features": features,
            "quality": r.get("quality"),
            "anomalyScoreRaw": r.get("anomalyScoreRaw"),
            "anomalyDecision": r.get("anomalyDecision"),
            "sourceMetadata": r.get("sourceMetadata"),
        })
    if not vectors and not any(m.get("id") == machine_id for m in store.machines):
        raise HTTPException(status_code=404, detail="Machine not found")
    return {"machineId": machine_id, "count": len(vectors), "windows": vectors}
