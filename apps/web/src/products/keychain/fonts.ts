import { FONT_URLS, parseFont, type Font, type FontKey } from '@nueve2siete/text-shapes'

const loading = new Map<FontKey, Promise<Font>>()

/** CSS font-family registered for each font, to draw samples with the very file that shapes the print. */
export const cssFamily = (key: FontKey) => `keychain-${key}`

/**
 * Downloads a font once (about 20 KB each) and gives back the parsed version for the geometry. It also registers
 * it as a CSS font so the font picker can show the customer's text in it.
 */
export function loadKeychainFont(key: FontKey): Promise<Font> {
  let promise = loading.get(key)
  if (!promise) {
    promise = fetch(FONT_URLS[key].href)
      .then((response) => {
        if (!response.ok) throw new Error(`Font ${key}: HTTP ${response.status}`)
        return response.arrayBuffer()
      })
      .then((bytes) => {
        if (typeof FontFace !== 'undefined') {
          new FontFace(cssFamily(key), bytes.slice(0))
            .load()
            .then((face) => document.fonts.add(face))
            .catch(() => {})
        }
        return parseFont(bytes)
      })
    promise.catch(() => loading.delete(key))
    loading.set(key, promise)
  }
  return promise
}
