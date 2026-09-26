"""Color quantization: finds the flat colors of a logo and measures how flat it really is."""

from dataclasses import dataclass

import cv2
import numpy as np

MAX_FIT_COLORS = 8
SAMPLE_SIZE = 60_000
EDGE_GRADIENT = 6.0  # delta E per px: above this a pixel is an anti-aliased edge, not a flat area
FLAT_RESIDUAL = 3.0  # mean delta E of a flat color area (JPEG noise included)
UNEXPLAINED_DISTANCE = 15.0  # a pixel this far from every color is a color the palette is missing
UNEXPLAINED_SHARE = 0.005  # ...and the palette must explain all but this share of pixels
ROUGH_DISTANCE = 5.0  # with the best 8-color fit, pixels farther than this are shading, not flat color
MERGE_DISTANCE = 12.0  # colors closer than this are the same color (and the same filament)
MIN_SHARE = 0.005  # colors covering less of the logo than this are noise


@dataclass
class Palette:
    centers: np.ndarray  # (K, 3) LAB, K <= max_colors
    shares: np.ndarray  # (K,) share of foreground pixels
    labels: np.ndarray  # (H, W) int, -1 for background
    residuals: dict[int, float]  # k -> mean delta E of flat-area pixels when fit with k colors
    raw_color_count: int  # distinct colors found before reducing to max_colors
    roughness: float  # share of flat-area pixels an 8-color palette can't represent (gradients, photos)


def interior_pixels(lab: np.ndarray, foreground: np.ndarray) -> np.ndarray:
    """Foreground pixels away from color edges: their color is a real logo color, not an edge blend.
    Uses a light erosion so the core of thin strokes still counts."""
    blurred = cv2.GaussianBlur(lab, (0, 0), 1.0)
    gx = cv2.Sobel(blurred, cv2.CV_32F, 1, 0, ksize=3) / 8.0
    gy = cv2.Sobel(blurred, cv2.CV_32F, 0, 1, ksize=3) / 8.0
    gradient = np.sqrt((gx**2 + gy**2).sum(axis=-1))
    eroded = cv2.erode(foreground.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    return eroded & (gradient < EDGE_GRADIENT)


def _kmeans(samples: np.ndarray, k: int) -> np.ndarray:
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.2)
    cv2.setRNGSeed(7)
    _, _, centers = cv2.kmeans(samples, k, None, criteria, 3, cv2.KMEANS_PP_CENTERS)
    return centers


def nearest(lab_pixels: np.ndarray, centers: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Index of the nearest center and the distance to it, for each pixel."""
    distances = np.linalg.norm(lab_pixels[:, None, :] - centers[None, :, :], axis=-1)
    index = distances.argmin(axis=1)
    return index, distances[np.arange(len(index)), index]


def merge_pairs(
    centers: np.ndarray, counts: np.ndarray, *, below: float = np.inf, down_to: int = 1
) -> tuple[np.ndarray, np.ndarray]:
    """Merges the closest pair of colors while they are closer than `below` and there are more than
    `down_to` colors. The merged color keeps the value of the bigger area: brand colors stay exact."""
    centers, counts = centers.copy(), counts.astype(np.float64).copy()
    while len(centers) > max(1, down_to):
        d = np.linalg.norm(centers[:, None] - centers[None, :], axis=-1)
        np.fill_diagonal(d, np.inf)
        i, j = np.unravel_index(d.argmin(), d.shape)
        if d[i, j] >= below:
            break
        keep, drop = (i, j) if counts[i] >= counts[j] else (j, i)
        counts[keep] += counts[drop]
        centers, counts = np.delete(centers, drop, axis=0), np.delete(counts, drop)
    return centers, counts


def _smooth_labels(labels: np.ndarray, foreground: np.ndarray, count: int) -> np.ndarray:
    """Majority filter: removes the one-pixel speckle that anti-aliasing leaves between colors."""
    if count <= 1:
        return labels
    votes = np.stack(
        [cv2.boxFilter((labels == i).astype(np.float32), -1, (5, 5), normalize=False) for i in range(count)]
    )
    smoothed = votes.argmax(axis=0).astype(np.int32)
    smoothed[~foreground] = -1
    return smoothed


def _choose_k(samples: np.ndarray) -> tuple[dict[int, np.ndarray], dict[int, float], int]:
    fits: dict[int, np.ndarray] = {}
    residuals: dict[int, float] = {}
    unexplained: dict[int, float] = {}
    for k in range(1, min(MAX_FIT_COLORS, len(samples)) + 1):
        fits[k] = _kmeans(samples, k)
        _, distance = nearest(samples, fits[k])
        residuals[k] = float(distance.mean())
        unexplained[k] = float((distance > UNEXPLAINED_DISTANCE).mean())

    # The logo's real color count: the smallest k that leaves no distinct color out and after which
    # extra colors stop helping.
    for k in sorted(fits):
        if unexplained[k] >= UNEXPLAINED_SHARE:
            continue
        nxt = residuals.get(k + 1)
        if residuals[k] < FLAT_RESIDUAL or nxt is None or residuals[k] - nxt < 0.6:
            return fits, residuals, k
    return fits, residuals, max(fits)


def fit_palette(lab: np.ndarray, foreground: np.ndarray, max_colors: int) -> Palette:
    interior = interior_pixels(lab, foreground)
    source = lab[interior] if interior.sum() >= 500 else lab[foreground]
    rng = np.random.default_rng(7)
    samples = source[rng.choice(len(source), min(SAMPLE_SIZE, len(source)), replace=False)].astype(np.float32)

    fits, residuals, best_k = _choose_k(samples)
    _, best_distance = nearest(samples, fits[max(fits)])
    roughness = float((best_distance > ROUGH_DISTANCE).mean())

    # Merge weights come from flat-area samples, so a clean color wins over its blurred edge version.
    centers = fits[best_k]
    sample_index, _ = nearest(samples, centers)
    centers, _ = merge_pairs(centers, np.bincount(sample_index, minlength=len(centers)), below=MERGE_DISTANCE)

    pixels = lab[foreground]
    index, _ = nearest(pixels, centers)
    counts = np.bincount(index, minlength=len(centers))
    keep = counts / counts.sum() >= MIN_SHARE
    centers, counts = centers[keep], counts[keep]
    raw_color_count = len(centers)
    centers, _ = merge_pairs(centers, counts, down_to=max_colors)

    labels = np.full(foreground.shape, -1, dtype=np.int32)
    labels[foreground] = nearest(pixels, centers)[0]
    labels = _smooth_labels(labels, foreground, len(centers))
    shares = np.array([(labels == i).sum() for i in range(len(centers))], dtype=np.float64)
    shares /= max(1.0, shares.sum())
    return Palette(
        centers=centers,
        shares=shares,
        labels=labels,
        residuals=residuals,
        raw_color_count=raw_color_count,
        roughness=roughness,
    )
