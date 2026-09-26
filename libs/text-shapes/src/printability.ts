import { area, offset, type Contour } from './geometry'

/**
 * Printability checks on 2D shapes, the vector version of the logo engine's morphology: shrinking and growing
 * back ("opening") erases whatever is thinner than a line the nozzle can draw; growing and shrinking back
 * ("closing") fills the gaps too narrow to stay open.
 */

/** mm² of the shapes that are thinner than `minFeatureMm` (they'd print broken or not at all). */
export function thinArea(contours: Contour[], minFeatureMm: number): number {
  if (!contours.length) return 0
  const r = minFeatureMm / 2
  const opened = offset(offset(contours, -r), r)
  return Math.max(0, area(contours) - area(opened))
}

/** mm² of gaps narrower than `minGapMm` (they'd close up when printed, merging the parts beside them). */
export function narrowGapArea(contours: Contour[], minGapMm: number): number {
  if (!contours.length) return 0
  const r = minGapMm / 2
  const closed = offset(offset(contours, r), -r)
  return Math.max(0, area(closed) - area(contours))
}
