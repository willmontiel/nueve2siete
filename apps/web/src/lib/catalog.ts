import { getPayloadClient, type Product, type Project } from '@nueve2siete/cms'
import {
  EXAMPLE_FILAMENTS,
  MICROPHONE,
  isNozzle,
  type Filament,
  type ProductDefinition,
} from '@nueve2siete/configurator'
import { KEYCHAIN, type KeychainDefinition } from '@nueve2siete/products'
import { cache } from 'react'

export interface MicCatalog {
  product: ProductDefinition
  filaments: Filament[]
}

function toProductDefinition(doc: Product): ProductDefinition {
  const parts = (doc.parts ?? []).map(({ key, label }) => ({ key, label }))
  const boxShapes = (doc.boxShapes ?? []).map(({ key, label }) => ({ key, label }))
  const sizes = (doc.sizes ?? []).map((size) => ({
    key: size.key,
    label: size.label,
    totalHeightMm: size.totalHeightMm,
    box: { widthMm: size.boxWidthMm, heightMm: size.boxHeightMm, depthMm: size.boxDepthMm },
    headDiameterMm: size.headDiameterMm,
    logoArea: { widthMm: size.logoAreaWidthMm, heightMm: size.logoAreaHeightMm },
  }))
  const defaults = MICROPHONE.logoRules
  const rules = doc.logoRules
  const nozzle = Number(rules?.nozzleMm)

  return {
    slug: doc.slug,
    name: doc.name,
    parts: parts.length ? parts : MICROPHONE.parts,
    boxShapes: boxShapes.length ? boxShapes : MICROPHONE.boxShapes,
    sizes: sizes.length ? sizes : MICROPHONE.sizes,
    logoRules: {
      integratedMaxExtraColors: rules?.integratedMaxExtraColors ?? defaults.integratedMaxExtraColors,
      separateMaxLogoColors: rules?.separateMaxLogoColors ?? defaults.separateMaxLogoColors,
      nozzleMm: isNozzle(nozzle) ? nozzle : defaults.nozzleMm,
      reliefHeightMm: rules?.reliefHeightMm ?? defaults.reliefHeightMm,
      allowFlat: rules?.allowFlat ?? defaults.allowFlat,
    },
  }
}

/**
 * The "microphone" product and available filaments from the CMS. If the CMS is empty or doesn't respond,
 * the site keeps working with the configurator package's defaults.
 */
export const getMicCatalog = cache(async (): Promise<MicCatalog> => {
  const filaments = getFilaments()
  try {
    const payload = await getPayloadClient()
    const products = await payload.find({
      collection: 'products',
      where: { slug: { equals: MICROPHONE.slug } },
      limit: 1,
    })
    const doc = products.docs[0]
    return { product: doc ? toProductDefinition(doc) : MICROPHONE, filaments: await filaments }
  } catch (error) {
    console.error('[catalog] CMS unavailable, using defaults:', error)
    return { product: MICROPHONE, filaments: await filaments }
  }
})

/** Filaments marked as available in the admin, or the example palette if there are none or the CMS is down. */
export const getFilaments = cache(async (): Promise<Filament[]> => {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'filaments',
      where: { available: { equals: true } },
      sort: 'sortOrder',
      limit: 100,
      pagination: false,
    })
    return result.docs.length
      ? result.docs.map((f) => ({ id: String(f.id), name: f.name, hex: f.hex, material: f.material ?? undefined }))
      : EXAMPLE_FILAMENTS
  } catch (error) {
    console.error('[catalog] Could not load filaments, using the example palette:', error)
    return EXAMPLE_FILAMENTS
  }
})

export interface KeychainCatalog {
  product: KeychainDefinition
  filaments: Filament[]
}

function toKeychainDefinition(doc: Product): KeychainDefinition {
  const rules = doc.keychain
  const sizes = (rules?.sizes ?? []).map((size) => ({
    key: size.key,
    label: size.label,
    letterHeightMm: size.letterHeightMm,
    borderMm: size.borderMm,
    baseMm: size.baseMm,
    reliefMm: size.reliefMm,
    ring: { outerMm: size.ringOuterMm, holeMm: size.ringHoleMm },
    maxLengthMm: size.maxLengthMm,
  }))
  return {
    ...KEYCHAIN,
    slug: doc.slug,
    name: doc.name,
    sizes: sizes.length ? sizes : KEYCHAIN.sizes,
    maxChars: rules?.maxChars ?? KEYCHAIN.maxChars,
    maxEmojis: rules?.maxEmojis ?? KEYCHAIN.maxEmojis,
  }
}

/** The name keychain (from the admin, or the package defaults) and the available filaments. */
export const getKeychainCatalog = cache(async (): Promise<KeychainCatalog> => {
  const filaments = getFilaments()
  try {
    const payload = await getPayloadClient()
    const products = await payload.find({
      collection: 'products',
      where: { slug: { equals: KEYCHAIN.slug }, kind: { equals: 'keychain' } },
      limit: 1,
    })
    const doc = products.docs[0]
    return { product: doc ? toKeychainDefinition(doc) : KEYCHAIN, filaments: await filaments }
  } catch (error) {
    console.error('[catalog] CMS unavailable, using the keychain defaults:', error)
    return { product: KEYCHAIN, filaments: await filaments }
  }
})

export async function getProjects(options: { featuredOnly?: boolean; limit?: number } = {}) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'projects',
      where: options.featuredOnly ? { featured: { equals: true } } : undefined,
      sort: 'sortOrder',
      limit: options.limit ?? 24,
      depth: 1,
    })
    return result.docs as Project[]
  } catch (error) {
    console.error('[catalog] Could not load projects:', error)
    return []
  }
}

/** Hex of a filament looked up by name, or the one at the given index as a fallback. */
export function pickHex(filaments: Filament[], name: string, fallbackIndex = 0): string {
  const byName = filaments.find((f) => f.name.trim().toLowerCase() === name)
  return (byName ?? filaments[fallbackIndex % filaments.length])?.hex ?? '#1F1B16'
}
