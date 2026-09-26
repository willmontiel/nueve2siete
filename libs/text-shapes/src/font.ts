/// <reference path="./opentype.d.ts" />
// The ESM build explicitly: plain Node would otherwise pick the CommonJS one, which has no named exports.
import { parse, type Font } from 'opentype.js/dist/opentype.mjs'

export type { Font }

/** Reads a font file (TTF, OTF or WOFF; not WOFF2). */
export function parseFont(bytes: ArrayBuffer): Font {
  return parse(bytes)
}
