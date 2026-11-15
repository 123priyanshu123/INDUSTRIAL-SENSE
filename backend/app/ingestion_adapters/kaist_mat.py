from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from scipy.io import loadmat

from app.core.config import settings


@dataclass
class SourceMetadata:
    source_path: str
    relative_path: str
    source_key: str
    channel: str  # 'acoustic' | 'vibration' | 'unknown'
    source_unit: str  # preserved/honest; never invented
    calibration_state: str = "unknown"
    source_sample_rate_hz: Optional[float] = None
    original_shape: Optional[Tuple[int, ...]] = None
    notes: List[str] = field(default_factory=list)


@dataclass
class LoadedSignal:
    data: np.ndarray
    metadata: SourceMetadata


def _safe_rel(path: Path, root: Path) -> str:
    try:
        return path.relative_to(root).as_posix()
    except Exception:
        return path.as_posix()


def inspect_mat_file(path: Path) -> Dict[str, Any]:
    """Inspect .mat structure without assuming schema (supports common v7/v7.2 files)."""
    info: Dict[str, Any] = {"path": str(path), "keys": [], "arrays": [], "error": None}
    try:
        mat = loadmat(path, squeeze_me=True, struct_as_record=False)
        keys = [k for k in mat.keys() if not k.startswith("__")]
        info["keys"] = keys
        for k in keys:
            v = mat[k]
            if isinstance(v, np.ndarray):
                item = {
                    "key": k,
                    "shape": list(v.shape),
                    "dtype": str(v.dtype),
                    "ndim": int(v.ndim),
                    "size": int(v.size),
                }
                if v.size > 0 and np.issubdtype(v.dtype, np.number):
                    flat = np.ravel(v)
                    sample = flat[:5]
                    item["sample"] = [float(x) for x in sample]
                info["arrays"].append(item)
            else:
                # try to expose struct-like fields
                fields = getattr(v, "_fieldnames", None)
                info["arrays"].append({"key": k, "type": type(v).__name__, "fields": list(fields) if fields else None})
    except NotImplementedError as e:
        info["error"] = f"MATLAB v7.3/HDF5 not supported by scipy.io.loadmat in this MVP: {e}"
    except Exception as e:
        info["error"] = str(e)
    return info


def discover_mat_files(root: str, max_files: int) -> List[Path]:
    r = Path(root)
    if not r.exists():
        return []
    selected = (settings.kaist_selected_file or "").strip().replace("\\", "/")
    if selected:
        p = r / selected
        if p.exists() and p.is_file():
            return [p]
        # allow absolute or loose match
        p2 = Path(selected)
        if p2.exists() and p2.is_file():
            return [p2]
    files = sorted([p for p in r.rglob("*.mat") if p.is_file()])
    return files[:max_files]


def _infer_channel(key: str) -> str:
    k = key.lower()
    vib_tokens = ["vib", "acc", "accel", "acceler", "x", "y", "z", "radial", "tangential", "bearing"]
    ac_tokens = ["ac", "acoustic", "sound", "mic", "microphone", "audio"]
    if any(t in k for t in ac_tokens):
        return "acoustic"
    if any(t in k for t in vib_tokens):
        return "vibration"
    return "unknown"


def _find_unit_label(mat: Dict[str, Any], key: str) -> Optional[str]:
    # Best-effort: look for explicit unit/label metadata fields; do not invent
    candidates = [f"{key}_unit", f"{key}_units", f"unit_{key}", "unit", "units", "label", "labels", f"{key}_label"]
    for c in candidates:
        if c in mat:
            try:
                v = mat[c]
                if isinstance(v, str):
                    return v
                arr = np.array(v).squeeze()
                if arr.size == 1:
                    item = arr.item()
                    if isinstance(item, (str, bytes)):
                        return item.decode() if isinstance(item, bytes) else str(item)
            except Exception:
                pass
    return None


def _infer_sample_rate(mat: Dict[str, Any], key: str, channel: str) -> Tuple[Optional[float], str]:
    # Heuristic: look for common fs keys in mat; report source; do not invent actual file rate
    candidates = ["fs", "Fs", "FS", "sr", "SR", "SampleRate", "sampleRate", "sampling_rate", "samplingRate"]
    for c in candidates:
        if c in mat:
            try:
                val = np.array(mat[c]).squeeze()
                if val.size == 1:
                    return float(val), f"metadata:{c}"
            except Exception:
                pass
    # some datasets embed per-signal fs as key_fs
    for c in [f"{key}_fs", f"fs_{key}", f"{key}Fs"]:
        if c in mat:
            try:
                val = np.array(mat[c]).squeeze()
                if val.size == 1:
                    return float(val), f"metadata:{c}"
            except Exception:
                pass
    # Fallback to canonical target for processing, but mark as assumed (not measured)
    if channel == "acoustic":
        return float(settings.acoustic_canonical_sr), "assumed_canonical_target_not_in_file"
    if channel == "vibration":
        return float(settings.vibration_canonical_sr), "assumed_canonical_target_not_in_file"
    return None, "unknown"


def _extract_numeric_arrays(mat: Dict[str, Any]) -> List[Tuple[str, np.ndarray]]:
    out = []
    for k, v in mat.items():
        if k.startswith("__"):
            continue
        if isinstance(v, np.ndarray) and np.issubdtype(v.dtype, np.number) and v.size > 16:
            out.append((k, v))
    return out


def load_selected_recordings() -> Tuple[List[LoadedSignal], Dict[str, Any]]:
    """Inspect KAIST_DATA_ROOT and load selected .mat recordings into acoustic/vibration signals.
    Returns (signals, inspection_report). Does not copy dataset; caches processed features elsewhere.
    """
    report: Dict[str, Any] = {
        "kaist_data_root": settings.kaist_data_root,
        "root_exists": False,
        "discovered_files": [],
        "inspected": [],
        "loaded_signals": 0,
        "warnings": [],
    }
    signals: List[LoadedSignal] = []
    root = settings.kaist_data_root
    if not root:
        report["warnings"].append("KAIST_DATA_ROOT is not set. No dataset loaded.")
        return signals, report
    root_path = Path(root)
    report["root_exists"] = root_path.exists()
    if not root_path.exists():
        report["warnings"].append(f"KAIST_DATA_ROOT does not exist: {root}")
        return signals, report

    files = discover_mat_files(root, settings.kaist_max_recordings)
    report["discovered_files"] = [_safe_rel(p, root_path) for p in files]
    if not files:
        report["warnings"].append("No .mat files found under KAIST_DATA_ROOT (searched recursively).")
        return signals, report

    for path in files:
        insp = inspect_mat_file(path)
        report["inspected"].append({k: insp.get(k) for k in ["path", "keys", "arrays", "error"]})
        if insp.get("error"):
            report["warnings"].append(f"Failed to inspect {path.name}: {insp['error']}")
            continue
        try:
            mat = loadmat(path, squeeze_me=True, struct_as_record=False)
        except Exception as e:
            report["warnings"].append(f"Failed to load {path.name}: {e}")
            continue
        arrays = _extract_numeric_arrays(mat)
        if not arrays:
            report["warnings"].append(f"No numeric signal arrays found in {path.name}")
            continue

        # Prefer clearly named channels; else pick largest 1D/2D arrays and map to acoustic+vibration conservatively
        named = [(k, v, _infer_channel(k)) for k, v in arrays]
        picked: List[Tuple[str, np.ndarray, str]] = [x for x in named if x[2] in ("acoustic", "vibration")]
        if not picked:
            arrays_sorted = sorted(arrays, key=lambda kv: kv[1].size, reverse=True)[:2]
            if len(arrays_sorted) == 1:
                picked = [(arrays_sorted[0][0], arrays_sorted[0][1], "vibration")]
            elif len(arrays_sorted) >= 2:
                picked = [
                    (arrays_sorted[0][0], arrays_sorted[0][1], "vibration"),
                    (arrays_sorted[1][0], arrays_sorted[1][1], "acoustic"),
                ]
        # ensure we try to have both channels from same recording when possible (vertical slice)
        channels_present = {c for _, _, c in picked}
        if "vibration" not in channels_present or "acoustic" not in channels_present:
            for k, v in sorted(arrays, key=lambda kv: kv[1].size, reverse=True):
                if "vibration" not in channels_present and (k, v, "vibration") not in picked:
                    picked.append((k, v, "vibration"))
                    channels_present.add("vibration")
                elif "acoustic" not in channels_present and (k, v, "acoustic") not in picked:
                    picked.append((k, v, "acoustic"))
                    channels_present.add("acoustic")
                if "vibration" in channels_present and "acoustic" in channels_present:
                    break
            # keep at most 2
            picked = picked[:2]

        rel = _safe_rel(path, root_path)
        for key, arr, channel in picked:
            x = np.asarray(arr)
            if x.ndim > 1:
                if x.shape[0] >= x.shape[1]:
                    x = x[:, 0]
                else:
                    x = x[0, :]
            x = np.ravel(x).astype(np.float64)
            sr, sr_source = _infer_sample_rate(mat, key, channel)
            unit_label = _find_unit_label(mat, key)
            source_unit = unit_label if unit_label else "unknown (uncalibrated; no unit/label metadata found)"
            cal_state = "unknown"
            notes = [
                "Units/physical calibration not asserted unless explicitly present in source metadata.",
                f"sample_rate_source={sr_source}",
            ]
            if unit_label is None:
                notes.append("No unit/label metadata found for this signal key; value treated as uncalibrated source-domain signal.")
            meta = SourceMetadata(
                source_path=str(path),
                relative_path=rel,
                source_key=key,
                channel=channel if channel in ("acoustic", "vibration") else "unknown",
                source_unit=source_unit,
                calibration_state=cal_state,
                source_sample_rate_hz=sr,
                original_shape=tuple(np.asarray(arr).shape),
                notes=notes,
            )
            signals.append(LoadedSignal(data=x, metadata=meta))

    report["loaded_signals"] = len(signals)
    return signals, report
