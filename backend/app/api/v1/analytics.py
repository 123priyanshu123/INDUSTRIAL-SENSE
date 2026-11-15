from fastapi import APIRouter

from app.feature_store_and_publisher.store import store

router = APIRouter()


@router.get("/analytics/overview")
def overview():
    machines = store.machines
    total = len(machines)
    running = len([m for m in machines if m.get("status") == "running"])
    warning = len([m for m in machines if m.get("status") == "warning"])
    critical = len([m for m in machines if m.get("status") == "critical"])
    health = round(sum([m.get("healthScore", 0) for m in machines]) / total, 1) if total else 0.0
    # sensor stats (acoustic/vibration) with honest naming
    def sstats(ch_key):
        vals = 0
        for m in machines:
            latest = store.get_latest(m.get("id"))
            if ch_key in latest or (ch_key == "acoustic" and "sound" in latest):
                vals += 1
        return {"online": vals, "warning": 0, "critical": 0, "offline": max(total - vals, 0)}
    return {
        "machineStats": {"total": total, "running": running, "idle": 0, "warning": warning, "critical": critical, "offline": 0},
        "overallHealthScore": health,
        "healthDelta": 0.0,
        "sensorStats": {
            "acoustic": sstats("acoustic"),
            "vibration": sstats("vibration"),
            "sound": sstats("acoustic"),
            "temperature": {"online": 0, "warning": 0, "critical": 0, "offline": total},
            "pressure": {"online": 0, "warning": 0, "critical": 0, "offline": total},
        },
        "recentAlerts": [],
        "recentAnomalies": store.anomalies[:20],
        "topAttentionMachines": [m for m in machines if m.get("healthScore", 100) < 90],
        "pipeline": store.pipeline_status,
    }
