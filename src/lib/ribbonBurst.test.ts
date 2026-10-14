import { describe, expect, it } from 'vitest'
import { burstRibbons, type Point } from './ribbonBurst'

// A repeatable stand-in for Math.random
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SCREENS = [
  [1440, 900],
  [390, 844],
  [768, 1024],
]

function everyBurst(check: (ribbons: ReturnType<typeof burstRibbons>, width: number, height: number) => void) {
  for (const [width, height] of SCREENS) {
    for (let seed = 1; seed <= 40; seed++) check(burstRibbons(width, height, seeded(seed)), width, height)
  }
}

function edgeOf({ x, y }: Point, width: number, height: number) {
  if (x < 0) return 'left'
  if (x > width) return 'right'
  if (y < 0) return 'top'
  if (y > height) return 'bottom'
  return null
}

// The turn at each point between its two neighbours, in degrees (positive one way, negative the other)
function turns(points: Point[]) {
  const result: number[] = []
  for (let i = 2; i < points.length; i++) {
    const a = Math.atan2(points[i - 1].y - points[i - 2].y, points[i - 1].x - points[i - 2].x)
    const b = Math.atan2(points[i].y - points[i - 1].y, points[i].x - points[i - 1].x)
    let turn = b - a
    while (turn > Math.PI) turn -= 2 * Math.PI
    while (turn < -Math.PI) turn += 2 * Math.PI
    result.push((turn * 180) / Math.PI)
  }
  return result
}

// The most the line turns in one stretch: a loop is a stretch that comes round a full circle
function longestTurn(points: Point[]) {
  let best = 0
  for (const sign of [1, -1]) {
    let run = 0
    for (const turn of turns(points)) {
      run = Math.max(0, run + sign * turn)
      best = Math.max(best, run)
    }
  }
  return best
}

describe('burstRibbons', () => {
  it('throws six ribbons', () => {
    everyBurst(ribbons => expect(ribbons).toHaveLength(6))
  })

  it('starts each ribbon past an edge, so it enters from outside and winds back out there', () => {
    everyBurst((ribbons, width, height) => {
      for (const { points, width: stroke } of ribbons) {
        const start = points[0]
        expect(edgeOf(start, width, height)).not.toBeNull()
        const outside = Math.max(-start.x, start.x - width, -start.y, start.y - height)
        expect(outside).toBeGreaterThanOrEqual(stroke / 2)
      }
    })
  })

  it('comes from at least three different edges', () => {
    everyBurst((ribbons, width, height) => {
      expect(new Set(ribbons.map(r => edgeOf(r.points[0], width, height))).size).toBeGreaterThanOrEqual(3)
    })
  })

  it('lands the tip of each ribbon on the screen', () => {
    everyBurst((ribbons, width, height) => {
      for (const { points, width: stroke } of ribbons) {
        const tip = points.at(-1)!
        expect(tip.x).toBeGreaterThanOrEqual(stroke)
        expect(tip.x).toBeLessThanOrEqual(width - stroke)
        expect(tip.y).toBeGreaterThanOrEqual(stroke)
        expect(tip.y).toBeLessThanOrEqual(height - stroke)
      }
    })
  })

  it('ties one loop in each ribbon', () => {
    everyBurst(ribbons => {
      for (const { points } of ribbons) expect(longestTurn(points)).toBeGreaterThanOrEqual(300)
    })
  })

  it('never folds back on itself', () => {
    everyBurst(ribbons => {
      for (const { points } of ribbons) {
        for (const turn of turns(points)) expect(Math.abs(turn)).toBeLessThan(90)
      }
    })
  })

  it('uses at least four brand colours, never the same one twice in a row', () => {
    everyBurst(ribbons => {
      expect(new Set(ribbons.map(r => r.color)).size).toBeGreaterThanOrEqual(4)
      for (let i = 1; i < ribbons.length; i++) expect(ribbons[i].color).not.toBe(ribbons[i - 1].color)
    })
  })

  it('makes the ribbons thicker on a larger screen, within 12 and 24 px', () => {
    const phone = burstRibbons(390, 844, seeded(1))[0].width
    const desktop = burstRibbons(1440, 900, seeded(1))[0].width
    expect(phone).toBe(12)
    expect(desktop).toBe(24)
    expect(burstRibbons(768, 1024, seeded(1))[0].width).toBeGreaterThan(phone)
  })

  it('lets the ribbons start one after another', () => {
    everyBurst(ribbons => {
      expect(ribbons[0].delay).toBe(0)
      for (let i = 1; i < ribbons.length; i++) expect(ribbons[i].delay).toBeGreaterThan(ribbons[i - 1].delay)
    })
  })

  it('draws a smooth line through every point', () => {
    const [{ points, d }] = burstRibbons(1440, 900, seeded(3))
    expect(d.startsWith(`M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`)).toBe(true)
    expect(d.match(/C/g)).toHaveLength(points.length - 1)
    expect(d.endsWith(`${points.at(-1)!.x.toFixed(1)} ${points.at(-1)!.y.toFixed(1)}`)).toBe(true)
  })
})
