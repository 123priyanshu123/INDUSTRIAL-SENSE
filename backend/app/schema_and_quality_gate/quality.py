from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

import numpy as np

from app.core.config import settings


@dataclass
class QualityResult:
    is_valid: bool
    nan_ratio: float
    is_flatline: bool
    is_clipped: bool
    reasons: List[str] = field(default_factory=list)

    def to_dict(self):
        return {
            "isValid": self.is_valid,
            "nanRatio": self.nan_ratio,
            "isFlatline": self.is_flatline,
            "isClipped": self.is_clipped,
            "reasons": self.reasons,
        }


def assess_window(x: np.ndarray) -> QualityResult:
    reasons: List[str] = []
    x = np.asarray(x)
    n = x.size
    if n == 0:
        return QualityResult(False, 1.0, True, False, ["empty_window"])

    nan_mask = ~np.isfinite(x)
    nan_ratio = float(np.mean(nan_mask))
    if nan_ratio > settings.max_nan_ratio:
        reasons.append("nan_ratio_exceeded")

    finite = x[np.isfinite(x)]
    if finite.size == 0:
        return QualityResult(False, nan_ratio, True, False, reasons + ["no_finite_values"])

    # Flatline: zero/near-zero variance or no meaningful delta
    var = float(np.var(finite))
    ptp = float(np.ptp(finite))
    is_flatline = (var <= settings.flatline_epsilon) or (ptp <= settings.flatline_epsilon)
    if is_flatline:
        reasons.append("flatline")

    # Clipping: saturation at min/max rail with high rail-hit ratio
    is_clipped = False
    if finite.size >= 10:
        vmin = float(np.min(finite))
        vmax = float(np.max(finite))
        if vmax > vmin:
            rail = (finite <= (vmin + 1e-12 * (abs(vmin) + 1.0))) | (finite >= (vmax - 1e-12 * (abs(vmax) + 1.0)))
            rail_ratio = float(np.mean(rail))
            # heuristic: significant portion at extremes and extremes repeated
            if rail_ratio >= 0.02 and (np.sum(finite == vmin) > 1 or np.sum(finite == vmax) > 1):
                # stronger check for repeated rail values
                if rail_ratio >= 0.05 or np.sum(finite == vmin) >= 5 or np.sum(finite == vmax) >= 5:
                    is_clipped = True
                    reasons.append("clipping")
        else:
            is_clipped = True
            reasons.append("clipping")

    is_valid = (nan_ratio <= settings.max_nan_ratio) and (not is_flatline) and (not is_clipped)
    return QualityResult(is_valid=is_valid, nan_ratio=nan_ratio, is_flatline=is_flatline, is_clipped=is_clipped, reasons=reasons)


def clean_window(x: np.ndarray) -> np.ndarray:
    x = np.asarray(x, dtype=np.float64)
    if np.all(np.isfinite(x)):
        return x
    # replace non-finite by median of finite for downstream processing only if within threshold (caller should reject otherwise)
    finite = x[np.isfinite(x)]
    if finite.size == 0:
        return np.zeros_like(x, dtype=np.float64)
    med = float(np.median(finite))
    y = x.copy()
    y[~np.isfinite(y)] = med
    return y
