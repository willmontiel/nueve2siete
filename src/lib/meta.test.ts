import { describe, expect, it } from 'vitest'
import { CATALOG_META, HOME_META, SITE_URL, productMeta } from './meta'
import { PRODUCTS, findProduct } from '../data/products'
import sitemap from '../../public/sitemap.xml?raw'

// Past these lengths search results cut the title and the description off
const TITLE_MAX = 60
const DESCRIPTION_MAX = 160

describe('page meta', () => {
  it('keeps every title and description short enough for a search result', () => {
    for (const meta of [HOME_META, CATALOG_META, ...PRODUCTS.map(productMeta)]) {
      expect(meta.title.length, meta.title).toBeLessThanOrEqual(TITLE_MAX)
      expect(meta.description.length, meta.description).toBeLessThanOrEqual(DESCRIPTION_MAX)
    }
  })

  it('names the piece and the brand in a product title', () => {
    expect(productMeta(findProduct('clicker-fidget')!).title).toBe('Clicker flor en tus colores | nueve2siete')
  })

  it('mentions the brand text only for a piece that takes one', () => {
    expect(productMeta(findProduct('portamicrofono')!).description).toContain('el texto de la caja')
    expect(productMeta(findProduct('clicker-fidget')!).description).not.toContain('texto')
  })

  it('keeps hidden pieces out of search engines', () => {
    expect(productMeta(findProduct('llavero-personalizado')!).noindex).toBe(true)
    expect(productMeta(findProduct('portamicrofono')!).noindex).toBe(false)
  })
})

describe('sitemap.xml', () => {
  it('lists the home, the catalog and every piece the catalog shows, and no hidden one', () => {
    expect(sitemap).toContain(`<loc>${SITE_URL}/</loc>`)
    expect(sitemap).toContain(`<loc>${SITE_URL}/catalogo</loc>`)
    for (const product of PRODUCTS) {
      const listed = sitemap.includes(`<loc>${SITE_URL}/catalogo/${product.slug}</loc>`)
      expect(listed, product.slug).toBe(!product.hidden)
    }
  })
})
