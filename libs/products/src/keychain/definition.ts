import type { Filament, Nozzle } from '@nueve2siete/configurator'
import { FONTS, type FontKey } from '@nueve2siete/text-shapes'

/** Name keychain: raised letters and emojis over a base that follows their outline, with a key ring loop. */

export interface KeychainSize {
  key: string
  label: string
  /** Height of the capital letters. */
  letterHeightMm: number
  /** How far the base extends around the text. */
  borderMm: number
  /** Base thickness and letter height above it (multiples of the 0.2 mm layer). */
  baseMm: number
  reliefMm: number
  /** Key ring loop: outer and hole diameters. */
  ring: { outerMm: number; holeMm: number }
  /** Longest keychain, loop included. */
  maxLengthMm: number
}

export interface KeychainPart {
  key: 'base' | 'letters'
  label: string
}

export interface KeychainDefinition {
  slug: string
  name: string
  parts: KeychainPart[]
  sizes: KeychainSize[]
  /** Letters, spaces and emojis, each one counts as one. */
  maxChars: number
  maxEmojis: number
  nozzleMm: Nozzle
  fonts: FontKey[]
}

/**
 * Provisional sizes, computed to be printable on the A1 with the 0.4 nozzle (to be checked with test prints):
 * - The bold fonts' strokes are over 1.2 mm at S, twice the 0.6 mm minimum line.
 * - The relief gets at least 5 layers and the base at least 12, so it doesn't bend.
 * - The loop's wall is 2 mm or more, and a 4 mm hole takes a standard split ring.
 * They're edited in the admin.
 */
export const KEYCHAIN: KeychainDefinition = {
  slug: 'llavero',
  name: 'Llavero con tu nombre',
  parts: [
    { key: 'base', label: 'Base' },
    { key: 'letters', label: 'Letras' },
  ],
  sizes: [
    {
      key: 'S',
      label: 'Pequeño',
      letterHeightMm: 10,
      borderMm: 2,
      baseMm: 2.4,
      reliefMm: 1,
      ring: { outerMm: 8, holeMm: 4 },
      maxLengthMm: 95,
    },
    {
      key: 'M',
      label: 'Mediano',
      letterHeightMm: 13,
      borderMm: 2.5,
      baseMm: 3,
      reliefMm: 1,
      ring: { outerMm: 9, holeMm: 4.5 },
      maxLengthMm: 115,
    },
    {
      key: 'L',
      label: 'Grande',
      letterHeightMm: 16,
      borderMm: 3,
      baseMm: 3,
      reliefMm: 1.2,
      ring: { outerMm: 10, holeMm: 5 },
      maxLengthMm: 130,
    },
  ],
  maxChars: 12,
  maxEmojis: 2,
  nozzleMm: 0.4,
  fonts: FONTS.map((font) => font.key),
}

/**
 * Like the example that inspired it: a blue base and white letters. Filaments are matched by id or by name,
 * because the ones from the admin have numeric ids.
 */
export function defaultKeychainColors(filaments: Filament[]): Record<KeychainPart['key'], string> {
  const pick = (wanted: string[], fallback: number) => {
    const match = wanted
      .map((w) => filaments.find((f) => f.id === w || f.name.trim().toLowerCase() === w))
      .find(Boolean)
    return (match ?? filaments[fallback % filaments.length])?.id ?? ''
  }
  return {
    base: pick(['blue', 'azul', 'dark-blue', 'azul oscuro', 'black', 'negro'], 0),
    letters: pick(['white', 'blanco', 'yellow', 'amarillo'], 1),
  }
}
