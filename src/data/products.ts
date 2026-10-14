export interface Color {
  id: string
  name: string
  hex: string
}

// Common colour names the customer picks from. The team has many filaments and buys any colour it lacks, so the
// list is what customers ask for, not an inventory. Names and hexes travel in the WhatsApp order.
// Ordered round the colour wheel, with the neutrals at the end.
export const COLORS: Color[] = [
  { id: 'rojo', name: 'Rojo', hex: '#C8102E' },
  { id: 'vinotinto', name: 'Vinotinto', hex: '#7A1F2E' },
  { id: 'naranja', name: 'Naranja', hex: '#DE5B2B' },
  { id: 'durazno', name: 'Durazno', hex: '#F4A27C' },
  { id: 'mostaza', name: 'Mostaza', hex: '#EFBB29' },
  { id: 'amarillo', name: 'Amarillo', hex: '#F7D73B' },
  { id: 'verde-limon', name: 'Verde limón', hex: '#CCD65F' },
  { id: 'verde', name: 'Verde', hex: '#2BA84A' },
  { id: 'verde-oscuro', name: 'Verde oscuro', hex: '#336F52' },
  { id: 'turquesa', name: 'Turquesa', hex: '#13A8A8' },
  { id: 'azul-cielo', name: 'Azul cielo', hex: '#8CC7EA' },
  { id: 'azul', name: 'Azul', hex: '#1F5FBF' },
  { id: 'azul-oscuro', name: 'Azul oscuro', hex: '#1F2A5C' },
  { id: 'lavanda', name: 'Lavanda', hex: '#9FAFE9' },
  { id: 'morado', name: 'Morado', hex: '#6A44B8' },
  { id: 'fucsia', name: 'Fucsia', hex: '#E0218A' },
  { id: 'rosado', name: 'Rosado', hex: '#E890B3' },
  { id: 'cafe', name: 'Café', hex: '#7B5236' },
  { id: 'beige', name: 'Beige', hex: '#E6D7B3' },
  { id: 'blanco', name: 'Blanco', hex: '#FFFFFF' },
  { id: 'gris', name: 'Gris', hex: '#8E9089' },
  { id: 'negro', name: 'Negro', hex: '#1C1C1E' },
]

export function findColor(id: string): Color | undefined {
  return COLORS.find(c => c.id === id)
}

/** Brand colours a poster and a product stage can be printed on; all take dark text */
export type Field = 'lavender' | 'mustard' | 'pink' | 'lime'

export interface ProductPart {
  id: string
  name: string
}

/** A colour id for every part, keyed by part id */
export type PartColors = Record<string, string>

export interface Product {
  id: string
  slug: string
  /** Set huge on its poster: 20 characters at most, so it never takes a third line */
  name: string
  /** Who it is for, in one line under the name */
  occasion: string
  description: string
  dimensions: string
  /** In COP. Provisional prices, kept for now (docs/deuda.md) */
  basePrice: number
  modelType: 'mic-cube' | 'clicker' | 'frame' | 'keychain'
  field: Field
  hidden?: boolean
  parts: ProductPart[]
  /** Combinations offered on the poster; the first one is where the configurator starts */
  colorways: PartColors[]
  customTextConfig?: {
    label: string
    placeholder: string
    defaultText: string
    maxLength: number
  }
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-mic',
    slug: 'portamicrofono',
    name: 'Portamicrófono',
    occasion: 'Para tu podcast, tu canal o tu empresa',
    description:
      'Convierte tu micrófono inalámbrico (DJI Mic, Rode Wireless y similares) en uno de mano para entrevistas. La caja lleva el nombre de tu marca en sus cuatro caras.',
    dimensions: 'Caja de 4 × 3 × 4 cm, mango de 5.6 cm y cabeza de 2.7 × 2.5 cm',
    basePrice: 55000,
    modelType: 'mic-cube',
    field: 'mustard',
    customTextConfig: {
      label: 'Tu marca o tu canal',
      placeholder: 'Ej. Mi Podcast',
      defaultText: 'Tu Marca',
      maxLength: 18,
    },
    parts: [
      { id: 'handle', name: 'Mango' },
      { id: 'box', name: 'Caja' },
      { id: 'head', name: 'Cabeza' },
    ],
    colorways: [
      { handle: 'negro', box: 'lavanda', head: 'negro' },
      { handle: 'blanco', box: 'naranja', head: 'blanco' },
      { handle: 'azul-oscuro', box: 'rosado', head: 'azul-oscuro' },
      { handle: 'blanco', box: 'verde-oscuro', head: 'blanco' },
    ],
  },
  {
    id: 'prod-clicker',
    slug: 'clicker-fidget',
    name: 'Clicker flor',
    occasion: 'Un recordatorio para cumpleaños y fiestas',
    description:
      'Una flor con un botón en el centro que hace clic cada vez que lo presionas. Tiene un ojal para llevarla como llavero.',
    dimensions: 'Flor de 5.8 × 6 cm y 1.8 cm de grosor',
    basePrice: 22000,
    modelType: 'clicker',
    field: 'lavender',
    parts: [
      { id: 'base', name: 'Flor' },
      { id: 'center', name: 'Centro' },
    ],
    colorways: [
      { base: 'rosado', center: 'amarillo' },
      { base: 'naranja', center: 'blanco' },
      { base: 'azul-cielo', center: 'mostaza' },
      { base: 'morado', center: 'verde-limon' },
    ],
  },
  {
    id: 'prod-frame',
    slug: 'portafotos-margarita',
    name: 'Portafotos margarita',
    occasion: 'Para bodas, bautizos y primeras comuniones',
    description:
      'Una margarita de mesa con una ranura para sostener una foto tipo Polaroid, una tarjeta o el recuerdo de tu evento.',
    dimensions: 'Margarita de 4.9 × 2.5 cm y 1.3 cm de grosor, con una ranura de 2 mm',
    basePrice: 28000,
    modelType: 'frame',
    field: 'pink',
    parts: [
      { id: 'base', name: 'Pétalos' },
      { id: 'center', name: 'Centro' },
    ],
    colorways: [
      { base: 'blanco', center: 'amarillo' },
      { base: 'lavanda', center: 'mostaza' },
      { base: 'naranja', center: 'blanco' },
      { base: 'verde-limon', center: 'naranja' },
    ],
  },
  {
    id: 'prod-keychain',
    slug: 'llavero-personalizado',
    name: 'Llavero con nombre',
    occasion: 'Con tu nombre o el de tu marca',
    description: 'Un llavero con letras en relieve en dos colores y su argolla.',
    dimensions: '7.5 × 2.5 cm y 6 mm de grosor',
    basePrice: 15000,
    modelType: 'keychain',
    field: 'lime',
    hidden: true,
    parts: [
      { id: 'basePlate', name: 'Base' },
      { id: 'raisedLetters', name: 'Letras' },
      { id: 'ringLoop', name: 'Argolla' },
    ],
    colorways: [
      { basePlate: 'negro', raisedLetters: 'amarillo', ringLoop: 'naranja' },
      { basePlate: 'blanco', raisedLetters: 'azul', ringLoop: 'rojo' },
    ],
  },
]

// Links shared before a slug changed keep landing on the right product
const SLUG_ALIASES: Record<string, string> = {
  'portarretratos-minimal': 'portafotos-margarita',
}

export function findProduct(slug: string | undefined): Product | undefined {
  if (!slug) return undefined
  const target = SLUG_ALIASES[slug] ?? slug
  return PRODUCTS.find(p => p.slug === target)
}
