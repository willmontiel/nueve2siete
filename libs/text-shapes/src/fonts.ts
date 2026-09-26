/**
 * Fonts for printed text: bold, rounded strokes that stay printable at the smallest size. All of them are
 * SIL Open Font License (see fonts/licenses) and include Spanish letters (ñ, accents, ¿ ¡).
 */
export const FONTS = [
  { key: 'fredoka', label: 'Redondeada', family: 'Fredoka Bold' },
  { key: 'pacifico', label: 'Cursiva', family: 'Pacifico' },
  { key: 'titan', label: 'Gruesa', family: 'Titan One' },
  { key: 'calsans', label: 'nueve2siete', family: 'Cal Sans SemiBold' },
] as const

export type FontKey = (typeof FONTS)[number]['key']

export const DEFAULT_FONT: FontKey = 'fredoka'

export function isFontKey(value: unknown): value is FontKey {
  return FONTS.some((font) => font.key === value)
}

/**
 * Where each font file is. In the browser the bundler turns these into asset URLs; in Node they're file URLs.
 */
export const FONT_URLS: Record<FontKey, URL> = {
  fredoka: new URL('../fonts/fredoka-bold.woff', import.meta.url),
  pacifico: new URL('../fonts/pacifico.woff', import.meta.url),
  titan: new URL('../fonts/titan-one.woff', import.meta.url),
  calsans: new URL('../fonts/cal-sans-semibold.woff', import.meta.url),
}
