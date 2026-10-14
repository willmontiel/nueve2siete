import type { CSSProperties } from 'react'
import { PRODUCTS } from '../data/products'
import { CustomPoster, Poster } from '../components/catalog/Poster'
import { CATALOG_META } from '../lib/meta'
import { usePageMeta } from '../lib/usePageMeta'

const PIECES = PRODUCTS.filter(product => !product.hidden)

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

// The catalog as a run of posters, one per piece, closing with the one for everything that is not here. With three
// pieces there is nothing to search or filter; bring those back when the catalog grows.
export function CatalogPage() {
  usePageMeta(CATALOG_META)
  return (
    <div className="px-4 sm:px-8 pt-8 sm:pt-14">
      <div className="mx-auto max-w-[90rem]">
        <header>
          <h1 className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-[-0.035em] text-fg">
            <span className="reveal-line">
              <span style={stagger(0)}>Ponle tus</span>
            </span>
            <span className="reveal-line">
              <span style={stagger(1)}>colores</span>
            </span>
          </h1>
          <p className="rise mt-6 sm:mt-8 text-xl sm:text-2xl leading-snug text-fg max-w-[36ch]" style={stagger(2)}>
            Elige una pieza, píntala como quieras y pídela por WhatsApp. ¿Buscas otra cosa? También la hacemos.
          </p>
        </header>

        <ul className="mt-12 sm:mt-20 flex flex-col gap-12 sm:gap-14">
          {PIECES.map((product, i) => (
            <li key={product.id}>
              <Poster product={product} index={i} />
            </li>
          ))}
          <li>
            <CustomPoster />
          </li>
        </ul>
      </div>
    </div>
  )
}
