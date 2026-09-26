"""Request and response models of the engine API."""

from typing import Literal

from pydantic import BaseModel, Field

from .printing import DEFAULT_NOZZLE, NOZZLE_LIMITS, Nozzle

Status = Literal["viable", "adjust", "not_viable"]
Severity = Literal["info", "warning", "error"]
IssueCode = Literal[
    "not_flat",  # photos, 3D renders or realistic illustrations: no flat-color version is possible
    "shading",  # gradients, shading or many tones, converted to flat color bands
    "too_many_colors",  # reduced automatically to max_colors
    "fine_detail",  # strokes, dots or gaps below the printable size are simplified
    "color_lost",  # a whole color is too thin to print and disappears
    "low_resolution",  # the uploaded logo is small; edges may look rough
    "enclosed_background",  # background-colored areas inside the logo were treated as holes
    "no_close_filament",  # a logo color has no similar filament available
    "shared_filament",  # two logo colors map to the same filament and will print as one
    "animated",  # animated image: only the first frame is used
]


class SizeSpec(BaseModel):
    key: str
    logo_width_mm: float = Field(gt=0)
    logo_height_mm: float = Field(gt=0)


class FilamentSpec(BaseModel):
    id: str
    hex: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")


DEFAULT_SIZES = [
    SizeSpec(key="S", logo_width_mm=37, logo_height_mm=37),
    SizeSpec(key="M", logo_width_mm=47, logo_height_mm=47),
    SizeSpec(key="L", logo_width_mm=57, logo_height_mm=57),
    SizeSpec(key="XL", logo_width_mm=67, logo_height_mm=67),
]


class AnalyzeOptions(BaseModel):
    sizes: list[SizeSpec] = Field(default_factory=lambda: list(DEFAULT_SIZES), min_length=1)
    max_colors: int = Field(4, ge=1, le=8)
    nozzle_mm: Nozzle = DEFAULT_NOZZLE
    # Override the nozzle limits (see printing.py) when calibrating.
    min_feature_mm: float | None = Field(None, gt=0)
    min_gap_mm: float | None = Field(None, gt=0)
    filaments: list[FilamentSpec] = Field(default_factory=list)
    keep_enclosed_background: bool = False

    def limits_mm(self) -> tuple[float, float]:
        feature, gap = NOZZLE_LIMITS[self.nozzle_mm]
        return self.min_feature_mm or feature, self.min_gap_mm or gap


class Issue(BaseModel):
    code: IssueCode
    severity: Severity
    sizes: list[str] = Field(default_factory=list)
    detail: dict[str, float | int | str] = Field(default_factory=dict)


class LogoColor(BaseModel):
    index: int
    hex: str
    share: float
    filament_id: str | None = None
    filament_hex: str | None = None
    filament_delta_e: float | None = None


class Layer(BaseModel):
    color_index: int
    path: str  # SVG path in the logo's viewBox (0 0 width height), even-odd fill


class MonoResult(BaseModel):
    """The same size printed in a single filament: all colors merged into one shape."""

    status: Status
    lost_ratio: float
    removed_features: int
    filled_ratio: float
    simplified: bool  # something was too thin or too narrow and had to change
    path: str


class SizeResult(BaseModel):
    key: str
    status: Status
    px_per_mm: float
    lost_ratio: float
    removed_features: int
    filled_ratio: float
    layers: list[Layer]
    mono: MonoResult


class Metrics(BaseModel):
    mono_merged_edges: float  # share of edges between touching colors, lost in one color
    nozzle_mm: float
    min_feature_mm: float
    min_gap_mm: float
    raw_color_count: int
    roughness: float
    residuals: dict[int, float]
    enclosed_share: float
    source_side: int
    elapsed_ms: int


class AnalysisResult(BaseModel):
    status: Status
    issues: list[Issue]
    width: int
    height: int
    background: Literal["alpha", "uniform", "none"]
    background_hex: str | None
    colors: list[LogoColor]
    sizes: list[SizeResult]
    # In one color the touching colors merge; true when that loses the design (a badge, an illustration).
    mono_loses_detail: bool
    metrics: Metrics
