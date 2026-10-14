import { useEffect, useRef, useState, type FocusEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { rockAngle, swingFor, type Point } from '../../lib/garland'

interface HangerProps {
  /** Its place on the garland: neighbours swing at slightly different rates */
  index: number
  /** Horizontal speed of the garland in px per second; the tag trails it */
  velocity: MotionValue<number>
  /** It drops onto the string when the string reaches it */
  dropped: boolean
  wide?: boolean
  front: ReactNode
  /** A tag with a back turns over when it is tapped */
  back?: ReactNode
  flipped?: boolean
  onTap?: () => void
  /** Keyboard focus moved into the tag (the garland brings it to the middle of the screen) */
  onFocusVisible: (slot: HTMLElement) => void
}

// Underdamped, so a tag swings past straight a few times before it settles; each a little different
const SWINGS = [
  { stiffness: 70, damping: 5, mass: 1 },
  { stiffness: 84, damping: 6, mass: 1 },
  { stiffness: 62, damping: 4.5, mass: 1 },
]
const DROP = { type: 'spring', stiffness: 130, damping: 8 } as const
// Pixels a press travels before it becomes a rock of the tag rather than a tap
const ROCK_START = 6

type Gesture =
  | { kind: 'press'; pointerId: number; pivot: Point; grab: Point }
  | { kind: 'rock'; pointerId: number; pivot: Point; grab: Point }
  | { kind: 'ignore'; pointerId: number }

// A gift tag tied to the garland's string by a loop of ribbon through its eyelet
export function Hanger({ index, velocity, dropped, wide = false, front, back, flipped = false, onTap, onFocusVisible }: HangerProps) {
  const reduceMotion = useReducedMotion()
  const slotRef = useRef<HTMLLIElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const rock = useMotionValue(0)
  const nudge = useMotionValue(0)
  const target = useTransform([velocity, rock, nudge], ([v, r, n]: number[]) => (reduceMotion ? 0 : swingFor(v) + r + n))
  const swing = useSpring(target, SWINGS[index % SWINGS.length])
  // While the tag turns over both faces are painted; at rest only the one facing the visitor
  const [turning, setTurning] = useState(false)
  const [lastFlipped, setLastFlipped] = useState(flipped)
  if (flipped !== lastFlipped) {
    setLastFlipped(flipped)
    setTurning(true)
  }

  // Turning the tag over from its button hides that button with its face, so focus moves to the button on
  // the face that comes up instead of falling back to the page
  const focusAfterTurn = useRef(false)
  function onClickCapture(e: MouseEvent<HTMLLIElement>) {
    if ((e.target as Element).closest('[data-flip]')) focusAfterTurn.current = true
  }
  useEffect(() => {
    if (!focusAfterTurn.current) return
    focusAfterTurn.current = false
    slotRef.current!.querySelector<HTMLElement>(`[data-face="${flipped ? 'back' : 'front'}"] [data-flip]`)?.focus()
  }, [flipped])

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || gesture.current) return
    if ((e.target as Element).closest('a, button')) return
    const slot = slotRef.current!.getBoundingClientRect()
    gesture.current = {
      kind: 'press',
      pointerId: e.pointerId,
      pivot: { x: slot.left + slot.width / 2, y: slot.top },
      grab: { x: e.clientX, y: e.clientY },
    }
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== e.pointerId || current.kind === 'ignore') return
    const dx = e.clientX - current.grab.x
    const dy = e.clientY - current.grab.y
    if (current.kind === 'press') {
      if (Math.abs(dx) < ROCK_START && Math.abs(dy) < ROCK_START) return
      // A mostly vertical move is the visitor scrolling the page
      if (Math.abs(dy) > Math.abs(dx) || reduceMotion) {
        gesture.current = { kind: 'ignore', pointerId: e.pointerId }
        return
      }
      e.currentTarget.setPointerCapture(e.pointerId)
      gesture.current = { ...current, kind: 'rock' }
    }
    rock.set(rockAngle(current.pivot, current.grab, { x: e.clientX, y: e.clientY }))
  }

  function onPointerEnd(e: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== e.pointerId) return
    gesture.current = null
    if (current.kind === 'press' && e.type === 'pointerup') onTap?.()
    // Let go, the tag swings back on its own
    rock.set(0)
  }

  function onPointerEnter(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== 'mouse' || reduceMotion) return
    animate(nudge, [0, index % 2 ? 5 : -5, 0], { duration: 0.35 })
  }

  function onFocus(e: FocusEvent<HTMLLIElement>) {
    if ((e.target as Element).matches(':focus-visible')) onFocusVisible(slotRef.current!)
  }

  return (
    <li
      ref={slotRef}
      data-slot
      onFocus={onFocus}
      onClickCapture={onClickCapture}
      className={`relative shrink-0 mt-(--string-y) snap-center ${wide ? 'w-[calc(var(--tag-w)*1.12)]' : 'w-(--tag-w)'}`}
    >
      <motion.div
        className="origin-top"
        initial={reduceMotion ? false : { y: -90, opacity: 0, rotate: index % 2 ? 9 : -9 }}
        animate={dropped || reduceMotion ? { y: 0, opacity: 1, rotate: 0 } : undefined}
        transition={{ default: DROP, opacity: { duration: 0.25 } }}
      >
        <motion.div className="origin-top" style={{ rotate: swing }}>
          {/* The loop of ribbon from the string, down through the eyelet */}
          <svg viewBox="0 0 40 64" className="relative z-10 mx-auto block w-10 h-16 text-orange overflow-visible" aria-hidden="true">
            <path
              d="M 20 2 C 4 22, 6 52, 20 62 C 34 52, 36 22, 20 2"
              fill="none"
              stroke="currentColor"
              strokeWidth={6}
              strokeLinecap="round"
            />
          </svg>
          <div className="-mt-7 perspective-[1600px]">
            <motion.div
              className="relative aspect-[7/10] transform-3d touch-pan-y select-none"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 90, damping: 14 }}
              onAnimationComplete={() => setTurning(false)}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onPointerEnter={onPointerEnter}
            >
              <Face shown={!flipped} painted={!flipped || turning}>
                {front}
              </Face>
              {back && (
                <Face shown={flipped} painted={flipped || turning} back>
                  {back}
                </Face>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </li>
  )
}

// The eyelet is a real hole: the page shows through it, ringed like the reinforced hole of a gift tag. The
// gradient is only a hard-edged mask that cuts the hole; nothing is painted with it.
const EYELET = 'radial-gradient(circle at 50% 1.75rem, transparent 0.8rem, #000 calc(0.8rem + 0.5px))' // taste-skill-ignore

function Face({ shown, painted, back = false, children }: { shown: boolean; painted: boolean; back?: boolean; children: ReactNode }) {
  return (
    <div
      data-face={back ? 'back' : 'front'}
      inert={!shown}
      className={`@container absolute inset-0 overflow-hidden rounded-[2rem] backface-hidden ${painted ? '' : 'invisible'}`}
      style={{ transform: back ? 'rotateY(180deg)' : undefined, maskImage: EYELET, WebkitMaskImage: EYELET }}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[1.75rem] w-[2.9rem] h-[2.9rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.3rem] border-night/15"
      />
    </div>
  )
}
