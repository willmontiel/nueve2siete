/**
 * Builds src/emoji-data.ts: the emojis customers can put on printed text, with their outline.
 *
 *   pnpm --filter @nueve2siete/text-shapes build:emojis
 *
 * Each candidate is taken from Noto Emoji (monochrome, Bold, SIL OFL), drawn at the size it has next to the
 * smallest letters (--letter-mm, the S keychain) and checked like the logo engine checks logos: no line thinner
 * than the nozzle can draw, no gap narrower than it can leave open. Only the ones that pass are written, so any
 * approved emoji prints at any size. Only their outlines are stored: the site doesn't load the emoji font.
 */
import { NOZZLE_LIMITS, type Nozzle } from '@nueve2siete/configurator'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse, type Font, type PathCommand } from 'opentype.js/dist/opentype.mjs'

import { area, union } from '../src/geometry'
import { EMOJI_EM_RATIO } from '../src/metrics'
import { commandsToContours, parsePathData } from '../src/paths'
import { narrowGapArea, thinArea } from '../src/printability'

const here = path.dirname(fileURLToPath(import.meta.url))
const pkg = path.resolve(here, '..')
const fontsource = path.join(pkg, 'node_modules/@fontsource/noto-emoji')

const args = new Map(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=') as [string, string]))
const letterMm = Number(args.get('letter-mm') ?? 10)
const nozzle = Number(args.get('nozzle') ?? 0.4) as Nozzle
const { minFeatureMm, minGapMm } = NOZZLE_LIMITS[nozzle]

// Allowed loss. Thin strokes are what break or vanish, so that limit is strict. The gap check also fills the
// sharp inner corners where two lines meet, which the printer rounds anyway, so it gets more slack.
const MAX_THIN_SHARE = 0.015
const MAX_GAP_SHARE = 0.035

export const CATEGORIES = [
  { key: 'hearts', label: 'Corazones' },
  { key: 'nature', label: 'Naturaleza' },
  { key: 'animals', label: 'Animales' },
  { key: 'hobbies', label: 'Deportes y hobbies' },
  { key: 'party', label: 'Fiesta y comida' },
  { key: 'symbols', label: 'Caritas y símbolos' },
] as const

/**
 * Our own outlines, for emojis Noto doesn't draw in a printable way (em of 1000 units, y up). Noto draws ❤ and 🖤
 * hatched (its way of saying "red" and "black"), so the classic solid heart is drawn here.
 */
const CUSTOM_OUTLINES: Record<string, string> = {
  '❤': 'M500 -40C380 60 60 260 60 480C60 640 180 760 320 760C410 760 470 710 500 650C530 710 590 760 680 760C820 760 940 640 940 480C940 260 620 60 500 -40Z',
}

/**
 * Candidates in order of preference: emoji, Spanish name and category. Emojis that differ only in color look the
 * same printed, so there's one of each.
 */
const CANDIDATES: [string, string, (typeof CATEGORIES)[number]['key']][] = [
  ['❤', 'Corazón', 'hearts'],
  ['🤍', 'Corazón de contorno', 'hearts'],
  ['💖', 'Corazón brillante', 'hearts'],
  ['💕', 'Dos corazones', 'hearts'],
  ['💘', 'Corazón con flecha', 'hearts'],
  ['💝', 'Corazón con moño', 'hearts'],
  ['💗', 'Corazón latiendo', 'hearts'],
  ['💞', 'Corazones girando', 'hearts'],
  ['💌', 'Carta de amor', 'hearts'],
  ['🌸', 'Flor de cerezo', 'nature'],
  ['🌼', 'Margarita', 'nature'],
  ['🌻', 'Girasol', 'nature'],
  ['🌷', 'Tulipán', 'nature'],
  ['🌹', 'Rosa', 'nature'],
  ['🍀', 'Trébol', 'nature'],
  ['🌈', 'Arcoíris', 'nature'],
  ['☀', 'Sol', 'nature'],
  ['🌙', 'Luna', 'nature'],
  ['⭐', 'Estrella', 'nature'],
  ['✨', 'Destellos', 'nature'],
  ['⚡', 'Rayo', 'nature'],
  ['❄', 'Copo de nieve', 'nature'],
  ['🔥', 'Fuego', 'nature'],
  ['🌵', 'Cactus', 'nature'],
  ['🍄', 'Hongo', 'nature'],
  ['🐶', 'Perro', 'animals'],
  ['🐱', 'Gato', 'animals'],
  ['🐾', 'Huellitas', 'animals'],
  ['🦋', 'Mariposa', 'animals'],
  ['🐰', 'Conejo', 'animals'],
  ['🐻', 'Oso', 'animals'],
  ['🦄', 'Unicornio', 'animals'],
  ['🐝', 'Abeja', 'animals'],
  ['🐞', 'Mariquita', 'animals'],
  ['🐢', 'Tortuga', 'animals'],
  ['🐬', 'Delfín', 'animals'],
  ['🦊', 'Zorro', 'animals'],
  ['🐸', 'Rana', 'animals'],
  ['🐧', 'Pingüino', 'animals'],
  ['🦖', 'Dinosaurio', 'animals'],
  ['🐙', 'Pulpo', 'animals'],
  ['🐷', 'Cerdito', 'animals'],
  ['🐨', 'Koala', 'animals'],
  ['🐯', 'Tigre', 'animals'],
  ['🐵', 'Mono', 'animals'],
  ['🐳', 'Ballena', 'animals'],
  ['🦉', 'Búho', 'animals'],
  ['🐥', 'Pollito', 'animals'],
  ['🐟', 'Pez', 'animals'],
  ['🐌', 'Caracol', 'animals'],
  ['⚽', 'Balón de fútbol', 'hobbies'],
  ['🏀', 'Baloncesto', 'hobbies'],
  ['⚾', 'Béisbol', 'hobbies'],
  ['🎾', 'Tenis', 'hobbies'],
  ['🏐', 'Voleibol', 'hobbies'],
  ['🏆', 'Trofeo', 'hobbies'],
  ['🎮', 'Control de videojuego', 'hobbies'],
  ['🎸', 'Guitarra', 'hobbies'],
  ['🎵', 'Nota musical', 'hobbies'],
  ['🎧', 'Audífonos', 'hobbies'],
  ['🎤', 'Micrófono', 'hobbies'],
  ['🎨', 'Paleta de pintura', 'hobbies'],
  ['📚', 'Libros', 'hobbies'],
  ['✏', 'Lápiz', 'hobbies'],
  ['🎲', 'Dado', 'hobbies'],
  ['🎯', 'Diana', 'hobbies'],
  ['🏓', 'Ping pong', 'hobbies'],
  ['🎀', 'Moño', 'party'],
  ['🎁', 'Regalo', 'party'],
  ['🎈', 'Globo', 'party'],
  ['🎂', 'Pastel', 'party'],
  ['🎉', 'Fiesta', 'party'],
  ['👑', 'Corona', 'party'],
  ['💎', 'Diamante', 'party'],
  ['🍭', 'Chupeta', 'party'],
  ['🍩', 'Dona', 'party'],
  ['🍦', 'Helado', 'party'],
  ['🍕', 'Pizza', 'party'],
  ['🍓', 'Fresa', 'party'],
  ['🍒', 'Cerezas', 'party'],
  ['🧁', 'Cupcake', 'party'],
  ['😊', 'Carita feliz', 'symbols'],
  ['😍', 'Enamorado', 'symbols'],
  ['😎', 'Con gafas', 'symbols'],
  ['😜', 'Guiño', 'symbols'],
  ['👍', 'Pulgar arriba', 'symbols'],
  ['✌', 'Paz', 'symbols'],
  ['☮', 'Símbolo de paz', 'symbols'],
  ['⚓', 'Ancla', 'symbols'],
  ['✈', 'Avión', 'symbols'],
  ['🚀', 'Cohete', 'symbols'],
  ['🏠', 'Casa', 'symbols'],
  ['🔑', 'Llave', 'symbols'],
  ['💡', 'Bombillo', 'symbols'],
  ['📷', 'Cámara', 'symbols'],
]
/** At most this many per category, so the picker stays easy to scan. */
const PER_CATEGORY = 10

function chunkFor(codepoint: number, ranges: Record<string, string>): string | undefined {
  for (const [chunk, spec] of Object.entries(ranges)) {
    for (const part of spec.split(',')) {
      const [from, to] = part.replace('U+', '').split('-').map((h) => parseInt(h, 16)) as [number, number?]
      if (codepoint >= from && codepoint <= (to ?? from)) return chunk.replace(/[[\]]/g, '')
    }
  }
  return undefined
}

const ranges = JSON.parse(readFileSync(path.join(fontsource, 'unicode.json'), 'utf8')) as Record<string, string>
const fonts = new Map<string, Font>()
const loadChunk = (chunk: string) => {
  if (!fonts.has(chunk)) {
    const file = path.join(fontsource, `files/noto-emoji-${chunk}-700-normal.woff`)
    const bytes = readFileSync(file)
    fonts.set(chunk, parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)))
  }
  return fonts.get(chunk)!
}

/** Path data normalized to an em of 1000 units, y up, rounded to whole units (about 0.013 mm at the S size). */
function normalizedPathData(commands: PathCommand[], scale: number): string {
  const n = (v: number | undefined) => String(Math.round(v! * scale))
  return commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${n(c.x)} ${n(c.y)}`
        case 'Q':
          return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
        case 'C':
          return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
        default:
          return 'Z'
      }
    })
    .join('')
}

const emMm = letterMm * EMOJI_EM_RATIO
const approved: { char: string; name: string; category: string; d: string }[] = []
const perCategory = new Map<string, number>()
const report: string[] = []

/** Outline of an emoji in font units, from our own drawings or from Noto Emoji. */
function outline(char: string): { commands: PathCommand[]; scale: number } | undefined {
  const custom = CUSTOM_OUTLINES[char]
  if (custom) return { commands: parsePathData(custom), scale: 1 }
  const chunk = chunkFor(char.codePointAt(0)!, ranges)
  const font = chunk ? loadChunk(chunk) : undefined
  const glyph = font?.charToGlyph(char)
  if (!font || !glyph || glyph.index === 0) return undefined
  return { commands: glyph.path.commands, scale: 1000 / font.unitsPerEm }
}

for (const [char, name, category] of CANDIDATES) {
  const source = outline(char)
  if (!source) {
    report.push(`✗ ${char} ${name}: not in Noto Emoji`)
    continue
  }
  const d = normalizedPathData(source.commands, source.scale)
  // Checks the stored (rounded) outline: exactly what the site will print.
  const mmPerUnit = emMm / 1000
  const contours = union(commandsToContours(parsePathData(d), (x, y) => ({ x: x * mmPerUnit, y: y * mmPerUnit }), mmPerUnit))
  const total = area(contours)
  const thin = thinArea(contours, minFeatureMm) / total
  const gaps = narrowGapArea(contours, minGapMm) / total
  const ok = thin <= MAX_THIN_SHARE && gaps <= MAX_GAP_SHARE
  const full = (perCategory.get(category) ?? 0) >= PER_CATEGORY
  report.push(
    `${ok ? (full ? '·' : '✓') : '✗'} ${char} ${name}: thin ${(thin * 100).toFixed(1)}%, narrow gaps ${(gaps * 100).toFixed(1)}%`,
  )
  if (ok && !full) {
    approved.push({ char, name, category, d })
    perCategory.set(category, (perCategory.get(category) ?? 0) + 1)
  }
}

const header = `// Generated by scripts/build-emojis.ts — don't edit by hand.
// Outlines from Noto Emoji (monochrome, Bold) © Google, SIL Open Font License 1.1 (fonts/licenses/noto-emoji-OFL.txt),
// except the ones drawn in CUSTOM_OUTLINES.
// Checked at ${letterMm} mm letters with the ${nozzle} mm nozzle (lines ≥ ${minFeatureMm} mm, gaps ≥ ${minGapMm} mm).
`
const body = `
export const EMOJI_CATEGORIES = [
${CATEGORIES.map((c) => `  { key: '${c.key}', label: '${c.label}' },`).join('\n')}
] as const

export type EmojiCategory = (typeof EMOJI_CATEGORIES)[number]['key']

export interface EmojiGlyph {
  char: string
  /** Spanish name, for screen readers and the picker. */
  name: string
  category: EmojiCategory
  /** Outline in an em of 1000 units, y up (absolute M/L/Q/C/Z). */
  d: string
}

export const EMOJIS: EmojiGlyph[] = [
${approved.map((e) => `  { char: '${e.char}', name: '${e.name}', category: '${e.category}', d: '${e.d}' },`).join('\n')}
]
`
writeFileSync(path.join(pkg, 'src/emoji-data.ts'), header + body)
console.log(report.join('\n'))
console.log(`\n${approved.length} emojis approved of ${CANDIDATES.length}.`)
