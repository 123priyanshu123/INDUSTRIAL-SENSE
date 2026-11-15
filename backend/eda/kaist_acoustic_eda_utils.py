"""
EDA-only utilities for KAIST acoustic .mat inspection, inventory, and feature extraction.
Read-only with respect to dataset. Separate from production backend modules.
Do not guess channels/sampling rates/units; mark unknown/unverified explicitly.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from scipy import signal, stats
from scipy.io import loadmat


ACOUSTIC_DIR_DEFAULT = Path(r"G:\My Drive\IndustrialSense\datasets\kaist\acoustic")


def get_acoustic_dir() -> Path:
    root = os.environ.get("KAIST_DATA_ROOT")
    if root:
        p = Path(root)
        # if root points to kaist or acoustic
        if p.name.lower() == "acoustic" and p.exists():
            return p
        cand = p / "acoustic"
        if cand.exists():
            return cand
        if p.exists():
            return p
    return ACOUSTIC_DIR_DEFAULT


def _join_char_array(x: Any) -> Optional[str]:
    try:
        a = np.asarray(x)
        if a.dtype.kind in ("U", "S") and a.ndim == 1 and a.size > 0:
            return "".join([str(c) for c in a.tolist()])
        if isinstance(x, str):
            return x
    except Exception:
        pass
    return None


def _to_jsonable(obj: Any) -> Any:
    if isinstance(obj, (str, int, float, bool)) or obj is None:
        return obj
    if isinstance(obj, np.integer):
        return int(obj)
    if isinstance(obj, np.floating):
        return float(obj)
    if isinstance(obj, np.ndarray):
        return obj.tolist()
    if isinstance(obj, dict):
        return {str(k): _to_jsonable(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [_to_jsonable(v) for v in obj]
    return str(obj)


def inspect_mat_structure(mat_path: Path) -> Dict[str, Any]:
    """Read-only inspection of a .mat file structure."""
    info: Dict[str, Any] = {
        "file": mat_path.name,
        "path": str(mat_path),
        "relative_path": None,
        "size_bytes": mat_path.stat().st_size if mat_path.exists() else None,
        "status": "unknown",
        "format": None,
        "mat_keys": [],
        "signal_fieldnames": [],
        "warnings": [],
        "error": None,
    }
    try:
        mat = loadmat(mat_path, squeeze_me=True, struct_as_record=False)
        keys = [k for k in mat.keys() if not k.startswith("__")]
        info["mat_keys"] = keys
        info["format"] = "scipy.io.loadmat OK (MATLAB v5/v7/v7.2 compatible; not v7.3/HDF5 in this load path)"
        if "Signal" not in mat:
            info["status"] = "inconsistent"
            info["warnings"].append("Top-level key 'Signal' not found.")
            info["top_level_summary"] = {k: type(mat[k]).__name__ for k in keys}
            return info
        sig = mat["Signal"]
        if not hasattr(sig, "_fieldnames"):
            info["status"] = "inconsistent"
            info["warnings"].append("'Signal' is not a MATLAB struct with _fieldnames.")
            return info
        info["signal_fieldnames"] = list(sig._fieldnames)
        expected = {"x_values", "y_values", "function_record"}
        missing = sorted(list(expected - set(sig._fieldnames)))
        if missing:
            info["warnings"].append(f"Missing expected Signal fields: {missing}")
        info["status"] = "ok"
    except NotImplementedError as e:
        info["status"] = "error"
        info["format"] = "MATLAB v7.3/HDF5 (scipy.io.loadmat unsupported)"
        info["error"] = str(e)
        info["warnings"].append("v7.3/HDF5 file encountered; h5py-based inspection required.")
    except Exception as e:
        info["status"] = "error"
        info["error"] = str(e)
    return info


def extract_signal_record(mat_path: Path, dataset_root: Path) -> Dict[str, Any]:
    """Extract verified metadata and signal info from one acoustic .mat file (read-only)."""
    rec: Dict[str, Any] = {
        "filename": mat_path.name,
        "relative_path": str(mat_path.relative_to(dataset_root)) if dataset_root in mat_path.parents or mat_path.parent == dataset_root else str(mat_path),
        "file_size_bytes": mat_path.stat().st_size,
        "fault_category": None,
        "operating_condition_load": None,
        "severity_or_variant": None,
        "matlab_structure": None,
        "signal_field": None,
        "signal_shape": None,
        "data_type": None,
        "sampling_frequency_hz_verified": None,
        "duration_s_verified": None,
        "units_verified": None,
        "x_unit_verified": None,
        "x_represents": None,
        "function_record_metadata": {},
        "inspection_status": "unknown",
        "warnings": [],
        "format": None,
    }
    # Parse from filename (best-effort, documented as filename-derived)
    name = mat_path.stem
    parts = name.split("_")
    if len(parts) >= 2:
        rec["operating_condition_load"] = parts[0]  # e.g. 0Nm
        rec["fault_category"] = parts[1]  # Normal/BPFI/BPFO
        if len(parts) >= 3:
            rec["severity_or_variant"] = "_".join(parts[2:])

    try:
        mat = loadmat(mat_path, squeeze_me=True, struct_as_record=False)
        rec["format"] = "scipy.io.loadmat OK (MATLAB v5/v7/v7.2 compatible; not v7.3/HDF5)"
        if "Signal" not in mat:
            rec["inspection_status"] = "inconsistent"
            rec["warnings"].append("Top-level key 'Signal' not found.")
            return rec
        sig = mat["Signal"]
        if not hasattr(sig, "_fieldnames"):
            rec["inspection_status"] = "inconsistent"
            rec["warnings"].append("'Signal' is not a MATLAB struct.")
            return rec
        rec["matlab_structure"] = f"Signal(mat_struct) fields={list(sig._fieldnames)}"
        # x_values
        xv = getattr(sig, "x_values", None)
        if xv is not None and hasattr(xv, "_fieldnames"):
            inc = float(getattr(xv, "increment", np.nan))
            n = int(getattr(xv, "number_of_values", 0))
            start = float(getattr(xv, "start_value", np.nan))
            x_unit = None
            try:
                x_unit = str(xv.quantity.label)
            except Exception:
                x_unit = None
            rec["x_unit_verified"] = x_unit
            if x_unit == "s" and np.isfinite(inc) and inc > 0:
                rec["x_represents"] = "time_axis_seconds (uniform sampling defined by start_value/increment/number_of_values)"
                rec["sampling_frequency_hz_verified"] = 1.0 / inc
                rec["duration_s_verified"] = (n - 1) * inc if n > 0 else None
            elif x_unit is not None:
                rec["x_represents"] = f"axis_with_unit_{x_unit} (interpretation not assumed beyond verified unit)"
            else:
                rec["x_represents"] = "unknown (no verified unit)"
                rec["warnings"].append("x_values quantity unit not verified.")
            rec["function_record_metadata"]["x_start_value"] = start
            rec["function_record_metadata"]["x_increment"] = inc
            rec["function_record_metadata"]["x_number_of_values"] = n
        else:
            rec["warnings"].append("Signal.x_values missing or unexpected structure.")

        # y_values
        yv = getattr(sig, "y_values", None)
        if yv is not None and hasattr(yv, "_fieldnames"):
            values = np.asarray(getattr(yv, "values"))
            rec["signal_field"] = "Signal.y_values.values"
            rec["signal_shape"] = list(values.shape)
            rec["data_type"] = str(values.dtype)
            try:
                y_unit = str(yv.quantity.label)
            except Exception:
                y_unit = None
            rec["units_verified"] = y_unit  # acoustic pressure unit as verified
            # consistency checks
            if xv is not None and hasattr(xv, "number_of_values"):
                try:
                    n = int(xv.number_of_values)
                    if values.size != n:
                        rec["warnings"].append(f"y_values size ({values.size}) != x_values.number_of_values ({n})")
                except Exception:
                    pass
        else:
            rec["warnings"].append("Signal.y_values missing or unexpected structure.")
            rec["signal_field"] = "unknown"

        # function_record
        fr = getattr(sig, "function_record", None)
        if fr is not None and hasattr(fr, "_fieldnames"):
            meta = rec["function_record_metadata"]
            for k in ["name", "type", "creation_time", "last_modification_time", "weighting"]:
                if hasattr(fr, k):
                    v = getattr(fr, k)
                    j = _join_char_array(v)
                    meta[k] = j if j is not None else _to_jsonable(v)
            try:
                pc = fr.primary_channel
                meta["primary_channel"] = {
                    "id": _to_jsonable(getattr(pc, "id", None)),
                    "label": _join_char_array(getattr(pc, "label", None)),
                }
            except Exception:
                pass
            try:
                ann = fr.TL_export_properties_annotation
                meta["annotation"] = {}
                for k in ["project_name", "section_name", "run_name", "absolute_time", "channel_group", "orig_location"]:
                    if hasattr(ann, k):
                        meta["annotation"][k] = _join_char_array(getattr(ann, k))
            except Exception:
                pass
        else:
            rec["warnings"].append("Signal.function_record missing or unexpected structure.")

        # finalize
        if rec["signal_field"] == "Signal.y_values.values" and rec["sampling_frequency_hz_verified"] is not None and rec["units_verified"] is not None:
            rec["inspection_status"] = "verified"
        elif rec.get("error"):
            rec["inspection_status"] = "error"
        else:
            rec["inspection_status"] = "partial"

    except NotImplementedError as e:
        rec["inspection_status"] = "error"
        rec["format"] = "MATLAB v7.3/HDF5 (scipy.io.loadmat unsupported)"
        rec["error"] = str(e)
        rec["warnings"].append("v7.3/HDF5 file encountered; h5py-based handling required.")
    except Exception as e:
        rec["inspection_status"] = "error"
        rec["error"] = str(e)
        rec["warnings"].append(f"Read/parse error: {e}")
    return rec


def load_acoustic_values(mat_path: Path) -> Tuple[np.ndarray, Dict[str, Any]]:
    """Load y_values.values and verified axis metadata (read-only)."""
    mat = loadmat(mat_path, squeeze_me=True, struct_as_record=False)
    sig = mat["Signal"]
    y = np.asarray(sig.y_values.values, dtype=np.float64).ravel()
    xv = sig.x_values
    inc = float(xv.increment)
    fs = 1.0 / inc
    meta = {
        "fs_hz": fs,
        "x_increment_s": inc,
        "x_start_s": float(xv.start_value),
        "n": int(xv.number_of_values),
        "duration_s": (int(xv.number_of_values) - 1) * inc,
        "x_unit": str(xv.quantity.label),
        "y_unit": str(sig.y_values.quantity.label),
        "file": mat_path.name,
    }
    return y, meta


def list_acoustic_mat_files(acoustic_dir: Optional[Path] = None) -> List[Path]:
    d = acoustic_dir or get_acoustic_dir()
    if not d.exists():
        return []
    files = sorted([p for p in d.rglob("*.mat") if p.is_file()])
    return files


def build_inventory(acoustic_dir: Optional[Path] = None) -> pd.DataFrame:
    d = acoustic_dir or get_acoustic_dir()
    dataset_root = d.parent if d.name.lower() == "acoustic" else d
    files = list_acoustic_mat_files(d)
    records = [extract_signal_record(p, dataset_root) for p in files]
    df = pd.DataFrame(records)
    # duplicate/inconsistency checks (shape is a list -> stringify for hashing)
    if not df.empty and "file_size_bytes" in df.columns:
        check = df.copy()
        if "signal_shape" in check.columns:
            check["signal_shape_key"] = check["signal_shape"].apply(lambda x: json.dumps(x) if isinstance(x, (list, dict)) else str(x))
        else:
            check["signal_shape_key"] = None
        subset = ["file_size_bytes", "signal_shape_key", "data_type", "sampling_frequency_hz_verified"]
        subset = [c for c in subset if c in check.columns]
        if subset:
            dup_mask = check.duplicated(subset=subset, keep=False)
            if dup_mask.any():
                for idx in check[dup_mask].index:
                    w = df.at[idx, "warnings"]
                    if isinstance(w, list):
                        msg = "Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file"
                        if msg not in w:
                            w.append(msg)
    return df


def time_domain_stats(y: np.ndarray) -> Dict[str, float]:
    y = np.asarray(y, dtype=np.float64)
    y = y[np.isfinite(y)]
    if y.size == 0:
        return {}
    rms = float(np.sqrt(np.mean(y**2)))
    std = float(np.std(y))
    peak_to_peak = float(np.ptp(y))
    peak = float(np.max(np.abs(y)))
    kurt = float(stats.kurtosis(y, fisher=True, bias=False)) if y.size > 3 else np.nan
    skew = float(stats.skew(y, bias=False)) if y.size > 2 else np.nan
    crest = float(peak / rms) if rms > 0 else np.nan
    return {
        "rms": rms,
        "std": std,
        "peak_to_peak": peak_to_peak,
        "kurtosis_fisher": kurt,
        "skewness": skew,
        "crest_factor": crest,
        "peak_abs": peak,
        "mean": float(np.mean(y)),
    }


def fft_spectrum(y: np.ndarray, fs: float) -> Tuple[np.ndarray, np.ndarray]:
    n = len(y)
    win = np.hanning(n)
    yf = np.fft.rfft(y * win)
    mag = np.abs(yf) * 2.0 / np.sum(win)
    freqs = np.fft.rfftfreq(n, d=1.0 / fs)
    return freqs, mag


def dominant_frequencies(freqs: np.ndarray, mag: np.ndarray, top_n: int = 5, fmin: float = 0.0) -> List[Dict[str, float]]:
    mask = freqs >= fmin
    f = freqs[mask]
    m = mag[mask]
    if len(m) == 0:
        return []
    idx = np.argsort(m)[::-1][:top_n]
    return [{"frequency_hz": float(f[i]), "magnitude": float(m[i])} for i in idx]


def save_inventory(df: pd.DataFrame, out_dir: Path) -> Tuple[Path, Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "acoustic_inventory.csv"
    json_path = out_dir / "acoustic_inventory.json"
    # CSV-friendly copy
    df_csv = df.copy()
    for col in df_csv.columns:
        if df_csv[col].apply(lambda x: isinstance(x, (dict, list))).any():
            df_csv[col] = df_csv[col].apply(lambda x: json.dumps(x, ensure_ascii=False) if isinstance(x, (dict, list)) else x)
    df_csv.to_csv(csv_path, index=False)
    records = json.loads(df.to_json(orient="records"))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    return csv_path, json_path
