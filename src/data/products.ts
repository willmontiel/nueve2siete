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
  leadTimeDays: number
  dimensions: string
  modelType: 'mic-cube' | 'clicker' | 'frame' | 'keychain'
  parts: ProductPart[]
  badge?: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-mic',
    slug: 'portamicrofono',
    name: 'Cubo Portamicrófono Pro',
    tagline: 'Personalización de colores para creadores y podcasters',
    category: 'audio',
    basePrice: 45000,
    description: 'Cubo ergonómico con ajuste universal de espuma para micrófonos dinámicos estándar (Shure SM58, Behringer, etc). Impreso con alta densidad y acabado impecable.',
    leadTimeDays: 2,
    dimensions: '65 x 65 x 55 mm (Diámetro interno 42mm)',
    modelType: 'mic-cube',
    badge: 'Más Vendido',
    parts: [
      { id: 'body', name: 'Cuerpo Principal', defaultColorId: 'matte-black', description: 'Estructura exterior del cubo' },
      { id: 'faces', name: 'Caras Laterales', defaultColorId: 'brand-orange', description: 'Paneles de visualización' },
      { id: 'topRing', name: 'Borde Superior', defaultColorId: 'brand-yellow', description: 'Acabado y anillo superior' },
    ]
  },
  {
    id: 'prod-clicker',
    slug: 'clicker-fidget',
    name: 'Clicker Mecánico Sensorial',
    tagline: 'Fidget antiestrés con switch mecánico intercambiable',
    category: 'gadgets',
    basePrice: 18000,
    description: 'El gadget sensorial definitivo para concentración y escritorio. Diseñado con tolerancias de 0.2mm para un clic táctil ultra satisfactorio.',
    leadTimeDays: 1,
    dimensions: '28 x 28 x 35 mm',
    modelType: 'clicker',
    badge: 'Sensorial',
    parts: [
      { id: 'housing', name: 'Carcasa Exterior', defaultColorId: 'brand-lavender', description: 'Cuerpo del clicker' },
      { id: 'button', name: 'Botón Pulsador', defaultColorId: 'brand-orange', description: 'Pulsador táctil superior' },
      { id: 'keyring', name: 'Ojal / Argolla', defaultColorId: 'matte-black', description: 'Sujeción para llavero' },
    ]
  },
  {
    id: 'prod-frame',
    slug: 'portarretratos-minimal',
    name: 'Portarretratos Escandinavo',
    tagline: 'Diseño geométrico de mesa en 2 tonos',
    category: 'decor',
    basePrice: 32000,
    description: 'Portafotos de escritorio minimalista con ángulo de visualización optimizado. Para fotos estándar de 10x15 cm o polaroids.',
    leadTimeDays: 2,
    dimensions: '130 x 175 x 45 mm',
    modelType: 'frame',
    parts: [
      { id: 'outerFrame', name: 'Marco Exterior', defaultColorId: 'brand-cream', description: 'Bisel visible frontal' },
      { id: 'innerBorder', name: 'Acento Interior', defaultColorId: 'brand-orange', description: 'Línea de contraste fotográfico' },
      { id: 'stand', name: 'Soporte Posterior', defaultColorId: 'matte-black', description: 'Pata de apoyo de ángulo fijo' },
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
    parts: [
      { id: 'basePlate', name: 'Base Sólida', defaultColorId: 'matte-black', description: 'Placa base de fondo' },
      { id: 'raisedLetters', name: 'Letras en Relieve', defaultColorId: 'brand-yellow', description: 'Relieve tipográfico superior' },
      { id: 'ringLoop', name: 'Ojal de Sujeción', defaultColorId: 'brand-orange', description: 'Enganche para argolla metálica' },
    ]
  }
]
