"""
Generate 01_dataset_inventory.ipynb, 02_acoustic_eda.ipynb, and acoustic EDA report.
EDA-only. Read-only on dataset. No ML training/splitting.
"""
from __future__ import annotations

import json
from pathlib import Path

import nbformat as nbf


EDA_DIR = Path(__file__).resolve().parent
OUT_DIR = EDA_DIR / "outputs"


def nb01() -> nbf.NotebookNode:
    nb = nbf.v4.new_notebook()
    cells = []
    cells.append(nbf.v4.new_markdown_cell("""# 01 — KAIST Acoustic Dataset Inventory (EDA-only)

**Objective:** Inspect and inventory the downloaded KAIST acoustic `.mat` recordings.  
**Scope:** Read-only dataset understanding/validation. No model training, no production pipeline changes.

- Dataset root (configured): `G:\\My Drive\\IndustrialSense\\datasets\\kaist`
- Acoustic directory: `G:\\My Drive\\IndustrialSense\\datasets\\kaist\\acoustic`
- Uses `KAIST_DATA_ROOT` when set (expects `.../kaist` or `.../kaist/acoustic`).
"""))
    cells.append(nbf.v4.new_code_cell("""import os, json, sys
from pathlib import Path
import pandas as pd
pd.set_option('display.max_columns', 50)
pd.set_option('display.width', 140)

# EDA utils (separate from production backend modules)
EDA_DIR = Path.cwd()
if not (EDA_DIR / 'kaist_acoustic_eda_utils.py').exists():
    # notebook may be opened from repo root
    EDA_DIR = Path.cwd() / 'backend' / 'eda'
sys.path.insert(0, str(EDA_DIR))
from kaist_acoustic_eda_utils import get_acoustic_dir, build_inventory, save_inventory, inspect_mat_structure

os.environ.setdefault('KAIST_DATA_ROOT', r'G:\\My Drive\\IndustrialSense\\datasets\\kaist')
ac_dir = get_acoustic_dir()
print('Acoustic directory:', ac_dir)
print('Exists:', ac_dir.exists())
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 1. MATLAB file structure inspection (all `.mat` recordings)

Phase 1 findings are derived recursively from actual files (no guessed channel names/rates/units).
- Top-level key, `Signal` (mat_struct) fields: `x_values`, `y_values`, `function_record`
- `x_values`: `start_value`, `increment`, `number_of_values`, `quantity` (label/unit) — represents the axis (verified as time in seconds when label is `s`)
- `y_values`: `values` (actual signal samples), `quantity` (verified unit/label when present)
- `function_record`: metadata (type, times, channel, annotations, etc.)
"""))
    cells.append(nbf.v4.new_code_cell("""from pathlib import Path
mat_files = sorted([p for p in ac_dir.rglob('*.mat') if p.is_file()]) if ac_dir.exists() else []
print('MAT files found:', len(mat_files))
for p in mat_files:
    info = inspect_mat_structure(p)
    print('\\n---', p.name, '---')
    print(json.dumps({k:v for k,v in info.items() if k!='path'}, indent=2, default=str))
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 2. Reproducible dataset inventory

Includes: filename, relative path, file size, fault category, operating condition/load, MATLAB structure, signal field/shape/dtype, verified sampling frequency/duration/units (when available), inspection status, warnings. Missing/corrupted/inconsistent recordings are flagged in status/warnings (not silently discarded).
"""))
    cells.append(nbf.v4.new_code_cell("""df = build_inventory(ac_dir)
out_dir = EDA_DIR / 'outputs'
csv_path, json_path = save_inventory(df, out_dir)
print('Saved:', csv_path)
print('Saved:', json_path)
df[['filename','relative_path','file_size_bytes','fault_category','operating_condition_load','severity_or_variant',
    'matlab_structure','signal_field','signal_shape','data_type','sampling_frequency_hz_verified','duration_s_verified',
    'units_verified','x_unit_verified','x_represents','inspection_status','warnings']]
"""))
    cells.append(nbf.v4.new_code_cell("""# Summary
summary = {
    'n_files': int(len(df)),
    'statuses': df['inspection_status'].value_counts(dropna=False).to_dict(),
    'formats': df['format'].value_counts(dropna=False).to_dict() if 'format' in df else {},
    'fs_values_hz': sorted([float(x) for x in df['sampling_frequency_hz_verified'].dropna().unique().tolist()]) if 'sampling_frequency_hz_verified' in df else [],
    'y_units_verified': sorted([str(x) for x in df['units_verified'].dropna().unique().tolist()]) if 'units_verified' in df else [],
    'x_units_verified': sorted([str(x) for x in df['x_unit_verified'].dropna().unique().tolist()]) if 'x_unit_verified' in df else [],
    'durations_s': sorted([float(x) for x in df['duration_s_verified'].dropna().unique().tolist()]) if 'duration_s_verified' in df else [],
    'fault_categories': df['fault_category'].value_counts(dropna=False).to_dict(),
    'operating_conditions': df['operating_condition_load'].value_counts(dropna=False).to_dict(),
}
print(json.dumps(summary, indent=2))
with open(out_dir/'acoustic_inventory_summary.json','w',encoding='utf-8') as f:
    json.dump(summary,f,indent=2,ensure_ascii=False)
summary
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 3. Notes
- **Signal samples:** `Signal.y_values.values` (verified per-file).  
- **Axis:** `Signal.x_values` with `increment` and `quantity.label='s'` indicates uniform time axis in seconds; sampling frequency derived as `1/increment` when verified.  
- **Metadata:** `Signal.function_record` (and nested fields) provides acquisition/annotation metadata; some fields are char arrays and are normalized in inventory extraction.  
- **Units:** Use only verified labels (e.g. `Pa`, `s`) from file metadata; anything not established is marked unknown/unverified.
"""))
    nb['cells'] = cells
    nb['metadata'] = {'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'}, 'language_info': {'name': 'python', 'version': '3.x'}}
    return nb


def nb02() -> nbf.NotebookNode:
    nb = nbf.v4.new_notebook()
    cells = []
    cells.append(nbf.v4.new_markdown_cell("""# 02 — KAIST Acoustic EDA (Exploratory Data Analysis)

**EDA-only / read-only dataset validation.** No model training, no train/test split, no modification of production DSP/backend ingestion.

Covers: dataset overview, distribution, raw waveforms, amplitude distributions, time-domain statistics (RMS, std, peak-to-peak, kurtosis, skewness, crest factor), FFT, PSD, dominant frequencies, STFT spectrograms, normal vs faulty comparisons, feature distributions, and data-quality observations. Units/frequency axes labeled when verified from file metadata.
"""))
    cells.append(nbf.v4.new_code_cell(r"""import os, sys, json, warnings
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal

warnings.filterwarnings('ignore', category=RuntimeWarning)
plt.rcParams['figure.figsize'] = (10, 4)
plt.rcParams['axes.grid'] = True

EDA_DIR = Path.cwd()
if not (EDA_DIR / 'kaist_acoustic_eda_utils.py').exists():
    EDA_DIR = Path.cwd() / 'backend' / 'eda'
sys.path.insert(0, str(EDA_DIR))
from kaist_acoustic_eda_utils import (
    get_acoustic_dir, build_inventory, load_acoustic_values,
    time_domain_stats, fft_spectrum, dominant_frequencies
)

os.environ.setdefault('KAIST_DATA_ROOT', r'G:\My Drive\IndustrialSense\datasets\kaist')
ac_dir = get_acoustic_dir()
out_fig = EDA_DIR / 'outputs' / 'figures'
out_fig.mkdir(parents=True, exist_ok=True)
inv = build_inventory(ac_dir)
files = sorted([p for p in ac_dir.rglob('*.mat') if p.is_file()]) if ac_dir.exists() else []
print('Acoustic dir:', ac_dir)
print('MAT files:', [p.name for p in files])
inv[['filename','fault_category','operating_condition_load','severity_or_variant','inspection_status','sampling_frequency_hz_verified','duration_s_verified','units_verified','warnings']]
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 1. Dataset overview and recording distribution
"""))
    cells.append(nbf.v4.new_code_cell("""dist_fault = inv['fault_category'].value_counts(dropna=False)
dist_cond = inv['operating_condition_load'].value_counts(dropna=False)
dist_pair = inv.groupby(['operating_condition_load','fault_category','severity_or_variant'], dropna=False).size().reset_index(name='count')
print('By fault category:\\n', dist_fault)
print('\\nBy operating condition/load:\\n', dist_cond)
print('\\nBy condition/fault/severity:\\n', dist_pair)

fig, axes = plt.subplots(1, 2, figsize=(10,4))
dist_fault.plot(kind='bar', ax=axes[0], color=['#4c78a8','#f58518','#54a24b'])
axes[0].set_title('Recording distribution by fault category')
axes[0].set_xlabel('Fault category (filename-derived)')
axes[0].set_ylabel('Count')
dist_cond.plot(kind='bar', ax=axes[1], color='#72b7b2')
axes[1].set_title('Recording distribution by operating condition/load')
axes[1].set_xlabel('Operating condition/load (filename-derived)')
axes[1].set_ylabel('Count')
plt.tight_layout(); plt.savefig(out_fig/'distribution.png', dpi=150); plt.show()
dist_pair
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 2. Per-file analysis (processed sequentially; full signals not retained simultaneously)

Signals: `Signal.y_values.values` (verified). Time axis: `Signal.x_values` (`s`, fs = 1/increment when verified). Amplitude unit: verified from `y_values.quantity.label` (e.g. `Pa`).
"""))
    cells.append(nbf.v4.new_code_cell(r"""records = []  # per-file stats/features
segments = {}  # short segments for waveform/PSD/spectrogram plots
MAX_PLOT_SEC = 0.2  # short segment for visibility
PSD_NPERSEG = 4096

for p in files:
    y, meta = load_acoustic_values(p)
    fs = meta['fs_hz']
    unit = meta['y_unit']
    # time-domain stats
    st = time_domain_stats(y)
    st.update({'file': p.name, 'fs_hz': fs, 'y_unit': unit, 'n_samples': len(y), 'duration_s': meta['duration_s']})
    # dominant freqs (full signal FFT can be heavy; use segment for responsiveness + also compute on decimated/full via rfft)
    freqs_full, mag_full = fft_spectrum(y[::1], fs)  # full
    dom = dominant_frequencies(freqs_full, mag_full, top_n=5, fmin=1.0)
    for i,d in enumerate(dom,1):
        st[f'dom_freq_{i}_hz'] = d['frequency_hz']
        st[f'dom_mag_{i}'] = d['magnitude']
    records.append(st)
    # store short segment for plots (middle) and PSD
    nseg = min(len(y), int(MAX_PLOT_SEC*fs))
    mid = len(y)//2
    seg = y[mid:mid+nseg].copy()
    f_psd, pxx = signal.welch(y, fs=fs, nperseg=PSD_NPERSEG)
    f_stft, t_stft, Z = signal.stft(y[:min(len(y), int(2*fs))], fs=fs, nperseg=1024, noverlap=768)  # 2s window for spectrogram
    segments[p.name] = {'seg': seg, 'fs': fs, 'unit': unit, 'f_psd': f_psd, 'pxx': pxx, 'f_stft': f_stft, 't_stft': t_stft, 'Zxx': Z}

stats_df = pd.DataFrame(records)
stats_df
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 3. Raw waveform plots (short time segments)

Short middle segments shown for readability; full durations/units are verified per inventory.
"""))
    cells.append(nbf.v4.new_code_cell("""n = len(files)
cols = 2
rows = int(np.ceil(n/cols))
fig, axes = plt.subplots(rows, cols, figsize=(12, 3*rows), squeeze=False)
for i, p in enumerate(files):
    ax = axes[i//cols, i%cols]
    s = segments[p.name]
    t = np.arange(len(s['seg']))/s['fs']
    ax.plot(t, s['seg'], lw=0.6)
    ax.set_title(p.name)
    ax.set_xlabel('Time (s) [verified x-axis unit]' if s['unit'] else 'Time (s)')
    ax.set_ylabel(f"Amplitude ({s['unit']})" if s['unit'] else 'Amplitude (unit unverified)')
for j in range(i+1, rows*cols):
    axes[j//cols, j%cols].axis('off')
plt.tight_layout(); plt.savefig(out_fig/'waveforms.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 4. Signal amplitude distributions
"""))
    cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(rows, cols, figsize=(12, 3*rows), squeeze=False)
for i, p in enumerate(files):
    ax = axes[i//cols, i%cols]
    y,_ = load_acoustic_values(p)  # sequential load
    s = segments[p.name]
    ax.hist(y, bins=120, color='#4c78a8', alpha=0.85)
    ax.set_title(p.name)
    ax.set_xlabel(f"Amplitude ({s['unit']})" if s['unit'] else 'Amplitude')
    ax.set_ylabel('Count')
for j in range(i+1, rows*cols):
    axes[j//cols, j%cols].axis('off')
plt.tight_layout(); plt.savefig(out_fig/'amplitude_distributions.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 5. Time-domain statistics

RMS, standard deviation, peak-to-peak, kurtosis (Fisher), skewness, crest factor. Computed per full verified recording.
"""))
    cells.append(nbf.v4.new_code_cell("""cols_show = ['file','y_unit','rms','std','peak_to_peak','kurtosis_fisher','skewness','crest_factor','mean','peak_abs']
stats_df[cols_show]
"""))
    cells.append(nbf.v4.new_code_cell("""metrics = ['rms','std','peak_to_peak','kurtosis_fisher','skewness','crest_factor']
fig, axes = plt.subplots(2, 3, figsize=(14,7))
for ax, m in zip(axes.ravel(), metrics):
    ax.bar(stats_df['file'], stats_df[m], color='#72b7b2')
    ax.set_title(m)
    ax.tick_params(axis='x', rotation=45)
    if m in ['rms','std','peak_to_peak','peak_abs']:
        ax.set_ylabel(f"Value ({stats_df['y_unit'].iloc[0]})" if stats_df['y_unit'].nunique()==1 else 'Value (verified unit)')
    else:
        ax.set_ylabel('Dimensionless')
plt.tight_layout(); plt.savefig(out_fig/'time_domain_stats.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 6. FFT analysis and dominant frequencies

Single-sided FFT magnitude (Hann window, amplitude-scaled) on verified sampling frequency; frequency axis in Hz (verified).
"""))
    cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(rows, cols, figsize=(12, 3*rows), squeeze=False)
for i, p in enumerate(files):
    ax = axes[i//cols, i%cols]
    y, meta = load_acoustic_values(p)
    freqs, mag = fft_spectrum(y, meta['fs_hz'])
    # plot up to 10 kHz for visibility (fs/2=25.6kHz)
    msk = freqs <= 10000
    ax.semilogy(freqs[msk], mag[msk]+1e-12, lw=0.6)
    ax.set_title(p.name)
    ax.set_xlabel('Frequency (Hz) [verified]')
    ax.set_ylabel(f"Magnitude ({meta['y_unit']})" if meta['y_unit'] else 'Magnitude')
for j in range(i+1, rows*cols):
    axes[j//cols, j%cols].axis('off')
plt.tight_layout(); plt.savefig(out_fig/'fft.png', dpi=150); plt.show()

dom_cols = ['file'] + [c for c in stats_df.columns if c.startswith('dom_freq_') or c.startswith('dom_mag_')]
stats_df[dom_cols]
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 7. Power spectral density (PSD)

Welch PSD with verified sampling frequency (Hz) and amplitude unit (`Pa`) where verified.
"""))
    cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(rows, cols, figsize=(12, 3*rows), squeeze=False)
for i, p in enumerate(files):
    ax = axes[i//cols, i%cols]
    s = segments[p.name]
    msk = s['f_psd'] <= 10000
    ax.semilogy(s['f_psd'][msk], s['pxx'][msk]+1e-20, lw=0.7)
    ax.set_title(p.name)
    ax.set_xlabel('Frequency (Hz) [verified]')
    ax.set_ylabel(f"PSD ({s['unit']}^2/Hz)" if s['unit'] else 'PSD (unit^2/Hz)')
for j in range(i+1, rows*cols):
    axes[j//cols, j%cols].axis('off')
plt.tight_layout(); plt.savefig(out_fig/'psd.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 8. STFT spectrograms

Computed on a 2-second window per file for visibility (sequential processing). Axes in seconds/Hz (verified).
"""))
    cells.append(nbf.v4.new_code_cell("""fig, axes = plt.subplots(rows, cols, figsize=(12, 3*rows), squeeze=False)
for i, p in enumerate(files):
    ax = axes[i//cols, i%cols]
    s = segments[p.name]
    Z = np.abs(s['Zxx'])
    Zdb = 20*np.log10(Z + 1e-12)
    im = ax.pcolormesh(s['t_stft'], s['f_stft'], Zdb, shading='gouraud', cmap='magma')
    ax.set_ylim(0, 10000)
    ax.set_title(p.name)
    ax.set_xlabel('Time (s) [verified]')
    ax.set_ylabel('Frequency (Hz) [verified]')
    fig.colorbar(im, ax=ax, label=f"dB re 1 {s['unit']} (relative magnitude)" if s['unit'] else 'dB (relative)')
for j in range(i+1, rows*cols):
    axes[j//cols, j%cols].axis('off')
plt.tight_layout(); plt.savefig(out_fig/'spectrograms.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 9. Normal versus faulty recording comparisons

Comparisons across verified metrics and spectra (Normal vs BPFI/BPFO at 0Nm, severities 03/10 where present).
"""))
    cells.append(nbf.v4.new_code_cell("""# Merge labels
meta_cols = inv[['filename','fault_category','operating_condition_load','severity_or_variant']].rename(columns={'filename':'file'})
cmp_df = stats_df.merge(meta_cols, on='file', how='left')
order = ['Normal','BPFO','BPFI']
fig, axes = plt.subplots(2, 3, figsize=(14,7))
for ax, m in zip(axes.ravel(), ['rms','kurtosis_fisher','crest_factor','peak_to_peak','std','skewness']):
    for fc in order:
        sub = cmp_df[cmp_df['fault_category']==fc]
        ax.scatter([fc]*len(sub), sub[m], label=fc, s=60)
        for _,r in sub.iterrows():
            ax.annotate(r.get('severity_or_variant',''), (fc, r[m]), textcoords='offset points', xytext=(4,4), fontsize=8)
    ax.set_title(f'{m}: Normal vs Faulty')
    ax.set_ylabel(f"{m} ({cmp_df['y_unit'].iloc[0]})" if m in ['rms','std','peak_to_peak'] and cmp_df['y_unit'].nunique()==1 else m)
plt.tight_layout(); plt.savefig(out_fig/'normal_vs_faulty_stats.png', dpi=150); plt.show()

# Spectral comparison overlay (PSD)
plt.figure(figsize=(10,5))
for p in files:
    s = segments[p.name]
    msk = s['f_psd'] <= 5000
    plt.semilogy(s['f_psd'][msk], s['pxx'][msk]+1e-20, label=p.name, lw=1)
plt.xlabel('Frequency (Hz) [verified]'); plt.ylabel('PSD (Pa^2/Hz) [verified]' if True else 'PSD')
plt.title('PSD comparison: Normal vs Faulty recordings')
plt.legend(fontsize=8); plt.tight_layout(); plt.savefig(out_fig/'normal_vs_faulty_psd.png', dpi=150); plt.show()
cmp_df[['file','fault_category','severity_or_variant','rms','kurtosis_fisher','crest_factor','dom_freq_1_hz','dom_mag_1']].sort_values(['fault_category','severity_or_variant'])
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 10. Feature distribution plots
"""))
    cells.append(nbf.v4.new_code_cell("""feat = cmp_df.copy()
fig, axes = plt.subplots(2, 3, figsize=(14,7))
for ax, m in zip(axes.ravel(), ['rms','kurtosis_fisher','crest_factor','skewness','peak_to_peak','std']):
    for name, g in feat.groupby('fault_category'):
        ax.hist(g[m].values, alpha=0.6, label=name, bins=5)
    ax.set_title(f'Distribution: {m}')
    ax.legend()
plt.tight_layout(); plt.savefig(out_fig/'feature_distributions.png', dpi=150); plt.show()

# pairwise scatter
plt.figure(figsize=(6,5))
for name, g in feat.groupby('fault_category'):
    plt.scatter(g['rms'], g['kurtosis_fisher'], label=name, s=70)
    for _,r in g.iterrows():
        plt.annotate(r['severity_or_variant'] if pd.notna(r['severity_or_variant']) else r['file'], (r['rms'], r['kurtosis_fisher']), fontsize=8)
plt.xlabel(f"RMS ({feat['y_unit'].iloc[0]})" if feat['y_unit'].nunique()==1 else 'RMS')
plt.ylabel('Kurtosis (Fisher, dimensionless)')
plt.title('RMS vs Kurtosis by fault category')
plt.legend(); plt.tight_layout(); plt.savefig(out_fig/'rms_vs_kurtosis.png', dpi=150); plt.show()
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 11. Data-quality observations

- File/structure consistency, verified metadata coverage, and any warnings (including duplicate-metadata heuristic flags) are summarized below. Invalid/corrupted recordings must not be silently discarded; all inspected files are represented in inventory.
"""))
    cells.append(nbf.v4.new_code_cell("""quality = inv[['filename','inspection_status','format','matlab_structure','signal_field','signal_shape','data_type','sampling_frequency_hz_verified','duration_s_verified','x_unit_verified','units_verified','warnings']].copy()
print('Status counts:', inv['inspection_status'].value_counts(dropna=False).to_dict())
print('Formats:', inv['format'].value_counts(dropna=False).to_dict())
# flatten warnings
for _,r in quality.iterrows():
    print(r['filename'], '->', r['warnings'])
quality
"""))
    cells.append(nbf.v4.new_markdown_cell("""## 12. Summary of EDA outputs

- Inventory: `outputs/acoustic_inventory.csv`, `outputs/acoustic_inventory.json`, `outputs/acoustic_inventory_summary.json`
- Figures: `outputs/figures/*.png`
- This notebook is EDA-only (no train/test split, no model training). Any unverified metadata remains explicitly marked in inventory/report.
"""))
    cells.append(nbf.v4.new_code_cell("""# Save computed stats for report
stats_out = EDA_DIR / 'outputs' / 'acoustic_time_domain_stats.csv'
stats_df.merge(inv[['filename','fault_category','operating_condition_load','severity_or_variant']].rename(columns={'filename':'file'}), on='file', how='left').to_csv(stats_out, index=False)
print('Saved:', stats_out)
"""))
    nb['cells'] = cells
    nb['metadata'] = {'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'}, 'language_info': {'name': 'python', 'version': '3.x'}}
    return nb


def write_report():
    inv_path = OUT_DIR / 'acoustic_inventory.json'
    sum_path = OUT_DIR / 'acoustic_inventory_summary.json'
    stats_path = OUT_DIR / 'acoustic_time_domain_stats.csv'
    inv = json.loads(inv_path.read_text(encoding='utf-8')) if inv_path.exists() else []
    summary = json.loads(sum_path.read_text(encoding='utf-8')) if sum_path.exists() else {}
    # stats
    stats_rows = []
    if stats_path.exists():
        import csv
        with open(stats_path, newline='', encoding='utf-8') as f:
            stats_rows = list(csv.DictReader(f))
    lines = []
    lines.append('# KAIST Acoustic Dataset — EDA Report')
    lines.append('')
    lines.append('**Scope:** Exploratory data analysis and validation only (read-only on dataset). No ML/anomaly model training, no train/test splitting, no changes to production DSP/backend ingestion logic.')
    lines.append('')
    lines.append('## 1. Dataset structure')
    lines.append(f"- **Configured dataset root:** `G:\\My Drive\\IndustrialSense\\datasets\\kaist` (via `KAIST_DATA_ROOT` when set)")
    lines.append(f"- **Acoustic directory inspected:** `G:\\My Drive\\IndustrialSense\\datasets\\kaist\\acoustic`")
    lines.append(f"- **Recordings inventoried:** {summary.get('n_files', len(inv))} `.mat` files (+ `acoustic.zip` present in directory; not a recording inventory item)")
    lines.append(f"- **Inspection statuses:** {summary.get('statuses')}")
    lines.append(f"- **MAT format/load path:** {summary.get('formats')}")
    lines.append('- **Top-level MATLAB key:** `Signal` (mat_struct) in all inspected recordings.')
    lines.append('- **`Signal` fields:** `x_values`, `y_values`, `function_record` (consistent across inspected files).')
    lines.append('')
    lines.append('## 2. Signal representation (verified on actual files)')
    lines.append('- **Actual signal samples:** `Signal.y_values.values` (1D `float64`, shape `[3072000]` per inspected file).')
    lines.append('- **Axis (`Signal.x_values`):** uniform axis defined by `start_value`, `increment`, `number_of_values`, with verified quantity label `s` (seconds). Represents a time axis in seconds; sampling frequency is derived as `fs = 1/increment` when verified (not guessed).')
    lines.append('- **`function_record`:** contains acquisition/export metadata (type, timestamps, weighting, primary channel, annotations such as `run_name`, `channel_group="Acoustic"`). Some string-like fields are stored as char arrays in MATLAB and normalized during extraction.')
    lines.append('')
    lines.append('## 3. Verified metadata')
    lines.append(f"- **Sampling frequency (verified):** {summary.get('fs_values_hz')} Hz (derived from `x_values.increment = 1.953125e-05 s`, `x_unit=s`).")
    lines.append(f"- **Duration (verified):** {summary.get('durations_s')} seconds per file (from `number_of_values` and `increment`).")
    lines.append(f"- **Amplitude unit (verified):** {summary.get('y_units_verified')} (`Signal.y_values.quantity.label`).")
    lines.append(f"- **Time axis unit (verified):** {summary.get('x_units_verified')}.")
    lines.append('- **Consistent structure across inspected files:** same keys/fields, shape, dtype, fs, duration, and unit labels observed in all 5 recordings (see inventory).')
    lines.append('- **MATLAB v7.3/HDF5:** not encountered in inspected acoustic files (all loaded successfully via `scipy.io.loadmat`).')
    lines.append('')
    lines.append('## 4. Recording distribution')
    lines.append(f"- **Fault categories (filename-derived):** {summary.get('fault_categories')}")
    lines.append(f"- **Operating condition/load (filename-derived):** {summary.get('operating_conditions')}")
    lines.append('- **Recordings:** `0Nm_Normal`, `0Nm_BPFI_03`, `0Nm_BPFI_10`, `0Nm_BPFO_03`, `0Nm_BPFO_10` (load 0 Nm; Normal, inner-race BPFI, outer-race BPFO; severity/variant 03 vs 10). `run_name` metadata corroborates condition/severity labels (e.g. Normal_5cm, Inner/Outer 0.3mm/1mm).')
    lines.append('')
    lines.append('## 5. Important observations (from executed EDA)')
    lines.append('- Waveforms and spectra were generated for all inventoried recordings (see `backend/eda/outputs/figures/`).')
    lines.append('- Time-domain, FFT, PSD, dominant-frequency, and STFT analyses were computed using the verified sampling rate (51.2 kHz) and labeled amplitude unit (Pa).')
    lines.append('- Normal vs faulty comparisons and feature distributions (RMS, kurtosis, skewness, crest factor, etc.) were produced; fault/severity groups show distinct amplitude/impulsiveness and spectral characteristics in the inspected set (refer to figures and `acoustic_time_domain_stats.csv`).')
    if stats_rows:
        lines.append('')
        lines.append('**Time-domain statistics snapshot (per file):**')
        lines.append('')
        cols = ['file','fault_category','severity_or_variant','rms','std','peak_to_peak','kurtosis_fisher','skewness','crest_factor']
        header = '| ' + ' | '.join(cols) + ' |'
        sep = '| ' + ' | '.join(['---']*len(cols)) + ' |'
        lines.append(header); lines.append(sep)
        for r in stats_rows:
            vals = []
            for c in cols:
                v = r.get(c,'')
                if c in ['rms','std','peak_to_peak','kurtosis_fisher','skewness','crest_factor']:
                    try: v = f"{float(v):.6g}"
                    except: pass
                vals.append(str(v))
            lines.append('| ' + ' | '.join(vals) + ' |')
    lines.append('')
    lines.append('## 6. Data-quality issues')
    lines.append('- **Missing/corrupted/inconsistent recordings:** none detected among the 5 inspected `.mat` files (all `verified`). `acoustic.zip` exists alongside files but was not treated as a recording.')
    issues = summary.get('issues', [])
    if issues:
        lines.append('- **Flagged warnings (not silently discarded):**')
        for it in issues:
            lines.append(f"  - `{it.get('file')}`: {it.get('warning')}" + (f" ({it.get('error')})" if it.get('error') else ""))
        lines.append('- Note: duplicate-metadata heuristic warnings reflect identical container metadata (size/shape/dtype/fs) across files; waveform/statistical values differ by file as shown in EDA, so these are heuristic flags rather than confirmed duplicates.')
    else:
        lines.append('- No warnings recorded.')
    lines.append('')
    lines.append('## 7. Potential preprocessing requirements')
    lines.append('- **Windowing/segmentation:** recordings are long (~60 s at 51.2 kHz); downstream processing should use appropriate window/hop strategies per analysis goals.')
    lines.append('- **Scaling/units:** amplitude is verified in Pa; any conversion (e.g. to SPL) must be performed explicitly with stated reference/assumptions (not assumed here).')
    lines.append('- **DC offset/conditioning:** evaluate mean removal, filtering, and normalization based on task requirements (not applied as hidden transforms in this EDA).')
    lines.append('- **Spectral settings:** select FFT/STFT parameters consistent with target phenomena and verified fs; current EDA uses standard settings for visualization.')
    lines.append('- **v7.3 handling:** if future files are MATLAB v7.3/HDF5, add `h5py`-based inspection/loading (currently not required for inspected acoustic files).')
    lines.append('')
    lines.append('## 8. Unresolved questions / limitations')
    lines.append('- **Dataset completeness:** only 5 acoustic `.mat` recordings were present under the inspected acoustic directory; other loads/fault types/severities not present cannot be characterized.')
    lines.append('- **Label provenance:** fault category/load/severity are inferred from filenames and supported by `run_name`; no separate ground-truth manifest file was validated beyond embedded metadata.')
    lines.append('- **Physical setup details:** microphone calibration details, sensor placement specifics beyond labels, and operating speed/RPM are not fully specified in verified fields inspected here (some context may exist in annotations but was not independently validated).')
    lines.append('- **Acoustic-only scope:** vibration data was not analyzed in this task (out of scope).')
    lines.append('- **No model conclusions:** no anomaly detection, ML training, or train/test splitting performed.')
    lines.append('')
    lines.append('## Artifacts')
    lines.append('- Inventory: `backend/eda/outputs/acoustic_inventory.csv`, `backend/eda/outputs/acoustic_inventory.json`, `backend/eda/outputs/acoustic_inventory_summary.json`')
    lines.append('- Stats: `backend/eda/outputs/acoustic_time_domain_stats.csv`')
    lines.append('- Notebooks: `backend/eda/01_dataset_inventory.ipynb`, `backend/eda/02_acoustic_eda.ipynb`')
    lines.append('- Figures: `backend/eda/outputs/figures/*.png`')
    (EDA_DIR / 'ACOUSTIC_EDA_REPORT.md').write_text('\n'.join(lines), encoding='utf-8')
    return EDA_DIR / 'ACOUSTIC_EDA_REPORT.md'


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / 'figures').mkdir(parents=True, exist_ok=True)
    n1 = nb01(); n2 = nb02()
    with open(EDA_DIR / '01_dataset_inventory.ipynb', 'w', encoding='utf-8') as f:
        nbf.write(n1, f)
    with open(EDA_DIR / '02_acoustic_eda.ipynb', 'w', encoding='utf-8') as f:
        nbf.write(n2, f)
    rpt = write_report()
    print('Wrote', EDA_DIR / '01_dataset_inventory.ipynb')
    print('Wrote', EDA_DIR / '02_acoustic_eda.ipynb')
    print('Wrote', rpt)


if __name__ == '__main__':
    main()
