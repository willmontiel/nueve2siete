export interface FilamentColor {
  id: string
  name: string
  hex: string
  isBrandColor?: boolean
}

// Paleta oficial de colores disponibles
export const FILAMENT_COLORS: FilamentColor[] = [
  // Colores Oficiales de la marca (Página 3)
  { id: 'brand-orange', name: 'Naranja Nueve2Siete', hex: '#DE5B2B', isBrandColor: true },
  { id: 'brand-lavender', name: 'Lavanda Nueve2Siete', hex: '#9FAEE9', isBrandColor: true },
  { id: 'brand-yellow', name: 'Mostaza Nueve2Siete', hex: '#EEBA29', isBrandColor: true },
  { id: 'brand-cream', name: 'Crema Nueve2Siete', hex: '#F6F3EF', isBrandColor: true },
  { id: 'brand-purple', name: 'Violeta Suave', hex: '#8576EA', isBrandColor: true },

  // Básicos y complementarios de alta demanda
  { id: 'matte-black', name: 'Negro Mate', hex: '#1C1C1E' },
  { id: 'pure-white', name: 'Blanco Puro', hex: '#FFFFFF' },
  { id: 'silver-gray', name: 'Gris Titanio', hex: '#8E8E93' },
  { id: 'forest-green', name: 'Verde Pino', hex: '#2D5A27' },
  { id: 'ruby-red', name: 'Rojo Carmesí', hex: '#C0292B' },
  { id: 'electric-blue', name: 'Azul Eléctrico', hex: '#0062FF' },
  { id: 'pastel-pink', name: 'Rosa Pastel', hex: '#F8BBD0' },
]

export interface ProductPart {
  id: string
  name: string
  defaultColorId: string
  description?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  category: 'audio' | 'gadgets' | 'decor' | 'accessories'
  basePrice: number // en COP (pesos colombianos)
  description: string
  dimensions: string
  leadTimeDays: number
  modelType: 'mic-cube' | 'clicker' | 'clicker-sakura' | 'frame' | 'keychain'
  badge?: string
  hidden?: boolean
  parts: ProductPart[]
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
    name: 'Adaptador Portamicrófono Inalámbrico',
    tagline: 'Convierte tu micrófono inalámbrico en un micrófono de mano para entrevistas',
    category: 'audio',
    basePrice: 55000,
    description: 'Adaptador ergonómico de mano para micrófonos inalámbricos (DJI Mic, Rode Wireless y similares). Diseñado con caja central de 4 × 3 × 4 cm para el nombre de tu marca, mango estilizado y cabeza vocal.',
    leadTimeDays: 2,
    dimensions: 'Caja: 4 × 3 × 4 cm | Mango: 5.6 cm (Ø 1.4 cm) | Cabeza: 2.7 × 2.5 cm',
    modelType: 'mic-cube',
    badge: 'Top Creadores',
    customTextConfig: {
      label: 'Nombre de tu Marca o Canal',
      placeholder: 'Ej. Mucchi, Sierra, Mi Podcast',
      defaultText: 'Tu Marca',
      maxLength: 18,
    },
    parts: [
      { id: 'handle', name: 'Mango', defaultColorId: 'brand-cream', description: 'Mango cilíndrico de 5.6 cm (Ø 1.4 cm)' },
      { id: 'box', name: 'Caja de Marca', defaultColorId: 'brand-purple', description: 'Caja central de 4 × 3 × 4 cm personalizada' },
      { id: 'head', name: 'Cabeza', defaultColorId: 'brand-cream', description: 'Cápsula de 2.7 × 2.5 cm' },
    ]
  },
  {
    id: 'prod-clicker',
    slug: 'clicker-fidget',
    name: 'Clicker Flor',
    tagline: 'Fidget sensorial con switch mecánico y diseño de flor',
    category: 'gadgets',
    basePrice: 22000,
    description: 'Clicker sensorial con switch mecánico de alta durabilidad. Diseño de flor con centro táctil y ojal integrado para llavero.',
    leadTimeDays: 1,
    dimensions: 'Flor: 5.8 × 6.0 cm | Grosor: 1.8 cm | Botón: Ø 2.4 cm',
    modelType: 'clicker',
    badge: 'Sensorial',
    parts: [
      { id: 'base', name: 'Base', defaultColorId: 'pastel-pink', description: 'Cuerpo de la flor con ojal' },
      { id: 'center', name: 'Centro', defaultColorId: 'brand-yellow', description: 'Botón pulsador central' },
    ]
  },
  {
    id: 'prod-frame',
    slug: 'portafotos-margarita',
    name: 'Portafotos Margarita',
    tagline: 'Soporte floral para fotos Polaroid o recordatorios',
    category: 'decor',
    basePrice: 28000,
    description: 'Soporte de mesa con diseño floral de margarita. Cuenta con una ranura central integrada de 2 mm para sostener fotos estilo Polaroid, tarjetas especiales o recordatorios con centro táctil en ambas caras.',
    leadTimeDays: 2,
    dimensions: 'Margarita: 4.9 × 2.5 cm | Grosor: 1.3 cm | Ranura: 2 mm',
    modelType: 'frame',
    badge: 'Decorativo',
    parts: [
      { id: 'base', name: 'Base', defaultColorId: 'pure-white', description: 'Cuerpo floral de pétalos con ranura para foto' },
      { id: 'center', name: 'Centro', defaultColorId: 'brand-yellow', description: 'Centro semi-circular en ambas caras' },
    ]
  },
  {
    id: 'prod-keychain',
    slug: 'llavero-personalizado',
    name: 'Llavero Tipográfico',
    tagline: 'Relieve de doble capa con tus colores favoritos',
    category: 'accessories',
    basePrice: 15000,
    description: 'Llavero resistente con argolla reforzada. Base sólida con letras y elementos destacados en relieve.',
    leadTimeDays: 1,
    dimensions: '75 x 25 x 6 mm',
    modelType: 'keychain',
    hidden: true,
    parts: [
      { id: 'basePlate', name: 'Base Sólida', defaultColorId: 'matte-black', description: 'Placa base de fondo' },
      { id: 'raisedLetters', name: 'Letras en Relieve', defaultColorId: 'brand-yellow', description: 'Relieve tipográfico superior' },
      { id: 'ringLoop', name: 'Ojal de Sujeción', defaultColorId: 'brand-orange', description: 'Enganche para argolla metálica' },
    ]
  }
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
