"""Generates the synthetic test logos. Run: uv run python tests/fixtures/make_fixtures.py"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = Path(__file__).parent
S = 4  # draw at 4x and downscale, so edges are anti-aliased like real exports


def canvas(size=(800, 800), bg=(255, 255, 255, 255)):
    image = Image.new("RGBA", (size[0] * S, size[1] * S), bg)
    return image, ImageDraw.Draw(image)


def save(image: Image.Image, name: str, mode="RGB", quality=None):
    image = image.resize((image.width // S, image.height // S), Image.LANCZOS)
    path = OUT / name
    if name.endswith(".jpg"):
        image.convert("RGB").save(path, quality=quality or 85)
    else:
        image.convert(mode).save(path)


def r(*box):
    return [v * S for v in box]


def flat_two_colors():
    image, d = canvas()
    d.ellipse(r(100, 100, 700, 700), fill=(31, 27, 22, 255))
    d.rounded_rectangle(r(230, 330, 570, 400), radius=20 * S, fill=(233, 92, 33, 255))
    d.rounded_rectangle(r(230, 440, 480, 510), radius=20 * S, fill=(233, 92, 33, 255))
    save(image, "flat_two_colors.png")


def flat_four_colors_transparent():
    image, d = canvas(bg=(0, 0, 0, 0))
    d.rounded_rectangle(r(80, 80, 720, 720), radius=90 * S, fill=(169, 182, 238, 255))
    d.ellipse(r(170, 170, 470, 470), fill=(233, 92, 33, 255))
    d.polygon(r(420, 620, 640, 620, 530, 380), fill=(233, 191, 15, 255))
    d.rectangle(r(170, 540, 380, 630), fill=(31, 27, 22, 255))
    save(image, "flat_four_colors_transparent.png", mode="RGBA")


def six_colors():
    image, d = canvas()
    colors = [(233, 92, 33), (233, 191, 15), (169, 182, 238), (47, 168, 90), (242, 155, 190), (47, 91, 211)]
    for i, color in enumerate(colors):
        d.rounded_rectangle(r(90 + i * 105, 150, 180 + i * 105, 650), radius=30 * S, fill=color + (255,))
    save(image, "six_colors.png")


def gradient():
    size = 800 * S
    x = np.linspace(0, 1, size)[None, :, None]
    start, end = np.array([233, 92, 33]), np.array([75, 91, 181])
    rgb = (start + (end - start) * x) * np.ones((size, 1, 1))
    image = Image.fromarray(rgb.astype(np.uint8), "RGB").convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse(r(100, 100, 700, 700), fill=255)
    out = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    out.paste(image, (0, 0), mask)
    save(out, "gradient.png")


def photo():
    rng = np.random.default_rng(3)
    noise = rng.random((25, 25, 3)) * 255
    image = Image.fromarray(noise.astype(np.uint8), "RGB").resize((800 * S, 800 * S), Image.BICUBIC)
    image = image.filter(ImageFilter.GaussianBlur(20)).convert("RGBA")
    save(image, "photo.jpg", quality=80)


def thin_details():
    image, d = canvas()
    d.rounded_rectangle(r(150, 150, 650, 450), radius=40 * S, fill=(31, 27, 22, 255))
    for i in range(12):  # hairlines, ~2 px wide at the final size
        y = 500 + i * 22
        d.line(r(150, y, 650, y), fill=(233, 92, 33, 255), width=2 * S)
    for i in range(20):  # tiny dots
        cx = 170 + i * 24
        d.ellipse(r(cx, 780 - 12, cx + 6, 780 - 6), fill=(31, 27, 22, 255))
    save(image, "thin_details.png")


if __name__ == "__main__":
    flat_two_colors()
    flat_four_colors_transparent()
    six_colors()
    gradient()
    photo()
    thin_details()
    print("Fixtures written to", OUT)
