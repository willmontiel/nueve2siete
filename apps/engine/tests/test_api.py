import json
from pathlib import Path

from fastapi.testclient import TestClient

from engine.api import app

client = TestClient(app)
FIXTURES = Path(__file__).parent / "fixtures"


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}


def test_analyze_returns_status_colors_and_layers() -> None:
    options = {"sizes": [{"key": "M", "logo_width_mm": 47, "logo_height_mm": 47}], "max_colors": 4}
    with (FIXTURES / "flat_two_colors.png").open("rb") as file:
        response = client.post(
            "/v1/analyze",
            files={"file": ("logo.png", file, "image/png")},
            data={"options": json.dumps(options)},
        )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "viable"
    assert [c["hex"] for c in body["colors"]] == ["#1F1B16", "#E95C21"]
    assert [s["key"] for s in body["sizes"]] == ["M"]
    assert body["sizes"][0]["layers"]


def test_rejects_files_that_are_not_images() -> None:
    response = client.post("/v1/analyze", files={"file": ("logo.png", b"not an image", "image/png")})
    assert response.status_code == 415


def test_rejects_invalid_options() -> None:
    with (FIXTURES / "flat_two_colors.png").open("rb") as file:
        response = client.post(
            "/v1/analyze",
            files={"file": ("logo.png", file, "image/png")},
            data={"options": json.dumps({"max_colors": 99})},
        )
    assert response.status_code == 422


def test_nozzle_sets_the_printable_limits() -> None:
    with (FIXTURES / "flat_two_colors.png").open("rb") as file:
        response = client.post(
            "/v1/analyze",
            files={"file": ("logo.png", file, "image/png")},
            data={"options": json.dumps({"nozzle_mm": 0.8})},
        )
    assert response.status_code == 200
    metrics = response.json()["metrics"]
    assert (metrics["nozzle_mm"], metrics["min_feature_mm"], metrics["min_gap_mm"]) == (0.8, 1.2, 1.0)


def test_rejects_nozzles_the_printer_does_not_have() -> None:
    with (FIXTURES / "flat_two_colors.png").open("rb") as file:
        response = client.post(
            "/v1/analyze",
            files={"file": ("logo.png", file, "image/png")},
            data={"options": json.dumps({"nozzle_mm": 0.2})},
        )
    assert response.status_code == 422
