/**
 * Initial CMS data: example filaments, the microphone product and the FAQs.
 * It's idempotent: it doesn't duplicate or overwrite anything that already exists.
 *
 *   pnpm seed
 *
 * Runs with tsx and not `payload run`: in Payload 3.90, `payload run` sometimes exits the process
 * before the script's top-level await finishes.
 */
import { DEFAULT_FAQS } from '@nueve2siete/cms/defaults'
import { EXAMPLE_FILAMENTS, MICROPHONE } from '@nueve2siete/configurator'
import { getPayload } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })

for (const [index, filament] of EXAMPLE_FILAMENTS.entries()) {
  const existing = await payload.find({
    collection: 'filaments',
    where: { name: { equals: filament.name } },
    limit: 1,
  })
  if (existing.docs.length) continue
  await payload.create({
    collection: 'filaments',
    data: {
      name: filament.name,
      hex: filament.hex,
      material: 'PLA Basic',
      brand: 'Bambu Lab',
      available: true,
      sortOrder: index,
    },
  })
  payload.logger.info(`Filament created: ${filament.name}`)
}

const existingProduct = await payload.find({
  collection: 'products',
  where: { slug: { equals: MICROPHONE.slug } },
  limit: 1,
})
if (!existingProduct.docs.length) {
  await payload.create({
    collection: 'products',
    data: {
      name: MICROPHONE.name,
      slug: MICROPHONE.slug,
      status: 'active',
      parts: MICROPHONE.parts,
      boxShapes: MICROPHONE.boxShapes,
      sizes: MICROPHONE.sizes.map((size) => ({
        key: size.key,
        label: size.label,
        totalHeightMm: size.totalHeightMm,
        headDiameterMm: size.headDiameterMm,
        boxWidthMm: size.box.widthMm,
        boxHeightMm: size.box.heightMm,
        boxDepthMm: size.box.depthMm,
        logoAreaWidthMm: size.logoArea.widthMm,
        logoAreaHeightMm: size.logoArea.heightMm,
      })),
      logoRules: {
        ...MICROPHONE.logoRules,
        nozzleMm: String(MICROPHONE.logoRules.nozzleMm) as '0.4' | '0.6' | '0.8',
      },
    },
  })
  payload.logger.info('Product created: Micrófono personalizado')
}

const faqs = await payload.count({ collection: 'faqs' })
if (faqs.totalDocs === 0) {
  for (const [index, faq] of DEFAULT_FAQS.entries()) {
    await payload.create({ collection: 'faqs', data: { ...faq, sortOrder: index } })
  }
  payload.logger.info(`${DEFAULT_FAQS.length} FAQs created`)
}

payload.logger.info('Seed complete')
process.exit(0)
