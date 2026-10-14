import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { burstRibbons, type BurstColor, type BurstRibbon } from '../lib/ribbonBurst'

// Seconds each ribbon spends drawing itself in, lying still, and winding back into its edge
const DRAW = 0.75
const HOLD = 0.5
const WIND = 0.7
const LIFE = DRAW + HOLD + WIND

// Literal class names, so Tailwind generates them
const STROKES: Record<BurstColor, string> = {
  orange: 'stroke-orange',
  lavender: 'stroke-lavender',
  mustard: 'stroke-mustard',
  pink: 'stroke-pink',
  lime: 'stroke-lime',
}

interface Burst {
  id: number
  width: number
  height: number
  ribbons: BurstRibbon[]
}

function BurstLine({ ribbon }: { ribbon: BurstRibbon }) {
  const drawn = useMotionValue(0)
  // A zero-length path with round caps still paints a dot, so the ribbon hides until it has length
  const opacity = useTransform(drawn, [0, 0.01], [0, 1])

  useEffect(() => {
    const controls = animate(drawn, [0, 1, 1, 0], {
      duration: LIFE,
      times: [0, DRAW / LIFE, (DRAW + HOLD) / LIFE, 1],
      ease: [[0.33, 1, 0.68, 1], 'linear', [0.32, 0, 0.67, 0]],
      delay: ribbon.delay,
    })
    return () => controls.stop()
  }, [drawn, ribbon.delay])

  return (
    <motion.path
      d={ribbon.d}
      fill="none"
      className={STROKES[ribbon.color]}
      strokeWidth={ribbon.width}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength: drawn, opacity }}
    />
  )
}

function BurstLayer({ burst, onDone }: { burst: Burst; onDone: (id: number) => void }) {
  const { id, width, height, ribbons } = burst
  const last = ribbons.at(-1)?.delay ?? 0

  useEffect(() => {
    const timer = window.setTimeout(() => onDone(id), (last + LIFE) * 1000 + 100)
    return () => window.clearTimeout(timer)
  }, [id, last, onDone])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="pointer-events-none fixed inset-0 z-[70] w-full h-full"
      aria-hidden="true"
      focusable="false"
    >
      {ribbons.map((ribbon, i) => (
        <BurstLine key={i} ribbon={ribbon} />
      ))}
    </svg>
  )
}

// The bow in the top bar. Pulling it lets loose a handful of ribbons in the brand colours: each comes in from a
// screen edge, ties a loop and winds back out (the geometry is src/lib/ribbonBurst.ts). It is only there for
// the fun of it, so it is left out under reduced motion.
export function BowButton() {
  const reduceMotion = useReducedMotion()
  const [bursts, setBursts] = useState<Burst[]>([])
  const [pulls, setPulls] = useState(0)
  const nextId = useRef(0)

  const remove = useCallback((id: number) => setBursts(list => list.filter(burst => burst.id !== id)), [])

  if (reduceMotion) return null

  const pull = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    const id = nextId.current++
    // Up to three bursts at once, however fast it is pulled
    setBursts(list => [...list.slice(-2), { id, width, height, ribbons: burstRibbons(width, height) }])
    setPulls(p => p + 1)
  }

  return (
    <>
      <button
        type="button"
        onClick={pull}
        aria-label="Soltar cintas de colores"
        title="Soltar cintas"
        className="group grid place-items-center w-11 h-11 rounded-full transition-colors duration-200 hover:bg-surface"
      >
        <span className="transition-transform duration-300 group-hover:-rotate-6">
          {/* Remounted on every pull, so the bow jiggles each time */}
          <motion.svg
            key={pulls}
            viewBox="0 0 48 48"
            className="block w-8 h-8"
            animate={pulls ? { rotate: [0, -16, 12, -6, 0], scale: [1, 0.84, 1.1, 1, 1] } : undefined}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
            focusable="false"
          >
            <g fill="none" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 26C19 32 16 37 12 42" className="stroke-lavender" />
              <path d="M27 26C29 32 32 37 36 42" className="stroke-lavender" />
              <path d="M22 23C16 12 5 11 5 19C5 27 15 27 22 23" className="stroke-orange" />
              <path d="M26 23C32 12 43 11 43 19C43 27 33 27 26 23" className="stroke-orange" />
            </g>
            <circle cx="24" cy="23.5" r="4.6" className="fill-mustard" />
          </motion.svg>
        </span>
      </button>
      {createPortal(
        bursts.map(burst => <BurstLayer key={burst.id} burst={burst} onDone={remove} />),
        document.body,
      )}
    </>
  )
}
