import type { Region } from '@nueve2siete/text-shapes'
import { Path, Shape, Vector2 } from 'three'

/** Turns 2D regions (mm, y up) into three.js shapes ready to extrude. */
export function regionsToShapes(regions: Region[]): Shape[] {
  return regions.map((region) => {
    const shape = new Shape(region.outer.map((p) => new Vector2(p.x, p.y)))
    shape.holes = region.holes.map((hole) => new Path(hole.map((p) => new Vector2(p.x, p.y))))
    return shape
  })
}

/** SVG path data for regions, flipping y so it draws right side up in a box `heightMm` tall. */
export function regionsToPathData(regions: Region[], heightMm: number): string {
  return regions
    .flatMap((region) => [region.outer, ...region.holes])
    .map((contour) => 'M' + contour.map((p) => `${p.x.toFixed(2)} ${(heightMm - p.y).toFixed(2)}`).join('L') + 'Z')
    .join('')
}
