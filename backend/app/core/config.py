from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Dataset
    kaist_data_root: Optional[str] = None
    kaist_healthy_baseline_files: str = ""  # comma-separated relative paths from KAIST_DATA_ROOT
    kaist_max_recordings: int = 1  # vertical slice: load one actual recording first
    kaist_selected_file: str = ""  # optional relative path from KAIST_DATA_ROOT to load a specific .mat file

    # App
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    cache_dir: str = "cache"

    # Blueprint DSP - Acoustic
    acoustic_canonical_sr: int = 16000
    acoustic_window_sec: float = 1.0
    acoustic_hop_sec: float = 0.5
    acoustic_mel_bands: int = 64
    acoustic_n_fft: int = 1024
    acoustic_hop_length: int = 256

    # Blueprint DSP - Vibration
    vibration_canonical_sr: int = 10000
    vibration_window_sec: float = 1.0
    vibration_hop_sec: float = 0.5
    vibration_bp_low_hz: float = 10.0
    vibration_bp_high_hz: float = 4500.0
    vibration_stft_nperseg: int = 256  # Hann window samples
    vibration_stft_hop: int = 128

    # Quality
    max_nan_ratio: float = 0.05
    flatline_epsilon: float = 1e-12

    @property
    def backend_root(self) -> Path:
        return Path(__file__).resolve().parents[2]

    @property
    def cache_path(self) -> Path:
        p = self.backend_root / self.cache_dir
        p.mkdir(parents=True, exist_ok=True)
        return p

    @property
    def healthy_baseline_files(self) -> List[str]:
        if not self.kaist_healthy_baseline_files:
            return []
        return [s.strip().replace("\\", "/") for s in self.kaist_healthy_baseline_files.split(",") if s.strip()]


settings = Settings()
