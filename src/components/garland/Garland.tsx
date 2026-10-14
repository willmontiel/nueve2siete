import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
  type MotionValue,
} from 'framer-motion'
import { Hanger } from './Hanger'
import { ClosingFace, ProjectBack, ProjectFront, TitleFace } from './faces'
import { PROJECTS, type Project } from '../../data/projects'
import { droppedCount, garlandPath, scrollToCenter, type Point } from '../../lib/garland'
import { scrollToY } from '../../lib/smoothScroll'

// The title tag, one tag per project and the closing tag
const TAG_COUNT = PROJECTS.length + 2
// Shares of the section's entrance (its top travelling from the bottom of the screen to the top) at which the
// string starts drawing and the tags start dropping onto it, one every step
const DRAW_FROM = 0.05
const DRAW_TO = 0.85
const DROP_FROM = 0.4
const DROP_STEP = 0.09

interface Layout {
  width: number
  height: number
  points: Point[]
}

// The projects as gift tags hanging from one long ribbon, strung across the page like a party garland. While
// the section is pinned, scrolling down carries the garland sideways and the tags swing behind the motion.
// Under reduced motion it is a plain sideways scroller and nothing swings.
export function Garland() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLUListElement>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  const travel = useMotionValue(0)
  const [travelPx, setTravelPx] = useState(0)

  useLayoutEffect(() => {
    const strip = stripRef.current!
    const measure = () => {
      const slots = [...strip.querySelectorAll<HTMLElement>('[data-slot]')]
      const run = Math.max(0, strip.scrollWidth - strip.parentElement!.clientWidth)
      setLayout({
        width: strip.scrollWidth,
        height: strip.clientHeight,
        points: slots.map(slot => ({ x: slot.offsetLeft + slot.offsetWidth / 2, y: slot.offsetTop })),
      })
      travel.set(run)
      setTravelPx(run)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(strip)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [travel])

  const { scrollYProgress: run } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const { scrollYProgress: entry } = useScroll({ target: sectionRef, offset: ['start end', 'start start'] })
  const x = useTransform([run, travel], ([progress, distance]: number[]) => (reduceMotion ? 0 : -progress * distance))
  const velocity = useVelocity(x)

  const [dropped, setDropped] = useState(0)
  // useScroll reports the first measured position as a change too, so a visit that lands below the section
  // (a link to #proyectos, a reload) finds the tags already hanging
  useMotionValueEvent(entry, 'change', progress =>
    setDropped(count => Math.max(count, droppedCount(progress, TAG_COUNT, DROP_FROM, DROP_STEP))),
  )

  function centerOn(slot: HTMLElement) {
    if (reduceMotion) return
    const top = sectionRef.current!.getBoundingClientRect().top + window.scrollY
    scrollToY(top + scrollToCenter(slot.offsetLeft + slot.offsetWidth / 2, window.innerWidth, travel.get()))
  }

  const shared = { velocity, onFocusVisible: centerOn }

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      aria-labelledby="guirnalda-titulo"
      className="relative"
      style={reduceMotion ? undefined : { height: `calc(100svh + ${travelPx}px)` }}
    >
      <div className={reduceMotion ? 'overflow-x-auto snap-x snap-mandatory' : 'sticky top-0 h-svh overflow-x-clip'}>
        <motion.ul
          ref={stripRef}
          className="relative flex w-max h-svh items-start gap-(--gap) pl-[max(1.5rem,7vw)] pr-[calc((100vw-var(--tag-w))/2)] [--tag-w:min(19rem,78vw)] [--gap:3rem] [--string-y:clamp(5rem,16svh,10rem)] md:[--tag-w:min(clamp(17rem,27vw,26rem),calc((100svh-14rem)*0.7))] md:[--gap:clamp(3.5rem,6vw,7rem)]"
          style={{ x }}
        >
          {layout && <GarlandString layout={layout} entry={entry} still={!!reduceMotion} />}
          <Hanger {...shared} index={0} dropped={dropped > 0} wide front={<TitleFace play={dropped > 0} />} />
          {PROJECTS.map((project, i) => (
            <ProjectTag key={project.id} {...shared} project={project} index={i + 1} dropped={dropped > i + 1} />
          ))}
          <Hanger
            {...shared}
            index={TAG_COUNT - 1}
            dropped={dropped >= TAG_COUNT}
            front={<ClosingFace play={dropped >= TAG_COUNT} />}
          />
        </motion.ul>
      </div>
    </section>
  )
}

interface ProjectTagProps {
  project: Project
  index: number
  dropped: boolean
  velocity: MotionValue<number>
  onFocusVisible: (slot: HTMLElement) => void
}

function ProjectTag({ project, index, ...hanger }: ProjectTagProps) {
  const [turns, setTurns] = useState(0)
  const flipped = turns % 2 === 1
  const flip = () => setTurns(count => count + 1)
  return (
    <Hanger
      {...hanger}
      index={index}
      flipped={flipped}
      onTap={flip}
      front={<ProjectFront project={project} onFlip={flip} />}
      back={<ProjectBack project={project} index={index - 1} flipped={flipped} turns={turns} onFlip={flip} />}
    />
  )
}

// The ribbon the tags hang from. It comes down from above, where the hero was, and draws itself across the
// page as the section arrives.
function GarlandString({ layout, entry, still }: { layout: Layout; entry: MotionValue<number>; still: boolean }) {
  const { width, points } = layout
  const first = points[0]
  const last = points[points.length - 1]
  const sag = (points[1].x - first.x) * 0.07
  // It starts well above the stage, over the bottom of the hero, so it seems to come down from there; it keeps
  // to the left edge so it never crosses the hero's text
  const from = { x: Math.min(first.x * 0.3, window.innerWidth * 0.04), y: -layout.height * 0.45 }
  const d = garlandPath(points, from, { x: width - (width - last.x) * 0.3, y: -80 }, sag)
  const pathLength = useTransform(entry, [DRAW_FROM, DRAW_TO], [still ? 1 : 0, 1])
  // A zero-length path with round caps still paints a dot
  const opacity = useTransform(pathLength, [0, 0.005], [0, 1])

  // The box covers only the band the string waves in; the part coming down from above overflows it
  const band = first.y + sag + 16
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${width} ${band}`}
      width={width}
      height={band}
      className="pointer-events-none absolute top-0 left-0 overflow-visible text-orange"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={14}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength, opacity }}
      />
    </svg>
  )
}
