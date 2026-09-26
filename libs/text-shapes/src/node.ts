import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { parseFont, type Font } from './font'
import { FONT_URLS, type FontKey } from './fonts'

const cache = new Map<FontKey, Font>()

/** Loads one of the bundled fonts from disk (tests, scripts and, later, generating print files on the server). */
export function loadFontFile(key: FontKey): Font {
  if (!cache.has(key)) {
    const bytes = readFileSync(fileURLToPath(FONT_URLS[key]))
    cache.set(key, parseFont(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)))
  }
  return cache.get(key)!
}
