import { describe, expect, it } from 'vitest'

import { fitToArea, logoShapes, pathToShapes } from '@/components/mic3d/logo-shapes'

// A 100 px square with a square hole in the middle, as the engine returns them.
const SQUARE_WITH_HOLE = 'M0 0 100 0 100 100 0 100 Z M25 25 75 25 75 75 25 75 Z'

describe('pathToShapes', () => {
  it('detects holes with the even-odd rule', () => {
    const shapes = pathToShapes(SQUARE_WITH_HOLE)
    expect(shapes).toHaveLength(1)
    expect(shapes[0]!.holes).toHaveLength(1)
  })

  it('splits separate pieces', () => {
    const shapes = pathToShapes('M0 0 10 0 10 10 0 10 Z M50 0 60 0 60 10 50 10 Z')
    expect(shapes).toHaveLength(2)
    expect(shapes.every((shape) => shape.holes.length === 0)).toBe(true)
  })

  it('reads an M attached to the first number and flips the y axis', () => {
    const [shape] = pathToShapes('M10 20 30 20 30 40 Z')
    const ys = shape!.getPoints().map((p) => p.y)
    expect(Math.max(...ys)).toBe(-20)
    expect(Math.min(...ys)).toBe(-40)
  })
})

describe('fitToArea', () => {
  it('fits the actual logo outline into the area, centered', () => {
    // 200 × 100 px logo between x 100..300 and y -150..-50.
    const { bounds } = logoShapes([{ colorIndex: 0, path: 'M100 50 300 50 300 150 100 150 Z' }])
    const fit = fitToArea(bounds, 40, 40)
    expect(fit.scale).toBeCloseTo(0.2) // width wins: 200 px → 40 mm
    expect(fit.x).toBeCloseTo(-200 * 0.2)
    expect(fit.y).toBeCloseTo(100 * 0.2)
  })
})
