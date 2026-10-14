import { describe, expect, it } from 'vitest'
import { threadPath } from './thread'

// The points of a path, read as x y pairs (controls included), so numbers never match across two points
const pointsOf = (d: string) =>
  d.split(/[MC]/).flatMap(part => {
    const numbers = part.trim().split(/\s+/).filter(Boolean).map(Number)
    return numbers.flatMap((n, i) => (i % 2 === 0 ? [`${n} ${numbers[i + 1]}`] : []))
  })

describe('threadPath', () => {
  const from = { x: 0, y: 100 }
  const stops = [
    { x: 300, y: 300 },
    { x: 900, y: 700 },
    { x: 300, y: 1100 },
  ]
  const d = threadPath(from, stops, 60)

  it('starts at the edge it comes from', () => {
    expect(d.startsWith('M 0 100')).toBe(true)
  })

  it('reaches every stop, ending at the last one', () => {
    for (const stop of stops) expect(pointsOf(d)).toContain(`${stop.x} ${stop.y}`)
    expect(d.endsWith('300 1100')).toBe(true)
  })

  it('ties one loop halfway between each pair of stops', () => {
    // The loop leaves the midpoint and comes back to it, so the midpoint ends two segments
    for (const mid of ['600 500', '600 900']) expect(pointsOf(d).filter(p => p === mid)).toHaveLength(2)
  })

  it('makes a bigger loop for a bigger size', () => {
    const small = threadPath(from, stops.slice(0, 2), 20)
    const big = threadPath(from, stops.slice(0, 2), 80)
    expect(big).not.toBe(small)
  })
})
