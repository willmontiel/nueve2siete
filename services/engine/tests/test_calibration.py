"""The engine's verdict on the sample logos must match calibration/expected.json.

The sample logos are not in the repository (third-party brands, and later real customer logos), so
this test is skipped where they are missing.
"""

from pathlib import Path

import pytest

from engine.analyze import analyze
from engine.report import load_samples

IMAGES, EXPECTED = load_samples(Path(__file__).parents[1] / "calibration" / "expected.json")


@pytest.mark.skipif(not IMAGES, reason="sample logos not available")
@pytest.mark.parametrize("path", IMAGES, ids=[path.name for path in IMAGES])
def test_matches_expected_verdict(path: Path) -> None:
    assert analyze(path.read_bytes()).status == EXPECTED[path.name]["status"]
