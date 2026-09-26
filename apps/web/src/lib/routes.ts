/**
 * The site's pages: the public URL visitors see (Spanish) and the folder under src/app that renders it (English).
 *
 * next.config.ts turns this map into rewrites (Spanish URL → English folder) and redirects (English path →
 * Spanish URL, so each page has a single address). Links, menus and the sitemap read it too: a URL changes here
 * and nowhere else.
 */
export const PAGES = {
  home: { url: '/', folder: '/' },
  microphones: { url: '/microfonos', folder: '/microphones' },
  designYourOwn: { url: '/disena-el-tuyo', folder: '/design-your-own' },
  projects: { url: '/trabajos', folder: '/projects' },
  about: { url: '/nosotros', folder: '/about' },
  contact: { url: '/contacto', folder: '/contact' },
  faq: { url: '/preguntas-frecuentes', folder: '/faq' },
  privacyPolicy: { url: '/legal/tratamiento-de-datos', folder: '/legal/privacy-policy' },
} as const satisfies Record<string, { url: string; folder: string }>

export type PageKey = keyof typeof PAGES

/** Public URL of each page: `routes.contact` → '/contacto'. */
export const routes = Object.fromEntries(Object.entries(PAGES).map(([key, page]) => [key, page.url])) as {
  [K in PageKey]: (typeof PAGES)[K]['url']
}

/** Pages whose folder name differs from their URL: the ones that need a rewrite and a redirect. */
export function translatedPages(): { url: string; folder: string }[] {
  return Object.values(PAGES).filter((page) => page.url !== page.folder)
}
