import { Fragment, useEffect, useRef, type CSSProperties } from 'react'
import { easeIn, easeInOut, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { Ribbon } from '../Ribbon'
import { whatsappUrl } from '../../lib/contact'
import { letterWindow } from '../../lib/stagger'

// Traced after the faint ribbon behind the wordmark on page 3 of the brand guide: it enters left,
// dips, rises into one loop above the words and curls out to the right
const FAINT_RIBBON =
  'M -40 560 C 120 640, 330 700, 520 600 C 640 535, 700 430, 690 330 C 680 210, 600 150, 540 190 ' +
  'C 470 235, 500 330, 600 330 C 760 330, 900 230, 1080 220 C 1260 210, 1400 280, 1480 400'

// The corner ribbons write the numbers of the name, each in its colour from the logo: the 9 of "nueve"
// in orange top left and the 2 in lavender bottom right. Each path starts off screen at its corner, so it
// draws itself out of the corner and winds back into it while the hero holds.
const CORNER_NINE =
  'M -60 360 C 80 380, 220 300, 260 190 C 290 110, 250 40, 170 50 C 80 60, 60 170, 140 190 ' +
  'C 210 205, 255 170, 262 150'
const CORNER_TWO =
  'M 680 548 C 420 562, 236 536, 270 520 C 318 498, 334 556, 292 572 C 232 594, 222 534, 262 492 ' +
  'C 340 410, 468 330, 452 232 C 430 100, 200 125, 205 255'

const MOTTO = ['Piezas únicas', 'que cobran vida']
// Shares of the magazine's rise in which each line leaves. The magazine comes up from below, so the lower
// line goes first, and every letter is gone before the magazine's edge reaches it.
const LINE_EXITS: [number, number][] = [
  [0.24, 0.56],
  [0.1, 0.42],
]
const LETTER_EXIT = 0.14

const order = (i: number) => ({ '--i': i }) as CSSProperties
const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

interface HeroProps {
  /** 0 to 1 while the hero holds still on screen and its ribbons wind back into the corners */
  hold: MotionValue<number>
  /** 0 to 1 while the magazine rises over the hero, from the bottom of the screen to the top */
  cover: MotionValue<number>
}

export function Hero({ hold, cover }: HeroProps) {
  const reduceMotion = useReducedMotion()
  const travel = reduceMotion ? 0 : 1
  const faintY = useTransform(hold, [0, 1], [0, -70 * travel])
  const faintScale = useTransform(hold, [0, 1], [1, 1 + 0.08 * travel])
  // The sentence and the action step aside at the end of the hold; the motto rises as the magazine comes
  const asideY = useTransform(hold, [0.5, 0.95], [0, -28 * travel])
  const asideOpacity = useTransform(hold, [0.5, 0.95], [1, reduceMotion ? 1 : 0])
  const asideVisibility = useTransform(asideOpacity, o => (o < 0.02 ? 'hidden' : 'visible'))
  // While they step aside the motto slides down to the middle of the screen; then it rises with the magazine
  const asideRef = useRef<HTMLDivElement>(null)
  const asideHeight = useMotionValue(0)
  useEffect(() => {
    const aside = asideRef.current!
    const observer = new ResizeObserver(() => asideHeight.set(aside.offsetHeight))
    observer.observe(aside)
    return () => observer.disconnect()
  }, [asideHeight])
  const mottoY = useTransform([hold, cover, asideHeight], ([h, c, aside]: number[]) => {
    const settle = easeInOut(clamp01((h - 0.5) / 0.45)) * (aside / 2)
    const rise = clamp01(c / 0.6) * 0.1 * window.innerHeight
    return (settle - rise) * travel
  })
  // Once every letter is out, nothing is left to paint or to reach with the keyboard
  const contentVisibility = useTransform(cover, c => (!reduceMotion && c >= 0.58 ? 'hidden' : 'visible'))

  return (
    <section
      aria-labelledby="hero-title"
      className={`${reduceMotion ? 'relative' : 'sticky top-0'} isolate overflow-hidden h-[calc(100svh-4rem)] sm:h-[calc(100svh-5rem)] min-h-[34rem] flex items-center justify-center px-4 sm:px-8 py-24`}
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
        progress={hold}
        rewind={1}
        turn={-14}
      />
      <Ribbon
        d={CORNER_TWO}
        viewBox="0 0 600 600"
        strokeWidth={64}
        className="absolute bottom-0 right-0 -z-10 w-[clamp(14rem,28vw,27rem)] text-lavender origin-bottom-right"
        delay={0.8}
        progress={hold}
        rewind={1}
        turn={14}
      />

      <motion.div className="flex flex-col items-center text-center" style={{ y: mottoY, visibility: contentVisibility }}>
        {/* Split into letters, the motto is named once for screen readers instead of spelled out */}
        <h1
          id="hero-title"
          aria-label={MOTTO.join(' ')}
          className="font-display text-[clamp(3.1rem,10.5vw,10rem)] leading-[0.92] tracking-[-0.035em] text-fg"
        >
          {MOTTO.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && ' '}
              <MottoLine text={line} index={i} cover={cover} still={!!reduceMotion} />
            </Fragment>
          ))}
        </h1>
        <motion.div
          ref={asideRef}
          className="flex flex-col items-center"
          style={{ y: asideY, opacity: asideOpacity, visibility: asideVisibility }}
        >
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
        </motion.div>
      </motion.div>
    </section>
  )
}

interface MottoLineProps {
  text: string
  index: number
  cover: MotionValue<number>
  still: boolean
}

// One line of the motto: it rises into its mask on load (CSS) and leaves it letter by letter on scroll
function MottoLine({ text, index, cover, still }: MottoLineProps) {
  const count = text.replaceAll(' ', '').length
  let letter = 0

  return (
    <span className="reveal-line" aria-hidden="true">
      <span style={order(index)}>
        {still
          ? text
          : text.split(' ').map((word, w) => (
              <Fragment key={w}>
                {w > 0 && ' '}
                {/* Words stay whole so a line never breaks inside one */}
                <span className="inline-block whitespace-nowrap">
                  {[...word].map(char => {
                    const [from, to] = letterWindow(letter++, count, LINE_EXITS[index], LETTER_EXIT)
                    return <Letter key={letter} char={char} cover={cover} from={from} to={to} />
                  })}
                </span>
              </Fragment>
            ))}
      </span>
    </span>
  )
}

function Letter({ char, cover, from, to }: { char: string; cover: MotionValue<number>; from: number; to: number }) {
  // Each letter drops out through the bottom of its line, as if slipping under the incoming magazine
  const y = useTransform(cover, [from, to], ['0%', '115%'], { ease: easeIn })
  return (
    <motion.span className="inline-block" style={{ y }}>
      {char}
    </motion.span>
  )
}
