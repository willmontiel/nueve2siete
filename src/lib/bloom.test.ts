import { describe, expect, it } from 'vitest'
import { FLOWER, FLOWER_MASK, bloomSize, petalCentres, valleyRadius } from './bloom'

const distance = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y)

describe('the clicker flower', () => {
  it('has six petals round the middle of a 100-unit box, all inside it', () => {
    const petals = petalCentres()
    expect(petals).toHaveLength(6)
    for (const petal of petals) {
      expect(distance(petal, { x: 50, y: 50 })).toBeCloseTo(FLOWER.ring)
      expect(Math.min(petal.x, petal.y) - FLOWER.petal).toBeGreaterThanOrEqual(0)
      expect(Math.max(petal.x, petal.y) + FLOWER.petal).toBeLessThanOrEqual(100)
    }
  })

  it('finds the valley, where two neighbouring petals meet on the outside', () => {
    const [first, second] = petalCentres()
    const between = Math.atan2(first.y + second.y - 100, first.x + second.x - 100)
    const valley = { x: 50 + Math.cos(between) * valleyRadius(), y: 50 + Math.sin(between) * valleyRadius() }
    expect(distance(valley, first)).toBeCloseTo(FLOWER.petal)
    expect(distance(valley, second)).toBeCloseTo(FLOWER.petal)
  })

  it('is the shape of the mask: one circle per petal and one for the centre', () => {
    expect(FLOWER_MASK.startsWith('url("data:image/svg+xml,')).toBe(true)
    expect(decodeURIComponent(FLOWER_MASK).match(/<circle/g)).toHaveLength(7)
  })
})

describe('bloomSize', () => {
  const screens = [
    [1440, 900],
    [390, 844],
  ]

  it('grows the flower until its valleys pass the farthest corner of the screen', () => {
    for (const [width, height] of screens) {
      for (const [x, y] of [
        [width - 40, height - 40],
        [width / 2, height / 2],
        [20, 30],
      ]) {
        const size = bloomSize(x, y, width, height)
        const reach = (valleyRadius() / 100) * size
        for (const corner of [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: 0, y: height },
          { x: width, y: height },
        ]) {
          expect(reach).toBeGreaterThan(distance({ x, y }, corner))
        }
      }
    }
  })

  it('needs a smaller flower from the middle of the screen than from a corner', () => {
    expect(bloomSize(720, 450, 1440, 900)).toBeLessThan(bloomSize(1400, 860, 1440, 900))
  })
})
