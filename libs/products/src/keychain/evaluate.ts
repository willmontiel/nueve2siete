import { NOZZLE_LIMITS } from '@nueve2siete/configurator'
import {
  area,
  buildTextShapes,
  regionContours,
  thinArea,
  type Font,
  type TextShapes,
} from '@nueve2siete/text-shapes'

import type { KeychainDefinition, KeychainSize } from './definition'

export type KeychainIssue =
  | { code: 'empty' }
  | { code: 'unsupported'; chars: string[] }
  | { code: 'too_many_chars'; count: number; max: number }
  | { code: 'too_many_emojis'; count: number; max: number }
  /** Longer than the size allows; `fitsIn` is a smaller size where it does fit, if any. */
  | { code: 'too_long'; widthMm: number; maxMm: number; fitsIn: string | null }
  /** Some strokes are too thin for the nozzle at this size (a warning: it can still be ordered). */
  | { code: 'thin'; betterSize: string | null }

const BLOCKING = new Set<KeychainIssue['code']>(['empty', 'unsupported', 'too_many_chars', 'too_many_emojis', 'too_long'])
/** Share of the letters' area that may be thinner than the nozzle's minimum line (rounded tips always lose a bit). */
const MAX_THIN_SHARE = 0.015

export interface KeychainEvaluation {
  /** The text as it will be printed (trimmed, single spaces). */
  text: string
  size: KeychainSize
  shapes: TextShapes
  issues: KeychainIssue[]
  /** No blocking issue: it can be ordered. */
  printable: boolean
  charCount: number
  emojiCount: number
}

/** One line, no leading or trailing spaces and single spaces between words. */
export function normalizeKeychainText(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

export function shapeOptions(size: KeychainSize) {
  return { letterHeightMm: size.letterHeightMm, borderMm: size.borderMm, ring: size.ring }
}

function thinShare(shapes: TextShapes, definition: KeychainDefinition): number {
  const relief = regionContours(shapes.relief)
  const total = area(relief)
  return total ? thinArea(relief, NOZZLE_LIMITS[definition.nozzleMm].minFeatureMm) / total : 0
}

/** Builds the keychain's shapes and checks the text against the product rules. */
export function evaluateKeychain(
  rawText: string,
  font: Font,
  sizeKey: string,
  definition: KeychainDefinition,
): KeychainEvaluation {
  const text = normalizeKeychainText(rawText)
  const size = definition.sizes.find((s) => s.key === sizeKey) ?? definition.sizes[0]!
  const shapes = buildTextShapes(text, font, shapeOptions(size))
  const { graphemes } = shapes
  const issues: KeychainIssue[] = []

  const emojiCount = graphemes.filter((g) => g.kind === 'emoji').length
  const unsupported = [...new Set(graphemes.filter((g) => g.kind === 'unsupported').map((g) => g.text))]

  if (!graphemes.some((g) => g.kind === 'char' || g.kind === 'emoji')) issues.push({ code: 'empty' })
  if (unsupported.length) issues.push({ code: 'unsupported', chars: unsupported })
  if (graphemes.length > definition.maxChars) {
    issues.push({ code: 'too_many_chars', count: graphemes.length, max: definition.maxChars })
  }
  if (emojiCount > definition.maxEmojis) {
    issues.push({ code: 'too_many_emojis', count: emojiCount, max: definition.maxEmojis })
  }

  if (shapes.widthMm > size.maxLengthMm) {
    // Letters shrink with the size, so a smaller one may fit.
    const index = definition.sizes.indexOf(size)
    const fitsIn =
      definition.sizes
        .slice(0, index)
        .reverse()
        .find((s) => buildTextShapes(text, font, shapeOptions(s)).widthMm <= s.maxLengthMm)?.key ?? null
    issues.push({ code: 'too_long', widthMm: shapes.widthMm, maxMm: size.maxLengthMm, fitsIn })
  }

  if (shapes.relief.length && thinShare(shapes, definition) > MAX_THIN_SHARE) {
    const index = definition.sizes.indexOf(size)
    const betterSize =
      definition.sizes
        .slice(index + 1)
        .find((s) => thinShare(buildTextShapes(text, font, shapeOptions(s)), definition) <= MAX_THIN_SHARE)?.key ??
      null
    issues.push({ code: 'thin', betterSize })
  }

  return {
    text,
    size,
    shapes,
    issues,
    printable: !issues.some((issue) => BLOCKING.has(issue.code)),
    charCount: graphemes.length,
    emojiCount,
  }
}
