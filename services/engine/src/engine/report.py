"""Visual report to calibrate the engine with real logos.

uv run engine-report tests/fixtures/*.png tests/fixtures/*.jpg --out report
uv run engine-report --samples calibration/expected.json --out report/samples
"""

import argparse
import base64
import html
import io
import json
from pathlib import Path

import numpy as np
from PIL import Image

from .analyze import Analysis, analyze_logo, color_image, nozzle_statuses
from .color import delta_e, rgb_to_hex, rgb_to_lab
from .printing import NOZZLE_LIMITS
from .schemas import AnalyzeOptions, Status

STATUS_LABEL = {"viable": "Viable", "adjust": "Con ajustes", "not_viable": "No viable"}
STATUS_COLOR = {"viable": "#CDEBD3", "adjust": "#F6E3A1", "not_viable": "#F6C6B0"}
CHECKER = "background:repeating-conic-gradient(#e6e0d4 0 25%,#f0f0eb 0 50%) 0 0/16px 16px"
# Marker candidates for the "changes" view; each logo uses the two that clash least with its colors.
MARKERS = [(255, 0, 255), (0, 220, 255), (0, 0, 0), (60, 220, 60), (255, 120, 0), (255, 255, 255)]


def _png(array: np.ndarray, max_side: int = 360) -> str:
    image = Image.fromarray(array)
    image.thumbnail((max_side, max_side), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode()


def markers(analysis: Analysis) -> tuple[tuple[int, int, int], tuple[int, int, int]]:
    """Colors for lost detail and filled gaps that stand out against the logo's own colors."""
    centers = analysis.palette.centers
    candidates = rgb_to_lab(np.array(MARKERS, dtype=np.uint8))
    distance = [float(delta_e(c[None, :], centers).min()) if len(centers) else 100.0 for c in candidates]
    lost, filled = sorted(range(len(MARKERS)), key=lambda i: -distance[i])[:2]
    return MARKERS[lost], MARKERS[filled]


def overlay(analysis: Analysis, key: str) -> np.ndarray:
    detail = analysis.details[key]
    labels = np.full(analysis.palette.labels.shape, -1, dtype=np.int32)
    for index, layer in enumerate(detail.layers):
        labels[layer] = index
    image = color_image(labels, analysis.palette.centers)
    lost, filled = markers(analysis)
    image[detail.lost] = (*lost, 255)
    image[detail.filled] = (*filled, 255)
    return image


def _pill(status: Status, big: bool = False) -> str:
    return (
        f'<span class="pill{" big" if big else ""}" style="background:{STATUS_COLOR[status]}">'
        f"{STATUS_LABEL[status]}</span>"
    )


def _nozzle_table(matrix: dict[float, dict[str, Status]]) -> str:
    keys = list(next(iter(matrix.values())))
    head = "".join(f"<th>{k}</th>" for k in keys)
    rows = "".join(
        f"<tr><th>{nozzle} mm <small>{NOZZLE_LIMITS[nozzle][0]}/{NOZZLE_LIMITS[nozzle][1]}</small></th>"
        + "".join(f"<td>{_pill(statuses[k])}</td>" for k in keys)
        + "</tr>"
        for nozzle, statuses in matrix.items()
    )
    return f'<table class="nozzles"><tr><th>Boquilla <small>detalle/hueco mm</small></th>{head}</tr>{rows}</table>'


def _section(path: Path, analysis: Analysis, options: AnalyzeOptions, expected: dict | None) -> str:
    r = analysis.result
    original = np.array(Image.open(path).convert("RGBA"))
    swatches = "".join(
        f'<span class="sw" style="background:{c.hex}" title="{c.hex} · {c.share:.0%}"></span>'
        for c in r.colors
    )
    issues = (
        "".join(
            f"<li><b>{i.code}</b> ({i.severity}){' · ' + ', '.join(i.sizes) if i.sizes else ''}"
            f"{' · ' + html.escape(str(i.detail)) if i.detail else ''}</li>"
            for i in r.issues
        )
        or "<li>Sin observaciones</li>"
    )
    lost, filled = markers(analysis)
    legend = (
        f'<span class="sw" style="background:{rgb_to_hex(lost)}"></span> muy fino, pasa al color vecino · '
        f'<span class="sw" style="background:{rgb_to_hex(filled)}"></span> hueco muy estrecho, se tapa'
    )
    sizes = "".join(
        f"<figure>"
        f'<svg class="result" viewBox="0 0 {r.width} {r.height}" style="{CHECKER}">'
        + "".join(
            f'<path fill="{r.colors[layer.color_index].hex}" fill-rule="evenodd" d="{layer.path}"/>'
            for layer in s.layers
        )
        + f'</svg><img class="changes" src="{_png(overlay(analysis, s.key), 440)}" style="{CHECKER}">'
        f"<figcaption><b>{s.key}</b> {_pill(s.status)}<br>pierde {s.lost_ratio:.1%} · tapa "
        f"{s.filled_ratio:.1%} · {s.removed_features} elementos desaparecen<br>En un color: {_pill(s.mono.status)}"
        "</figcaption></figure>"
        for s in r.sizes
    )
    verdict = _pill(r.status, big=True)
    if expected:
        ok = expected["status"] == r.status
        verdict += (
            f' <span class="expect {"ok" if ok else "ko"}">{"✓" if ok else "✗"} esperado: '
            f"{STATUS_LABEL[expected['status']]}</span>"
            f' <span class="note">{html.escape(expected.get("note", ""))}</span>'
        )
    m = r.metrics
    return f"""
<section id="{html.escape(path.name)}">
  <header><h2>{html.escape(path.name)}</h2>{verdict}</header>
  <div class="row">
    <figure><img src="{_png(original)}" style="{CHECKER}"><figcaption>Original</figcaption></figure>
    <figure><img src="{_png(color_image(analysis.palette.labels, analysis.palette.centers))}" style="{CHECKER}">
      <figcaption>Colores detectados {swatches}</figcaption></figure>
    <div class="facts">
      <ul>{issues}</ul>
      <p>Fondo: {r.background} {r.background_hex or ""} · colores encontrados: {m.raw_color_count}
      · rugosidad: {m.roughness:.3f} · huecos encerrados: {m.enclosed_share:.1%}
      · lado original: {m.source_side}px · {m.elapsed_ms} ms</p>
    </div>
  </div>
  <p class="legend">Boquilla {m.nozzle_mm} mm (detalle mínimo {m.min_feature_mm} mm, hueco mínimo
  {m.min_gap_mm} mm). Cambios: {legend}</p>
  <div class="row sizes">{sizes}</div>
  {_nozzle_table(nozzle_statuses(analysis, options))}
</section>"""


def _summary(rows: list[tuple[Path, Analysis, dict | None]]) -> str:
    matches = [e for _, a, e in rows if e]
    agree = sum(1 for _, a, e in rows if e and e["status"] == a.result.status)
    body = "".join(
        f'<tr><td><a href="#{html.escape(p.name)}">{html.escape(p.name)}</a></td>'
        f"<td>{_pill(a.result.status)}</td>"
        f"<td>{(('✓ ' if e['status'] == a.result.status else '✗ ') + STATUS_LABEL[e['status']]) if e else ''}</td>"
        + "".join(f"<td>{_pill(s.status)}</td>" for s in a.result.sizes)
        + f"<td>{_pill(min((s.mono.status for s in a.result.sizes), key=list(STATUS_LABEL).index))}</td>"
        + "</tr>"
        for p, a, e in rows
    )
    keys = "".join(f"<th>{s.key}</th>" for s in rows[0][1].result.sizes) if rows else ""
    score = f"<p><b>Coinciden {agree} de {len(matches)}</b> con el veredicto esperado.</p>" if matches else ""
    return (
        f"{score}<table class='summary'><tr><th>Logo</th><th>Motor</th><th>Esperado</th>{keys}"
        f"<th>En un color</th></tr>{body}</table>"
    )


def build_report(
    paths: list[Path], out: Path, options: AnalyzeOptions, expected: dict[str, dict] | None = None
) -> Path:
    expected = expected or {}
    rows = [(path, analyze_logo(path.read_bytes(), options), expected.get(path.name)) for path in paths]
    sections = [_section(path, analysis, options, exp) for path, analysis, exp in rows]
    out.mkdir(parents=True, exist_ok=True)
    target = out / "report.html"
    target.write_text(
        f"""<!doctype html><html lang="es"><meta charset="utf-8"><title>Reporte del motor</title>
<style>
body{{font-family:system-ui,sans-serif;background:#f0f0eb;color:#1f1b16;margin:0;padding:32px}}
section{{background:#fafaf7;border-radius:24px;padding:24px;margin:0 0 24px}}
header{{display:flex;gap:12px;align-items:center;flex-wrap:wrap}} h2{{margin:0;font-size:20px;overflow-wrap:anywhere}}
.row{{display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;margin-top:16px}}
figure{{margin:0;max-width:100%}} figure img,figure svg{{display:block;width:220px;height:220px;max-width:100%;object-fit:contain;border-radius:12px}}
.row:not(.sizes)>figure img{{width:320px;height:320px}} .sizes figure{{width:220px}}
figcaption{{font-size:13px;margin-top:6px;line-height:1.5}}
.changes{{display:none}} body:has(#toggle:checked) .changes{{display:block}}
body:has(#toggle:checked) .result{{display:none}}
.pill{{padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}}
.big{{font-size:14px;padding:4px 14px}} .expect{{font-size:14px;font-weight:600}} .ok{{color:#2c7a3f}} .ko{{color:#b3261e}}
.note{{font-size:14px;color:#6b635a}} .legend{{font-size:13px;margin:16px 0 0;color:#4a443d}}
.sw{{display:inline-block;width:14px;height:14px;border-radius:50%;margin-left:4px;vertical-align:middle;border:1px solid #0003}}
.facts{{flex:1;min-width:260px;font-size:14px}} .facts ul{{padding-left:18px;margin:0 0 12px}}
table{{border-collapse:collapse;font-size:13px}} th,td{{padding:4px 8px;text-align:left}}
th small{{font-weight:400;color:#6b635a}} .nozzles{{margin-top:16px}}
.summary{{background:#fafaf7;border-radius:16px;margin-bottom:24px;display:block;overflow-x:auto}}
.summary td,.summary th{{border-bottom:1px solid #e6e0d4}} .summary a{{color:inherit}}
.toolbar{{display:block;position:sticky;top:0;background:#f0f0eb;padding:12px 0;z-index:1;font-size:15px}}
@media (max-width:640px){{body{{padding:16px}} section{{padding:16px}} .row:not(.sizes)>figure img{{width:100%;height:auto}}
.sizes figure{{width:calc(50% - 10px)}} .sizes figure img,.sizes figure svg{{width:100%;height:auto}} .nozzles{{display:block;overflow-x:auto}}}}
</style>
<h1>Reporte del motor de logos</h1>
<p>Por tamaño: arriba, las capas vectoriales que recibe el visor 3D (lo que se imprime). Con “mostrar
cambios”, lo que el motor modificó para que se pueda imprimir. La tabla de boquillas dice qué tamaños
aguantan una boquilla más gruesa (imprime más rápido, pierde más detalle).</p>
{_summary(rows)}
<label class="toolbar"><input type="checkbox" id="toggle"> Mostrar cambios</label>
{"".join(sections)}
</html>""",
        encoding="utf-8",
    )
    return target


def load_samples(path: Path) -> tuple[list[Path], dict[str, dict]]:
    """Reads a calibration file: the folder of sample logos and the verdict expected for each."""
    config = json.loads(path.read_text(encoding="utf-8"))
    folder = (path.parent / config["samples"]).resolve()
    return [folder / name for name in config["logos"] if (folder / name).exists()], config["logos"]


def main() -> None:
    parser = argparse.ArgumentParser(description="Visual report of the logo engine")
    parser.add_argument("images", nargs="*", type=Path)
    parser.add_argument("--samples", type=Path, help="calibration file with expected verdicts")
    parser.add_argument("--nozzle", type=float, default=0.4, choices=sorted(NOZZLE_LIMITS))
    parser.add_argument("--out", type=Path, default=Path("report"))
    args = parser.parse_args()

    images, expected = list(args.images), {}
    if args.samples:
        sample_images, expected = load_samples(args.samples)
        images += sample_images
    if not images:
        parser.error("no images: pass files or --samples")
    options = AnalyzeOptions(nozzle_mm=args.nozzle)
    target = build_report(images, args.out, options, expected)
    print(f"Report written to {target}")


if __name__ == "__main__":
    main()
