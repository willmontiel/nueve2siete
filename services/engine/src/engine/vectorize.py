"""Color layers to SVG paths (outer contours plus holes, even-odd fill)."""

import cv2
import numpy as np

SIMPLIFY_PX = 0.8  # Douglas-Peucker tolerance at the normalized 1024 px scale


def mask_to_path(mask: np.ndarray) -> str:
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    parts: list[str] = []
    for contour in contours:
        if cv2.contourArea(contour) < 4:
            continue
        points = cv2.approxPolyDP(contour, SIMPLIFY_PX, True).reshape(-1, 2)
        if len(points) < 3:
            continue
        coords = " ".join(f"{x:.0f} {y:.0f}" for x, y in points)
        parts.append(f"M{coords}Z")
    return "".join(parts)


def layers_to_svg(paths: list[tuple[str, str]], width: int, height: int) -> str:
    body = "".join(f'<path fill="{hex_}" fill-rule="evenodd" d="{d}"/>' for hex_, d in paths if d)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">{body}</svg>'
