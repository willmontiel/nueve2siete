/// <reference path="./opentype.d.ts" />
import type { Font } from 'opentype.js'

import { EMOJIS, type EmojiGlyph } from './emoji-data'
import {
  area,
  bounds,
  circle,
  intersect,
  offset,
  rectangle,
  subtract,
  toRegions,
  translate,
  union,
  type Contour,
  type Region,
} from './geometry'
import { EMOJI_EM_RATIO, EMOJI_GAP_RATIO } from './metrics'
import { commandsToContours, parsePathData } from './paths'


export type GraphemeKind = 'char' | 'space' | 'emoji' | 'unsupported'

export interface Grapheme {
  text: string
  kind: GraphemeKind
  /** For approved emojis. */
  emoji?: EmojiGlyph
}

export interface TextShapeOptions {
  /** Height of the capital letters, in mm. */
  letterHeightMm: number
  /** How far the base extends around the text, in mm. */
  borderMm: number
  /** Key ring loop on the left: outer and hole diameters. */
  ring?: { outerMm: number; holeMm: number }
}

export interface TextShapes {
  /** Letters and emojis: the raised part, printed in the second color. */
  relief: Region[]
  /** The plate under them, with the key ring loop and its hole. */
  base: Region[]
  widthMm: number
  heightMm: number
  graphemes: Grapheme[]
}

const EMOJI_BY_CHAR = new Map(EMOJIS.map((emoji) => [emoji.char, emoji]))
const PICTOGRAPHIC = /\p{Extended_Pictographic}|\p{Regional_Indicator}|⃣/u
const segmenter = new Intl.Segmenter('es', { granularity: 'grapheme' })

/** The text split the way a person counts it: an emoji or an accented letter is one piece. */
export function splitGraphemes(text: string): string[] {
  return Array.from(segmenter.segment(text.normalize('NFC')), (s) => s.segment)
}

/** Whether a piece of text is an emoji (approved or not), a flag or a keycap. */
export function looksLikeEmoji(grapheme: string): boolean {
  return PICTOGRAPHIC.test(grapheme)
}

/** Emoji lookup key: without the variation selectors (❤️ and ❤ are the same emoji). */
export const emojiKey = (text: string) => text.replace(/[︎️]/g, '')

export function findEmoji(text: string): EmojiGlyph | undefined {
  return EMOJI_BY_CHAR.get(emojiKey(text))
}

/**
 * Splits the text the way a person counts it (an emoji or an accented letter is one) and says what each piece is:
 * a letter the font can draw, a space, an approved emoji, or something that can't be printed.
 */
export function segmentText(text: string, font: Font): Grapheme[] {
  const graphemes: Grapheme[] = []
  for (const { segment } of segmenter.segment(text.normalize('NFC'))) {
    if (segment === ' ') {
      graphemes.push({ text: segment, kind: 'space' })
    } else if (PICTOGRAPHIC.test(segment)) {
      const emoji = findEmoji(segment)
      graphemes.push(emoji ? { text: segment, kind: 'emoji', emoji } : { text: segment, kind: 'unsupported' })
    } else if ([...segment].length === 1 && font.hasChar(segment)) {
      graphemes.push({ text: segment, kind: 'char' })
    } else {
      graphemes.push({ text: segment, kind: 'unsupported' })
    }
  }
  return graphemes
}

function capHeightUnits(font: Font): number {
  return font.tables.os2?.sCapHeight || font.charToGlyph('H').getBoundingBox().y2
}

/** x where a horizontal line at `y` first meets the shapes, coming from the left (Infinity if it doesn't). */
function leftEdgeAt(contours: Contour[], y: number): number {
  let edge = Infinity
  for (const contour of contours) {
    for (let i = 0; i < contour.length; i++) {
      const a = contour[i]!
      const b = contour[(i + 1) % contour.length]!
      if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y)) {
        const x = a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x)
        if (x < edge) edge = x
      }
    }
  }
  return edge
}

/**
 * Builds the printable shapes for a line of text: raised letters and emojis over a base that follows their outline,
 * with an optional key ring loop. Unsupported pieces are skipped (validate them with `segmentText` first).
 * Coordinates are in mm, y up, with the base's bottom-left corner at (0, 0).
 */
export function buildTextShapes(text: string, font: Font, options: TextShapeOptions): TextShapes {
  const graphemes = segmentText(text, font)
  const { letterHeightMm: capMm, borderMm } = options
  const mmPerUnit = capMm / capHeightUnits(font)
  const emojiMmPerUnit = (capMm * EMOJI_EM_RATIO) / 1000
  const gap = capMm * EMOJI_GAP_RATIO

  const raw: Contour[] = []
  let cursor = 0
  let run = ''
  const flushRun = () => {
    if (!run) return
    const path = font.getPath(run, 0, 0, font.unitsPerEm, { kerning: true })
    const x0 = cursor
    // opentype gives y down in font units; flip it and scale to mm.
    raw.push(...commandsToContours(path.commands, (x, y) => ({ x: x0 + x * mmPerUnit, y: -y * mmPerUnit }), mmPerUnit))
    cursor += font.getAdvanceWidth(run, font.unitsPerEm, { kerning: true }) * mmPerUnit
    run = ''
  }

  for (const grapheme of graphemes) {
    if (grapheme.kind === 'char' || grapheme.kind === 'space') {
      run += grapheme.text
    } else if (grapheme.kind === 'emoji' && grapheme.emoji) {
      flushRun()
      const shape = commandsToContours(
        parsePathData(grapheme.emoji.d),
        (x, y) => ({ x: x * emojiMmPerUnit, y: y * emojiMmPerUnit }),
        emojiMmPerUnit,
      )
      const b = bounds(shape)
      if (cursor > 0) cursor += gap
      // Centered on the middle of the capital letters.
      raw.push(...translate(shape, cursor - b.minX, capMm / 2 - (b.minY + b.maxY) / 2))
      cursor += b.maxX - b.minX + gap
    }
  }
  flushRun()

  const reliefContours = union(raw)
  if (!reliefContours.length) return { relief: [], base: [], widthMm: 0, heightMm: 0, graphemes }

  // The base: the outline of everything, grown by the border, without holes, in a single piece. A bar through the
  // middle of the letters joins words the border alone wouldn't reach.
  const r = bounds(reliefContours)
  const bridge = rectangle(r.minX, capMm * 0.25, r.maxX, capMm * 0.65)
  const outline = offset(union([...reliefContours, bridge]), borderMm)
  let base = union(toRegions(outline).map((region) => region.outer))

  if (options.ring) {
    const outerR = options.ring.outerMm / 2
    const holeR = options.ring.holeMm / 2
    const cy = capMm / 2
    const edge = leftEdgeAt(base, cy)
    // Mostly outside the plate, so it reads as a loop.
    let cx = (Number.isFinite(edge) ? edge : bounds(base).minX) - outerR * 0.65
    // The hole must keep a wall around it; if the letters come too close, slide the loop further left.
    const keepOut = offset(reliefContours, Math.max(1, borderMm * 0.6))
    for (let i = 0; i < 40 && area(intersect([circle(cx, cy, holeR)], keepOut)) > 0; i++) cx -= 0.25
    base = union([...base, circle(cx, cy, outerR)])
    // Round the inner corners where the loop meets the plate, then cut the hole.
    const fillet = Math.min(1, borderMm / 2)
    base = subtract(offset(offset(base, fillet), -fillet), [circle(cx, cy, holeR)])
  }

  const b = bounds(base)
  const dx = -b.minX
  const dy = -b.minY
  return {
    relief: toRegions(translate(reliefContours, dx, dy)),
    base: toRegions(translate(base, dx, dy)),
    widthMm: b.maxX - b.minX,
    heightMm: b.maxY - b.minY,
    graphemes,
  }
}

