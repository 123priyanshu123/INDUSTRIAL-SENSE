"""
Generate KAIST acoustic dataset inventory (CSV/JSON) and summary. EDA-only, read-only on dataset.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from kaist_acoustic_eda_utils import build_inventory, save_inventory


def main():
    eda_dir = Path(__file__).resolve().parent
    out_dir = eda_dir / "outputs"
    df = build_inventory()
    csv_path, json_path = save_inventory(df, out_dir)

    issues = []
    for _, r in df.iterrows():
        ws = r.get("warnings") or []
        if isinstance(ws, str):
            try:
                ws = json.loads(ws)
            except Exception:
                ws = [ws]
        for w in ws:
            issues.append({"file": r.get("filename"), "warning": w})
        if r.get("inspection_status") in ("error", "inconsistent", "partial"):
            issues.append({"file": r.get("filename"), "warning": f"inspection_status={r.get('inspection_status')}", "error": r.get("error")})

    summary = {
        "n_files": int(len(df)),
        "statuses": df["inspection_status"].value_counts(dropna=False).to_dict() if "inspection_status" in df else {},
        "formats": df["format"].value_counts(dropna=False).to_dict() if "format" in df else {},
        "fs_values_hz": sorted([float(x) for x in df["sampling_frequency_hz_verified"].dropna().unique().tolist()]) if "sampling_frequency_hz_verified" in df else [],
        "y_units_verified": sorted([str(x) for x in df["units_verified"].dropna().unique().tolist()]) if "units_verified" in df else [],
        "x_units_verified": sorted([str(x) for x in df["x_unit_verified"].dropna().unique().tolist()]) if "x_unit_verified" in df else [],
        "durations_s": sorted([float(x) for x in df["duration_s_verified"].dropna().unique().tolist()]) if "duration_s_verified" in df else [],
        "shapes": df["signal_shape"].astype(str).value_counts().to_dict() if "signal_shape" in df else {},
        "fault_categories": df["fault_category"].value_counts(dropna=False).to_dict() if "fault_category" in df else {},
        "operating_conditions": df["operating_condition_load"].value_counts(dropna=False).to_dict() if "operating_condition_load" in df else {},
        "issues": issues,
    }
    with open(out_dir / "acoustic_inventory_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print(json.dumps({"csv": str(csv_path), "json": str(json_path), "summary": summary}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
