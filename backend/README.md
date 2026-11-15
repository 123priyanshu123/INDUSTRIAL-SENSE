# IndustrialSense MVP Backend (90-min scope)

## Run (Windows, local)
```powershell
cd INDUSTRIAL-SENSE\backend
$env:KAIST_DATA_ROOT="G:\My Drive\path\to\KAIST"   # Google Drive for Desktop/local path
# Optional: verified healthy baseline recordings (relative paths from KAIST_DATA_ROOT)
# $env:KAIST_HEALTHY_BASELINE_FILES="subdir/healthy1.mat,subdir/healthy2.mat"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Endpoints:
- `GET /api/v1/health` startup + pipeline/DSP status
- `GET /api/v1/inspection` discovered/inspected KAIST `.mat` structure and load notes
- `GET /api/v1/machines`
- `GET /api/v1/machines/{id}/readings`
- `GET /api/v1/machines/{id}/history`
- `GET /api/v1/analytics/overview`
- `POST /api/v1/pipeline/run` rerun processing

Notes:
- Supports KAIST MATLAB `.mat` files (v7/v7.2 via `scipy.io.loadmat`); no WAV/CSV adapters in this MVP.
- Does not copy dataset; loads selected recordings and caches processed outputs under `backend/cache`.
- DSP follows blueprint specs (acoustic 16kHz/1s/0.5s/Mel64 n_fft=1024 hop_length=256; vibration 10kHz/1s/0.5s Butterworth 10–4500Hz, STFT Hann256 hop128). Quality gates reject >5% NaN, flatlines, clipping.
- Units/calibration are preserved as metadata; uncalibrated values are never labeled as `dB(A)` or `g`.
- Anomaly scores are raw baseline-distance scores (not probabilities) and require verified healthy baseline recordings when configured.
