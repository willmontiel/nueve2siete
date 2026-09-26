import type { Filament, ProductDefinition } from '@nueve2siete/configurator'

/** Options the website sends to the engine. They come from the CMS: the browser can't change them. */
export interface EngineOptions {
  sizes: { key: string; logo_width_mm: number; logo_height_mm: number }[]
  max_colors: number
  nozzle_mm: number
  filaments: { id: string; hex: string }[]
}

export function engineOptions(product: ProductDefinition, filaments: Filament[]): EngineOptions {
  return {
    sizes: product.sizes.map((size) => ({
      key: size.key,
      logo_width_mm: size.logoArea.widthMm,
      logo_height_mm: size.logoArea.heightMm,
    })),
    // The absolute maximum; whether it also fits in the same print as the box is decided by chooseFabricationMode.
    max_colors: product.logoRules.separateMaxLogoColors,
    nozzle_mm: product.logoRules.nozzleMm,
    filaments: filaments.map(({ id, hex }) => ({ id, hex })),
  }
}
