import {
  useEffect,
  useEffectEvent,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from 'framer-motion'
import { dragAngle, leafLayer, settleAngle, visibleFaces, type LeafRest, type RestAngle } from '../../lib/book'

interface FlipBookProps {
  /**
   * Pages in reading order. Open as a spread, the first page is the left one of the first spread and the
   * last one the right page of the last spread, so there are two pages more than leaves. One page at a time,
   * each leaf holds one page and the last page lies under all of them.
   */
  pages: ReactNode[]
  spread: boolean
  /** Must position the book (absolute or relative): its pages are laid out inside it */
  className: string
  /** Leaves turned so far: 0 shows the first spread (or page) */
  turned: number
  onTurn: (turned: number) => void
  label: string
}

const TURN = { duration: 0.8, ease: [0.65, 0, 0.35, 1] as const }
// Seconds between leaves when several turn at once (a jump from the controls riffles through them)
const STAGGER = 0.08
// Pixels a press travels before it becomes a drag
const DRAG_START = 8
// A drag that paused this long before release carries no flick
const FLICK_WINDOW = 80

type Gesture =
  | { kind: 'press'; pointerId: number; startX: number; startY: number }
  | { kind: 'ignore'; pointerId: number }
  | {
      kind: 'drag'
      pointerId: number
      startX: number
      leaf: number
      from: RestAngle
      lastX: number
      lastT: number
      velocity: number
    }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const restAngle = (leaf: number, turned: number): RestAngle => (leaf < turned ? -180 : 0)

export function FlipBook({ pages, spread, turned, onTurn, label, className }: FlipBookProps) {
  const reduceMotion = useReducedMotion()
  const leafCount = spread ? (pages.length - 2) / 2 : pages.length - 1
  // The book is remounted when the layout changes, so the leaves never change in number
  const [angles] = useState(() => Array.from({ length: leafCount }, (_, i) => motionValue<number>(restAngle(i, turned))))
  const targets = useRef<(number | null)[]>(angles.map(angle => angle.get()))
  const animations = useRef<(AnimationPlaybackControls | undefined)[]>([])
  const gesture = useRef<Gesture | null>(null)
  const bookRef = useRef<HTMLDivElement>(null)
  const [held, setHeld] = useState<number | null>(null)
  // Covered pages are not painted, so the book repaints whenever a leaf starts or stops moving
  const [, repaint] = useReducer((n: number) => n + 1, 0)

  useEffect(() => {
    const stops = angles.flatMap(angle => [
      angle.on('animationStart', repaint),
      angle.on('animationComplete', repaint),
      angle.on('animationCancel', repaint),
    ])
    return () => stops.forEach(stop => stop())
  }, [angles])

  function turnLeaf(leaf: number, target: RestAngle, delay = 0) {
    targets.current[leaf] = target
    animations.current[leaf]?.stop()
    animations.current[leaf] = animate(angles[leaf], target, reduceMotion ? { duration: 0 } : { ...TURN, delay })
  }

  // Every leaf heads for the side `turned` puts it on; forward turns riffle first to last, backward last to first
  const settleLeaves = useEffectEvent((turnedNow: number) => {
    const held = gesture.current?.kind === 'drag' ? gesture.current.leaf : -1
    const moving = angles
      .map((_, leaf) => leaf)
      .filter(leaf => leaf !== held && targets.current[leaf] !== restAngle(leaf, turnedNow))
    const ordered = moving.every(leaf => leaf < turnedNow) ? moving : [...moving].reverse()
    ordered.forEach((leaf, k) => turnLeaf(leaf, restAngle(leaf, turnedNow), k * STAGGER))
  })

  useEffect(() => {
    settleLeaves(turned)
  }, [turned])

  function go(next: number) {
    const target = clamp(next, 0, leafCount)
    if (target !== turned) onTurn(target)
  }

  function geometry() {
    const rect = bookRef.current!.getBoundingClientRect()
    return spread
      ? { rect, spineX: rect.left + rect.width / 2, pageWidth: rect.width / 2 }
      : { rect, spineX: rect.left, pageWidth: rect.width }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || gesture.current) return
    // Links and buttons on a page keep working; only the paper turns the page
    if ((e.target as Element).closest('a, button')) return
    gesture.current = { kind: 'press', pointerId: e.pointerId, startX: e.clientX, startY: e.clientY }
  }

  function startDrag(e: PointerEvent<HTMLDivElement>, press: Extract<Gesture, { kind: 'press' }>) {
    const dx = e.clientX - press.startX
    const dy = e.clientY - press.startY
    if (Math.abs(dx) < DRAG_START && Math.abs(dy) < DRAG_START) return
    const forward = dx < 0
    const leaf = forward ? turned : turned - 1
    // A mostly vertical move is the visitor scrolling the page. Open as a spread, a leaf is picked up from
    // the side it lies on, and there has to be a leaf on that side.
    const scrolling = Math.abs(dy) > Math.abs(dx)
    const wrongSide = spread && press.startX >= geometry().spineX !== forward
    if (scrolling || wrongSide || leaf < 0 || leaf >= leafCount) {
      gesture.current = { kind: 'ignore', pointerId: e.pointerId }
      return
    }

    animations.current[leaf]?.stop()
    targets.current[leaf] = null
    bookRef.current!.setPointerCapture(e.pointerId)
    gesture.current = {
      kind: 'drag',
      pointerId: e.pointerId,
      startX: press.startX,
      leaf,
      from: forward ? 0 : -180,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    }
    setHeld(leaf)
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== e.pointerId) return
    if (current.kind === 'press') startDrag(e, current)
    const drag = gesture.current
    if (drag?.kind !== 'drag') return

    const { spineX, pageWidth } = geometry()
    const angle =
      spread || drag.from === 0
        ? dragAngle({ from: drag.from, startX: drag.startX, x: e.clientX, spineX, pageWidth })
        : // One page at a time the previous page waits off stage, so a swipe to the right just brings it back
          -180 + clamp((e.clientX - drag.startX) / pageWidth, 0, 1) * 180
    angles[drag.leaf].set(angle)

    const elapsed = e.timeStamp - drag.lastT
    if (elapsed > 0) drag.velocity = 0.7 * ((e.clientX - drag.lastX) / elapsed) + 0.3 * drag.velocity
    drag.lastX = e.clientX
    drag.lastT = e.timeStamp
  }

  function onPointerEnd(e: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== e.pointerId) return
    gesture.current = null

    if (current.kind === 'press' && e.type === 'pointerup') {
      // A plain click turns forward on the right page and back on the left one
      const { rect, spineX } = geometry()
      const back = spread ? e.clientX < spineX : e.clientX < rect.left + rect.width * 0.3
      go(back ? turned - 1 : turned + 1)
    }

    if (current.kind === 'drag') {
      setHeld(null)
      const velocity = e.timeStamp - current.lastT > FLICK_WINDOW ? 0 : current.velocity
      const target = settleAngle(angles[current.leaf].get(), velocity)
      turnLeaf(current.leaf, target)
      go(target === -180 ? current.leaf + 1 : current.leaf)
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    go(e.key === 'ArrowRight' ? turned + 1 : turned - 1)
  }

  const front = (leaf: number) => (spread ? pages[2 * leaf + 1] : pages[leaf])
  const back = (leaf: number) => (spread ? pages[2 * leaf + 2] : null)
  const rests = angles.map((angle, leaf): LeafRest => {
    if (leaf === held || angle.isAnimating()) return 'moving'
    const value = angle.get()
    return value === 0 ? 'right' : value === -180 ? 'left' : 'moving'
  })
  const faces = visibleFaces(rests, spread)

  return (
    <div
      ref={bookRef}
      role="group"
      aria-roledescription="revista"
      aria-label={label}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onKeyDown={onKeyDown}
      className={`rounded-[1.75rem] select-none touch-pan-y perspective-[2600px] [--page-r:1.75rem] [--spine-r:0.375rem] ${held === null ? 'cursor-grab' : 'cursor-grabbing'} ${className}`}
    >
      {spread && (
        <PageFace side="left" visible={faces.firstLeft} className="left-0 w-1/2">
          {pages[0]}
        </PageFace>
      )}
      <PageFace
        side={spread ? 'right' : 'single'}
        shown={turned === leafCount}
        visible={faces.last}
        className={spread ? 'left-1/2 w-1/2' : 'inset-x-0'}
      >
        {pages[pages.length - 1]}
      </PageFace>
      {angles.map((angle, leaf) => (
        <Leaf
          key={leaf}
          leaf={leaf}
          count={leafCount}
          angle={angle}
          spread={spread}
          front={front(leaf)}
          back={back(leaf)}
          frontShown={leaf === turned}
          backShown={leaf === turned - 1}
          frontVisible={faces.fronts[leaf]}
          backVisible={faces.backs[leaf]}
        />
      ))}
    </div>
  )
}

interface LeafProps {
  leaf: number
  count: number
  angle: MotionValue<number>
  spread: boolean
  front: ReactNode
  back: ReactNode
  frontShown: boolean
  backShown: boolean
  frontVisible: boolean
  backVisible: boolean
}

function Leaf(props: LeafProps) {
  const { leaf, count, angle, spread, front, back, frontShown, backShown, frontVisible, backVisible } = props
  const zIndex = useTransform(angle, a => leafLayer(leaf, count, a))
  // Light falls on the page as it rises and leaves it as it lands
  const frontShade = useTransform(angle, [0, -90], [0, 0.3])
  const backShade = useTransform(angle, [-90, -180], [0.3, 0])
  // One page at a time there is no left page: a turned leaf fades away as it lands
  const backOpacity = useTransform(angle, [-140, -180], [1, spread ? 1 : 0])

  return (
    <motion.div
      className={`absolute inset-y-0 origin-left transform-3d ${spread ? 'left-1/2 w-1/2' : 'inset-x-0'}`}
      style={{ rotateY: angle, zIndex }}
    >
      <PageFace side={spread ? 'right' : 'single'} shown={frontShown} visible={frontVisible} shade={frontShade} className="inset-0">
        {front}
      </PageFace>
      <PageFace
        side={spread ? 'left' : 'single'}
        shown={backShown}
        visible={backVisible}
        shade={backShade}
        back
        opacity={backOpacity}
        className="inset-0"
      >
        {back}
      </PageFace>
    </motion.div>
  )
}

const RADIUS = {
  // The outer corners are round like the brand; the spine side only softly
  right: 'rounded-r-(--page-r) rounded-l-(--spine-r)',
  left: 'rounded-l-(--page-r) rounded-r-(--spine-r)',
  single: 'rounded-(--page-r)',
}

interface PageFaceProps {
  side: keyof typeof RADIUS
  /** Pages that are not the open spread leave the tab order and the accessibility tree */
  shown?: boolean
  /** Covered or facing away while every leaf near it rests: not painted at all */
  visible: boolean
  shade?: MotionValue<number>
  back?: boolean
  opacity?: MotionValue<number>
  className: string
  children: ReactNode
}

function PageFace({ side, shown = true, visible, shade, back = false, opacity, className, children }: PageFaceProps) {
  return (
    <motion.div
      inert={!shown}
      className={`@container absolute inset-y-0 overflow-hidden backface-hidden bg-surface ${RADIUS[side]} ${visible ? '' : 'invisible'} ${className}`}
      style={{ rotateY: back ? 180 : 0, opacity }}
    >
      {children}
      {shade && <Shade amount={shade} />}
    </motion.div>
  )
}

// The darkening of a page in motion; at rest it is not painted at all
function Shade({ amount }: { amount: MotionValue<number> }) {
  const visibility = useTransform(amount, a => (a > 0.001 ? 'visible' : 'hidden'))
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-night"
      style={{ opacity: amount, visibility }}
    />
  )
}
