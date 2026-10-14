import { describe, expect, it } from 'vitest'
import { dragAngle, leafLayer, settleAngle, visibleFaces } from './book'

const spineX = 500
const pageWidth = 400

describe('dragAngle', () => {
  it('stands a leaf upright when its outer edge is dragged to the spine', () => {
    expect(dragAngle({ from: 0, startX: spineX + pageWidth, x: spineX, spineX, pageWidth })).toBeCloseTo(-90)
  })

  it('lays the leaf on the left when the edge reaches the mirror position, and no further', () => {
    expect(dragAngle({ from: 0, startX: spineX + pageWidth, x: spineX - pageWidth, spineX, pageWidth })).toBeCloseTo(-180)
    expect(dragAngle({ from: 0, startX: spineX + pageWidth, x: 0, spineX, pageWidth })).toBeCloseTo(-180)
  })

  it('keeps a leaf flat when it is pushed the wrong way', () => {
    expect(dragAngle({ from: 0, startX: spineX + 200, x: spineX + 380, spineX, pageWidth })).toBeCloseTo(0)
  })

  it('turns a leaf back from the left page', () => {
    expect(dragAngle({ from: -180, startX: spineX - pageWidth, x: spineX, spineX, pageWidth })).toBeCloseTo(-90)
    expect(dragAngle({ from: -180, startX: spineX - pageWidth, x: spineX + pageWidth, spineX, pageWidth })).toBeCloseTo(0)
  })

  it('does not jump when the leaf is grabbed next to the spine', () => {
    const grab = { from: 0 as const, startX: spineX + 10, spineX, pageWidth }
    expect(dragAngle({ ...grab, x: spineX + 10 })).toBeCloseTo(0)
    expect(dragAngle({ ...grab, x: spineX })).toBeGreaterThan(-30)
  })
})

describe('settleAngle', () => {
  it('completes a slow turn that passed halfway', () => {
    expect(settleAngle(-120, -0.05)).toBe(-180)
  })

  it('drops a slow turn back that did not reach halfway', () => {
    expect(settleAngle(-60, -0.05)).toBe(0)
  })

  it('completes a quick flick to the left before halfway', () => {
    expect(settleAngle(-30, -0.9)).toBe(-180)
  })

  it('sends a leaf back with a quick flick to the right past halfway', () => {
    expect(settleAngle(-150, 0.9)).toBe(0)
  })
})

describe('leafLayer', () => {
  const count = 5

  it('piles unturned leaves with the first one on top', () => {
    expect(leafLayer(0, count, 0)).toBeGreaterThan(leafLayer(1, count, 0))
  })

  it('piles turned leaves with the last one turned on top', () => {
    expect(leafLayer(3, count, -180)).toBeGreaterThan(leafLayer(2, count, -180))
  })

  it('passes a leaf in motion over every leaf at rest', () => {
    const resting = [0, 1, 2, 3, 4].flatMap(i => [leafLayer(i, count, 0), leafLayer(i, count, -180)])
    expect(leafLayer(4, count, -60)).toBeGreaterThan(Math.max(...resting))
    expect(leafLayer(0, count, -150)).toBeGreaterThan(Math.max(...resting))
  })
})

describe('visibleFaces', () => {
  it('paints only the open spread when every leaf is at rest', () => {
    const faces = visibleFaces(['left', 'left', 'right', 'right', 'right'], true)
    expect(faces.fronts).toEqual([false, false, true, false, false])
    expect(faces.backs).toEqual([false, true, false, false, false])
    expect(faces.firstLeft).toBe(false)
    expect(faces.last).toBe(false)
  })

  it('uncovers both pages under a turning leaf', () => {
    const faces = visibleFaces(['left', 'left', 'moving', 'right', 'right'], true)
    expect(faces.fronts).toEqual([false, false, true, true, false])
    expect(faces.backs).toEqual([false, true, true, false, false])
  })

  it('shows the inside of the cover and the first leaf before anything turns', () => {
    const faces = visibleFaces(['right', 'right', 'right'], true)
    expect(faces.firstLeft).toBe(true)
    expect(faces.fronts).toEqual([true, false, false])
    expect(faces.last).toBe(false)
  })

  it('shows the last page once every leaf is turned', () => {
    expect(visibleFaces(['left', 'left'], true).last).toBe(true)
  })

  it('hides the blank back of a turned leaf one page at a time, except while it turns', () => {
    expect(visibleFaces(['left', 'right'], false).backs).toEqual([false, false])
    expect(visibleFaces(['moving', 'right'], false).backs).toEqual([true, false])
  })
})
