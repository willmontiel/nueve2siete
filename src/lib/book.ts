// Geometry of a rigid leaf turning on the spine. Angles are degrees around the vertical axis:
// 0 lies flat on the right, -180 lies flat on the left.

export type RestAngle = 0 | -180

interface Drag {
  /** Where the leaf rested when it was grabbed */
  from: RestAngle
  startX: number
  x: number
  spineX: number
  pageWidth: number
}

// Below this a quick flick decides the turn instead of the halfway point (pointer px per ms)
const FLICK = 0.5

const toDegrees = (radians: number) => (radians * 180) / Math.PI
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * The grabbed point of a rigid leaf follows the pointer: its distance to the spine is r·cos(θ).
 * A grab close to the spine still turns the leaf at a usable rate, from a third of the page.
 */
export function dragAngle({ from, startX, x, spineX, pageWidth }: Drag): number {
  const radius = Math.max(Math.abs(startX - spineX), pageWidth / 3)
  const startCos = from === 0 ? 1 : -1
  return -toDegrees(Math.acos(clamp(startCos + (x - startX) / radius, -1, 1)))
}

/** A released leaf finishes the turn past halfway, unless a quick flick says otherwise */
export function settleAngle(angle: number, velocity: number): RestAngle {
  if (velocity <= -FLICK) return -180
  if (velocity >= FLICK) return 0
  return angle <= -90 ? -180 : 0
}

/** z-index: resting leaves pile up on their side, and a leaf in motion passes over all of them */
export function leafLayer(index: number, count: number, angle: number): number {
  const onLeft = angle < -90
  const resting = onLeft ? index + 1 : count - index
  const moving = angle < 0 && angle > -180
  return moving ? resting + count : resting
}

export type LeafRest = 'right' | 'left' | 'moving'

interface Faces {
  fronts: boolean[]
  backs: boolean[]
  /** The page under the first leaf on the left (spread only) */
  firstLeft: boolean
  /** The page under the last leaf */
  last: boolean
}

/**
 * Which faces can be seen. A face is hidden when it faces away at rest or a resting leaf lies on top of it;
 * anything near a moving leaf stays painted. One page at a time, a turned leaf leaves the stage.
 */
export function visibleFaces(rests: LeafRest[], spread: boolean): Faces {
  const firstRight = rests.indexOf('right')
  const lastLeft = rests.lastIndexOf('left')
  return {
    fronts: rests.map((rest, i) => rest !== 'left' && (firstRight === -1 || firstRight >= i)),
    backs: rests.map((rest, i) =>
      spread ? rest !== 'right' && lastLeft <= i : rest === 'moving',
    ),
    firstLeft: lastLeft === -1,
    last: firstRight === -1,
  }
}
