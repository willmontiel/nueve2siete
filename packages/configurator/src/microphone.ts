import type { Filament, ProductDefinition, ProductSize } from './types'

/** Build volume of the Bambu Lab A1. */
export const BAMBU_A1_BUILD_VOLUME_MM = { x: 256, y: 256, z: 256 } as const

/** Margin between the box edge and the logo, per side. */
export const LOGO_MARGIN_MM = 4

function micSize(
  key: string,
  label: string,
  totalHeightMm: number,
  boxMm: number,
  headDiameterMm: number,
): ProductSize {
  return {
    key,
    label,
    totalHeightMm,
    box: { widthMm: boxMm, heightMm: boxMm, depthMm: boxMm },
    headDiameterMm,
    logoArea: { widthMm: boxMm - LOGO_MARGIN_MM * 2, heightMm: boxMm - LOGO_MARGIN_MM * 2 },
  }
}

/**
 * Provisional dimensions sized for the A1: each part (head, box, handle) fits comfortably in
 * 256 mm, and the full XL is shorter than the Z axis. Edited later from the CMS.
 */
export const MICROPHONE: ProductDefinition = {
  slug: 'microfono',
  name: 'Micrófono personalizado',
  parts: [
    { key: 'head', label: 'Cabeza' },
    { key: 'box', label: 'Caja' },
    { key: 'handle', label: 'Palo' },
  ],
  // The star was dropped for now (2026-09): cube only. The model supports more shapes later.
  boxShapes: [{ key: 'cube', label: 'Cubo' }],
  sizes: [
    micSize('S', 'Small', 150, 45, 36),
    micSize('M', 'Medium', 190, 55, 44),
    micSize('L', 'Large', 220, 65, 52),
    micSize('XL', 'Extra Large', 250, 75, 60),
  ],
  logoRules: {
    integratedMaxExtraColors: 3,
    separateMaxLogoColors: 4,
    nozzleMm: 0.4,
    reliefHeightMm: 1,
    allowFlat: true,
  },
}

/**
 * Starter palette, ordered by hue, with colors close to Bambu Lab PLA. Not all of them need to be in
 * stock: if an order asks for one we don't have, we buy it (confirmed with the customer). Edited in the CMS.
 */
export const EXAMPLE_FILAMENTS: Filament[] = [
  { id: 'white', name: 'Blanco', hex: '#FAFAF7' },
  { id: 'beige', name: 'Beige', hex: '#F2E3D0' },
  { id: 'light-gray', name: 'Gris claro', hex: '#D1D3D5' },
  { id: 'silver', name: 'Plata', hex: '#A6A9AA' },
  { id: 'gray', name: 'Gris', hex: '#6E706B' },
  { id: 'black', name: 'Negro', hex: '#1F1B16' },
  { id: 'brown', name: 'Marrón', hex: '#6F5034' },
  { id: 'wine', name: 'Vinotinto', hex: '#8C1D2F' },
  { id: 'red', name: 'Rojo', hex: '#C8281E' },
  { id: 'orange', name: 'Naranja', hex: '#E95C21' },
  { id: 'light-orange', name: 'Naranja claro', hex: '#FF9016' },
  { id: 'gold', name: 'Dorado', hex: '#D9AE55' },
  { id: 'yellow', name: 'Amarillo', hex: '#E9BF0F' },
  { id: 'lemon-yellow', name: 'Amarillo limón', hex: '#F4E92A' },
  { id: 'lime-green', name: 'Verde lima', hex: '#A8C81E' },
  { id: 'green', name: 'Verde', hex: '#2FA85A' },
  { id: 'dark-green', name: 'Verde oscuro', hex: '#2E6B3A' },
  { id: 'turquoise', name: 'Turquesa', hex: '#00A9AE' },
  { id: 'cyan', name: 'Cian', hex: '#0A9AD8' },
  { id: 'blue', name: 'Azul', hex: '#2F5BD3' },
  { id: 'dark-blue', name: 'Azul oscuro', hex: '#16296B' },
  { id: 'lilac', name: 'Lila', hex: '#A9B6EE' },
  { id: 'purple', name: 'Morado', hex: '#5E43B7' },
  { id: 'magenta', name: 'Magenta', hex: '#D6177F' },
  { id: 'pink', name: 'Rosa', hex: '#F29BBE' },
].map((filament) => ({ ...filament, material: 'PLA Basic' }))
