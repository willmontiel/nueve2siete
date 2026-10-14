// Tags of the garland on the Home. The real list lives in Supabase (the projects table, src/lib/useProjects.ts);
// this one shows until Supabase answers, and whenever it cannot. For now these projects are made up and the
// photos are AI mood images (docs/deuda.md).

export type Occasion = 'party' | 'business' | 'event'

/** How an occasion reads on a tag */
export const OCCASION_LABELS: Record<Occasion, string> = {
  party: 'Fiesta',
  business: 'Empresa',
  event: 'Evento',
}

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
  /** Colour ids from COLORS, shown as swatches */
  colorIds: string[]
  /** Catalog product the visitor can design for themselves */
  productSlug?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'podcast-con-marca',
    title: 'Su marca en cada micrófono',
    occasion: 'business',
    summary:
      'Un podcast quería que su nombre se viera en cada video. Hicimos los portamicrófonos con su logo en los cuatro lados, en sus colores.',
    photo: '/photos/mic_studio.jpg',
    photoAlt: 'Micrófono de podcast con un portamicrófono de color terracota con el nombre del programa',
    photoPosition: '44% 50%',
    color: 'lavender',
    colorIds: ['naranja', 'blanco'],
    productSlug: 'portamicrofono',
  },
  {
    id: 'cumple-con-clic',
    title: 'Un clic para cada invitado',
    occasion: 'party',
    summary:
      'Recordatorios para un cumpleaños: clickers en los colores de la fiesta, uno para cada invitado, para llevar en el bolsillo.',
    photo: '/photos/clicker_hand.jpg',
    photoAlt: 'Manos sosteniendo un clicker naranja con un botón lavanda',
    photoPosition: '58% 50%',
    color: 'pink',
    colorIds: ['naranja', 'lavanda'],
    productSlug: 'clicker-fidget',
  },
  {
    id: 'boda-portafotos',
    title: 'La foto de cada mesa',
    occasion: 'event',
    summary:
      'Para una boda: portafotos que marcaban cada mesa y que al final cada invitado se llevó a casa con su foto.',
    photo: '/photos/portafoto_desk.jpg',
    photoAlt: 'Portafotos rosado sobre un escritorio de madera, con una foto de una pareja en la playa',
    photoPosition: '46% 50%',
    color: 'lime',
    colorIds: ['rosado', 'blanco'],
    productSlug: 'portafotos-margarita',
  },
  {
    id: 'kit-de-bienvenida',
    title: 'Bienvenida al equipo',
    occasion: 'business',
    summary:
      'Un kit para el primer día de trabajo: piezas con el logo de la empresa y en sus colores, una para cada persona nueva.',
    photo: '/photos/regalo_empaque.jpg',
    photoAlt: 'Caja de regalo con cinta de satén junto a otra caja abierta con piezas de colores',
    photoPosition: '62% 50%',
    color: 'pine',
    colorIds: ['blanco', 'naranja', 'mostaza'],
  },
]
