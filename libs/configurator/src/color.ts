export const INK = '#1F1B16'
export const SNOW = '#FAFAF7'
export const BRAND_YELLOW = '#E9BF0F'

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** Linear RGB channels (0–1) of a #RRGGBB color. */
function linearRgb(hex: string): [number, number, number] {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Invalid color: ${hex}`)
  const n = parseInt(match[1]!, 16)
  return [channel((n >> 16) & 0xff), channel((n >> 8) & 0xff), channel(n & 0xff)]
}

/** WCAG relative luminance of a #RRGGBB color (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = linearRgb(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** CIELAB (D65) of a #RRGGBB color. */
function toLab(hex: string): [number, number, number] {
  const [r, g, b] = linearRgb(hex)
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116)
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047)
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b)
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883)
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
}

/**
 * Perceptual distance between two colors (CIE76 ΔE, the same measure the logo engine uses).
 * Around 2 is barely noticeable; below LOW_CONTRAST_DELTA_E two touching parts blend in a print.
 */
export function deltaE(a: string, b: string): number {
  const [l1, a1, b1] = toLab(a)
  const [l2, a2, b2] = toLab(b)
  return Math.hypot(l1 - l2, a1 - a2, b1 - b2)
}

/** Below this ΔE, two parts that touch (base and letters, box and logo) are hard to tell apart. */
export const LOW_CONTRAST_DELTA_E = 20

export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/**
 * Color of the sample text on the box in the preview: whichever has the most contrast.
 * On near-black boxes it uses the brand yellow.
 */
export function previewLogoColor(boxHex: string): string {
  if (relativeLuminance(boxHex) < 0.02) return BRAND_YELLOW
  return contrastRatio(boxHex, INK) >= contrastRatio(boxHex, SNOW) ? INK : SNOW
}

/** true if the color is light (useful to draw the head grille dark or light). */
export function isLight(hex: string): boolean {
  return relativeLuminance(hex) > 0.35
}
