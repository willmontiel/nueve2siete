import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, type PageMeta } from './meta'

function headTag<T extends HTMLElement>(selector: string, create: () => T): T {
  return document.head.querySelector<T>(selector) ?? document.head.appendChild(create())
}

// Sets the tab title, the description, the canonical address (without the ?colores of a poster link) and, for
// pages kept out of search, a noindex. index.html carries the home's values for the first paint.
export function usePageMeta({ title, description, noindex = false }: PageMeta) {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = title
    headTag('meta[name="description"]', () => Object.assign(document.createElement('meta'), { name: 'description' })).content =
      description
    headTag('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' })).href =
      `${SITE_URL}${pathname}`
    const robots = document.head.querySelector('meta[name="robots"]')
    if (noindex && !robots) document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex' }))
    if (!noindex) robots?.remove()
  }, [title, description, noindex, pathname])
}
