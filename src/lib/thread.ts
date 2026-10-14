import type { Point } from './garland'

const round = (value: number) => Math.round(value * 10) / 10
const at = (p: Point) => `${round(p.x)} ${round(p.y)}`

/**
 * A ribbon that threads a row of stops (the steps of "Cómo se pide"): it comes in from `from` at the screen's
 * edge, passes through every stop and ties one loop, `loop` px across, halfway between each pair of them, like
 * the loops in the letters of the logo.
 */
export function threadPath(from: Point, stops: Point[], loop: number): string {
  const [first] = stops
  // Leave the edge level, arrive at the first stop heading down
  const parts = [
    `M ${at(from)}`,
    `C ${at({ x: from.x + (first.x - from.x) * 0.6, y: from.y })} ${at({ x: first.x, y: first.y - (first.y - from.y) * 0.5 })} ${at(first)}`,
  ]

  stops.slice(1).forEach((stop, i) => {
    const prev = stops[i]
    const length = Math.hypot(stop.x - prev.x, stop.y - prev.y)
    const t = { x: (stop.x - prev.x) / length, y: (stop.y - prev.y) / length }
    const n = { x: -t.y, y: t.x }
    const mid = { x: (prev.x + stop.x) / 2, y: (prev.y + stop.y) / 2 }
    const reach = length * 0.25
    const along = (p: Point, k: number) => ({ x: p.x + t.x * k, y: p.y + t.y * k })
    // The loop leaves the middle forward and to one side, swings round and crosses itself there
    const out = { x: mid.x + (t.x * 1.2 + n.x * 1.3) * loop, y: mid.y + (t.y * 1.2 + n.y * 1.3) * loop }
    const back = { x: mid.x + (-t.x * 1.2 + n.x * 1.3) * loop, y: mid.y + (-t.y * 1.2 + n.y * 1.3) * loop }
    parts.push(
      `C ${at(along(prev, reach))} ${at(along(mid, -reach))} ${at(mid)}`,
      `C ${at(out)} ${at(back)} ${at(mid)}`,
      `C ${at(along(mid, reach))} ${at(along(stop, -reach))} ${at(stop)}`,
    )
  })

  return parts.join(' ')
}
