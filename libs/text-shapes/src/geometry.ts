import {
  ClipType,
  differenceD,
  intersectD,
  ellipseD,
  EndType,
  FillRule,
  inflatePathsD,
  JoinType,
  PolyTreeD,
  booleanOpD,
  booleanOpDWithPolyTree,
  areaPathsD,
  type PolyPathD,
} from 'clipper2-ts'

/** 2D geometry in millimeters, y up. Thin wrappers over Clipper2 (unions and offsets of polygons). */

export interface Point {
  x: number
  y: number
}

/** A closed polygon. Its winding says whether it's filled or a hole (non-zero rule). */
export type Contour = Point[]

/** A filled area: one outer contour and the holes inside it. */
export interface Region {
  outer: Contour
  holes: Contour[]
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

/** Decimals kept by Clipper: 0.001 mm, far below what a printer can make. */
const PRECISION = 3
/** Max deviation of the round joins from a true arc. */
const ARC_TOLERANCE_MM = 0.02

export function union(contours: Contour[]): Contour[] {
  return booleanOpD(ClipType.Union, contours, null, FillRule.NonZero, PRECISION)
}

export function intersect(a: Contour[], b: Contour[]): Contour[] {
  return intersectD(a, b, FillRule.NonZero, PRECISION)
}

export function subtract(from: Contour[], cut: Contour[]): Contour[] {
  return differenceD(from, cut, FillRule.NonZero, PRECISION)
}

/** Grows (positive) or shrinks (negative) the shapes by `deltaMm`, with round corners. */
export function offset(contours: Contour[], deltaMm: number): Contour[] {
  return inflatePathsD(contours, deltaMm, JoinType.Round, EndType.Polygon, 2, PRECISION, ARC_TOLERANCE_MM)
}

/** Filled area in mm² (holes subtract). Expects the output of union/offset. */
export function area(contours: Contour[]): number {
  return Math.abs(areaPathsD(contours))
}

export function circle(cx: number, cy: number, radiusMm: number): Contour {
  const steps = Math.max(24, Math.ceil((2 * Math.PI * radiusMm) / 0.4))
  return ellipseD({ x: cx, y: cy }, radiusMm, radiusMm, steps)
}

export function rectangle(minX: number, minY: number, maxX: number, maxY: number): Contour {
  return [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ]
}

export function bounds(contours: Contour[]): Bounds {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const contour of contours) {
    for (const { x, y } of contour) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }
  return { minX, minY, maxX, maxY }
}

export function translate(contours: Contour[], dx: number, dy: number): Contour[] {
  return contours.map((contour) => contour.map(({ x, y }) => ({ x: x + dx, y: y + dy })))
}

/** Groups contours into outer shapes with their holes (islands inside holes become shapes of their own). */
export function toRegions(contours: Contour[]): Region[] {
  const tree = new PolyTreeD()
  booleanOpDWithPolyTree(ClipType.Union, contours, null, tree, FillRule.NonZero, PRECISION)
  const regions: Region[] = []
  const visitOuter = (node: PolyPathD) => {
    const holes: Contour[] = []
    for (let i = 0; i < node.count; i++) {
      const hole = node.child(i)
      if (hole.poly) holes.push(hole.poly)
      for (let j = 0; j < hole.count; j++) visitOuter(hole.child(j))
    }
    if (node.poly) regions.push({ outer: node.poly, holes })
  }
  for (let i = 0; i < tree.count; i++) visitOuter(tree.child(i))
  return regions
}

export function regionContours(regions: Region[]): Contour[] {
  return regions.flatMap((region) => [region.outer, ...region.holes])
}
