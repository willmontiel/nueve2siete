export const INK = '#1F1B16'
export const SNOW = '#FAFAF7'
export const BRAND_YELLOW = '#E9BF0F'

function channel(value: number): number {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/** WCAG relative luminance of a #RRGGBB color (0 = black, 1 = white). */
export function relativeLuminance(hex: string): number {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) throw new Error(`Invalid color: ${hex}`)
  const n = parseInt(match[1]!, 16)
  const r = channel((n >> 16) & 0xff)
  const g = channel((n >> 8) & 0xff)
  const b = channel(n & 0xff)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

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
