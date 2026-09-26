import { describe, expect, it } from 'vitest'

import {
  area,
  buildTextShapes,
  circle,
  EMOJIS,
  findEmoji,
  FONTS,
  intersect,
  narrowGapArea,
  offset,
  parsePathData,
  regionContours,
  segmentText,
  thinArea,
  union,
} from '../src'
import { loadFont } from './helpers'

const OPTIONS = { letterHeightMm: 10, borderMm: 2, ring: { outerMm: 8, holeMm: 4 } }

describe('segmentText', () => {
  const font = loadFont('fredoka')

  it('counts an emoji or an accented letter as one, and recognizes approved emojis', () => {
    const parts = segmentText('Lucía 🎀', font)
    expect(parts.map((p) => p.kind)).toEqual(['char', 'char', 'char', 'char', 'char', 'space', 'emoji'])
    expect(parts[6]!.emoji?.name).toBe('Moño')
  })

  it('treats ❤️ and ❤ as the same emoji', () => {
    expect(findEmoji('❤️')).toBe(findEmoji('❤'))
    expect(segmentText('❤️', font)[0]!.kind).toBe('emoji')
  })

  it('marks emojis that are not approved, and characters the font lacks, as unsupported', () => {
    expect(segmentText('👩‍👩‍👧', font)[0]!.kind).toBe('unsupported')
    expect(segmentText('🇨🇴', font)[0]!.kind).toBe('unsupported')
    expect(segmentText('Ω', font)[0]!.kind).toBe('unsupported')
  })

  it('keeps accents written as two code points together', () => {
    const decomposed = 'Lucí́a'.replace('í́', 'í')
    expect(segmentText(decomposed, font).filter((p) => p.kind === 'char')).toHaveLength(5)
  })
})

describe('buildTextShapes', () => {
  const font = loadFont('fredoka')

  it('makes a single base with a hole, and raised letters inside it', () => {
    const shapes = buildTextShapes('Lucía 🎀', font, OPTIONS)
    expect(shapes.base).toHaveLength(1)
    expect(shapes.base[0]!.holes).toHaveLength(1) // the key ring hole
    const base = regionContours(shapes.base)
    const relief = regionContours(shapes.relief)
    // Every raised part sits on the base.
    expect(area(relief)).toBeGreaterThan(50)
    expect(area(intersect(relief, base))).toBeCloseTo(area(relief), 1)
  })

  it('is about as tall as the letters plus the border, and grows with the text', () => {
    const short = buildTextShapes('Ana', font, OPTIONS)
    const long = buildTextShapes('Anastasia', font, OPTIONS)
    expect(short.heightMm).toBeGreaterThan(10 + 2 * 2)
    expect(short.heightMm).toBeLessThan(22)
    expect(long.widthMm).toBeGreaterThan(short.widthMm + 25)
  })

  it('joins separate words into one base', () => {
    const shapes = buildTextShapes('Ana   María', font, { ...OPTIONS, ring: undefined })
    expect(shapes.base).toHaveLength(1)
  })

  it('keeps a wall around the key ring hole', () => {
    const shapes = buildTextShapes('Jota', font, OPTIONS)
    const hole = shapes.base[0]!.holes[0]!
    const relief = regionContours(shapes.relief)
    // Nothing raised within 1 mm of the hole.
    expect(area(intersect(relief, offset([hole], 1)))).toBe(0)
  })

  it('returns empty shapes for empty text', () => {
    expect(buildTextShapes('   ', font, OPTIONS).base).toHaveLength(0)
  })
})

describe('printability checks', () => {
  it('find nothing wrong with a solid disc and flag a thin line', () => {
    expect(thinArea([circle(0, 0, 5)], 0.6)).toBeLessThan(0.05)
    const line = [{ x: 0, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 0.3 }, { x: 0, y: 0.3 }]
    expect(thinArea([line], 0.6)).toBeCloseTo(6, 0)
  })

  it('flag a gap narrower than the minimum', () => {
    const a = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]
    const b = a.map(({ x, y }) => ({ x: x + 10.3, y }))
    expect(narrowGapArea(union([a, b]), 0.5)).toBeGreaterThan(2)
  })
})

describe('fonts and emojis', () => {
  it('every font has the Spanish letters', () => {
    for (const { key } of FONTS) {
      const font = loadFont(key)
      const missing = [...'abcdefghijklmnñopqrstuvwxyzáéíóúüABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ0123456789¿?¡!'].filter(
        (c) => !font.hasChar(c),
      )
      expect(missing, key).toEqual([])
    }
  })

  it('every emoji outline parses', () => {
    for (const emoji of EMOJIS) expect(parsePathData(emoji.d).length, emoji.name).toBeGreaterThan(3)
  })
})
