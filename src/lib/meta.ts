import type { Product } from '../data/products'

export const SITE_URL = 'https://nueve2siete.com'

export interface PageMeta {
  /** The browser tab and the search result's headline: 60 characters at most */
  title: string
  /** The search result's summary: 160 characters at most */
  description: string
  /** Keeps a page reachable by link out of search engines */
  noindex?: boolean
}

// Provisional copy, to be reviewed with the owners (docs/deuda.md). The share preview (WhatsApp, social) reads
// the static tags in index.html instead, since its crawlers do not run the site's script.
export const HOME_META: PageMeta = {
  title: 'nueve2siete | Recordatorios, merch y piezas a medida',
  description:
    'Recordatorios para fiestas, merch para empresas y piezas a medida, en los colores que elijas. Cuéntanos tu idea por WhatsApp. Hecho en Colombia.',
}

export const CATALOG_META: PageMeta = {
  title: 'Catálogo de piezas para personalizar | nueve2siete',
  description:
    'Portamicrófono con tu marca, clicker flor y portafotos margarita. Elige los colores de cada pieza y pídela por WhatsApp.',
}

export function productMeta(product: Product): PageMeta {
  const occasion = product.occasion.charAt(0).toLowerCase() + product.occasion.slice(1)
  const extra = product.customTextConfig ? ' y el texto de la caja,' : ''
  return {
    title: `${product.name} en tus colores | nueve2siete`,
    description: `${product.name}: ${occasion}. Elige el color de cada parte${extra} y pídelo por WhatsApp.`,
    noindex: Boolean(product.hidden),
  }
}
