"""Color conversions. All distances are CIE76 delta E in CIELAB (L in 0..100)."""

import cv2
import numpy as np


def hex_to_rgb(value: str) -> tuple[int, int, int]:
    value = value.strip().lstrip("#")
    if len(value) != 6:
        raise ValueError(f"Invalid hex color: {value!r}")
    n = int(value, 16)
    return (n >> 16) & 0xFF, (n >> 8) & 0xFF, n & 0xFF


def rgb_to_hex(rgb: np.ndarray | tuple[int, int, int]) -> str:
    r, g, b = (round(float(c)) for c in rgb)
    return f"#{r:02X}{g:02X}{b:02X}"


def rgb_to_lab(rgb: np.ndarray) -> np.ndarray:
    """uint8 RGB array of any shape (..., 3) to float32 LAB of the same shape."""
    flat = rgb.reshape(-1, 1, 3).astype(np.float32) / 255.0
    lab = cv2.cvtColor(flat, cv2.COLOR_RGB2LAB)
    return lab.reshape(rgb.shape[:-1] + (3,))


def lab_to_rgb(lab: np.ndarray) -> np.ndarray:
    flat = lab.reshape(-1, 1, 3).astype(np.float32)
    rgb = cv2.cvtColor(flat, cv2.COLOR_LAB2RGB)
    return np.clip(rgb * 255.0 + 0.5, 0, 255).astype(np.uint8).reshape(lab.shape[:-1] + (3,))


def hex_to_lab(value: str) -> np.ndarray:
    return rgb_to_lab(np.array(hex_to_rgb(value), dtype=np.uint8))


def delta_e(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    return np.linalg.norm(a.astype(np.float32) - b.astype(np.float32), axis=-1)
