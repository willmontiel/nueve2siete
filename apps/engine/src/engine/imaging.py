"""Loading, background removal and normalization of the uploaded logo."""

import io
from dataclasses import dataclass

import cv2
import numpy as np
from PIL import Image, ImageOps, UnidentifiedImageError

from .color import delta_e, lab_to_rgb, rgb_to_hex, rgb_to_lab

MAX_INPUT_PIXELS = 40_000_000
WORKING_MAX_SIDE = 2048
NORMALIZED_SIDE = 1024
BACKGROUND_TOLERANCE = 12.0  # delta E from the border color still counted as background
BORDER_UNIFORMITY = 0.9  # share of border pixels that must match for a "uniform" background
LOW_RESOLUTION_SIDE = 300


class UnsupportedImageError(ValueError):
    pass


@dataclass
class PreparedLogo:
    rgb: np.ndarray  # (H, W, 3) uint8, cropped to the logo and normalized to NORMALIZED_SIDE
    foreground: np.ndarray  # (H, W) bool
    background: str  # "alpha" | "uniform" | "none"
    background_hex: str | None
    source_side: int  # long side of the logo in the original image, in px
    # Background-colored areas enclosed by the logo (letter counters, or a white fill inside a badge),
    # as a share of the logo. They are removed unless keep_enclosed is requested.
    enclosed_share: float
    animated: bool  # an animated GIF/WebP: only its first frame is analyzed


def load_rgba(data: bytes) -> tuple[np.ndarray, bool]:
    """The image as RGBA (first frame if animated) and whether it was animated."""
    try:
        image = Image.open(io.BytesIO(data))
        if image.width * image.height > MAX_INPUT_PIXELS:
            raise UnsupportedImageError("Image is too large")
        animated = bool(getattr(image, "is_animated", False))
        image = ImageOps.exif_transpose(image).convert("RGBA")
    except (UnidentifiedImageError, OSError) as error:
        raise UnsupportedImageError("Unsupported or corrupt image") from error

    long_side = max(image.size)
    if long_side > WORKING_MAX_SIDE:
        scale = WORKING_MAX_SIDE / long_side
        image = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    return np.array(image), animated


def _border(values: np.ndarray) -> np.ndarray:
    return np.concatenate([values[0], values[-1], values[:, 0], values[:, -1]])


def _background_from_color(rgb: np.ndarray, bg_lab: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """Background-colored pixels, split into those connected to the image border and those enclosed
    by the logo."""
    near = (delta_e(rgb_to_lab(rgb), bg_lab) < BACKGROUND_TOLERANCE).astype(np.uint8)
    _, labels = cv2.connectedComponents(near, connectivity=4)
    border_labels = np.unique(_border(labels)[_border(near) > 0])
    outside = np.isin(labels, border_labels) & (near > 0)
    return outside, (near > 0) & ~outside


def detect_foreground(rgba: np.ndarray) -> tuple[np.ndarray, str, np.ndarray | None]:
    alpha = rgba[..., 3]
    if (alpha < 250).mean() > 0.01:
        return alpha >= 128, "alpha", None

    rgb = rgba[..., :3]
    border_lab = rgb_to_lab(_border(rgb))
    bg_lab = np.median(border_lab, axis=0)
    if (delta_e(border_lab, bg_lab) < BACKGROUND_TOLERANCE).mean() < BORDER_UNIFORMITY:
        # Busy edges (a photo, a full-bleed design): everything is foreground.
        return np.ones(rgb.shape[:2], dtype=bool), "none", None

    outside, _ = _background_from_color(rgb, bg_lab)
    return ~outside, "uniform", bg_lab


def _bounding_box(mask: np.ndarray) -> tuple[int, int, int, int]:
    # Ignore specks (JPEG noise, dust) when framing the logo.
    clean = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    ys, xs = np.nonzero(clean if clean.any() else mask)
    if len(xs) == 0:
        raise UnsupportedImageError("The image has no visible logo")
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def prepare_logo(data: bytes, keep_enclosed: bool = False) -> PreparedLogo:
    rgba, animated = load_rgba(data)
    foreground, method, bg_lab = detect_foreground(rgba)

    x0, y0, x1, y1 = _bounding_box(foreground)
    pad = max(2, round(0.02 * max(x1 - x0, y1 - y0)))
    h, w = foreground.shape
    x0, y0, x1, y1 = max(0, x0 - pad), max(0, y0 - pad), min(w, x1 + pad), min(h, y1 + pad)
    crop = rgba[y0:y1, x0:x1]

    source_side = max(x1 - x0, y1 - y0)
    scale = NORMALIZED_SIDE / source_side
    size = (max(1, round(crop.shape[1] * scale)), max(1, round(crop.shape[0] * scale)))
    interpolation = cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC

    if method == "alpha":
        # Resize premultiplied color so transparent pixels don't bleed their hidden color into edges.
        alpha = crop[..., 3:4].astype(np.float32) / 255.0
        premultiplied = crop[..., :3].astype(np.float32) * alpha
        resized_rgb = cv2.resize(premultiplied, size, interpolation=interpolation)
        resized_alpha = np.clip(cv2.resize(alpha[..., 0], size, interpolation=interpolation), 0, 1)
        rgb = np.where(
            resized_alpha[..., None] > 0.01, resized_rgb / np.maximum(resized_alpha[..., None], 0.01), 0
        )
        rgb = np.clip(rgb, 0, 255).astype(np.uint8)
        fg = resized_alpha >= 0.5
        enclosed_share = 0.0
    elif method == "none":
        rgb = cv2.resize(crop[..., :3], size, interpolation=interpolation)
        fg = np.ones(rgb.shape[:2], dtype=bool)
        enclosed_share = 0.0
    else:
        rgb = cv2.resize(crop[..., :3], size, interpolation=interpolation)
        outside, enclosed = _background_from_color(rgb, bg_lab)
        fg = ~outside if keep_enclosed else ~(outside | enclosed)
        enclosed_share = float(enclosed.sum() / max(1, (~outside).sum()))

    return PreparedLogo(
        rgb=rgb,
        foreground=fg,
        background=method,
        background_hex=None if bg_lab is None else rgb_to_hex(lab_to_rgb(bg_lab.reshape(1, 3))[0]),
        source_side=source_side,
        enclosed_share=enclosed_share,
        animated=animated,
    )
