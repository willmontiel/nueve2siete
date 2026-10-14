import { useState, type CSSProperties } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, MessageCircle, Pause, RotateCw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { PRODUCTS, findProduct, type PartColors, type Product } from '../data/products'
import { ProductViewer3D } from '../components/3d/ProductViewer3D'
import { FIELDS } from '../components/catalog/fields'
import { ColorPicker, PartPicker, TextPicker } from '../components/product/Pickers'
import { colorsFromParam } from '../lib/colorway'
import { buildOrderMessage, formatCOP } from '../lib/order'
import { logOrder, orderCode, orderRow } from '../lib/orderLog'
import { whatsappUrl } from '../lib/contact'
import { productMeta } from '../lib/meta'
import { usePageMeta } from '../lib/usePageMeta'

const stagger = (i: number) => ({ '--i': i }) as CSSProperties

const HINTS: Record<Product['modelType'], string> = {
  'mic-cube': 'Arrástrala para verla por todos lados',
  clicker: 'Toca el centro para oír el clic',
  frame: 'Arrástrala para verla por todos lados',
  keychain: 'Arrástrala para verla por todos lados',
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [params] = useSearchParams()
  const product = findProduct(slug)
  if (!product) return <Navigate to="/catalogo" replace />
  // Keyed by product so moving to another model starts from that model's own colours (or the poster's)
  return <ProductConfigurator key={product.id} product={product} startColors={colorsFromParam(product, params.get('colores'))} />
}

function ProductConfigurator({ product, startColors }: { product: Product; startColors: PartColors }) {
  usePageMeta(productMeta(product))
  const reduceMotion = useReducedMotion()
  const [selectedPartId, setSelectedPartId] = useState(product.parts[0].id)
  const [colors, setColors] = useState(startColors)
  const [customText, setCustomText] = useState(product.customTextConfig?.defaultText ?? '')
  const [autoRotate, setAutoRotate] = useState(!reduceMotion)
  const selectedPart = product.parts.find(part => part.id === selectedPartId)!

  const order = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#DE5B2B', '#9FAFE9', '#EFBB29', '#E890B3'],
      disableForReducedMotion: true,
    })
    const code = orderCode()
    const message = buildOrderMessage(product, colors, customText, code)
    // WhatsApp opens first, inside the click, so no popup blocker stops it; the log is written after
    window.open(whatsappUrl(message), '_blank', 'noopener')
    void logOrder(orderRow(product, colors, customText, code, message))
  }

  return (
    <div className="px-4 sm:px-8 pt-4 sm:pt-6">
      <div className="mx-auto max-w-[90rem]">
        <Link to="/catalogo" className="inline-flex items-center gap-2 min-h-11 text-lg font-semibold text-fg hover:text-accent transition-colors">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Catálogo
        </Link>

        <div className="mt-2 sm:mt-4 grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-12 xl:gap-x-20 items-start">
          {/* The piece stays in sight while the colours are chosen below it (beside it on a wide screen) */}
          {/* Whole pixels only: at a fractional size Chrome draws a hairline of the field along the edge of this sticky
              layer, beside the 3D canvas */}
          <div style={stagger(0)} className="rise sticky top-0 z-10 w-[round(down,100%,1px)] bg-ground pb-3 lg:top-6 lg:pb-0">
            <div
              className={`relative overflow-hidden rounded-[2.5rem] h-[round(down,42svh,1px)] min-h-64 lg:h-[round(down,calc(100svh-9rem),1px)] lg:max-h-[54rem] ${FIELDS[product.field].bg}`}
            >
              <ProductViewer3D product={product} colors={colors} customText={customText} autoRotate={autoRotate} still={!!reduceMotion} />
              <button
                type="button"
                aria-pressed={autoRotate}
                aria-label="Girar sola"
                onClick={() => setAutoRotate(on => !on)}
                className="absolute top-4 right-4 grid place-items-center w-12 h-12 rounded-full bg-night text-cream transition-transform duration-200 hover:scale-110 active:scale-95"
              >
                {autoRotate ? <Pause className="w-5 h-5" aria-hidden="true" /> : <RotateCw className="w-5 h-5" aria-hidden="true" />}
              </button>
              <p className="pointer-events-none absolute bottom-4 inset-x-4 text-center text-base font-semibold text-night">
                {HINTS[product.modelType]}
              </p>
            </div>
          </div>

          <div className="pt-6 lg:pt-0">
            <h1 style={stagger(0)} className="rise font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.035em] text-fg text-balance">
              {product.name}
            </h1>
            <p style={stagger(1)} className="rise mt-5 text-xl sm:text-2xl leading-snug font-semibold text-fg">{product.occasion}</p>
            <p style={stagger(2)} className="rise mt-4 text-lg leading-relaxed text-fg max-w-[46ch]">{product.description}</p>
            <p style={stagger(3)} className="rise mt-3 text-base text-fg-muted">{product.dimensions}</p>

            <div style={stagger(4)} className="rise mt-20 flex flex-col gap-12">
              <PartPicker product={product} colors={colors} selected={selectedPartId} onSelect={setSelectedPartId} />
              <ColorPicker
                partName={selectedPart.name}
                current={colors[selectedPartId]}
                onPick={id => setColors(prev => ({ ...prev, [selectedPartId]: id }))}
              />
              {product.customTextConfig && <TextPicker config={product.customTextConfig} value={customText} onChange={setCustomText} />}
            </div>

            {/* Always at hand: on a phone it rides the bottom of the screen until the column ends */}
            <div className="sticky bottom-0 z-10 mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 bg-ground pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
              <p className="flex flex-col">
                <span className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none text-fg">{formatCOP(product.basePrice)}</span>
                <span className="mt-1 text-sm sm:text-base text-fg-muted">valor de referencia</span>
              </p>
              <button
                type="button"
                onClick={order}
                className="shrink-0 inline-flex items-center gap-2.5 min-h-14 px-5 sm:px-7 rounded-full bg-fg text-ground text-base sm:text-lg font-semibold transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                Pedir por WhatsApp
              </button>
            </div>
          </div>
        </div>

        <OtherPieces current={product} />
      </div>
    </div>
  )
}

function OtherPieces({ current }: { current: Product }) {
  const others = PRODUCTS.filter(p => !p.hidden && p.id !== current.id)
  return (
    <section aria-labelledby="otras-piezas" className="mt-24 sm:mt-32">
      <h2 id="otras-piezas" className="font-display text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.92] tracking-[-0.03em] text-fg">
        Otras piezas
      </h2>
      <ul className="mt-8 sm:mt-10 grid md:grid-cols-2 gap-4 sm:gap-6">
        {others.map(other => (
          <li key={other.id}>
            <Link
              to={`/catalogo/${other.slug}`}
              className={`group flex flex-col justify-between gap-10 min-h-60 h-full p-8 sm:p-10 rounded-[2.5rem] text-night ${FIELDS[other.field].bg}`}
            >
              <span className="font-display text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[0.9] tracking-[-0.03em]">{other.name}</span>
              <span className="flex items-end justify-between gap-6 text-xl font-semibold leading-snug">
                {other.occasion}
                <ArrowRight className="w-8 h-8 shrink-0 transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
