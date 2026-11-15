from __future__ import annotations

from dataclasses import dataclass
from typing import Generator, Iterable, Tuple

import numpy as np


@dataclass
class WindowSpec:
    sample_rate_hz: int
    window_sec: float
    hop_sec: float

    @property
    def window_samples(self) -> int:
        return int(round(self.window_sec * self.sample_rate_hz))

    @property
    def hop_samples(self) -> int:
        return int(round(self.hop_sec * self.sample_rate_hz))


@dataclass
class WindowFrame:
    index: int
    start_sample: int
    end_sample: int
    start_sec: float
    end_sec: float
    data: np.ndarray


def iter_windows(signal: np.ndarray, spec: WindowSpec) -> Generator[WindowFrame, None, None]:
    """Deterministic 1.0s window / 0.5s hop segmentation."""
    x = np.asarray(signal)
    w = spec.window_samples
    h = spec.hop_samples
    if w <= 0 or h <= 0 or x.size < w:
        return
    idx = 0
    start = 0
    n = x.size
    while start + w <= n:
        end = start + w
        yield WindowFrame(
            index=idx,
            start_sample=start,
            end_sample=end,
            start_sec=start / float(spec.sample_rate_hz),
            end_sec=end / float(spec.sample_rate_hz),
            data=x[start:end].copy(),
        )
        idx += 1
        start += h
