from __future__ import annotations

import json
import math
import re
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
    modality: str  # 'acoustic' | 'vibration' | 'unknown'
    channel: str   # processing channel: 'acoustic' | 'vibration' | 'unknown'
    source_unit: str  # preserved/honest; never invented
    calibration_state: str = "unknown"
    source_sample_rate_hz: Optional[float] = None
    sampling_rate_source: str = "unknown"
    original_shape: Optional[Tuple[int, ...]] = None
    time_axis: Optional[Dict[str, Any]] = None
    channel_info: Optional[Dict[str, Any]] = None
    recording_info: Dict[str, Any] = field(default_factory=dict)
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


def _join_char_array(x: Any) -> Optional[str]:
    try:
        a = np.asarray(x)
        if a.dtype.kind in ("U", "S") and a.ndim >= 1 and a.size > 0:
            return "".join([str(c) for c in np.ravel(a).tolist()])
        if isinstance(x, str):
            return x
        if isinstance(x, bytes):
            return x.decode("utf-8", errors="ignore")
    except Exception:
        pass
    return None


def _scalar(x: Any) -> Any:
    if isinstance(x, np.generic):
        return x.item()
    if isinstance(x, np.ndarray) and x.size == 1:
        try:
            return x.item()
        except Exception:
            return x
    return x


def _index_value(obj: Any, idx: int) -> Any:
    """Get per-channel/item value from scalar/list/ndarray/object-array structures."""
    try:
        if obj is None:
            return None
        if isinstance(obj, (str, bytes, int, float, bool, np.generic)):
            return obj if idx == 0 else None
        a = np.asarray(obj)
        if a.dtype == object:
            flat = a.ravel()
            if idx < flat.size:
                return flat[idx]
            return flat[0] if flat.size else None
        if a.dtype.kind in ("U", "S"):
            if a.ndim == 1 and idx < a.size:
                return a[idx]
            if a.ndim >= 2 and idx < a.shape[0]:
                return a[idx]
            return a
        if a.size == 1:
            return a.item()
        if idx < a.size:
            return a.ravel()[idx]
    except Exception:
        pass
    return None


def _text_value(x: Any) -> Optional[str]:
    jc = _join_char_array(x)
    if jc is not None:
        return jc
    try:
        s = _scalar(x)
        if isinstance(s, bytes):
            return s.decode("utf-8", errors="ignore")
        if isinstance(s, str):
            return s
    except Exception:
        pass
    return None


def modality_from_path(path: Path, root: Optional[Path] = None) -> str:
    parts = []
    try:
        rel = path.relative_to(root) if root else path
        parts = [p.lower() for p in rel.parts]
    except Exception:
        parts = [p.lower() for p in path.parts]
    if "acoustic" in parts:
        return "acoustic"
    if "vibration" in parts:
        return "vibration"
    name = path.stem.lower()
    if "acoustic" in name:
        return "acoustic"
    if "vib" in name or "vibration" in name:
        return "vibration"
    return "unknown"


def parse_recording_identity(filename: str) -> Dict[str, Any]:
    stem = Path(filename).stem
    info: Dict[str, Any] = {
        "recording_id": stem,
        "operating_load": None,
        "fault_category": None,
        "severity_or_variant": None,
        "fault_family": None,
    }
    # examples: 0Nm_BPFI_03, 2Nm_Unbalalnce_3318mg, 4Nm_Normal
    m = re.match(r"^(?P<load>\d+Nm)_(?P<rest>.+)$", stem, flags=re.IGNORECASE)
    if m:
        info["operating_load"] = m.group("load")
        rest = m.group("rest")
        parts = rest.split("_")
        if parts:
            raw_cat = parts[0]
            cat_norm = raw_cat.lower()
            if cat_norm.startswith("normal"):
                info["fault_category"] = "Normal"
                info["fault_family"] = "normal"
            elif cat_norm.startswith("bpfi"):
                info["fault_category"] = "BPFI"
                info["fault_family"] = "bearing_inner_race_fault"
            elif cat_norm.startswith("bpfo"):
                info["fault_category"] = "BPFO"
                info["fault_family"] = "bearing_outer_race_fault"
            elif cat_norm.startswith("misalign"):
                info["fault_category"] = "Misalign"
                info["fault_family"] = "misalignment"
            elif cat_norm.startswith("unbal"):
                info["fault_category"] = "Unbalance"
                info["fault_family"] = "unbalance"
            else:
                info["fault_category"] = raw_cat
            if len(parts) > 1:
                info["severity_or_variant"] = "_".join(parts[1:])
    return info


def _deep_describe(obj: Any, name: str = "root", depth: int = 0, max_depth: int = 5) -> Dict[str, Any]:
    if depth > max_depth:
        return {"name": name, "type": type(obj).__name__, "truncated": True}
    if isinstance(obj, np.ndarray):
        if obj.dtype == object and obj.size == 1:
            try:
                return {"name": name, "type": "ndarray_object_scalar", "shape": list(obj.shape), "item": _deep_describe(obj.item(), name + "[]", depth + 1, max_depth)}
            except Exception as e:
                return {"name": name, "type": "ndarray", "shape": list(obj.shape), "dtype": str(obj.dtype), "error": str(e)}
        if obj.dtype == object:
            sample = []
            for i in range(min(int(obj.size), 3)):
                try:
                    sample.append(_deep_describe(obj.ravel()[i], f"{name}[{i}]", depth + 1, max_depth))
                except Exception as e:
                    sample.append({"error": str(e)})
            return {"name": name, "type": "ndarray_object", "shape": list(obj.shape), "dtype": str(obj.dtype), "sample_items": sample}
        if getattr(obj, "dtype", None) is not None and obj.dtype.names:
            return {"name": name, "type": "structured_ndarray", "dtype_names": list(obj.dtype.names), "shape": list(obj.shape)}
        if np.issubdtype(obj.dtype, np.number):
            info = {"name": name, "type": "ndarray", "shape": list(obj.shape), "dtype": str(obj.dtype), "size": int(obj.size)}
            if obj.size > 0:
                flat = np.ravel(obj)
                finite = flat[np.isfinite(flat)] if np.issubdtype(flat.dtype, np.floating) else flat
                if finite.size:
                    info["min"] = float(np.nanmin(finite))
                    info["max"] = float(np.nanmax(finite))
                    info["sample"] = [float(x) for x in flat[:5]]
            return info
        jc = _join_char_array(obj)
        if jc is not None:
            return {"name": name, "type": "char_array", "value": jc}
        return {"name": name, "type": "ndarray", "shape": list(obj.shape), "dtype": str(obj.dtype)}
    if hasattr(obj, "_fieldnames"):
        fields = list(getattr(obj, "_fieldnames", []) or [])
        out = {"name": name, "type": "mat_struct", "fields": fields, "children": {}}
        for f in fields:
            try:
                out["children"][f] = _deep_describe(getattr(obj, f), f, depth + 1, max_depth)
            except Exception as e:
                out["children"][f] = {"name": f, "error": str(e)}
        return out
    if isinstance(obj, (str, int, float, bool)):
        return {"name": name, "type": type(obj).__name__, "value": obj}
    if isinstance(obj, (np.generic,)):
        return {"name": name, "type": type(obj).__name__, "value": obj.item()}
    jc = _join_char_array(obj)
    if jc is not None:
        return {"name": name, "type": "char_array", "value": jc}
    return {"name": name, "type": type(obj).__name__, "repr": repr(obj)[:300]}


def inspect_mat_file(path: Path, root: Optional[Path] = None) -> Dict[str, Any]:
    """Inspect .mat structure, including nested LMS/Test.Lab Signal schemas. Read-only."""
    info: Dict[str, Any] = {
        "path": str(path),
        "relative_path": _safe_rel(path, root) if root else path.name,
        "modality": modality_from_path(path, root),
        "file_size_bytes": path.stat().st_size if path.exists() else None,
        "keys": [],
        "format": None,
        "structure": {},
        "signal_summary": None,
        "status": "unknown",
        "errors": [],
        "warnings": [],
    }
    try:
        mat = loadmat(path, squeeze_me=True, struct_as_record=False)
        keys = [k for k in mat.keys() if not k.startswith("__")]
        info["keys"] = keys
        info["format"] = "scipy.io.loadmat OK (MATLAB v5/v7/v7.2-compatible path)"
        info["structure"] = {k: _deep_describe(mat[k], k) for k in keys}
        if "Signal" in mat and hasattr(mat["Signal"], "_fieldnames"):
            sig = mat["Signal"]
            ssum = {"type": "mat_struct", "fields": list(sig._fieldnames)}
            try:
                if hasattr(sig, "x_values") and hasattr(sig.x_values, "_fieldnames"):
                    xv = sig.x_values
                    inc = float(_scalar(getattr(xv, "increment", np.nan)))
                    n = int(_scalar(getattr(xv, "number_of_values", 0)))
                    x_unit = _text_value(getattr(getattr(xv, "quantity", None), "label", None))
                    ssum["x_values"] = {"increment": inc, "number_of_values": n, "x_unit": x_unit}
                    if x_unit == "s" and np.isfinite(inc) and inc > 0:
                        ssum["x_values"]["sampling_frequency_hz_verified"] = 1.0 / inc
                        ssum["x_values"]["duration_s_verified"] = (n - 1) * inc if n > 0 else None
                        ssum["x_values"]["time_axis"] = "time_seconds_verified"
            except Exception as e:
                info["warnings"].append(f"x_values inspection issue: {e}")
            try:
                if hasattr(sig, "y_values") and hasattr(sig.y_values, "_fieldnames"):
                    yv = sig.y_values
                    vals = np.asarray(getattr(yv, "values"))
                    y_unit = _text_value(getattr(getattr(yv, "quantity", None), "label", None))
                    ssum["y_values"] = {"shape": list(vals.shape), "dtype": str(vals.dtype), "y_unit": y_unit}
            except Exception as e:
                info["warnings"].append(f"y_values inspection issue: {e}")
            try:
                fr = getattr(sig, "function_record", None)
                if fr is not None and hasattr(fr, "_fieldnames"):
                    fr_sum = {"fields": list(fr._fieldnames)}
                    try:
                        ch_group = getattr(getattr(fr, "TL_export_properties_annotation", None), "channel_group", None)
                        fr_sum["channel_group"] = [_text_value(_index_value(ch_group, i)) for i in range(int(np.asarray(ch_group).size))] if ch_group is not None else None
                    except Exception:
                        pass
                    try:
                        pc = getattr(fr, "primary_channel", None)
                        if pc is not None and hasattr(pc, "_fieldnames"):
                            labels = getattr(pc, "label", None)
                            ids = getattr(pc, "id", None)
                            fr_sum["primary_channel_labels"] = [_text_value(_index_value(labels, i)) for i in range(int(np.asarray(labels).size))] if labels is not None else None
                            fr_sum["primary_channel_ids"] = [_scalar(_index_value(ids, i)) for i in range(int(np.asarray(ids).size))] if ids is not None else None
                    except Exception:
                        pass
                    ssum["function_record"] = fr_sum
            except Exception as e:
                info["warnings"].append(f"function_record inspection issue: {e}")
            info["signal_summary"] = ssum
        info["status"] = "inspected"
    except NotImplementedError as e:
        info["status"] = "failed"
        info["format"] = "MATLAB v7.3/HDF5 (scipy.io.loadmat unsupported)"
        info["errors"].append(str(e))
        info["warnings"].append("Unsupported format in current backend (v7.3/HDF5 requires h5py-based handling).")
    except Exception as e:
        info["status"] = "failed"
        info["format"] = info.get("format") or "unreadable"
        info["errors"].append(f"{type(e).__name__}: {e}")
    return info


def discover_all_mat_files(root: str) -> Tuple[List[Path], List[Dict[str, Any]]]:
    """Recursively discover all .mat files under root. Returns (files, discovery_issues)."""
    issues: List[Dict[str, Any]] = []
    r = Path(root)
    if not r.exists():
        issues.append({"path": str(r), "reason": "root_not_found"})
        return [], issues
    files = sorted([p for p in r.rglob("*.mat") if p.is_file()])
    return files, issues


def _extract_lms_signal(mat: Dict[str, Any], path: Path, root: Optional[Path]) -> Tuple[List[LoadedSignal], List[str], Dict[str, Any]]:
    signals: List[LoadedSignal] = []
    errors: List[str] = []
    details: Dict[str, Any] = {"schema": None}
    if "Signal" not in mat or not hasattr(mat["Signal"], "_fieldnames"):
        return signals, errors, details
    sig = mat["Signal"]
    details["schema"] = "LMS_TestLab_Signal"
    rel = _safe_rel(path, root) if root else path.name
    modality = modality_from_path(path, root)
    rec_info = parse_recording_identity(path.name)

    # x_values / time axis
    try:
        xv = sig.x_values
        inc = float(_scalar(getattr(xv, "increment")))
        n = int(_scalar(getattr(xv, "number_of_values")))
        x_unit = _text_value(getattr(getattr(xv, "quantity", None), "label", None))
        if not (np.isfinite(inc) and inc > 0):
            errors.append("Invalid x_values.increment (cannot derive sampling frequency).")
            return signals, errors, details
        fs_hz = 1.0 / inc
        duration_s = (n - 1) * inc if n > 0 else None
        time_axis = {"x_unit": x_unit, "increment": inc, "number_of_values": n, "fs_hz_verified": fs_hz if x_unit == "s" else None, "duration_s_verified": duration_s if x_unit == "s" else None, "sampling_rate_source": "verified:x_values.increment" if x_unit == "s" else "derived:x_values.increment_unit_unverified"}
    except Exception as e:
        errors.append(f"Failed to parse x_values/time axis: {type(e).__name__}: {e}")
        return signals, errors, details

    # y_values
    try:
        yv = sig.y_values
        values = np.asarray(getattr(yv, "values"))
        y_unit = _text_value(getattr(getattr(yv, "quantity", None), "label", None))
    except Exception as e:
        errors.append(f"Failed to parse y_values: {type(e).__name__}: {e}")
        return signals, errors, details

    # function_record metadata
    fr_meta: Dict[str, Any] = {}
    ch_labels: List[Optional[str]] = []
    ch_ids: List[Any] = []
    ch_names: List[Optional[str]] = []
    ch_groups: List[Optional[str]] = []
    try:
        fr = getattr(sig, "function_record", None)
        if fr is not None and hasattr(fr, "_fieldnames"):
            for k in ["type", "weighting"]:
                if hasattr(fr, k):
                    fr_meta[k] = _text_value(getattr(fr, k))
            if hasattr(fr, "primary_channel") and hasattr(fr.primary_channel, "_fieldnames"):
                labels = getattr(fr.primary_channel, "label", None)
                ids = getattr(fr.primary_channel, "id", None)
                nlabels = int(np.asarray(labels).size) if labels is not None else 0
                nids = int(np.asarray(ids).size) if ids is not None else 0
                m = max(nlabels, nids)
                ch_labels = [_text_value(_index_value(labels, i)) for i in range(m)]
                ch_ids = [_scalar(_index_value(ids, i)) for i in range(m)]
            if hasattr(fr, "name"):
                nm = getattr(fr, "name")
                ch_names = [_text_value(_index_value(nm, i)) for i in range(int(np.asarray(nm).size))]
            ann = getattr(fr, "TL_export_properties_annotation", None)
            if ann is not None and hasattr(ann, "_fieldnames"):
                cg = getattr(ann, "channel_group", None)
                if cg is not None:
                    ch_groups = [_text_value(_index_value(cg, i)) for i in range(int(np.asarray(cg).size))]
                for k in ["project_name", "section_name", "run_name"]:
                    if hasattr(ann, k):
                        fr_meta[k] = _text_value(getattr(ann, k))
    except Exception:
        pass

    # shape/consistency checks
    if values.ndim == 1:
        n_channels = 1
        if n > 0 and values.size != n:
            errors.append(f"Sample count mismatch: y_values.size={values.size} != x_values.number_of_values={n}")
    elif values.ndim == 2:
        # common: (samples, channels); handle (channels, samples) if needed
        if n > 0 and values.shape[0] == n:
            n_channels = values.shape[1]
        elif n > 0 and values.shape[1] == n:
            values = values.T
            n_channels = values.shape[1]
        else:
            # prefer axis matching n if possible
            if n > 0 and n in values.shape:
                axis = list(values.shape).index(n)
                if axis == 1:
                    values = values.T
                n_channels = values.shape[1]
            else:
                n_channels = values.shape[1]
        if n > 0 and values.shape[0] != n:
            errors.append(f"Sample count mismatch: y_values.shape={list(values.shape)} vs x_values.number_of_values={n}")
    else:
        errors.append(f"Unsupported y_values dimensionality: shape={list(values.shape)}")
        return signals, errors, details

    details.update({
        "modality": modality,
        "fs_hz": fs_hz if x_unit == "s" else None,
        "duration_s": duration_s if x_unit == "s" else None,
        "x_unit": x_unit,
        "y_unit": y_unit,
        "y_shape": list(values.shape),
        "n_channels": n_channels,
        "channel_labels": ch_labels,
        "channel_ids": ch_ids,
        "channel_names": ch_names,
        "channel_groups": ch_groups,
    })

    # Determine per-channel modality (prefer verified metadata, else path)
    def ch_modality(i: int) -> str:
        cg = ch_groups[i] if i < len(ch_groups) and ch_groups[i] else None
        if cg:
            cgl = cg.lower()
            if "acoustic" in cgl:
                return "acoustic"
            if "vib" in cgl:
                return "vibration"
        if modality in ("acoustic", "vibration"):
            return modality
        # fallback from y_unit
        if (y_unit or "").lower() == "pa":
            return "acoustic"
        if (y_unit or "").lower() == "g":
            return "vibration"
        return "unknown"

    sr_verified = fs_hz if x_unit == "s" and np.isfinite(fs_hz) and fs_hz > 0 else None
    sr_source = "verified:x_values.increment" if sr_verified is not None else "unverified:x_values_unit_not_seconds_or_invalid_increment"

    for i in range(n_channels):
        if values.ndim == 1:
            arr = np.asarray(values, dtype=np.float64)
        else:
            arr = np.asarray(values[:, i], dtype=np.float64)
        mod = ch_modality(i)
        proc_channel = mod if mod in ("acoustic", "vibration") else ("acoustic" if (y_unit or "").lower() == "pa" else "vibration")
        label = ch_labels[i] if i < len(ch_labels) else None
        cid = ch_ids[i] if i < len(ch_ids) else None
        cname = ch_names[i] if i < len(ch_names) else None
        ch_key = cname or label or f"ch{i+1}"
        source_key = f"Signal.y_values.values" if n_channels == 1 else f"Signal.y_values.values[:,{i}]"
        source_unit = y_unit if y_unit else "unknown (unit not found in verified metadata)"
        cal_state = "unknown"
        notes = [
            "Parsed from verified nested LMS/Test.Lab Signal structure (Signal.x_values/y_values/function_record).",
            f"time_axis_unit={x_unit}" if x_unit else "time_axis_unit_unverified",
        ]
        if x_unit == "s":
            notes.append("Sampling frequency derived from verified x_values.increment (s).")
        else:
            notes.append("Sampling frequency not verified (x_values unit not 's').")
        if y_unit:
            notes.append(f"Amplitude unit from verified metadata: {y_unit}.")
        else:
            notes.append("Amplitude unit not found in verified metadata; not invented.")
        meta = SourceMetadata(
            source_path=str(path),
            relative_path=rel,
            source_key=source_key,
            modality=mod,
            channel=proc_channel,
            source_unit=source_unit,
            calibration_state=cal_state,
            source_sample_rate_hz=sr_verified,
            sampling_rate_source=sr_source,
            original_shape=tuple(np.asarray(getattr(yv, "values")).shape),
            time_axis=time_axis,
            channel_info={
                "index": i,
                "name": cname,
                "label": label,
                "id": cid,
                "channel_group": ch_groups[i] if i < len(ch_groups) else None,
                "key": ch_key,
            },
            recording_info={**rec_info, **{k: v for k, v in fr_meta.items() if v is not None}},
            notes=notes,
        )
        signals.append(LoadedSignal(data=arr, metadata=meta))

    return signals, errors, details


def load_recording(path: Path, root: Optional[Path] = None) -> Dict[str, Any]:
    """Load and parse a single .mat recording. Never silently discards; returns status and reasons."""
    result: Dict[str, Any] = {
        "path": str(path),
        "relative_path": _safe_rel(path, root) if root else path.name,
        "modality": modality_from_path(path, root),
        "file_size_bytes": path.stat().st_size if path.exists() else None,
        "status": "unknown",
        "signals": [],
        "errors": [],
        "warnings": [],
        "details": {},
        "inspection": None,
    }
    insp = inspect_mat_file(path, root)
    result["inspection"] = insp
    if insp.get("status") == "failed":
        result["status"] = "failed"
        result["errors"].extend(insp.get("errors", []))
        result["warnings"].extend(insp.get("warnings", []))
        return result

    try:
        mat = loadmat(path, squeeze_me=True, struct_as_record=False)
    except NotImplementedError as e:
        result["status"] = "failed"
        result["errors"].append(f"Unsupported MATLAB format (v7.3/HDF5): {e}")
        return result
    except Exception as e:
        result["status"] = "failed"
        result["errors"].append(f"{type(e).__name__}: {e}")
        return result

    # Preferred: verified nested LMS/Test.Lab Signal schema (acoustic + vibration)
    try:
        if "Signal" in mat and hasattr(mat["Signal"], "_fieldnames"):
            signals, errs, details = _extract_lms_signal(mat, path, root)
            result["details"] = details
            result["warnings"].extend(insp.get("warnings", []))
            if errs and not signals:
                result["status"] = "failed"
                result["errors"].extend(errs)
                return result
            if errs:
                result["warnings"].extend(errs)
            if signals:
                result["signals"] = signals
                result["status"] = "loaded"
                result["modality"] = details.get("modality") or result["modality"]
                return result
            result["status"] = "failed"
            result["errors"].append("No loadable signals extracted from verified Signal structure.")
            return result
    except Exception as e:
        result["warnings"].append(f"Nested Signal parsing error: {type(e).__name__}: {e}")

    # Fallback: generic numeric arrays at top level (legacy/simple files)
    try:
        arrays = []
        for k, v in mat.items():
            if k.startswith("__"):
                continue
            if isinstance(v, np.ndarray) and np.issubdtype(v.dtype, np.number) and v.size > 16:
                arrays.append((k, v))
        if not arrays:
            result["status"] = "failed"
            result["errors"].append("No numeric signal arrays found and no supported nested Signal schema parsed.")
            result["warnings"].extend(insp.get("warnings", []))
            return result
        # pick largest array
        k, v = sorted(arrays, key=lambda kv: kv[1].size, reverse=True)[0]
        arr = np.asarray(v)
        if arr.ndim > 1:
            arr = arr[:, 0] if arr.shape[0] >= arr.shape[1] else arr[0, :]
        arr = np.ravel(arr).astype(np.float64)
        mod = modality_from_path(path, root)
        proc = mod if mod in ("acoustic", "vibration") else "vibration"
        meta = SourceMetadata(
            source_path=str(path),
            relative_path=_safe_rel(path, root) if root else path.name,
            source_key=k,
            modality=mod,
            channel=proc,
            source_unit="unknown (unit not found in verified metadata)",
            calibration_state="unknown",
            source_sample_rate_hz=None,
            sampling_rate_source="unknown",
            original_shape=tuple(np.asarray(v).shape),
            recording_info=parse_recording_identity(path.name),
            notes=["Fallback generic top-level numeric array load; no verified nested schema used."],
        )
        result["signals"] = [LoadedSignal(data=arr, metadata=meta)]
        result["status"] = "loaded"
        result["warnings"].append("Loaded via generic fallback (not verified LMS Signal schema).")
        return result
    except Exception as e:
        result["status"] = "failed"
        result["errors"].append(f"Fallback load failed: {type(e).__name__}: {e}")
        return result


def _select_for_loading(all_files: List[Path], root: Path) -> Tuple[List[Path], List[Dict[str, Any]]]:
    """Select subset to load/process while still allowing full discovery/inspection."""
    excluded: List[Dict[str, Any]] = []
    selected_name = (settings.kaist_selected_file or "").strip().replace("\\", "/")
    if selected_name:
        p = root / selected_name
        if not (p.exists() and p.is_file()):
            p2 = Path(selected_name)
            p = p2 if p2.exists() and p2.is_file() else p
        target = str(p.resolve()) if p.exists() else str(p)
        chosen = [f for f in all_files if str(f.resolve()) == target or _safe_rel(f, root) == selected_name or f.as_posix().endswith(selected_name)]
        for f in all_files:
            if f not in chosen:
                excluded.append({"relative_path": _safe_rel(f, root), "reason": "excluded_by_kaist_selected_file"})
        return chosen, excluded

    max_n = int(getattr(settings, "kaist_max_recordings", 0) or 0)
    if max_n <= 0:
        return list(all_files), excluded  # 0 means load all
    chosen = all_files[:max_n]
    for f in all_files[max_n:]:
        excluded.append({"relative_path": _safe_rel(f, root), "reason": "excluded_by_kaist_max_recordings"})
    return chosen, excluded


def inspect_and_load_selected() -> Tuple[List[LoadedSignal], Dict[str, Any]]:
    """Discover all .mat files, inspect all, load selected subset for processing.
    Reports discovered/inspected/loaded/failed/excluded counts separately.
    """
    root_str = settings.kaist_data_root
    report: Dict[str, Any] = {
        "kaist_data_root": root_str,
        "root_exists": False,
        "counts": {"discovered": 0, "inspected": 0, "loaded_files": 0, "loaded_signals": 0, "failed": 0, "excluded": 0},
        "discovered_files": [],
        "inspected": [],
        "loaded": [],
        "failed": [],
        "excluded": [],
        "warnings": [],
    }
    signals: List[LoadedSignal] = []
    if not root_str:
        report["warnings"].append("KAIST_DATA_ROOT is not set. No dataset loaded.")
        return signals, report
    root = Path(root_str)
    report["root_exists"] = root.exists()
    if not root.exists():
        report["warnings"].append(f"KAIST_DATA_ROOT does not exist: {root_str}")
        return signals, report

    all_files, disc_issues = discover_all_mat_files(root_str)
    report["warnings"].extend([f"Discovery: {i}" for i in disc_issues])
    report["counts"]["discovered"] = len(all_files)
    report["discovered_files"] = [
        {"relative_path": _safe_rel(p, root), "modality": modality_from_path(p, root), "file_size_bytes": p.stat().st_size}
        for p in all_files
    ]
    if not all_files:
        report["warnings"].append("No .mat files found under KAIST_DATA_ROOT (searched recursively).")
        return signals, report

    # Inspect all discovered files
    for p in all_files:
        insp = inspect_mat_file(p, root)
        report["inspected"].append({
            "relative_path": _safe_rel(p, root),
            "modality": insp.get("modality"),
            "status": insp.get("status"),
            "format": insp.get("format"),
            "keys": insp.get("keys"),
            "signal_summary": insp.get("signal_summary"),
            "errors": insp.get("errors", []),
            "warnings": insp.get("warnings", []),
        })
    report["counts"]["inspected"] = len(report["inspected"])

    # Load selected subset
    to_load, excluded = _select_for_loading(all_files, root)
    report["excluded"] = excluded
    report["counts"]["excluded"] = len(excluded)

    for p in to_load:
        res = load_recording(p, root)
        rel = res["relative_path"]
        if res["status"] == "loaded" and res.get("signals"):
            signals.extend(res["signals"])
            report["loaded"].append({
                "relative_path": rel,
                "modality": res.get("modality"),
                "n_signals": len(res["signals"]),
                "details": res.get("details", {}),
                "warnings": res.get("warnings", []),
            })
        else:
            report["failed"].append({
                "relative_path": rel,
                "modality": res.get("modality"),
                "status": res.get("status"),
                "errors": res.get("errors", []),
                "warnings": res.get("warnings", []),
                "details": res.get("details", {}),
            })
    report["counts"]["loaded_files"] = len(report["loaded"])
    report["counts"]["loaded_signals"] = len(signals)
    report["counts"]["failed"] = len(report["failed"])

    # Do not claim successful ingestion when only discovery succeeded
    if report["counts"]["discovered"] > 0 and report["counts"]["loaded_signals"] == 0:
        report["warnings"].append("No signals successfully ingested (discovery/inspection completed but loading/parse produced zero signals).")

    return signals, report


def load_selected_recordings() -> Tuple[List[LoadedSignal], Dict[str, Any]]:
    """Backward-compatible entrypoint for pipeline."""
    return inspect_and_load_selected()


# Backward-compatible helper retained for existing callers/tests
def discover_mat_files(root: str, max_files: int) -> List[Path]:
    files, _ = discover_all_mat_files(root)
    if max_files and max_files > 0:
        return files[:max_files]
    return files
