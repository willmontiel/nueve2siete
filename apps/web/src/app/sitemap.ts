import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/site'

const routes = [
  '',
  '/microfonos',
  '/trabajos',
  '/nosotros',
  '/contacto',
  '/preguntas-frecuentes',
  '/disena-el-tuyo',
  '/legal/tratamiento-de-datos',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
