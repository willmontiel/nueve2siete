export interface Point {
  x: number
  y: number
}

/** Brand colour tokens (src/index.css) that show on both themes */
export type BurstColor = 'orange' | 'lavender' | 'mustard' | 'pink' | 'lime'

export interface BurstRibbon {
  /** The centre line, starting past the screen edge it comes from */
  points: Point[]
  /** The same line as a smooth SVG path */
  d: string
  color: BurstColor
  /** Stroke width in px */
  width: number
  /** Seconds after the bow is pulled */
  delay: number
}

type Edge = 'left' | 'top' | 'right' | 'bottom'

const EDGES: Edge[] = ['left', 'top', 'right', 'bottom']
const COLORS: BurstColor[] = ['orange', 'lavender', 'mustard', 'pink', 'lime']
const COUNT = 6
const STAGGER = 0.07
// Points round each loop; the line comes back to where the loop started, so it crosses itself once
const LOOP_STEPS = 8

const between = (random: () => number, min: number, max: number) => min + random() * (max - min)
const step = (from: Point, angle: number, distance: number): Point => ({
  x: from.x + Math.cos(angle) * distance,
  y: from.y + Math.sin(angle) * distance,
})
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function shuffled<T>(items: T[], random: () => number) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// One ribbon: in from past its edge, a loop, then a short run on to a tip. The loop sits a fifth to two
// fifths of the way in and away from the side edges, so the loop and the run after it stay on the screen.
function ribbonPoints(edge: Edge, width: number, height: number, stroke: number, random: () => number): Point[] {
  const short = Math.min(width, height)
  const along = between(random, 0.2, 0.8)
  const into = between(random, 0.22, 0.4)
  const across = clamp(along + between(random, -0.15, 0.15), 0.25, 0.75)
  const ends: Record<Edge, [Point, Point]> = {
    left: [{ x: -stroke, y: along * height }, { x: into * width, y: across * height }],
    right: [{ x: width + stroke, y: along * height }, { x: (1 - into) * width, y: across * height }],
    top: [{ x: along * width, y: -stroke }, { x: across * width, y: into * height }],
    bottom: [{ x: along * width, y: height + stroke }, { x: across * width, y: (1 - into) * height }],
  }
  const [start, loopAt] = ends[edge]
  const heading = Math.atan2(loopAt.y - start.y, loopAt.x - start.x)
  const travel = Math.hypot(loopAt.x - start.x, loopAt.y - start.y)
  const side = random() < 0.5 ? 1 : -1
  // A slight sideways give halfway along a straight run, at most about 11°
  const bend = (length: number) => between(random, -0.1, 0.1) * length

  const radius = short * between(random, 0.06, 0.1)
  const centre = step(loopAt, heading + (side * Math.PI) / 2, radius)
  const from = Math.atan2(loopAt.y - centre.y, loopAt.x - centre.x)
  const loop = Array.from({ length: LOOP_STEPS }, (_, k) =>
    step(centre, from + (side * (k + 1) * 2 * Math.PI) / LOOP_STEPS, radius),
  )

  // Out of the loop it keeps turning the same way, a little
  const after = heading + side * between(random, 0.2, 0.7)
  const run = short * between(random, 0.12, 0.25)
  const end = step(loopAt, after, run)
  const margin = stroke * 2
  const tip = { x: clamp(end.x, margin, width - margin), y: clamp(end.y, margin, height - margin) }

  return [
    start,
    step(step(start, heading, travel / 2), heading + Math.PI / 2, bend(travel)),
    loopAt,
    ...loop,
    step(step(loopAt, after, run / 2), after + Math.PI / 2, bend(run)),
    tip,
  ]
}

// A Catmull-Rom curve through every point, written as cubic Béziers
export function smoothPath(points: Point[]) {
  const n = (value: number) => value.toFixed(1)
  let d = `M${n(points[0].x)} ${n(points[0].y)}`
  for (let i = 0; i < points.length - 1; i++) {
    const before = points[i - 1] ?? points[i]
    const from = points[i]
    const to = points[i + 1]
    const next = points[i + 2] ?? to
    d +=
      `C${n(from.x + (to.x - before.x) / 6)} ${n(from.y + (to.y - before.y) / 6)} ` +
      `${n(to.x - (next.x - from.x) / 6)} ${n(to.y - (next.y - from.y) / 6)} ${n(to.x)} ${n(to.y)}`
  }
  return d
}

/** The ribbons the bow lets loose: each enters from past a screen edge, ties a loop and stops on the screen */
export function burstRibbons(width: number, height: number, random: () => number = Math.random): BurstRibbon[] {
  const stroke = Math.round(clamp(Math.min(width, height) * 0.028, 12, 24))
  const firstEdge = Math.floor(random() * EDGES.length)
  const palette = shuffled(COLORS, random)
  // A sixth colour that differs from the fifth
  const colors = [...palette, palette[Math.floor(random() * (palette.length - 1))]]

  return Array.from({ length: COUNT }, (_, i) => {
    const points = ribbonPoints(EDGES[(firstEdge + i) % EDGES.length], width, height, stroke, random)
    return { points, d: smoothPath(points), color: colors[i], width: stroke, delay: i * STAGGER }
  })
}
