// Compresses every model in models/ (the GLBs converted from the Bambu Lab .3mf files) into public/models/, the
// files the site loads. Meshopt keeps the decoder inside the bundle, so no outside server is needed. The flags
// keep each part as its own mesh named after its part id, with its own material, and leave the geometry whole
// (simplifying left marks on the clicker's face).
import { execFileSync } from 'node:child_process'
import { readdirSync, statSync } from 'node:fs'

const kb = path => `${Math.round(statSync(path).size / 1024)} KB`

for (const file of readdirSync('models').filter(name => name.endsWith('.glb'))) {
  const from = `models/${file}`
  const to = `public/models/${file}`
  execFileSync(
    'npx',
    ['--yes', '@gltf-transform/cli@4.5.1', 'optimize', from, to, '--compress', 'meshopt', '--simplify', 'false',
      '--join', 'false', '--flatten', 'false', '--instance', 'false', '--palette', 'false', '--prune', 'false'],
    { stdio: 'ignore' },
  )
  console.log(`${file}: ${kb(from)} → ${kb(to)}`)
}
