# Logo engine

Internal Python service that takes a logo and says whether it can be 3D printed: flat colors, minimum detail
per size and the per-color vector layers used by the 3D viewer.

Requirement: [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`).

```bash
uv sync                                         # creates .venv and installs dependencies
uv run uvicorn engine.api:app --reload --port 8000
uv run pytest
uv run engine-report tests/fixtures/*.png tests/fixtures/*.jpg --out report   # visual report
uv run engine-report --samples calibration/expected.json --out report/samples  # sample logos
```

From the monorepo root: `pnpm engine`, `pnpm engine:test`, `pnpm engine:report`, `pnpm engine:samples`.

## API

- `GET /health`
- `POST /v1/analyze` (multipart): `file` = PNG, JPG, WebP or GIF (first frame) up to 10 MB; `options` =
  optional JSON:

```json
{
  "sizes": [{ "key": "M", "logo_width_mm": 47, "logo_height_mm": 47 }],
  "max_colors": 4,
  "nozzle_mm": 0.4,
  "filaments": [{ "id": "orange", "hex": "#E95C21" }],
  "keep_enclosed_background": false
}
```

`min_feature_mm` and `min_gap_mm` override the nozzle limits, for calibration only.

Returns `status` (`viable` | `adjust` | `not_viable`), `issues` (codes in English; the web app translates them),
`colors` (with the closest filament), and for each size its status and its layers as SVG paths.

Each size also carries `mono`: the same logo printed in **a single filament** (all colors merged into one
shape), with its own status and path. In one color the color issues don't apply (`too_many_colors`, `shading`,
`no_close_filament`, `shared_filament`), and a thin line of one color inside another stops being a detail.
`mono_loses_detail` warns when merging the colors loses the design: when more than 40 % of the logo's edges are
between distinct colors that touch (a badge, an illustration).

## Printer limits

Bambu Lab A1, in `printing.py`. Minimum detail = 1.5 times the nozzle (Arachne prints it as one wide line or two
thin ones); minimum gap = 1.25 times (the narrowest channel between two raised parts that doesn't close up).

| Nozzle | Minimum detail | Minimum gap |
| ------ | -------------- | ----------- |
| 0.4 mm | 0.6 mm         | 0.5 mm      |
| 0.6 mm | 0.9 mm         | 0.75 mm     |
| 0.8 mm | 1.2 mm         | 1.0 mm      |

0.4 by default, the most detailed one. The report shows which sizes hold up with 0.6 and 0.8.

## How it decides

1. **Background:** transparency, or a uniform color along the edges. Background-colored areas enclosed by the
   logo (the counter of an "e") are background too, unless `keep_enclosed_background`.
2. **Colors:** k-means in CIELAB over the flat areas (no anti-aliased edges). Merges colors closer than ΔE 12 and
   reduces to `max_colors`, keeping the exact tone of the largest area.
3. **Flatness:** roughness is the part of the logo that not even 8 colors represent. Flat < 1.5 %. Between 1.5
   and 20 % (gradients, shading or more than 8 flat colors) it becomes flat bands → `adjust`. More than 20 %
   (photos, renders, realistic illustrations) → `not_viable`.
4. **Detail per size:** scales the logo to the printable area in mm. Anything thinner than the minimum detail
   goes to the neighboring color (or the background), and gaps narrower than the minimum gap are filled. Measures
   the area that changes and the elements that disappear entirely. If a color that is more than 5 % of the logo
   disappears, that size is not viable.
5. **Verdict:** each size has its own; the logo's is that of its best size.
6. **Vectorization:** contours per color → SVG paths.

## Calibration

`calibration/expected.json` holds the expected verdict for each logo in `logos-example/` (at the root; not
committed to the repo). `pnpm engine:samples` builds the report comparing engine vs. expected, and
`tests/test_calibration.py` fails if any stops matching. To correct a criterion: change the expected verdict,
then tune thresholds until the report matches.

The thresholds are at the top of `analyze.py` and `palette.py`.
