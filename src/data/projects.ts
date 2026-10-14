// Pages of the magazine on the Home. These projects are made up and the photos are AI mood images: both are
// placeholders until the real projects and photos arrive (docs/deuda.md). In phase 6 they move to Supabase.

export type Occasion = 'Fiesta' | 'Empresa' | 'Evento'

/** Brand colours a project page can be printed on; each page picks its own text colour for contrast */
export type PageColor = 'lavender' | 'pink' | 'lime' | 'pine'

export interface Project {
  id: string
  /** Set large on the page: 28 characters at most, so it never takes a third line */
  title: string
  occasion: Occasion
  summary: string
  photo: string
  photoAlt: string
  /** CSS object-position that keeps the subject in a portrait crop of the landscape photo */
  photoPosition?: string
  color: PageColor
  /** Filament ids from FILAMENT_COLORS, shown as swatches */
  colorIds: string[]
  /** Catalog product the visitor can design for themselves */
  productSlug?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'podcast-con-marca',
    title: 'Su marca en cada micrófono',
    occasion: 'Empresa',
    summary:
      'Un podcast quería que su nombre se viera en cada video. Hicimos los portamicrófonos con su logo en los cuatro lados, en sus colores.',
    photo: '/photos/mic_studio.jpg',
    photoAlt: 'Micrófono de podcast con un portamicrófono de color terracota con el nombre del programa',
    photoPosition: '44% 50%',
    color: 'lavender',
    colorIds: ['brand-orange', 'brand-cream'],
    productSlug: 'portamicrofono',
  },
  {
    id: 'cumple-con-clic',
    title: 'Un clic para cada invitado',
    occasion: 'Fiesta',
    summary:
      'Recordatorios para un cumpleaños: clickers en los colores de la fiesta, uno para cada invitado, para llevar en el bolsillo.',
    photo: '/photos/clicker_hand.jpg',
    photoAlt: 'Manos sosteniendo un clicker naranja con un botón lavanda',
    photoPosition: '58% 50%',
    color: 'pink',
    colorIds: ['brand-orange', 'brand-lavender'],
    productSlug: 'clicker-fidget',
  },
  {
    id: 'boda-portafotos',
    title: 'La foto de cada mesa',
    occasion: 'Evento',
    summary:
      'Para una boda: portafotos que marcaban cada mesa y que al final cada invitado se llevó a casa con su foto.',
    photo: '/photos/portafoto_desk.jpg',
    photoAlt: 'Portafotos rosado sobre un escritorio de madera, con una foto de una pareja en la playa',
    photoPosition: '46% 50%',
    color: 'lime',
    colorIds: ['pastel-pink', 'brand-cream'],
    productSlug: 'portafotos-margarita',
  },
  {
    id: 'kit-de-bienvenida',
    title: 'Bienvenida al equipo',
    occasion: 'Empresa',
    summary:
      'Un kit para el primer día de trabajo: piezas con el logo de la empresa y en sus colores, una para cada persona nueva.',
    photo: '/photos/regalo_empaque.jpg',
    photoAlt: 'Caja de regalo con cinta de satén junto a otra caja abierta con piezas de colores',
    photoPosition: '62% 50%',
    color: 'pine',
    colorIds: ['brand-cream', 'brand-orange', 'brand-yellow'],
  },
]
