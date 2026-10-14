import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { findColor, type PartColors, type Product } from '../../data/products'
import { colorsToParam } from '../../lib/colorway'
import { whatsappUrl } from '../../lib/contact'
import { formatCOP } from '../../lib/order'
import { ProductViewer3D } from '../3d/ProductViewer3D'
import { Ribbon } from '../Ribbon'
import { FIELDS } from './fields'

// Faint ribbons behind the posters (viewBox 1400 × 900), each entering from an edge and looping once
const POSTER_RIBBONS = [
  'M -80 760 C 220 860, 520 820, 640 640 C 740 490, 660 330, 540 360 C 420 390, 470 560, 640 560 C 900 560, 1100 300, 1480 180',
  'M 1480 760 C 1180 860, 880 820, 760 640 C 660 490, 740 330, 860 360 C 980 390, 930 560, 760 560 C 500 560, 300 300, -80 180',
  'M 300 -80 C 260 200, 420 420, 640 460 C 820 490, 900 360, 820 300 C 720 230, 620 380, 760 470 C 960 600, 1200 640, 1480 820',
]

const CUSTOM_RIBBON =
  'M -80 220 C 240 120, 560 180, 700 360 C 800 490, 720 640, 600 600 C 480 560, 540 400, 700 420 C 960 450, 1160 720, 1480 700'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

// The parts of a poster arrive one after another as it comes into view: the name, the piece, then the facts
const rise: Variants = {
  hidden: { opacity: 0, y: 32 },
  shown: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.08, ease: EASE_OUT } }),
}

// The piece drops in, turning, and settles at its tilt (degrees)
const drop: Variants = {
  hidden: (tilt: number) => ({ opacity: 0, y: -48, rotate: tilt * 3 }),
  shown: (tilt: number) => ({ opacity: 1, y: 0, rotate: tilt, transition: { duration: 0.9, delay: 0.1, ease: EASE_OUT } }),
}

/** Props that play the poster's entrance once it has been seen, or show it settled under reduced motion */
function entrance(seen: boolean, reduceMotion: boolean | null) {
  return { initial: reduceMotion ? false : 'hidden', animate: seen || reduceMotion ? 'shown' : 'hidden' } as const
}

function PosterRibbon({ d, className, play }: { d: string; className: string; play: boolean }) {
  return (
    <Ribbon
      d={d}
      viewBox="0 0 1400 900"
      preserveAspectRatio="xMidYMid slice"
      strokeWidth={90}
      className={`absolute inset-0 -z-10 w-full h-full ${className}`}
      duration={2}
      play={play}
    />
  )
}

/** What a screen reader says for a combination: "Mango: Negro, Caja: Lavanda, Cabeza: Negro" */
function describe(product: Product, colors: PartColors) {
  return product.parts.map(part => `${part.name}: ${findColor(colors[part.id])?.name}`).join(', ')
}

// One piece as a loud, flat poster: its name huge, the piece itself turning over it, and a row of colour
// combinations that repaint the piece on the spot. "Personalízala" carries the chosen combination along.
export function Poster({ product, index }: { product: Product; index: number }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  // The 3D canvas lives only while the poster is near the screen, so a phone never runs more than two at once
  const near = useInView(ref, { margin: '300px 0px' })
  const seen = useInView(ref, { once: true, amount: 0.15 })
  const [chosen, setChosen] = useState(0)
  const colors = product.colorways[chosen]
  const field = FIELDS[product.field]
  const flip = index % 2 === 1
  const titleId = `pieza-${product.slug}`

  return (
    <article
      ref={ref}
      aria-labelledby={titleId}
      className={`@container relative isolate overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] text-night ${field.bg}`}
    >
      <PosterRibbon d={POSTER_RIBBONS[index % POSTER_RIBBONS.length]} className={field.ribbon} play={seen} />

      <motion.div className="grid @3xl:grid-cols-2 @3xl:items-center pt-[6cqi]" {...entrance(seen, reduceMotion)}>
        <motion.h2
          variants={rise}
          custom={0}
          id={titleId}
          className={`px-[6cqi] font-display text-[11.5cqi] leading-[0.86] tracking-[-0.04em] text-balance @3xl:col-span-2 ${
            flip ? '@3xl:text-right' : ''
          }`}
        >
          {product.name}
        </motion.h2>

        {/* The piece, cut out and tilted beside the facts, clear of the name */}
        <motion.div
          aria-hidden="true"
          variants={drop}
          custom={flip ? -5 : 5}
          className={`w-[88cqi] @3xl:w-[46cqi] aspect-square justify-self-center @3xl:row-start-2 ${
            flip ? '@3xl:col-start-1' : '@3xl:col-start-2'
          }`}
        >
          {near && <ProductViewer3D product={product} colors={colors} interactive={false} still={!!reduceMotion} />}
        </motion.div>

        <div
          className={`flex flex-col gap-6 px-[6cqi] pb-[6cqi] @3xl:pt-[3cqi] @3xl:row-start-2 ${
            flip ? '@3xl:col-start-2' : '@3xl:col-start-1'
          }`}
        >
          <motion.p
            variants={rise}
            custom={1}
            className="text-xl @3xl:text-[clamp(1.25rem,2.1cqi,1.75rem)] leading-snug max-w-[24ch] font-semibold"
          >
            {product.occasion}
          </motion.p>
          <motion.p variants={rise} custom={2} className="font-display text-[clamp(2.5rem,6cqi,4.5rem)] leading-none">
            {formatCOP(product.basePrice)}
          </motion.p>

          <motion.div variants={rise} custom={3} role="group" aria-label="Combinaciones de colores" className="flex flex-wrap gap-3">
            {product.colorways.map((colorway, i) => {
              const ids = [...new Set(Object.values(colorway))]
              const on = i === chosen
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={on}
                  aria-label={describe(product, colorway)}
                  onClick={() => setChosen(i)}
                  className={`flex items-center h-14 pl-3 pr-4 rounded-full transition-[background-color,transform] duration-200 active:scale-95 ${
                    on ? 'bg-night' : 'bg-night/10 hover:bg-night/20'
                  }`}
                >
                  {ids.map(id => (
                    <span
                      key={id}
                      className="w-8 h-8 -mr-2 last:mr-0 rounded-full border-[3px] border-night/25"
                      style={{ backgroundColor: findColor(id)?.hex }}
                    />
                  ))}
                </button>
              )
            })}
          </motion.div>

          <motion.div variants={rise} custom={4} className="self-start">
            <Link
              to={`/catalogo/${product.slug}?colores=${colorsToParam(product, colors)}`}
              className="group inline-flex items-center gap-3 min-h-14 px-7 rounded-full bg-night text-cream text-lg font-semibold transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            >
              Personalízala
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </article>
  )
}

// The last poster: the catalog is a sample, and anything else can be made too
export function CustomPoster() {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.15 })

  return (
    <article
      ref={ref}
      aria-labelledby="pieza-a-medida"
      className="@container relative isolate overflow-hidden rounded-[2.5rem] sm:rounded-[3rem] bg-orange text-night"
    >
      <PosterRibbon
        d={CUSTOM_RIBBON}
        className="text-[color-mix(in_srgb,var(--color-orange),var(--color-ink)_12%)]"
        play={seen}
      />
      <motion.div className="px-[6cqi] py-[7cqi] flex flex-col gap-8" {...entrance(seen, reduceMotion)}>
        <motion.h2 variants={rise} custom={0} id="pieza-a-medida" className="font-display text-[11.5cqi] leading-[0.86] tracking-[-0.04em] max-w-[11ch]">
          ¿No está aquí? La hacemos
        </motion.h2>
        <motion.p variants={rise} custom={1} className="text-xl sm:text-2xl leading-snug font-semibold max-w-[38ch]">
          Animales para una fiesta de la jungla, el logo de tu empresa en un llavero, la inicial de cada invitado.
          Cuéntanos la idea y te proponemos el diseño.
        </motion.p>
        <motion.a
          variants={rise}
          custom={2}
          href={whatsappUrl('¡Hola nueve2siete! Busco una pieza que no está en el catálogo: ')}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start inline-flex items-center gap-3 min-h-14 px-7 rounded-full bg-night text-cream text-lg font-semibold transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Cuéntanos tu idea
        </motion.a>
      </motion.div>
    </article>
  )
}
