import { useRef, type CSSProperties } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Ribbon } from '../Ribbon'
import { whatsappUrl } from '../../lib/contact'

// Traced after the faint ribbon behind the wordmark on page 3 of the brand guide: it enters left,
// dips, rises into one loop above the words and curls out to the right
const FAINT_RIBBON =
  'M -40 560 C 120 640, 330 700, 520 600 C 640 535, 700 430, 690 330 C 680 210, 600 150, 540 190 ' +
  'C 470 235, 500 330, 600 330 C 760 330, 900 230, 1080 220 C 1260 210, 1400 280, 1480 400'

// The corner ribbons write the numbers of the name, each in its colour from the logo: the 9 of "nueve"
// in orange top left and the 2 in lavender bottom right. Each path starts off screen at its corner, so it
// draws itself out of the corner and winds back into it as the hero scrolls away.
const CORNER_NINE =
  'M -60 360 C 80 380, 220 300, 260 190 C 290 110, 250 40, 170 50 C 80 60, 60 170, 140 190 ' +
  'C 210 205, 255 170, 262 150'
const CORNER_TWO =
  'M 680 548 C 420 562, 236 536, 270 520 C 318 498, 334 556, 292 572 C 232 594, 222 534, 262 492 ' +
  'C 340 410, 468 330, 452 232 C 430 100, 200 125, 205 255'

const order = (i: number) => ({ '--i': i }) as CSSProperties

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const faintY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -60])
  const faintScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.06])

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] flex items-center justify-center px-4 sm:px-8 py-24"
    >
      <motion.div className="absolute inset-0 -z-10 text-ribbon" style={{ y: faintY, scale: faintScale }}>
        <Ribbon
          d={FAINT_RIBBON}
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          strokeWidth={58}
          className="w-full h-full"
          delay={0.2}
          duration={2.4}
        />
      </motion.div>

      <Ribbon
        d={CORNER_NINE}
        viewBox="0 0 600 600"
        strokeWidth={64}
        className="absolute top-0 left-0 -z-10 w-[clamp(14rem,28vw,27rem)] text-orange origin-top-left"
        delay={0.5}
        progress={scrollYProgress}
        rewind={0.7}
        turn={-10}
      />
      <Ribbon
        d={CORNER_TWO}
        viewBox="0 0 600 600"
        strokeWidth={64}
        className="absolute bottom-0 right-0 -z-10 w-[clamp(14rem,28vw,27rem)] text-lavender origin-bottom-right"
        delay={0.8}
        progress={scrollYProgress}
        rewind={0.7}
        turn={10}
      />

      <div className="flex flex-col items-center text-center">
        <h1
          id="hero-title"
          className="font-display text-[clamp(3.1rem,10.5vw,10rem)] leading-[0.92] tracking-[-0.035em] text-fg"
        >
          <span className="reveal-line"><span style={order(0)}>Piezas únicas</span></span>
          <span className="reveal-line"><span style={order(1)}>que cobran vida</span></span>
        </h1>
        <p className="rise mt-7 sm:mt-9 max-w-[40ch] text-xl sm:text-2xl leading-snug text-fg" style={order(3)}>
          Recordatorios para fiestas, merch para empresas y piezas a medida, en los colores que elijas.
        </p>
        <a
          href={whatsappUrl('¡Hola nueve2siete! Tengo una idea y quiero cotizarla.')}
          target="_blank"
          rel="noopener noreferrer"
          className="rise mt-9 sm:mt-11 inline-flex items-center gap-2.5 min-h-14 px-8 rounded-full bg-orange text-night text-lg font-semibold transition-[transform,background-color,color] duration-200 hover:bg-fg hover:text-ground active:scale-[0.97]"
          style={order(4)}
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Cuéntanos tu idea
        </a>
      </div>
    </section>
  )
}
