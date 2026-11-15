# KAIST Acoustic Dataset — EDA Report

**Scope:** Exploratory data analysis and validation only (read-only on dataset). No ML/anomaly model training, no train/test splitting, no changes to production DSP/backend ingestion logic.

## 1. Dataset structure
- **Configured dataset root:** `G:\My Drive\IndustrialSense\datasets\kaist` (via `KAIST_DATA_ROOT` when set)
- **Acoustic directory inspected:** `G:\My Drive\IndustrialSense\datasets\kaist\acoustic`
- **Recordings inventoried:** 5 `.mat` files (+ `acoustic.zip` present in directory; not a recording inventory item)
- **Inspection statuses:** {'verified': 5}
- **MAT format/load path:** {'scipy.io.loadmat OK (MATLAB v5/v7/v7.2 compatible; not v7.3/HDF5)': 5}
- **Top-level MATLAB key:** `Signal` (mat_struct) in all inspected recordings.
- **`Signal` fields:** `x_values`, `y_values`, `function_record` (consistent across inspected files).

## 2. Signal representation (verified on actual files)
- **Actual signal samples:** `Signal.y_values.values` (1D `float64`, shape `[3072000]` per inspected file).
- **Axis (`Signal.x_values`):** uniform axis defined by `start_value`, `increment`, `number_of_values`, with verified quantity label `s` (seconds). Represents a time axis in seconds; sampling frequency is derived as `fs = 1/increment` when verified (not guessed).
- **`function_record`:** contains acquisition/export metadata (type, timestamps, weighting, primary channel, annotations such as `run_name`, `channel_group="Acoustic"`). Some string-like fields are stored as char arrays in MATLAB and normalized during extraction.

## 3. Verified metadata
- **Sampling frequency (verified):** [51200.0] Hz (derived from `x_values.increment = 1.953125e-05 s`, `x_unit=s`).
- **Duration (verified):** [59.99998046875] seconds per file (from `number_of_values` and `increment`).
- **Amplitude unit (verified):** ['Pa'] (`Signal.y_values.quantity.label`).
- **Time axis unit (verified):** ['s'].
- **Consistent structure across inspected files:** same keys/fields, shape, dtype, fs, duration, and unit labels observed in all 5 recordings (see inventory).
- **MATLAB v7.3/HDF5:** not encountered in inspected acoustic files (all loaded successfully via `scipy.io.loadmat`).

## 4. Recording distribution
- **Fault categories (filename-derived):** {'BPFI': 2, 'BPFO': 2, 'Normal': 1}
- **Operating condition/load (filename-derived):** {'0Nm': 5}
- **Recordings:** `0Nm_Normal`, `0Nm_BPFI_03`, `0Nm_BPFI_10`, `0Nm_BPFO_03`, `0Nm_BPFO_10` (load 0 Nm; Normal, inner-race BPFI, outer-race BPFO; severity/variant 03 vs 10). `run_name` metadata corroborates condition/severity labels (e.g. Normal_5cm, Inner/Outer 0.3mm/1mm).

## 5. Important observations (from executed EDA)
- Waveforms and spectra were generated for all inventoried recordings (see `backend/eda/outputs/figures/`).
- Time-domain, FFT, PSD, dominant-frequency, and STFT analyses were computed using the verified sampling rate (51.2 kHz) and labeled amplitude unit (Pa).
- Normal vs faulty comparisons and feature distributions (RMS, kurtosis, skewness, crest factor, etc.) were produced; fault/severity groups show distinct amplitude/impulsiveness and spectral characteristics in the inspected set (refer to figures and `acoustic_time_domain_stats.csv`).

## 6. Data-quality issues
- **Missing/corrupted/inconsistent recordings:** none detected among the 5 inspected `.mat` files (all `verified`). `acoustic.zip` exists alongside files but was not treated as a recording.
- **Flagged warnings (not silently discarded):**
  - `0Nm_BPFI_03.mat`: Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file
  - `0Nm_BPFI_10.mat`: Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file
  - `0Nm_BPFO_03.mat`: Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file
  - `0Nm_BPFO_10.mat`: Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file
  - `0Nm_Normal.mat`: Potential duplicate/inconsistent: shares size/shape/dtype/fs with another file
- Note: duplicate-metadata heuristic warnings reflect identical container metadata (size/shape/dtype/fs) across files; waveform/statistical values differ by file as shown in EDA, so these are heuristic flags rather than confirmed duplicates.

## 7. Potential preprocessing requirements
- **Windowing/segmentation:** recordings are long (~60 s at 51.2 kHz); downstream processing should use appropriate window/hop strategies per analysis goals.
- **Scaling/units:** amplitude is verified in Pa; any conversion (e.g. to SPL) must be performed explicitly with stated reference/assumptions (not assumed here).
- **DC offset/conditioning:** evaluate mean removal, filtering, and normalization based on task requirements (not applied as hidden transforms in this EDA).
- **Spectral settings:** select FFT/STFT parameters consistent with target phenomena and verified fs; current EDA uses standard settings for visualization.
- **v7.3 handling:** if future files are MATLAB v7.3/HDF5, add `h5py`-based inspection/loading (currently not required for inspected acoustic files).

## 8. Unresolved questions / limitations
- **Dataset completeness:** only 5 acoustic `.mat` recordings were present under the inspected acoustic directory; other loads/fault types/severities not present cannot be characterized.
- **Label provenance:** fault category/load/severity are inferred from filenames and supported by `run_name`; no separate ground-truth manifest file was validated beyond embedded metadata.
- **Physical setup details:** microphone calibration details, sensor placement specifics beyond labels, and operating speed/RPM are not fully specified in verified fields inspected here (some context may exist in annotations but was not independently validated).
- **Acoustic-only scope:** vibration data was not analyzed in this task (out of scope).
- **No model conclusions:** no anomaly detection, ML training, or train/test splitting performed.

## Artifacts
- Inventory: `backend/eda/outputs/acoustic_inventory.csv`, `backend/eda/outputs/acoustic_inventory.json`, `backend/eda/outputs/acoustic_inventory_summary.json`
- Stats: `backend/eda/outputs/acoustic_time_domain_stats.csv`
- Notebooks: `backend/eda/01_dataset_inventory.ipynb`, `backend/eda/02_acoustic_eda.ipynb`
- Figures: `backend/eda/outputs/figures/*.png`

## 9. Review / additional analysis (`03_acoustic_eda_review.ipynb`)

**Scope:** EDA-only investigation of existing acoustic results (read-only dataset). No model training, no train/test split, no production pipeline changes. **No mechanical fault frequencies inferred** (RPM and bearing geometry not verified/available in inspected metadata).

**Artifacts:** `backend/eda/03_acoustic_eda_review.ipynb`, `backend/eda/03_acoustic_eda_review.executed.ipynb` (0 error outputs), `backend/eda/outputs/review/*.csv|*.json`, `backend/eda/outputs/review/figures/*.png`.

### 9.1 FFT peak extraction (independent peaks vs neighboring bins) — **Verified observation**
- **Existing method (`dominant_frequencies`):** selects top-N bins by magnitude (global sort) without peak picking/prominence or neighborhood suppression.
- **Finding:** reported top-5 frequencies can be neighboring bins of the same spectral peak (same independent peak). Using full-length FFT (Hann, amplitude scaling as in utils) and independent peak detection (`scipy.signal.find_peaks`, adaptive prominence, min distance 10 Hz, fmin 1 Hz), naive bins mapped as follows:
  - `0Nm_BPFI_03.mat`: 2247.05 & 2247.033 → same peak (~2247.05 Hz); 2196.833 & 2196.85 → same peak (~2196.83 Hz); 2096.433 separate.
  - `0Nm_BPFI_10.mat`: 4 of 5 naive bins → same peak (~2246.45 Hz); 1 → ~2196.25 Hz.
  - `0Nm_BPFO_03.mat`: 3 → ~1454.217 Hz; 2 → ~730.617 Hz.
  - `0Nm_BPFO_10.mat`: all 5 → same peak (~1283.75 Hz).
  - `0Nm_Normal.mat`: 3 → ~1454.05 Hz; 1 → ~2158.567 Hz; 1 → ~2108.367 Hz.
- **Implication:** "top frequencies" from naive bin ranking should not be interpreted as 5 independent peaks without peak picking/grouping. See `naive_vs_independent_peaks.csv` and `figures/fft_peaks_*.png`.

### 9.2 Spectral peak prominence and bandwidth — **Verified observation**
- Computed for independent peaks (same detection settings) using `scipy.signal.peak_prominences` and `scipy.signal.peak_widths` (`rel_height=0.5` of prominence → half-prominence bandwidth in Hz). Results (top peaks per file, with prominence, bandwidth, left/right intercepts, bin spacing/threshold metadata) saved in `spectral_peaks_prominence_bandwidth.csv`. Bandwidth/prominence values are parameter- and definition-dependent (half-prominence width reported).

### 9.3 Persistence of dominant frequencies across segments — **Verified observation**
- Method: reference independent peaks from full recording (top 5) tracked across **12 non-overlapping 5 s segments** per file (60 s recordings) with **tolerance ±15 Hz** and per-segment independent peak picking (top 5).
- Persistence (segments present / 12):
  - `0Nm_BPFI_03`: 2247.05, 2196.83, 2096.43, 2146.63, 1291.45 Hz → 12/12 each.
  - `0Nm_BPFI_10`: 2246.45, 2196.25, 1291.07, 2146.05 Hz → 12/12; 804.767 Hz → 0/12.
  - `0Nm_BPFO_03`: 1454.217, 730.617, 2191.867 Hz → 12/12; 6099.5, 2132.85 Hz → 0/12.
  - `0Nm_BPFO_10`: 1283.75, 2200.6, 916.967, 2017.217 Hz → 12/12; 1467.15 Hz → 11/12.
  - `0Nm_Normal`: 1454.05, 2158.567, 2108.367, 6375.317 Hz → 12/12; 4166.55 Hz → 0/12.
- Some reference peaks (often lower-ranked in specific contexts) were not consistently among per-segment top-5 within tolerance; persistent vs intermittent behavior is segment-length/threshold/tolerance dependent. See `frequency_persistence_summary.csv`, `segment_dominant_frequencies.csv`, `figures/persistence_*.png`.

### 9.4 Relationship between RMS, kurtosis and crest factor — **Verified observations + definitions**
- **Definitions (verified):** $RMS=\sqrt{\frac{1}{N}\sum y_i^2}$, $crest=\max|y_i|/RMS$, Fisher (excess) kurtosis reflects tail heaviness/impulsiveness relative to Gaussian. By mechanics, crest increases with larger peaks relative to RMS; kurtosis increases with rare/extreme deviations (impulsive events). A signal can have moderate RMS but elevated kurtosis/crest if impulsive.
- **Computed (full-file and 12 × 5 s non-overlapping segments, Pa):**
  - Segment means/CV illustrate amplitude vs impulsiveness patterns: e.g. `BPFI_10`/`BPFO_10` higher RMS means (~1.025/0.895 Pa) with negative mean excess kurtosis in segments (~-0.603/-0.355) and moderate crest (~3.10/3.32); `BPFO_03`/`Normal` lower RMS (~0.141/0.148 Pa) with higher crest (~4.83/5.02) and near-zero/positive kurtosis (~0.073/0.212). `BPFI_03` intermediate.
  - Within-recording variability (CV over 5 s segments): RMS CV ~0.31–2.98% across files; crest-factor and peak-abs variability higher in `BPFO_03`/`Normal` (crest std ~0.28–0.35, peak-abs CV ~7.2–7.5%) than in `BPFI_10`/`BPFO_10`.
- Relationships/correlations and scatter trends are provided in notebook outputs (`figures/rms_kurtosis_crest_relationships.png`, `segment_variability_summary.csv`); interpretations are limited to signal statistics (no causal/mechanical attribution).

### 9.5 PSD normalization and units — **Verified observation**
- **Check:** `scipy.signal.welch` with `scaling='density'` (Hann, `nperseg=4096`, 50% overlap, detrend constant) on verified Pa signals.
- **Units:** one-sided PSD density units **Pa²/Hz** (consistent with existing EDA labeling). For comparison, `scaling='spectrum'` yields **Pa²**.
- **Integral consistency (density integral / mean-square):** `BPFI_03` 0.971, `BPFI_10` 0.995, `BPFO_03` 0.782, `BPFO_10` 0.994, `Normal` 0.769 (spectrum/mean-square ratios ~1.162–1.493). Density integrals approximate mean-square with deviations attributable to Welch windowing/averaging/detrending/segmentation; labeling/normalization choice is verified and documented. See `psd_normalization_check.csv`.

### 9.6 Equivalent-duration waveform segments — **Verified observation**
- Compared identical windows across all 5 recordings: **50 ms starting at 10.0 s** (verified time axis). Side-by-side and overlay plots generated (`figures/equivalent_waveform_segments.png`, `figures/equivalent_waveform_overlay.png`) showing amplitude/time-domain morphology differences at the same offset/duration in verified units (Pa, s).

### 9.7 Time-domain statistics over multiple non-overlapping segments — **Verified observation**
- Computed per **5 s non-overlapping segments** (12 segments/file, 60 s each): RMS, std, peak-to-peak, kurtosis, skewness, crest factor, peak abs, mean. Saved `segment_time_domain_stats.csv` and `segment_variability_summary.csv`; per-file trend plots in `figures/variability_*.png`. Within-recording variability differs by metric and file (see 9.4 summary).

### 9.8 Methodological limitations (verified context)
- **Peak analysis parameter sensitivity:** prominence threshold, minimum distance (10 Hz), FFT length/segmenting, and persistence tolerance (±15 Hz) affect detected peaks, bandwidths, and persistence counts.
- **Spectral resolution/leakage:** full-length FFT yields fine bin spacing (~1/duration) so neighboring bins can belong to one peak lobe; shorter segments change resolution and variance.
- **PSD estimation:** Welch results depend on window/nperseg/overlap/detrending; integral checks are approximate under windowed averaging.
- **Dataset scope:** 5 recordings, single verified operating condition/load (0 Nm), filename/metadata-derived labels; no external manifest.
- **No mechanical inference:** RPM and bearing geometry not verified → characteristic fault frequencies not computed or attributed.

### 9.9 Hypotheses (clearly separated, **not verified**)
- Observed differences in impulsiveness (kurtosis/crest), RMS, and spectral/persistence patterns between Normal/BPFI/BPFO and severities **may be consistent** with fault-related acoustic behavior, but this is **not** a causal/mechanical diagnosis in this analysis.
- Confirmation would require verified operating speed/RPM, bearing/geometry details, controlled repeats, and (for modeling) appropriately designed validation — outside this EDA-only review.
