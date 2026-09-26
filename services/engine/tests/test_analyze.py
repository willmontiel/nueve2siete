import io
from pathlib import Path

import numpy as np
import pytest
from PIL import Image, ImageDraw

from engine.analyze import analyze, analyze_logo
from engine.color import delta_e, hex_to_lab
from engine.schemas import AnalyzeOptions, FilamentSpec

FIXTURES = Path(__file__).parent / "fixtures"
BRAND = ["#E95C21", "#A9B6EE", "#E9BF0F"]


def load(name: str) -> bytes:
    return (FIXTURES / name).read_bytes()


def closest(hex_value: str, candidates: list[str]) -> float:
    return min(float(delta_e(hex_to_lab(hex_value), hex_to_lab(c))) for c in candidates)


def png(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


def square_with_lines(line_color: tuple[int, int, int], count: int, width: int) -> bytes:
    """A pink square on a transparent background, crossed by thin lines."""
    image = Image.new("RGBA", (800, 800), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((100, 100, 700, 700), fill=(201, 39, 88, 255))
    for i in range(count):
        x = 180 + i * 110
        draw.rectangle((x, 100, x + width - 1, 700), fill=(*line_color, 255))
    return png(image)


@pytest.mark.parametrize(
    ("name", "status"),
    [
        ("flat_two_colors.png", "viable"),
        ("flat_four_colors_transparent.png", "viable"),
        ("six_colors.png", "adjust"),
        ("thin_details.png", "not_viable"),
        ("nueve2siete_transparent.png", "adjust"),
        ("nueve2siete_cream_background.jpg", "adjust"),
        ("gradient.png", "adjust"),
        ("photo.jpg", "not_viable"),
    ],
)
def test_status(name: str, status: str) -> None:
    assert analyze(load(name)).status == status


def test_keeps_exact_brand_colors() -> None:
    result = analyze(load("nueve2siete_transparent.png"))
    assert len(result.colors) == 3
    assert all(closest(color.hex, BRAND) < 3 for color in result.colors)


def test_jpeg_with_background_finds_the_same_colors() -> None:
    result = analyze(load("nueve2siete_cream_background.jpg"))
    assert result.background == "uniform"
    assert len(result.colors) == 3
    assert all(closest(color.hex, BRAND) < 6 for color in result.colors)
    # Letter counters are background, not a fourth color.
    assert result.metrics.enclosed_share > 0


def test_gradient_becomes_flat_bands() -> None:
    result = analyze(load("gradient.png"))
    codes = {issue.code for issue in result.issues}
    assert "shading" in codes
    assert "not_flat" not in codes


def test_photo_is_not_flat() -> None:
    result = analyze(load("photo.jpg"))
    assert "not_flat" in {issue.code for issue in result.issues}
    assert all(size.status == "not_viable" for size in result.sizes)


def test_too_many_colors_are_reduced() -> None:
    result = analyze(load("six_colors.png"))
    assert result.metrics.raw_color_count == 6
    assert len(result.colors) == 4
    assert "too_many_colors" in {issue.code for issue in result.issues}


def test_thin_strokes_keep_their_color_but_it_cannot_be_printed() -> None:
    result = analyze(load("thin_details.png"))
    assert len(result.colors) == 2
    lost = next(issue for issue in result.issues if issue.code == "color_lost")
    assert lost.severity == "error"
    assert lost.sizes == ["S", "M", "L", "XL"]


def test_detail_loss_shrinks_as_the_size_grows() -> None:
    sizes = analyze(load("nueve2siete_transparent.png")).sizes
    lost = [size.lost_ratio for size in sizes]
    assert lost == sorted(lost, reverse=True)


def test_every_size_has_vector_layers() -> None:
    result = analyze(load("flat_four_colors_transparent.png"))
    for size in result.sizes:
        assert len(size.layers) == 4
        assert all(layer.path.startswith("M") for layer in size.layers)


def test_matches_colors_to_filaments() -> None:
    options = AnalyzeOptions(
        filaments=[
            FilamentSpec(id="orange", hex="#E95C21"),
            FilamentSpec(id="lilac", hex="#A9B6EE"),
            FilamentSpec(id="yellow", hex="#E9BF0F"),
            FilamentSpec(id="black", hex="#1F1B16"),
        ]
    )
    result = analyze(load("nueve2siete_transparent.png"), options)
    assert {color.filament_id for color in result.colors} == {"orange", "lilac", "yellow"}
    assert all(color.filament_delta_e is not None and color.filament_delta_e < 3 for color in result.colors)


def test_flags_colors_that_share_a_filament() -> None:
    options = AnalyzeOptions(filaments=[FilamentSpec(id="black", hex="#1F1B16")])
    result = analyze(load("nueve2siete_transparent.png"), options)
    codes = [issue.code for issue in result.issues]
    assert "shared_filament" in codes
    assert "no_close_filament" in codes
    assert result.status == "adjust"


def test_thin_lines_take_the_surrounding_color_instead_of_leaving_slits() -> None:
    analysis = analyze_logo(square_with_lines((255, 255, 255), count=5, width=4), AnalyzeOptions())
    assert len(analysis.palette.centers) == 2
    # Inside the square, away from its corners (which the nozzle rounds off).
    inside = np.zeros_like(analysis.palette.labels, dtype=bool)
    inside[100:-100, 100:-100] = True
    for key, detail in analysis.details.items():
        pink, white = detail.layers
        assert detail.lost.any()
        assert not white.any(), key
        assert pink[inside].all(), f"{key}: the lines left slits"


def test_a_small_color_that_disappears_is_a_simplification() -> None:
    # White shines covering ~3% of the logo, too thin at every size (like the Burger King bun).
    result = analyze(square_with_lines((255, 255, 255), count=5, width=4))
    assert result.status == "adjust"
    assert "color_lost" not in {issue.code for issue in result.issues}


def test_bigger_nozzles_lose_more_detail() -> None:
    data = load("nueve2siete_transparent.png")
    by_nozzle = [analyze(data, AnalyzeOptions(nozzle_mm=n)) for n in (0.4, 0.6, 0.8)]
    assert [r.metrics.min_feature_mm for r in by_nozzle] == [0.6, 0.9, 1.2]
    for i in range(len(by_nozzle[0].sizes)):
        lost = [r.sizes[i].lost_ratio for r in by_nozzle]
        assert lost == sorted(lost)


def test_explicit_limits_override_the_nozzle() -> None:
    result = analyze(load("flat_two_colors.png"), AnalyzeOptions(nozzle_mm=0.8, min_feature_mm=0.5))
    assert (result.metrics.min_feature_mm, result.metrics.min_gap_mm) == (0.5, 1.0)


def test_uses_the_first_frame_of_an_animated_gif() -> None:
    frames = [Image.new("RGB", (400, 400), (255, 255, 255)) for _ in range(2)]
    ImageDraw.Draw(frames[0]).ellipse((80, 80, 320, 320), fill=(233, 92, 33))
    buffer = io.BytesIO()
    frames[0].save(buffer, format="GIF", save_all=True, append_images=frames[1:], duration=100)
    result = analyze(buffer.getvalue())
    assert "animated" in {issue.code for issue in result.issues}
    assert closest(result.colors[0].hex, ["#E95C21"]) < 6


def test_single_color_needs_no_color_reduction() -> None:
    # Six colors don't fit in four, but they all fit in one filament.
    result = analyze(load("six_colors.png"))
    assert all(size.status == "adjust" for size in result.sizes)
    assert all(size.mono.status == "viable" for size in result.sizes)
    assert all(size.mono.path.startswith("M") for size in result.sizes)


def test_single_color_merges_lines_that_touch_another_color() -> None:
    # White hairlines inside pink are too thin as their own color, but in one color the square is solid.
    result = analyze(square_with_lines((255, 255, 255), count=5, width=4))
    assert result.status == "adjust"
    for size in result.sizes:
        assert size.mono.status == "viable"
        assert not size.mono.simplified


def test_a_photo_is_not_printable_in_one_color_either() -> None:
    result = analyze(load("photo.jpg"))
    assert all(size.mono.status == "not_viable" for size in result.sizes)


def test_small_text_is_still_too_thin_in_one_color() -> None:
    result = analyze(load("nueve2siete_transparent.png"))
    small = result.sizes[0]
    assert small.mono.simplified
    assert small.mono.status == "adjust"


@pytest.mark.parametrize(
    ("name", "loses"),
    [
        ("six_colors.png", False),  # separate bars: one color keeps every shape
        ("nueve2siete_transparent.png", False),
        ("flat_four_colors_transparent.png", True),  # shapes on a lilac badge: one color is a blob
    ],
)
def test_warns_when_one_color_loses_the_design(name: str, loses: bool) -> None:
    assert analyze(load(name)).mono_loses_detail is loses
