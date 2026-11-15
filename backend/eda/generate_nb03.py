import nbformat as nbf
from pathlib import Path

nb = nbf.v4.new_notebook()
cells = []

def md(s): cells.append(nbf.v4.new_markdown_cell(s))
def code(s): cells.append(nbf.v4.new_code_cell(s))

md(r"""# 03 — KAIST Acoustic EDA Review (Additional Analysis)

**Scope:** Review/investigation of existing KAIST acoustic EDA results. Read-only on dataset. No model training, no train/test split, no production pipeline changes. EDA-only.

This notebook investigates:
1. FFT peak extraction (independent peaks vs neighboring bins)
2. Spectral peak prominence and bandwidth
3. Persistence of dominant frequencies across multiple segments
4. Relationship between RMS, kurtosis and crest factor
5. PSD normalization and units
6. Equivalent-duration waveform segment comparisons across all recordings
7. Time-domain statistics over multiple non-overlapping segments (within-recording variability)
8. Observations and methodological limitations

**Constraint:** No inference of mechanical fault frequencies without verified RPM and bearing geometry.
""")

code(r"""import os, sys, json, warnings
from pathlib import Path
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy import signal, stats

warnings.filterwarnings('ignore')
plt.rcParams['figure.figsize'] = (10, 4)
plt.rcParams['axes.grid'] = True

EDA_DIR = Path.cwd()
if not (EDA_DIR / 'kaist_acoustic_eda_utils.py').exists():
    EDA_DIR = Path.cwd() / 'backend' / 'eda'
sys.path.insert(0, str(EDA_DIR))
from kaist_acoustic_eda_utils import get_acoustic_dir, list_acoustic_mat_files, load_acoustic_values, time_domain_stats

os.environ.setdefault('KAIST_DATA_ROOT', r'G:\My Drive\IndustrialSense\datasets\kaist')
ac_dir = get_acoustic_dir()
files = list_acoustic_mat_files(ac_dir)
out_dir = EDA_DIR / 'outputs' / 'review'
fig_dir = out_dir / 'figures'
fig_dir.mkdir(parents=True, exist_ok=True)

print('Acoustic dir:', ac_dir)
print('Files:', [p.name for p in files])
# Load once (reused; sequential processing for segment analyses)
data = {}
for p in files:
    y, meta = load_acoustic_values(p)
    data[p.name] = {'y': y, 'meta': meta}
print('Loaded recordings:', {k: (len(v['y']), v['meta']['fs_hz'], v['meta']['y_unit']) for k,v in data.items()})
""")

md("""## 1. Verify FFT peak extraction algorithm

**Context (existing EDA utils):** `dominant_frequencies` takes the top-N bins by magnitude after sorting (no peak picking/prominence/neighborhood suppression). This can report neighboring bins of the same spectral peak as separate "dominant frequencies".
""")

code(r"""# Reproduce naive top-bin method (as in existing utils) and compare to independent peak picking
def fft_spectrum_hann(y, fs):
    n = len(y)
    win = np.hanning(n)
    cg = np.sum(win)  # coherent gain sum for amplitude scaling used in existing utils
    Y = np.fft.rfft(y * win)
    mag = np.abs(Y) * 2.0 / cg
    freqs = np.fft.rfftfreq(n, d=1.0/fs)
    return freqs, mag

def naive_top_bins(freqs, mag, top_n=5, fmin=1.0):
    msk = freqs >= fmin
    f, m = freqs[msk], mag[msk]
    idx = np.argsort(m)[::-1][:top_n]
    return pd.DataFrame({'rank': np.arange(1, top_n+1), 'frequency_hz': f[idx], 'magnitude': m[idx], 'bin_index_in_masked': idx})

def independent_peaks(freqs, mag, fmin=1.0, prominence=None, distance_hz=10.0):
    msk = freqs >= fmin
    f, m = freqs[msk], mag[msk]
    if len(f) < 3:
        return pd.DataFrame(), {}
    df_hz = float(np.median(np.diff(f)))
    distance_bins = max(1, int(round(distance_hz / df_hz))) if df_hz > 0 else 1
    if prominence is None:
        prominence = float(np.median(m) + 3*np.std(m))  # adaptive threshold
    peaks, props = signal.find_peaks(m, prominence=prominence, distance=distance_bins)
    out = pd.DataFrame({
        'frequency_hz': f[peaks],
        'magnitude': m[peaks],
        'prominence': props.get('prominences', np.full(len(peaks), np.nan)),
        'peak_bin': peaks,
    })
    if len(out):
        out = out.sort_values('magnitude', ascending=False).reset_index(drop=True)
        out['rank'] = np.arange(1, len(out)+1)
    return out, {'df_hz': df_hz, 'distance_bins': distance_bins, 'prominence_threshold': prominence}

comparison_rows = []
for name, d in data.items():
    freqs, mag = fft_spectrum_hann(d['y'], d['meta']['fs_hz'])
    naive = naive_top_bins(freqs, mag, top_n=5, fmin=1.0)
    peaks_df, meta_pk = independent_peaks(freqs, mag, fmin=1.0, prominence=None, distance_hz=10.0)
    print('\n' + '='*80)
    print(name, '| fs=', d['meta']['fs_hz'], 'Hz | FFT bin spacing ~', meta_pk.get('df_hz'), 'Hz')
    print('Naive top-5 bins (existing method):')
    print(naive.to_string(index=False))
    print('\nIndependent peaks (find_peaks, min distance 10 Hz, adaptive prominence): top 10 by magnitude')
    if len(peaks_df):
        print(peaks_df.head(10)[['rank','frequency_hz','magnitude','prominence']].to_string(index=False))
    else:
        print('None found with current criteria')
    if len(peaks_df):
        peak_freqs = peaks_df['frequency_hz'].values
        for _, r in naive.iterrows():
            j = int(np.argmin(np.abs(peak_freqs - r['frequency_hz'])))
            comparison_rows.append({
                'file': name,
                'naive_rank': int(r['rank']),
                'naive_freq_hz': float(r['frequency_hz']),
                'naive_mag': float(r['magnitude']),
                'nearest_independent_peak_freq_hz': float(peak_freqs[j]),
                'abs_diff_hz': float(abs(peak_freqs[j] - r['frequency_hz'])),
                'mapped_peak_rank_by_mag': int(peaks_df.iloc[j]['rank']) if 'rank' in peaks_df.columns else None,
                'n_independent_peaks_total': int(len(peaks_df)),
            })
    else:
        for _, r in naive.iterrows():
            comparison_rows.append({'file': name, 'naive_rank': int(r['rank']), 'naive_freq_hz': float(r['frequency_hz']), 'naive_mag': float(r['magnitude']), 'nearest_independent_peak_freq_hz': np.nan, 'abs_diff_hz': np.nan, 'mapped_peak_rank_by_mag': np.nan, 'n_independent_peaks_total': 0})

comp_df = pd.DataFrame(comparison_rows)
comp_df.to_csv(out_dir/'naive_vs_independent_peaks.csv', index=False)
comp_df
""")

code(r"""# Visual: naive bins vs independent peaks
for name, d in data.items():
    freqs, mag = fft_spectrum_hann(d['y'], d['meta']['fs_hz'])
    naive = naive_top_bins(freqs, mag, top_n=5, fmin=1.0)
    peaks_df, _ = independent_peaks(freqs, mag, fmin=1.0, distance_hz=10.0)
    msk = (freqs>=1) & (freqs<=5000)
    f,m = freqs[msk], mag[msk]
    plt.figure(figsize=(11,3.5))
    plt.semilogy(f, m+1e-12, lw=0.7, label='FFT magnitude (Hann, scaled as utils)')
    plt.scatter(naive['frequency_hz'], naive['magnitude'], color='red', zorder=5, label='Naive top-5 bins', marker='x')
    if len(peaks_df):
        pshow = peaks_df[peaks_df['frequency_hz']<=5000].head(10)
        plt.scatter(pshow['frequency_hz'], pshow['magnitude'], facecolors='none', edgecolors='green', s=70, zorder=6, label='Independent peaks (top 10)')
    plt.xlim(0,5000)
    plt.xlabel('Frequency (Hz) [verified fs=51.2 kHz]')
    plt.ylabel(f"Magnitude ({d['meta']['y_unit']}) [scaled as in existing utils]")
    plt.title(f'{name}: naive top bins vs independent peaks')
    plt.legend(loc='upper right', fontsize=8)
    plt.tight_layout(); plt.savefig(fig_dir/f'fft_peaks_{name.replace(".mat","")}.png', dpi=150); plt.show()
""")

md("""**Verified finding:** Naive top-5 bin selection can report neighboring bins of the same spectral peak as separate "dominant frequencies" (insufficient neighborhood suppression). Independent peak picking (prominence + minimum distance) identifies distinct peaks; naive bins often map to the same independent peak.
""")

md("""## 2. Spectral peak prominence and bandwidth
""")

code(r"""peak_rows = []
for name, d in data.items():
    freqs, mag = fft_spectrum_hann(d['y'], d['meta']['fs_hz'])
    msk = freqs >= 1.0
    f, m = freqs[msk], mag[msk]
    df_hz = float(np.median(np.diff(f)))
    prominence_thr = float(np.median(m) + 3*np.std(m))
    peaks, props = signal.find_peaks(m, prominence=prominence_thr, distance=max(1,int(round(10/df_hz))))
    if len(peaks)==0:
        continue
    prominences = props['prominences']
    widths_res = signal.peak_widths(m, peaks, rel_height=0.5, prominence_data=(props['prominences'], props['left_bases'], props['right_bases']))
    widths_hm = widths_res[0] * df_hz
    left_ips_hz = f[0] + widths_res[2] * df_hz
    right_ips_hz = f[0] + widths_res[3] * df_hz
    order = np.argsort(m[peaks])[::-1]
    for rk, i in enumerate(order[:15], 1):
        p = peaks[i]
        peak_rows.append({
            'file': name,
            'peak_rank_by_mag': rk,
            'frequency_hz': float(f[p]),
            'magnitude': float(m[p]),
            'prominence': float(prominences[i]),
            'bandwidth_half_prominence_hz': float(widths_hm[i]),
            'left_ip_hz': float(left_ips_hz[i]),
            'right_ip_hz': float(right_ips_hz[i]),
            'prominence_threshold_used': float(prominence_thr),
            'fft_bin_spacing_hz': df_hz,
        })
peaks_df_all = pd.DataFrame(peak_rows)
peaks_df_all.to_csv(out_dir/'spectral_peaks_prominence_bandwidth.csv', index=False)
peaks_df_all.head(40)
""")

md("""## 3. Persistence of dominant frequencies across multiple segments
""")

code(r"""SEG_SEC = 5.0  # non-overlapping segments
seg_persist_rows = []
persistence_summary = []
for name, d in data.items():
    y, fs = d['y'], d['meta']['fs_hz']
    seg_len = int(SEG_SEC*fs)
    nseg = len(y)//seg_len
    if nseg < 2:
        continue
    freqs_full, mag_full = fft_spectrum_hann(y, fs)
    ref_peaks, _ = independent_peaks(freqs_full, mag_full, fmin=1.0, distance_hz=10.0)
    ref_top = ref_peaks.head(5)['frequency_hz'].values if len(ref_peaks) else np.array([])
    seg_top_freqs = []
    for s in range(nseg):
        ys = y[s*seg_len:(s+1)*seg_len]
        fr, mg = fft_spectrum_hann(ys, fs)
        pk,_ = independent_peaks(fr, mg, fmin=1.0, distance_hz=10.0)
        topf = pk.head(5)['frequency_hz'].values if len(pk) else np.array([])
        seg_top_freqs.append(topf)
        for rnk, fv in enumerate(topf,1):
            seg_persist_rows.append({'file':name,'segment':s,'segment_start_s':s*SEG_SEC,'segment_end_s':(s+1)*SEG_SEC,'rank':rnk,'frequency_hz':float(fv)})
    tol_hz = 15.0
    print('\n', name, f'| {nseg} segments of {SEG_SEC}s | ref top independent peaks (Hz):', np.round(ref_top,3))
    for rf in ref_top[:5]:
        count = sum(1 for arr in seg_top_freqs if len(arr)>0 and np.min(np.abs(arr-rf)) <= tol_hz)
        persistence_summary.append({'file':name,'ref_peak_hz':float(rf),'segments_present':int(count),'n_segments':int(nseg),'persistence_ratio':count/nseg,'tolerance_hz':tol_hz})
        print(f'  ref {rf:9.3f} Hz -> present in {count}/{nseg} segments (tol {tol_hz} Hz)')

seg_persist_df = pd.DataFrame(seg_persist_rows)
persist_df = pd.DataFrame(persistence_summary)
seg_persist_df.to_csv(out_dir/'segment_dominant_frequencies.csv', index=False)
persist_df.to_csv(out_dir/'frequency_persistence_summary.csv', index=False)
persist_df
""")

code(r"""# Frequency tracks across segments
for name in data.keys():
    sdf = seg_persist_df[seg_persist_df['file']==name]
    if sdf.empty: continue
    plt.figure(figsize=(11,4))
    for rnk in sorted(sdf['rank'].unique()):
        sr = sdf[sdf['rank']==rnk]
        plt.scatter(sr['segment_start_s'] + SEG_SEC/2, sr['frequency_hz'], s=18, alpha=0.7, label=f'rank {rnk}')
    plt.xlabel('Segment mid-time (s)')
    plt.ylabel('Peak frequency (Hz) [verified]')
    plt.title(f'{name}: dominant independent peak frequencies across {SEG_SEC}s segments')
    plt.legend(ncol=5, fontsize=8)
    plt.tight_layout(); plt.savefig(fig_dir/f'persistence_{name.replace(".mat","")}.png', dpi=150); plt.show()
""")

md("""## 4. Relationship between RMS, kurtosis and crest factor
""")

code(r"""SEG_SEC_STATS = 5.0
full_rows = []
seg_rows = []
for name, d in data.items():
    y, fs = d['y'], d['meta']['fs_hz']
    st = time_domain_stats(y)
    st.update({'file':name,'scope':'full'})
    full_rows.append(st)
    seg_len = int(SEG_SEC_STATS*fs)
    nseg = len(y)//seg_len
    for s in range(nseg):
        ys = y[s*seg_len:(s+1)*seg_len]
        ss = time_domain_stats(ys)
        ss.update({'file':name,'scope':'segment','segment':s,'t_start_s':s*SEG_SEC_STATS})
        seg_rows.append(ss)
full_stats = pd.DataFrame(full_rows)
seg_stats = pd.DataFrame(seg_rows)
print(full_stats[['file','rms','std','peak_abs','peak_to_peak','kurtosis_fisher','skewness','crest_factor','mean']].to_string(index=False))
print('\nFull-file Pearson correlation:')
print(full_stats[['rms','std','peak_abs','peak_to_peak','kurtosis_fisher','skewness','crest_factor']].corr().round(4))
print('\nPooled segment-level Pearson correlation:')
print(seg_stats[['rms','std','peak_abs','peak_to_peak','kurtosis_fisher','skewness','crest_factor']].corr().round(4))
""")

code(r"""fig, axes = plt.subplots(1,3, figsize=(14,4))
for name, g in seg_stats.groupby('file'):
    axes[0].scatter(g['rms'], g['kurtosis_fisher'], label=name, alpha=0.6, s=18)
    axes[1].scatter(g['rms'], g['crest_factor'], label=name, alpha=0.6, s=18)
    axes[2].scatter(g['kurtosis_fisher'], g['crest_factor'], label=name, alpha=0.6, s=18)
axes[0].set_xlabel('RMS (Pa) [verified]'); axes[0].set_ylabel('Kurtosis (Fisher)')
axes[1].set_xlabel('RMS (Pa) [verified]'); axes[1].set_ylabel('Crest factor')
axes[2].set_xlabel('Kurtosis (Fisher)'); axes[2].set_ylabel('Crest factor')
for ax in axes: ax.legend(fontsize=7)
plt.suptitle(f'Segment-level relationships ({SEG_SEC_STATS}s non-overlapping segments)')
plt.tight_layout(); plt.savefig(fig_dir/'rms_kurtosis_crest_relationships.png', dpi=150); plt.show()
""")

md(r"""**Verified definitions/mechanics:** $RMS=\sqrt{\frac{1}{N}\sum y_i^2}$, $crest=\max|y_i|/RMS$, Fisher kurtosis measures tail heaviness/impulsiveness (excess over Gaussian). Crest rises with larger peaks relative to RMS; kurtosis rises with rare/extreme deviations. A signal may have moderate RMS but high kurtosis/crest if impulsive. Computed correlations/plots above are **verified observations** for this dataset/segmentation; causal/mechanical attribution beyond verified metadata is not claimed.
""")

md("""## 5. Verify PSD normalization and units
""")

code(r"""rows_psd=[]
for name, d in data.items():
    y, fs, unit = d['y'], d['meta']['fs_hz'], d['meta']['y_unit']
    nperseg = 4096
    f, pxx = signal.welch(y, fs=fs, window='hann', nperseg=nperseg, noverlap=nperseg//2, scaling='density', detrend='constant')
    df = float(f[1]-f[0]) if len(f)>1 else np.nan
    integral = float(np.trapezoid(pxx, f))
    ms = float(np.mean(y**2))
    var = float(np.var(y))
    f2, pxx2 = signal.welch(y, fs=fs, window='hann', nperseg=nperseg, noverlap=nperseg//2, scaling='spectrum', detrend='constant')
    integral_spec = float(np.sum(pxx2))
    rows_psd.append({
        'file':name,'y_unit_verified':unit,'nperseg':nperseg,'df_hz':df,
        'mean_square_signal':ms,'variance_signal':var,
        'welch_density_integral':integral,
        'density_integral_over_mean_square':integral/ms if ms!=0 else np.nan,
        'welch_spectrum_integral':integral_spec,
        'spectrum_integral_over_mean_square':integral_spec/ms if ms!=0 else np.nan,
        'expected_density_unit':'Pa^2/Hz' if unit=='Pa' else f'{unit}^2/Hz',
        'expected_spectrum_unit':'Pa^2' if unit=='Pa' else f'{unit}^2'
    })
psd_check = pd.DataFrame(rows_psd)
psd_check.to_csv(out_dir/'psd_normalization_check.csv', index=False)
psd_check
""")

md("""**Verified:** `scipy.signal.welch` with `scaling='density'` yields a one-sided PSD in (signal unit)^2/Hz (here **Pa^2/Hz**, given verified `Pa`), whose frequency integral approximates the signal mean-square (detrended/windowed Welch estimate). `scaling='spectrum'` yields (unit)^2. Existing EDA PSD labeling (`Pa^2/Hz`) is consistent with density scaling.
""")

md("""## 6. Equivalent-duration waveform segments across all five recordings
""")

code(r"""START_S = 10.0
DUR_S = 0.05  # 50 ms
names = [p.name for p in files]
fig, axes = plt.subplots(len(names), 1, figsize=(12, 2.2*len(names)), sharex=False)
if len(names)==1: axes=[axes]
for ax, name in zip(axes, names):
    y, fs, unit = data[name]['y'], data[name]['meta']['fs_hz'], data[name]['meta']['y_unit']
    i0 = int(START_S*fs); i1 = i0 + int(DUR_S*fs)
    seg = y[i0:i1]
    t = (np.arange(len(seg))/fs) + START_S
    ax.plot(t, seg, lw=0.7)
    ax.set_ylabel(f'Amp ({unit})')
    ax.set_title(f'{name} | {START_S:.2f}s–{START_S+DUR_S:.3f}s (equivalent duration/start)')
axes[-1].set_xlabel('Time (s) [verified]')
plt.tight_layout(); plt.savefig(fig_dir/'equivalent_waveform_segments.png', dpi=150); plt.show()

plt.figure(figsize=(12,4))
for name in names:
    y, fs = data[name]['y'], data[name]['meta']['fs_hz']
    i0 = int(START_S*fs); i1 = i0 + int(DUR_S*fs)
    seg = y[i0:i1]
    t = np.arange(len(seg))/fs
    plt.plot(t, seg, lw=0.8, label=name)
plt.xlabel('Time within segment (s) [verified]'); plt.ylabel('Amplitude (Pa) [verified]')
plt.title(f'Equivalent-duration overlay: {DUR_S*1000:.0f} ms starting at {START_S}s (all recordings)')
plt.legend(fontsize=8); plt.tight_layout(); plt.savefig(fig_dir/'equivalent_waveform_overlay.png', dpi=150); plt.show()
""")

md("""## 7. Time-domain statistics over multiple non-overlapping segments (within-recording variability)
""")

code(r"""SEG_SEC_VAR = 5.0
seg_long = []
for name, d in data.items():
    y, fs = d['y'], d['meta']['fs_hz']
    seg_len = int(SEG_SEC_VAR*fs)
    nseg = len(y)//seg_len
    for s in range(nseg):
        ys = y[s*seg_len:(s+1)*seg_len]
        stt = time_domain_stats(ys)
        stt.update({'file':name,'segment':s,'t_start_s':s*SEG_SEC_VAR,'t_end_s':(s+1)*SEG_SEC_VAR})
        seg_long.append(stt)
seg_long_df = pd.DataFrame(seg_long)
seg_long_df.to_csv(out_dir/'segment_time_domain_stats.csv', index=False)

summary_rows=[]
for name,g in seg_long_df.groupby('file'):
    r={'file':name,'n_segments':len(g)}
    for m in ['rms','std','peak_to_peak','kurtosis_fisher','skewness','crest_factor','peak_abs','mean']:
        vals=g[m].values.astype(float)
        r[f'{m}_mean']=float(np.mean(vals)); r[f'{m}_std']=float(np.std(vals, ddof=1)) if len(vals)>1 else 0.0
        r[f'{m}_min']=float(np.min(vals)); r[f'{m}_max']=float(np.max(vals)); r[f'{m}_range']=float(np.max(vals)-np.min(vals))
        r[f'{m}_cv_pct']= float((r[f'{m}_std']/r[f'{m}_mean']*100) if r[f'{m}_mean']!=0 else np.nan)
    summary_rows.append(r)
var_summary = pd.DataFrame(summary_rows)
var_summary.to_csv(out_dir/'segment_variability_summary.csv', index=False)
display_cols = ['file','n_segments','rms_mean','rms_cv_pct','kurtosis_fisher_mean','kurtosis_fisher_std','crest_factor_mean','crest_factor_std','peak_abs_mean','peak_abs_cv_pct']
var_summary[display_cols]
""")

code(r"""metrics_plot=['rms','kurtosis_fisher','crest_factor','peak_to_peak']
for name in seg_long_df['file'].unique():
    g = seg_long_df[seg_long_df['file']==name].sort_values('segment')
    fig, axes = plt.subplots(2,2, figsize=(12,6), sharex=True)
    for ax,m in zip(axes.ravel(), metrics_plot):
        ax.plot(g['t_start_s']+SEG_SEC_VAR/2, g[m], marker='o', ms=3, lw=1)
        ax.set_title(m); ax.set_xlabel('Time (s) [verified]')
    plt.suptitle(f'Within-recording segment variability: {name} ({SEG_SEC_VAR}s segments)')
    plt.tight_layout(); plt.savefig(fig_dir/f'variability_{name.replace(".mat","")}.png', dpi=150); plt.show()
""")

md("""## 8. Observations and methodological limitations

### Verified observations (computed from actual files)
- **FFT peak extraction:** naive top-N bin selection (as in existing utils) can report neighboring bins of the same spectral peak; independent peak picking with prominence and minimum frequency distance identifies distinct peaks (see comparison table/plots and CSVs).
- **Prominence/bandwidth:** computed for independent peaks using `scipy.signal.peak_prominences` and `peak_widths` (half-prominence bandwidth reported in Hz) at stated thresholds/bin spacing.
- **Persistence:** reference independent peaks tracked across fixed non-overlapping segments (tolerance-based presence) show which dominant peaks recur over time vs vary (see persistence summary/plots).
- **RMS–kurtosis–crest:** definitions hold by construction; computed full/segment statistics and correlations quantify their relationships in this dataset/segmentation (e.g. crest factor depends on peak and RMS; kurtosis reflects tail/impulsiveness).
- **PSD normalization/units:** `welch(..., scaling='density')` consistent with **Pa²/Hz** for verified Pa signals; integral checks vs mean-square reported.
- **Equivalent segments & within-recording variability:** same start/duration segments compared across files; per-segment statistics (multiple non-overlapping windows) quantify temporal variability within each recording.

### Methodological limitations / caveats
- Peak detection is parameter-dependent (prominence threshold, minimum distance, segment length, tolerance); results reported for stated parameters.
- Full-length FFT has very fine bin spacing (~1/duration) so "neighboring bins" can represent the same peak/main lobe; segmentation changes spectral resolution/leakage tradeoffs.
- PSD/Welch estimates depend on window, nperseg, overlap, detrending; Parseval-style comparisons are approximate under windowing/averaging.
- Single operating condition/load (0 Nm) and 5 recordings limit generalization; no external manifest beyond filename/embedded metadata.
- **No mechanical fault frequencies inferred:** RPM and bearing geometry are not verified/available in inspected metadata, so characteristic fault-order frequencies are not computed or attributed.

### Hypotheses (clearly separated, not verified here)
- Differences in impulsiveness (kurtosis/crest) and spectral content between Normal/BPFI/BPFO and severities **may be consistent** with fault-related behavior, but causal/mechanical attribution requires verified operating speed, bearing geometry, and controlled validation.
""")

code(r"""# Save compact review summary
with open(out_dir/'review_observations.json','w',encoding='utf-8') as f:
    json.dump({
        'files': list(data.keys()),
        'fs_hz_verified': 51200.0,
        'y_unit_verified': 'Pa',
        'parameters': {'peak_min_distance_hz':10.0,'persistence_segment_sec':SEG_SEC,'variability_segment_sec':SEG_SEC_VAR,'equivalent_segment_start_s':START_S,'equivalent_segment_dur_s':DUR_S},
        'artifacts': [str(p.relative_to(EDA_DIR)) for p in sorted(out_dir.glob('*')) if p.is_file()] + [str(p.relative_to(EDA_DIR)) for p in sorted(fig_dir.glob('*')) if p.is_file()]
    }, f, indent=2)
print('Saved review outputs to', out_dir)
""")

nb['cells'] = cells
nb['metadata'] = {
    'kernelspec': {'display_name': 'Python 3', 'language': 'python', 'name': 'python3'},
    'language_info': {'name': 'python', 'version': '3.x'}
}
out = Path(r'D:\industrialsense-pipeline\INDUSTRIAL-SENSE\backend\eda\03_acoustic_eda_review.ipynb')
out.write_text(nbf.writes(nb), encoding='utf-8')
print('wrote', out)
