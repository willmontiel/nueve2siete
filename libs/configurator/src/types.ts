import type { Nozzle } from './printer'

/**
 * A product is described with data, not code: colorable parts, sizes and logo rules.
 * That way a keychain (or any other product) reuses the same configurator.
 */

export interface ProductPart {
  key: string
  label: string
}

export interface BoxShape {
  key: string
  label: string
}

export interface ProductSize {
  key: string
  label: string
  totalHeightMm: number
  box: { widthMm: number; heightMm: number; depthMm: number }
  headDiameterMm: number
  /** Printable logo area on the front face of the box. */
  logoArea: { widthMm: number; heightMm: number }
}

export interface LogoRules {
  /** Logo colors, on top of the box color, when box and logo come out of the same print. */
  integratedMaxExtraColors: number
  /** Logo colors when it's printed as a separate piece and glued on. */
  separateMaxLogoColors: number
  /** Nozzle used to print logos; sets the minimum detail (see NOZZLE_LIMITS). */
  nozzleMm: Nozzle
  reliefHeightMm: number
  allowFlat: boolean
}

export interface ProductDefinition {
  slug: string
  name: string
  parts: ProductPart[]
  boxShapes: BoxShape[]
  sizes: ProductSize[]
  logoRules: LogoRules
}

export interface Filament {
  id: string
  name: string
  /** #RRGGBB */
  hex: string
  material?: string
}

/** What the customer chose. `colors` maps each part key to a filament id. */
export interface Selection {
  sizeKey: string
  shapeKey: string
  colors: Record<string, string>
  text: string
}
