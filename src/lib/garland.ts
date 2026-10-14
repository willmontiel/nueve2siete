// Geometry of the project garland: one ribbon strung across the page with gift tags hanging from it.

export interface Point {
  x: number
  y: number
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const toDegrees = (radians: number) => (radians * 180) / Math.PI

/**
 * The string of the garland: it comes down from `from` (above the stage, where the hero's ribbon was),
 * dips by `sag` between consecutive hang points and climbs out at `to`. It runs level through every hang
 * point and every dip, so it waves like a ribbon instead of peaking where a tag hangs.
 */
export function garlandPath(points: Point[], from: Point, to: Point, sag: number): string {
  const [first] = points
  const last = points[points.length - 1]
  const spans = points.slice(1).map((point, i) => {
    const prev = points[i]
    const half = (point.x - prev.x) / 2
    const dip = { x: prev.x + half, y: Math.max(prev.y, point.y) + sag }
    return (
      `C ${prev.x + half / 2} ${prev.y} ${dip.x - half / 2} ${dip.y} ${dip.x} ${dip.y} ` +
      `C ${dip.x + half / 2} ${dip.y} ${point.x - half / 2} ${point.y} ${point.x} ${point.y}`
    )
  })
  return [
    `M ${from.x} ${from.y}`,
    `Q ${from.x} ${first.y} ${first.x} ${first.y}`,
    ...spans,
    `Q ${to.x} ${last.y} ${to.x} ${to.y}`,
  ].join(' ')
}

/** Degrees a hanging tag swings for the garland's horizontal speed (px per second): it trails the motion */
export function swingFor(velocity: number, perPxPerSecond = 0.012, max = 14): number {
  return clamp(velocity * perPxPerSecond, -max, max)
}

/** How many tags hang already, when the string has drawn `progress` of its entrance: one more every `step` */
export function droppedCount(progress: number, count: number, start: number, step: number): number {
  return clamp(Math.floor((progress - start) / step) + 1, 0, count)
}

/** Angle of a tag rocked by the pointer: it turns about its hang point to follow where it was grabbed */
export function rockAngle(pivot: Point, grab: Point, pointer: Point, max = 40): number {
  const angle = (p: Point) => -toDegrees(Math.atan2(p.x - pivot.x, p.y - pivot.y))
  return clamp(angle(pointer) - angle(grab), -max, max)
}

/** Pixels into the pinned run that bring a tag (its centre along the strip) to the middle of the screen */
export function scrollToCenter(tagCenter: number, viewport: number, travel: number): number {
  return clamp(tagCenter - viewport / 2, 0, travel)
}
