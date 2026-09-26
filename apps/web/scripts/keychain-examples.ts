/**
 * Draws the example keychains shown on /llaveros and on "Diseña el tuyo" with the real engine (same fonts, sizes
 * and emojis as the creator), as SVG files in src/assets/products.
 *
 *   pnpm --filter @nueve2siete/web assets:keychains
 */
import { evaluateKeychain, KEYCHAIN } from '@nueve2siete/products'
import type { FontKey, Region } from '@nueve2siete/text-shapes'
import { loadFontFile } from '@nueve2siete/text-shapes/node'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/assets/products')

const EXAMPLES: { file: string; text: string; font: FontKey; size: string; base: string; letters: string }[] = [
  { file: 'keychain-lucia.svg', text: 'Lucía 🎀', font: 'fredoka', size: 'M', base: '#2F5BD3', letters: '#FAFAF7' },
  { file: 'keychain-mateo.svg', text: 'Mateo ⚽', font: 'titan', size: 'M', base: '#1F1B16', letters: '#E9BF0F' },
  { file: 'keychain-sofi.svg', text: 'Sofi ❤', font: 'pacifico', size: 'M', base: '#A9B6EE', letters: '#FAFAF7' },
]

const pathData = (regions: Region[], height: number) =>
  regions
    .flatMap((r) => [r.outer, ...r.holes])
    .map((c) => 'M' + c.map((p) => `${p.x.toFixed(1)} ${(height - p.y).toFixed(1)}`).join('L') + 'Z')
    .join('')

for (const example of EXAMPLES) {
  const { shapes } = evaluateKeychain(example.text, loadFontFile(example.font), example.size, KEYCHAIN)
  const { widthMm: w, heightMm: h } = shapes
  const depth = 1.6
  const base = pathData(shapes.base, h)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 ${(w + 2).toFixed(2)} ${(h + depth + 2).toFixed(2)}" width="${Math.round(w * 8)}" height="${Math.round((h + depth) * 8)}">
<defs><path id="base" d="${base}"/></defs>
<use href="#base" y="${depth}" fill="${example.base}"/>
<use href="#base" y="${depth}" fill="#000" fill-opacity="0.28"/>
<use href="#base" fill="${example.base}"/>
<path d="${pathData(shapes.relief, h)}" fill="${example.letters}"/>
</svg>
`
  writeFileSync(path.join(out, example.file), svg)
  console.log(`${example.file}: ${w.toFixed(0)} × ${h.toFixed(0)} mm`)
}
