import io
import os
from pathlib import Path

import numpy as np
import pytest
from scipy.io import savemat

from app.ingestion_adapters.kaist_mat import (
    discover_all_mat_files,
    inspect_mat_file,
    load_recording,
    modality_from_path,
)


def _lms_acoustic_mat(path: Path, fs=51200.0, n=5120, unit="Pa"):
    t = np.arange(n) * (1.0 / fs)
    y = (0.1 * np.sin(2 * np.pi * 100 * t)).astype(np.float64)
    Signal = {
        "x_values": {
            "start_value": 0.0,
            "increment": 1.0 / fs,
            "number_of_values": n,
            "quantity": {"label": "s"},
        },
        "y_values": {
            "values": y,
            "quantity": {"label": unit},
        },
        "function_record": {"type": "Signal"},
    }
    savemat(path, {"Signal": Signal})


def _lms_vibration_mat(path: Path, fs=25600.0, n=2560, channels=4, unit="g"):
    t = np.arange(n) * (1.0 / fs)
    cols = []
    for i in range(channels):
        cols.append(0.01 * (i + 1) * np.sin(2 * np.pi * (50 + 10 * i) * t))
    y = np.stack(cols, axis=1).astype(np.float64)
    labels = [f"Point{i+1}" for i in range(channels)]
    Signal = {
        "x_values": {
            "start_value": 0.0,
            "increment": 1.0 / fs,
            "number_of_values": n,
            "quantity": {"label": "s"},
        },
        "y_values": {
            "values": y,
            "quantity": {"label": unit},
        },
        "function_record": {
            "type": "Signal",
            "name": np.array([f"{i+3}:{labels[i]}" for i in range(channels)], dtype=object),
            "primary_channel": {
                "id": np.array([i + 3 for i in range(channels)], dtype=object),
                "label": np.array(labels, dtype=object),
            },
            "TL_export_properties_annotation": {
                "channel_group": np.array(["Vibration"] * channels, dtype=object),
                "run_name": "test_run",
            },
        },
    }
    savemat(path, {"Signal": Signal})


def test_recursive_discovery_includes_both_modalities(tmp_path: Path):
    (tmp_path / "acoustic").mkdir()
    (tmp_path / "vibration" / "vibration").mkdir(parents=True)
    _lms_acoustic_mat(tmp_path / "acoustic" / "a1.mat")
    _lms_vibration_mat(tmp_path / "vibration" / "vibration" / "v1.mat")
    # non-mat ignored
    (tmp_path / "acoustic" / "readme.txt").write_text("x", encoding="utf-8")

    files, issues = discover_all_mat_files(str(tmp_path))
    rels = sorted([p.relative_to(tmp_path).as_posix() for p in files])
    assert rels == ["acoustic/a1.mat", "vibration/vibration/v1.mat"]
    assert issues == []


def test_modality_identification_from_path(tmp_path: Path):
    assert modality_from_path(tmp_path / "acoustic" / "x.mat", tmp_path) == "acoustic"
    assert modality_from_path(tmp_path / "vibration" / "x.mat", tmp_path) == "vibration"
    assert modality_from_path(tmp_path / "other" / "x.mat", tmp_path) == "unknown"


def test_nested_acoustic_structure_loading_and_sampling(tmp_path: Path):
    p = tmp_path / "acoustic" / "0Nm_Normal.mat"
    p.parent.mkdir(parents=True)
    _lms_acoustic_mat(p, fs=51200.0, n=5120, unit="Pa")
    res = load_recording(p, tmp_path)
    assert res["status"] == "loaded"
    assert len(res["signals"]) == 1
    sig = res["signals"][0]
    assert sig.metadata.modality == "acoustic"
    assert sig.metadata.channel == "acoustic"
    assert sig.metadata.source_unit == "Pa"
    assert sig.metadata.source_sample_rate_hz == pytest.approx(51200.0)
    assert sig.metadata.sampling_rate_source == "verified:x_values.increment"
    assert sig.metadata.source_key == "Signal.y_values.values"
    assert sig.data.shape == (5120,)


def test_nested_vibration_multichannel_structure_loading(tmp_path: Path):
    p = tmp_path / "vibration" / "2Nm_BPFI_03.mat"
    p.parent.mkdir(parents=True)
    _lms_vibration_mat(p, fs=25600.0, n=2560, channels=4, unit="g")
    res = load_recording(p, tmp_path)
    assert res["status"] == "loaded"
    assert len(res["signals"]) == 4
    units = {s.metadata.source_unit for s in res["signals"]}
    mods = {s.metadata.modality for s in res["signals"]}
    srs = {round(s.metadata.source_sample_rate_hz, 6) for s in res["signals"]}
    assert units == {"g"}
    assert mods == {"vibration"}
    assert srs == {25600.0}
    keys = [s.metadata.channel_info.get("label") for s in res["signals"]]
    assert keys == ["Point1", "Point2", "Point3", "Point4"]


def test_missing_fields_reported_not_silent(tmp_path: Path):
    p = tmp_path / "acoustic" / "bad.mat"
    p.parent.mkdir(parents=True)
    # Signal missing y_values.values -> parsing should fail
    savemat(p, {"Signal": {"x_values": {"increment": 1.0/1000, "number_of_values": 10, "quantity": {"label": "s"}}}})
    res = load_recording(p, tmp_path)
    assert res["status"] == "failed"
    assert res["signals"] == []
    assert res["errors"]  # not silently discarded


def test_corrupt_file_handled(tmp_path: Path):
    p = tmp_path / "acoustic" / "corrupt.mat"
    p.parent.mkdir(parents=True)
    p.write_bytes(b"not a mat file")
    res = load_recording(p, tmp_path)
    assert res["status"] == "failed"
    assert res["signals"] == []
    assert res["errors"]


def test_unsupported_v73_format_handled(tmp_path: Path, monkeypatch):
    p = tmp_path / "acoustic" / "v73.mat"
    p.parent.mkdir(parents=True)
    p.write_bytes(b"dummy")

    def raise_notimpl(*a, **k):
        raise NotImplementedError("Please use HDF reader for matlab v7.3 files")

    monkeypatch.setattr("app.ingestion_adapters.kaist_mat.loadmat", raise_notimpl)
    insp = inspect_mat_file(p, tmp_path)
    assert insp["status"] == "failed"
    assert any("v7.3" in e or "HDF" in e for e in (insp.get("errors", []) + insp.get("warnings", [])))
    res = load_recording(p, tmp_path)
    assert res["status"] == "failed"
    assert res["signals"] == []


def test_sampling_rate_extraction_verified_from_increment(tmp_path: Path):
    p = tmp_path / "acoustic" / "fs.mat"
    p.parent.mkdir(parents=True)
    _lms_acoustic_mat(p, fs=51200.0, n=1024)
    res = load_recording(p, tmp_path)
    assert res["status"] == "loaded"
    assert res["details"]["fs_hz"] == pytest.approx(51200.0)
    assert res["signals"][0].metadata.sampling_rate_source.startswith("verified:")

