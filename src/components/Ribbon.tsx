import { useEffect } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'

interface RibbonProps {
  /** Centre line of the ribbon, in viewBox units */
  d: string
  viewBox: string
  strokeWidth: number
  /** Position, size and colour; the stroke uses currentColor */
  className?: string
  preserveAspectRatio?: string
  /** Seconds before it starts drawing itself */
  delay?: number
  duration?: number
  /** Scroll progress of the section it lives in, 0 to 1 */
  progress?: MotionValue<number>
  /** Share of its length that winds back into its corner as progress reaches 1 */
  rewind?: number
  /** Degrees it turns as progress reaches 1 */
  turn?: number
  /** It waits, hidden, until this turns true (for ribbons below the first screen) */
  play?: boolean
}

// The brand's ribbon: one thick round-capped line, like the one that loops behind the logo
export function Ribbon({
  d,
  viewBox,
  strokeWidth,
  className,
  preserveAspectRatio,
  delay = 0,
  duration = 1.8,
  progress,
  rewind = 0,
  turn = 0,
  play = true,
}: RibbonProps) {
  const reduceMotion = useReducedMotion()
  const still = useMotionValue(0)
  const scroll = progress ?? still
  const drawn = useMotionValue(reduceMotion ? 1 : 0)

  useEffect(() => {
    if (reduceMotion) {
      drawn.set(1)
      return
    }
    if (!play) return
    const controls = animate(drawn, 1, { duration, delay, ease: [0.33, 1, 0.68, 1] })
    return () => controls.stop()
  }, [drawn, delay, duration, reduceMotion, play])

  const pathLength = useTransform([drawn, scroll], ([drawnShare, scrolled]: number[]) =>
    drawnShare * (1 - (reduceMotion ? 0 : rewind) * scrolled),
  )
  // A zero-length path with round caps still paints a dot, so the ribbon stays hidden until it has length
  const opacity = useTransform(pathLength, [0, 0.01], [0, 1])
  const rotate = useTransform(scroll, [0, 1], [0, reduceMotion ? 0 : turn])

  return (
    <motion.svg
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      className={className}
      style={{ rotate }}
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ pathLength, opacity }}
      />
    </motion.svg>
  )
}
