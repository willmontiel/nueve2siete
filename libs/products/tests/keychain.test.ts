import { NOZZLE_LIMITS } from '@nueve2siete/configurator'
import {
  area,
  buildTextShapes,
  commandsToContours,
  EMOJI_EM_RATIO,
  EMOJIS,
  FONTS,
  parsePathData,
  thinArea,
  union,
  regionContours,
} from '@nueve2siete/text-shapes'
import { loadFontFile } from '@nueve2siete/text-shapes/node'
import { describe, expect, it } from 'vitest'

import { evaluateKeychain, KEYCHAIN, normalizeKeychainText, shapeOptions } from '../src'

const fredoka = loadFontFile('fredoka')
const codes = (text: string, size = 'M') => evaluateKeychain(text, fredoka, size, KEYCHAIN).issues.map((i) => i.code)
const { minFeatureMm } = NOZZLE_LIMITS[KEYCHAIN.nozzleMm]
const smallest = KEYCHAIN.sizes[0]!

describe('keychain rules', () => {
  it('accepts a name with an emoji', () => {
    const result = evaluateKeychain('  Lucía   🎀 ', fredoka, 'M', KEYCHAIN)
    expect(result.text).toBe('Lucía 🎀')
    expect(result.issues).toEqual([])
    expect(result.printable).toBe(true)
    expect(result.charCount).toBe(7)
    expect(result.emojiCount).toBe(1)
    expect(result.shapes.widthMm).toBeLessThan(KEYCHAIN.sizes[1]!.maxLengthMm)
  })

  it('normalizes spaces and line breaks', () => {
    expect(normalizeKeychainText(' Ana\n  María ')).toBe('Ana María')
  })

  it('blocks empty text, unsupported characters, too many characters or emojis', () => {
    expect(codes('   ')).toContain('empty')
    expect(codes('Ana 🇨🇴')).toContain('unsupported')
    expect(codes('Maximiliano Andrés')).toContain('too_many_chars')
    expect(codes('❤ Ana ❤ ⭐')).toContain('too_many_emojis')
    expect(evaluateKeychain('   ', fredoka, 'M', KEYCHAIN).printable).toBe(false)
  })

  it('blocks text longer than the size and suggests a smaller one where it fits', () => {
    const result = evaluateKeychain('WWWWWWW', fredoka, 'L', KEYCHAIN)
    const tooLong = result.issues.find((i) => i.code === 'too_long')
    expect(tooLong).toBeDefined()
    expect(result.printable).toBe(false)
    const small = evaluateKeychain('Valentina', fredoka, 'S', KEYCHAIN)
    expect(small.issues.map((i) => i.code)).not.toContain('too_long')
  })

  it('gets taller with each size', () => {
    const heights = KEYCHAIN.sizes.map((size) => buildTextShapes('Ana', fredoka, shapeOptions(size)).heightMm)
    expect(heights[0]!).toBeLessThan(heights[1]!)
    expect(heights[1]!).toBeLessThan(heights[2]!)
  })
})

describe('printable at the smallest size', () => {
  it.each(FONTS.map((f) => f.key))('every letter of %s is thick enough', (key) => {
    const font = loadFontFile(key)
    for (const word of ['abcdefghijklm', 'nñopqrstuvwxyz', 'ABCDEFGHIJKLM', 'NÑOPQRSTUVWXYZ', 'áéíóúü 0123456789']) {
      const relief = regionContours(buildTextShapes(word, font, shapeOptions(smallest)).relief)
      const share = thinArea(relief, minFeatureMm) / area(relief)
      expect(share, `${key}: ${word}`).toBeLessThan(0.015)
    }
  })

  it('every approved emoji was checked at letters no bigger than the smallest size', () => {
    // scripts/build-emojis.ts checks them at 10 mm letters: if S gets smaller, run it again with --letter-mm.
    expect(smallest.letterHeightMm).toBeGreaterThanOrEqual(10)
    for (const emoji of EMOJIS) {
      const mm = (smallest.letterHeightMm * EMOJI_EM_RATIO) / 1000
      const shape = union(commandsToContours(parsePathData(emoji.d), (x, y) => ({ x: x * mm, y: y * mm }), mm))
      expect(thinArea(shape, minFeatureMm) / area(shape), emoji.name).toBeLessThan(0.016)
    }
  })
})
