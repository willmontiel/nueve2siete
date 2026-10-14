import { describe, expect, it } from 'vitest'
import { droppedCount, garlandPath, rockAngle, scrollToCenter, swingFor } from './garland'

describe('garlandPath', () => {
  const points = [
    { x: 300, y: 150 },
    { x: 800, y: 150 },
    { x: 1300, y: 150 },
  ]
  const from = { x: 40, y: -60 }
  const to = { x: 1600, y: -60 }
  const d = garlandPath(points, from, to, 40)

  it('comes down from above the stage', () => {
    expect(d.startsWith('M 40 -60')).toBe(true)
  })

  it('passes through every hang point', () => {
    for (const p of points) expect(d).toContain(` ${p.x} ${p.y}`)
  })

  it('dips by the sag halfway between two hang points', () => {
    expect(d).toContain(' 550 190')
  })

  it('stays round at every hang point: the string arrives and leaves level, with no peak', () => {
    // Between 300 and 800 the curve leaves the first point heading level, and reaches the second level too
    expect(d).toContain('C 425 150')
    expect(d).toContain('675 150 800 150')
  })

  it('leaves at the far end', () => {
    expect(d.endsWith('1600 -60')).toBe(true)
  })
})

describe('swingFor', () => {
  it('hangs straight while the garland is still', () => {
    expect(swingFor(0)).toBe(0)
  })

  it('trails the motion: moving left swings the tags anticlockwise', () => {
    expect(swingFor(-500)).toBeLessThan(0)
    expect(swingFor(500)).toBeGreaterThan(0)
  })

  it('never swings past the limit', () => {
    expect(swingFor(-100000)).toBe(-14)
    expect(swingFor(100000)).toBe(14)
  })
})

describe('droppedCount', () => {
  it('drops nothing before the string reaches the first tag', () => {
    expect(droppedCount(0.2, 6, 0.4, 0.1)).toBe(0)
  })

  it('drops one tag more at each step', () => {
    expect(droppedCount(0.4, 6, 0.4, 0.1)).toBe(1)
    expect(droppedCount(0.55, 6, 0.4, 0.1)).toBe(2)
  })

  it('never drops more tags than there are', () => {
    expect(droppedCount(5, 6, 0.4, 0.1)).toBe(6)
  })

  // The entrance ends (progress 1) when the section pins; the closing tag must already hang by then
  it('drops every tag by the end of the entrance, however many there are', () => {
    expect(droppedCount(1, 12, 0.4, 0.09)).toBe(12)
    expect(droppedCount(0.99, 30, 0.4, 0.09)).toBe(30)
  })
})

describe('rockAngle', () => {
  const pivot = { x: 0, y: 0 }
  const grab = { x: 0, y: 200 }

  it('stays put until the pointer moves', () => {
    expect(rockAngle(pivot, grab, grab)).toBeCloseTo(0)
  })

  it('turns anticlockwise when the bottom is pulled to the right', () => {
    expect(rockAngle(pivot, grab, { x: 200, y: 200 })).toBeCloseTo(-40)
    expect(rockAngle(pivot, grab, { x: 60, y: 200 })).toBeCloseTo(-16.7, 1)
  })

  it('turns clockwise when pulled to the left, within the limit', () => {
    expect(rockAngle(pivot, grab, { x: -60, y: 200 })).toBeCloseTo(16.7, 1)
    expect(rockAngle(pivot, grab, { x: -400, y: 10 })).toBe(40)
  })
})

describe('scrollToCenter', () => {
  it('scrolls so the tag sits in the middle of the screen', () => {
    expect(scrollToCenter(1500, 1000, 2000)).toBe(1000)
  })

  it('stays within the run at both ends', () => {
    expect(scrollToCenter(200, 1000, 2000)).toBe(0)
    expect(scrollToCenter(4000, 1000, 2000)).toBe(2000)
  })
})
