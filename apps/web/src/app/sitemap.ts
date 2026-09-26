import type { MetadataRoute } from 'next'

import { PAGES } from '@/lib/routes'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).map(({ url }) => ({
    url: url === '/' ? SITE_URL : `${SITE_URL}${url}`,
    changeFrequency: 'monthly',
    priority: url === '/' ? 1 : 0.7,
  }))
}
