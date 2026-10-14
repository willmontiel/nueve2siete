import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { FlipBook } from './FlipBook'
import {
  ClosingLeft,
  ClosingRight,
  ClosingSingle,
  CoverLeft,
  CoverRight,
  CoverSingle,
  ProjectPhoto,
  ProjectSingle,
  ProjectText,
} from './pages'
import { PROJECTS } from '../../data/projects'
import { useMediaQuery } from '../../lib/useMediaQuery'

// Sheets of colour fanned out on both sides of the open magazine, nearest first. The nearest ones use colours
// no page on that side is printed on, so a page never melts into the fan.
const LEFT_FAN = ['bg-pink', 'bg-lime', 'bg-lavender', 'bg-pine', 'bg-mustard']
const RIGHT_FAN = ['bg-violet', 'bg-mustard', 'bg-pink', 'bg-lime', 'bg-pine']
// On a phone the page sits on a loose stack instead
const PHONE_STACK = [
  { color: 'bg-lavender', rotate: -4, x: '-3%' },
  { color: 'bg-mustard', rotate: 3.5, x: '3%' },
]

const EASE_OUT = [0.22, 1, 0.36, 1] as const
const LAST_TURN = PROJECTS.length + 1

function status(turned: number): string {
  if (turned === 0) return 'Portada'
  if (turned === LAST_TURN) return 'Tu idea'
  return `Proyecto ${turned} de ${PROJECTS.length}`
}

const arrowButton =
  'grid place-items-center w-14 h-14 rounded-full bg-fg text-ground transition-[transform,background-color,color,opacity] duration-200 hover:bg-accent hover:text-night active:scale-95 disabled:opacity-30 disabled:pointer-events-none'

// The project magazine: open as a spread from tablets up, one page at a time on phones
export function Magazine() {
  const spread = useMediaQuery('(min-width: 768px)')
  const [turned, setTurned] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, amount: 0.3 })
  const reduceMotion = useReducedMotion()
  const fanned = inView || !!reduceMotion
  // The closing ribbon draws itself when its spread comes up, not unseen at the start
  const closingPlay = inView && turned === LAST_TURN

  const pages = spread
    ? [
        <CoverLeft key="portada-izquierda" play={inView} />,
        <CoverRight key="portada-derecha" play={inView} onOpen={() => setTurned(1)} />,
        ...PROJECTS.flatMap((project, i) => [
          <ProjectPhoto key={`${project.id}-foto`} project={project} />,
          // Its ribbon draws itself when the visitor lands on the spread
          <ProjectText key={`${project.id}-texto`} project={project} index={i} play={inView && turned === i + 1} />,
        ]),
        <ClosingLeft key="cierre-izquierda" play={closingPlay} />,
        <ClosingRight key="cierre-derecha" play={closingPlay} />,
      ]
    : [
        <CoverSingle key="portada" play={inView} onOpen={() => setTurned(1)} />,
        ...PROJECTS.map(project => <ProjectSingle key={project.id} project={project} />),
        <ClosingSingle key="cierre" play={closingPlay} />,
      ]

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      aria-labelledby="revista-titulo"
      className="relative overflow-x-clip px-4 sm:px-8 py-20 sm:py-28"
    >
      <motion.div
        className={`relative isolate mx-auto ${
          spread
            ? 'w-[min(90vw,111svh)] lg:w-[min(66vw,111svh,84rem)] aspect-[3/2]'
            : 'w-[min(calc(100vw-2rem),28rem,calc((100svh-12rem)*0.7))] aspect-[7/10]'
        }`}
        initial={reduceMotion ? false : { y: 70, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        {spread
          ? [LEFT_FAN, RIGHT_FAN].map((fan, side) =>
              fan.map((color, k) => (
                <motion.div
                  key={`${side}-${color}`}
                  aria-hidden="true"
                  className={`absolute inset-y-0 w-1/2 rounded-[1.75rem] ${color} ${side === 0 ? 'left-0' : 'left-1/2'}`}
                  style={{ zIndex: -1 - k }}
                  initial={false}
                  animate={
                    fanned
                      ? { x: `${(side === 0 ? -1 : 1) * (k + 1) * 20}%`, scale: 1 - (k + 1) * 0.035 }
                      : { x: '0%', scale: 0.97 }
                  }
                  transition={reduceMotion ? { duration: 0 } : { duration: 1.1, delay: 0.3 + k * 0.07, ease: EASE_OUT }}
                />
              )),
            )
          : PHONE_STACK.map(({ color, rotate, x }) => (
              <motion.div
                key={color}
                aria-hidden="true"
                className={`absolute inset-0 -z-10 rounded-[1.75rem] ${color}`}
                initial={false}
                animate={fanned ? { rotate, x } : { rotate: 0, x: '0%' }}
                transition={reduceMotion ? { duration: 0 } : { duration: 1, delay: 0.3, ease: EASE_OUT }}
              />
            ))}

        <FlipBook
          key={spread ? 'spread' : 'single'}
          pages={pages}
          spread={spread}
          turned={turned}
          onTurn={setTurned}
          label="Revista de proyectos"
          className="absolute inset-0"
        />

      </motion.div>

      <div className="mt-10 sm:mt-14 flex items-center justify-center gap-3 sm:gap-5">
        <button
          type="button"
          onClick={() => setTurned(Math.max(0, turned - 1))}
          disabled={turned === 0}
          aria-label="Página anterior"
          className={arrowButton}
        >
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        </button>
        <p aria-live="polite" className="w-[11rem] text-center text-lg font-semibold tabular-nums text-fg">
          {status(turned)}
        </p>
        <button
          type="button"
          onClick={() => setTurned(Math.min(LAST_TURN, turned + 1))}
          disabled={turned === LAST_TURN}
          aria-label="Página siguiente"
          className={arrowButton}
        >
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
