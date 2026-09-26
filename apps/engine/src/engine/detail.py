"""Printability of details at a given physical size."""

from dataclasses import dataclass

import cv2
import numpy as np

MIN_FEATURE_SHARE = 0.0002  # shapes smaller than this share of the logo are noise, not features
REMOVED_KEEP = 0.2  # a shape that keeps less than this after simplification is gone


@dataclass
class DetailResult:
    px_per_mm: float
    lost_ratio: float  # share of the logo too thin to print (strokes, dots, small text)
    removed_features: int  # whole shapes (letters, dots) that disappear, however small
    layer_lost: list[float]  # share of each color's own area that is too thin to print
    filled_ratio: float  # gaps too narrow to print, relative to the logo area
    layers: list[np.ndarray]  # printable mask per color after simplification; they don't overlap
    lost: np.ndarray  # (H, W) bool, for the report
    filled: np.ndarray  # (H, W) bool, for the report


def _disk(diameter_px: float) -> np.ndarray:
    # Odd sizes only: OpenCV doesn't reflect the kernel when dilating, so an even (asymmetric) disk
    # shifts every shape by a pixel and "opening" eats a band along one side.
    d = max(1, round(diameter_px)) | 1
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (d, d))


def px_per_mm(foreground: np.ndarray, area_width_mm: float, area_height_mm: float) -> float:
    """Scale when the logo is fit (contain) into the printable area of the box."""
    ys, xs = np.nonzero(foreground)
    width_px = xs.max() - xs.min() + 1
    height_px = ys.max() - ys.min() + 1
    return max(width_px / area_width_mm, height_px / area_height_mm)


def _absorb(labels: np.ndarray, lost: np.ndarray, color_count: int, reach_px: int) -> np.ndarray:
    """Pixels too thin for their color take the most common color around them, or the background, but
    never their own color: a white hairline inside a pink area turns pink and a thin serif turns into
    background. Leaving them empty would open slits too narrow to print."""
    if not lost.any():
        return labels
    kept = np.where(lost, -2, labels)
    window = (2 * reach_px + 1, 2 * reach_px + 1)
    # Candidate c + 1 is color c; candidate 0 is the background.
    votes = np.stack(
        [
            cv2.boxFilter((kept == c).astype(np.float32), -1, window, normalize=False)
            for c in range(-1, color_count)
        ]
    )
    ys, xs = np.nonzero(lost)
    votes[labels[ys, xs] + 1, ys, xs] = -1
    simplified = labels.copy()
    simplified[ys, xs] = votes[:, ys, xs].argmax(axis=0) - 1
    return simplified


def analyze_detail(
    labels: np.ndarray,
    color_count: int,
    scale_px_per_mm: float,
    min_feature_mm: float,
    min_gap_mm: float,
) -> DetailResult:
    feature = _disk(min_feature_mm * scale_px_per_mm)
    gap = _disk(min_gap_mm * scale_px_per_mm)
    foreground = labels >= 0
    total = max(1, int(foreground.sum()))

    lost = np.zeros_like(foreground)
    removed_features = 0
    layer_lost: list[float] = []
    for index in range(color_count):
        mask = (labels == index).astype(np.uint8)
        # Opening removes what is thinner than the smallest printable feature.
        opened = cv2.morphologyEx(mask, cv2.MORPH_OPEN, feature)
        removed_features += _count_removed(mask, opened, total)
        layer_lost.append(float(((mask > 0) & (opened == 0)).sum() / max(1, int(mask.sum()))))
        lost |= (mask > 0) & (opened == 0)

    simplified = _absorb(labels, lost, color_count, feature.shape[0])

    layers: list[np.ndarray] = []
    filled = np.zeros_like(foreground)
    for index in range(color_count):
        mask = (simplified == index).astype(np.uint8)
        # Closing fills gaps narrower than the printer can keep open, but only over the background:
        # a thin line of another color is not a gap.
        closed = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, gap)
        grown = (closed > 0) & (simplified < 0)
        filled |= grown
        layers.append((mask > 0) | grown)

    # A gap filled by two colors belongs to the first one (layers are stacked).
    taken = np.zeros_like(foreground)
    for i, layer in enumerate(layers):
        layers[i] = layer & ~taken
        taken |= layers[i]

    return DetailResult(
        px_per_mm=scale_px_per_mm,
        lost_ratio=float(lost.sum() / total),
        removed_features=removed_features,
        layer_lost=layer_lost,
        filled_ratio=float(filled.sum() / total),
        layers=layers,
        lost=lost,
        filled=filled,
    )


def _count_removed(mask: np.ndarray, opened: np.ndarray, total: int) -> int:
    count, components, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    if count <= 1:
        return 0
    area = stats[:, cv2.CC_STAT_AREA].astype(np.float64)
    kept = np.bincount(components.ravel(), weights=(opened > 0).ravel(), minlength=count)
    removed = (area >= MIN_FEATURE_SHARE * total) & (kept / np.maximum(area, 1) < REMOVED_KEEP)
    removed[0] = False  # label 0 is the background
    return int(removed.sum())
