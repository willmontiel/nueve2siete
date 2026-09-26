"""Full analysis: prepared logo -> palette -> printability per size -> verdict and color layers."""

import time
from collections.abc import Sequence
from dataclasses import dataclass

import numpy as np

from .color import delta_e, hex_to_lab, lab_to_rgb, rgb_to_hex, rgb_to_lab
from .detail import DetailResult, analyze_detail, px_per_mm
from .imaging import LOW_RESOLUTION_SIDE, PreparedLogo, prepare_logo
from .palette import Palette, fit_palette
from .printing import NOZZLE_LIMITS
from .schemas import (
    AnalysisResult,
    AnalyzeOptions,
    Issue,
    Layer,
    LogoColor,
    Metrics,
    MonoResult,
    SizeResult,
    SizeSpec,
    Status,
)
from .vectorize import mask_to_path

# Roughness: share of flat-area pixels that the best 8-color fit misses by more than 5 delta E.
SHADING_ROUGHNESS = 0.015  # flat logos measure < 0.01, JPEG included
# Gradients, shading or more than 8 flat colors measure 0.03-0.08 and simplify into flat bands.
# Photos, 3D renders and realistic illustrations measure > 0.35: no flat version resembles them.
NOT_FLAT_ROUGHNESS = 0.2
DETAIL_OK_LOST = 0.02  # up to 2% of the logo can be too thin (edge noise) and still print as is
DETAIL_OK_FILLED = 0.03
DETAIL_MAX_LOST = 0.15  # beyond 15% the simplified logo no longer looks like the original
COLOR_MAX_LOST = 0.6  # a color that loses more than this of its area practically disappears...
COLOR_LOST_MIN_SHARE = 0.05  # ...which matters when it is a real part of the logo, not a small shine
ENCLOSED_NOTICE = 0.05
NO_CLOSE_FILAMENT = 20.0
SIZE_ISSUES = {"fine_detail", "color_lost"}
# Issues about the logo's colors: they don't apply when the whole logo prints in one filament.
COLOR_ISSUES = {"shading", "too_many_colors", "no_close_filament", "shared_filament"}
# In one color, edges between two touching colors disappear. Past this share of the logo's edges the design
# is lost (a badge becomes a blob): 0-0.3 in logos whose colors are apart, 0.5-0.9 in badges and illustrations.
MONO_LOSES_DETAIL = 0.4
MONO_DISTINCT_DELTA_E = 25.0  # merging colors closer than this (gradient bands) loses nothing

_RANK: dict[Status, int] = {"viable": 0, "adjust": 1, "not_viable": 2}


@dataclass
class Analysis:
    result: AnalysisResult
    logo: PreparedLogo
    palette: Palette
    details: dict[str, DetailResult]


def _worst(*statuses: Status) -> Status:
    return max(statuses, key=_RANK.__getitem__)


def _floor(issues: list[Issue]) -> Status:
    """The best status any size can get, given the issues that affect the whole logo."""
    if any(i.severity == "error" for i in issues):
        return "not_viable"
    if any(i.severity == "warning" for i in issues):
        return "adjust"
    return "viable"


def _needs_simplifying(detail: DetailResult) -> bool:
    return (
        detail.lost_ratio > DETAIL_OK_LOST
        or detail.filled_ratio > DETAIL_OK_FILLED
        or detail.removed_features > 0
    )


def _lost_colors(detail: DetailResult, shares: Sequence[float]) -> list[int]:
    return [
        index
        for index, lost in enumerate(detail.layer_lost)
        if lost > COLOR_MAX_LOST and shares[index] >= COLOR_LOST_MIN_SHARE
    ]


def _detail_status(detail: DetailResult, shares: Sequence[float]) -> Status:
    if not _needs_simplifying(detail):
        return "viable"
    if detail.lost_ratio <= DETAIL_MAX_LOST and not _lost_colors(detail, shares):
        return "adjust"
    return "not_viable"


def _evaluate(
    logo: PreparedLogo, labels: np.ndarray, count: int, spec: SizeSpec, feature_mm: float, gap_mm: float
) -> DetailResult:
    scale = px_per_mm(logo.foreground, spec.logo_width_mm, spec.logo_height_mm)
    return analyze_detail(labels, count, scale, feature_mm, gap_mm)


def _merged_edges(palette: Palette) -> float:
    """Share of the logo's edges that lie between two distinct colors and vanish in one color."""
    labels = palette.labels
    distinct = (
        np.linalg.norm(palette.centers[:, None] - palette.centers[None], axis=-1) >= MONO_DISTINCT_DELTA_E
    )
    inner = outer = 0
    for a, b in ((labels[:, 1:], labels[:, :-1]), (labels[1:, :], labels[:-1, :])):
        edge = a != b
        both = (a >= 0) & (b >= 0)
        between = np.zeros_like(edge)
        between[both] = distinct[a[both], b[both]]
        inner += int((edge & between).sum())
        outer += int((edge & ~both).sum())
    return inner / max(1, inner + outer)


def _mono_labels(palette: Palette) -> np.ndarray:
    """The whole logo as a single color: colors that touch merge, so a thin line of one color inside
    another is no longer a detail to print."""
    return np.where(palette.labels >= 0, 0, -1).astype(np.int32)


def _logo_issues(logo: PreparedLogo, palette: Palette, options: AnalyzeOptions) -> list[Issue]:
    issues: list[Issue] = []
    roughness = {"roughness": round(palette.roughness, 3)}
    if palette.roughness > NOT_FLAT_ROUGHNESS:
        issues.append(Issue(code="not_flat", severity="error", detail=roughness))
    elif palette.roughness > SHADING_ROUGHNESS:
        issues.append(Issue(code="shading", severity="warning", detail=roughness))
    if palette.raw_color_count > options.max_colors:
        issues.append(
            Issue(
                code="too_many_colors",
                severity="warning",
                detail={"found": palette.raw_color_count, "max": options.max_colors},
            )
        )
    if logo.source_side < LOW_RESOLUTION_SIDE:
        issues.append(Issue(code="low_resolution", severity="warning", detail={"side_px": logo.source_side}))
    if logo.enclosed_share > ENCLOSED_NOTICE:
        issues.append(
            Issue(
                code="enclosed_background", severity="info", detail={"share": round(logo.enclosed_share, 3)}
            )
        )
    if logo.animated:
        issues.append(Issue(code="animated", severity="info"))
    return issues


def _match_filaments(palette: Palette, options: AnalyzeOptions) -> tuple[list[LogoColor], list[Issue]]:
    colors: list[LogoColor] = []
    issues: list[Issue] = []
    filament_labs = [(f, hex_to_lab(f.hex)) for f in options.filaments]

    for index, (center, share) in enumerate(zip(palette.centers, palette.shares)):
        color = LogoColor(
            index=index, hex=rgb_to_hex(lab_to_rgb(center.reshape(1, 3))[0]), share=round(share, 4)
        )
        if filament_labs:
            filament, distance = min(
                ((f, float(delta_e(center, lab))) for f, lab in filament_labs), key=lambda item: item[1]
            )
            color.filament_id, color.filament_hex = filament.id, filament.hex
            color.filament_delta_e = round(distance, 1)
            if distance > NO_CLOSE_FILAMENT:
                issues.append(
                    Issue(
                        code="no_close_filament",
                        severity="warning",
                        detail={"color_index": index, "hex": color.hex},
                    )
                )
        colors.append(color)

    used = [c.filament_id for c in colors if c.filament_id]
    for filament_id in sorted({f for f in used if used.count(f) > 1}):
        issues.append(Issue(code="shared_filament", severity="info", detail={"filament_id": filament_id}))
    return colors, issues


def analyze_logo(data: bytes, options: AnalyzeOptions) -> Analysis:
    started = time.perf_counter()
    logo = prepare_logo(data, keep_enclosed=options.keep_enclosed_background)
    palette = fit_palette(rgb_to_lab(logo.rgb), logo.foreground, options.max_colors)
    feature_mm, gap_mm = options.limits_mm()

    issues = _logo_issues(logo, palette, options)
    colors, filament_issues = _match_filaments(palette, options)
    floor = _floor(issues + filament_issues)
    mono_floor = _floor([i for i in issues + filament_issues if i.code not in COLOR_ISSUES])
    not_flat = floor == "not_viable"
    mono_labels = _mono_labels(palette)
    merged_edges = _merged_edges(palette)

    details: dict[str, DetailResult] = {}
    sizes: list[SizeResult] = []
    for spec in options.sizes:
        detail = _evaluate(logo, palette.labels, len(palette.centers), spec, feature_mm, gap_mm)
        details[spec.key] = detail
        mono = _evaluate(logo, mono_labels, 1, spec, feature_mm, gap_mm)
        layers = [
            Layer(color_index=i, path=mask_to_path(mask))
            for i, mask in enumerate(detail.layers)
            if mask.any()
        ]
        sizes.append(
            SizeResult(
                key=spec.key,
                status=_worst(_detail_status(detail, palette.shares), floor),
                px_per_mm=round(detail.px_per_mm, 2),
                lost_ratio=round(detail.lost_ratio, 4),
                removed_features=detail.removed_features,
                filled_ratio=round(detail.filled_ratio, 4),
                layers=layers,
                mono=MonoResult(
                    status=_worst(_detail_status(mono, [1.0]), mono_floor),
                    lost_ratio=round(mono.lost_ratio, 4),
                    removed_features=mono.removed_features,
                    filled_ratio=round(mono.filled_ratio, 4),
                    simplified=_needs_simplifying(mono),
                    path=mask_to_path(mono.layers[0]),
                ),
            )
        )

    # Size issues only make sense for a logo that can be printed at all.
    lost_color_sizes = [key for key, detail in details.items() if _lost_colors(detail, palette.shares)]
    if lost_color_sizes and not not_flat:
        lost = sorted({i for key in lost_color_sizes for i in _lost_colors(details[key], palette.shares)})
        issues.append(
            Issue(
                code="color_lost",
                severity="error" if len(lost_color_sizes) == len(sizes) else "warning",
                sizes=lost_color_sizes,
                detail={"color_indexes": ",".join(map(str, lost))},
            )
        )
    detailed_sizes = [key for key, detail in details.items() if _needs_simplifying(detail)]
    if detailed_sizes and not not_flat:
        severity = "error" if all(s.status == "not_viable" for s in sizes) else "warning"
        issues.append(Issue(code="fine_detail", severity=severity, sizes=detailed_sizes))
    issues.extend(filament_issues)

    # Each size carries its own verdict; the logo is as good as its best size.
    status = min((s.status for s in sizes), key=_RANK.__getitem__)

    height, width = logo.foreground.shape
    result = AnalysisResult(
        status=status,
        issues=issues,
        width=width,
        height=height,
        background=logo.background,
        background_hex=logo.background_hex,
        colors=colors,
        sizes=sizes,
        mono_loses_detail=merged_edges > MONO_LOSES_DETAIL,
        metrics=Metrics(
            mono_merged_edges=round(merged_edges, 3),
            nozzle_mm=options.nozzle_mm,
            min_feature_mm=feature_mm,
            min_gap_mm=gap_mm,
            raw_color_count=palette.raw_color_count,
            roughness=round(palette.roughness, 4),
            residuals={k: round(v, 2) for k, v in palette.residuals.items()},
            enclosed_share=round(logo.enclosed_share, 4),
            source_side=logo.source_side,
            elapsed_ms=round((time.perf_counter() - started) * 1000),
        ),
    )
    return Analysis(result=result, logo=logo, palette=palette, details=details)


def nozzle_statuses(analysis: Analysis, options: AnalyzeOptions) -> dict[float, dict[str, Status]]:
    """Status of every size with every nozzle, reusing the analyzed palette. A bigger nozzle prints
    faster but loses more detail; this shows which one each size still allows."""
    floor = _floor([i for i in analysis.result.issues if i.code not in SIZE_ISSUES])
    matrix: dict[float, dict[str, Status]] = {}
    for nozzle, (feature_mm, gap_mm) in NOZZLE_LIMITS.items():
        matrix[nozzle] = {
            spec.key: _worst(
                _detail_status(
                    _evaluate(
                        analysis.logo,
                        analysis.palette.labels,
                        len(analysis.palette.centers),
                        spec,
                        feature_mm,
                        gap_mm,
                    ),
                    analysis.palette.shares,
                ),
                floor,
            )
            for spec in options.sizes
        }
    return matrix


def analyze(data: bytes, options: AnalyzeOptions | None = None) -> AnalysisResult:
    return analyze_logo(data, options or AnalyzeOptions()).result


def color_image(labels: np.ndarray, centers: np.ndarray) -> np.ndarray:
    """RGBA preview of a label map (transparent background)."""
    rgb = lab_to_rgb(centers.reshape(-1, 1, 3)).reshape(-1, 3)
    out = np.zeros(labels.shape + (4,), dtype=np.uint8)
    for index, color in enumerate(rgb):
        out[labels == index] = (*color, 255)
    return out
