from fastapi import APIRouter, HTTPException

from app.feature_store_and_publisher.store import store

router = APIRouter()


@router.get("/machines")
def list_machines():
    return store.machines


@router.get("/machines/{machine_id}")
def get_machine(machine_id: str):
    for m in store.machines:
        if m.get("id") == machine_id:
            # include latest readings summary
            m2 = dict(m)
            m2["latestReadings"] = store.get_latest(machine_id)
            return m2
    raise HTTPException(status_code=404, detail="Machine not found")
