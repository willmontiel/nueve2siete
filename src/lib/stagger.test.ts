import { describe, expect, it } from 'vitest'
import { letterWindow } from './stagger'

describe('letterWindow', () => {
  const line: [number, number] = [0.2, 0.6]

  it('starts the first letter when the line starts leaving', () => {
    expect(letterWindow(0, 5, line, 0.1)).toEqual([0.2, expect.closeTo(0.3)])
  })

  it('lets the last letter finish exactly when the line is gone', () => {
    const [, to] = letterWindow(4, 5, line, 0.1)
    expect(to).toBeCloseTo(0.6)
  })

  it('spaces the letters evenly in reading order', () => {
    const starts = [0, 1, 2, 3, 4].map(i => letterWindow(i, 5, line, 0.1)[0])
    const gaps = starts.slice(1).map((s, i) => s - starts[i])
    for (const gap of gaps) expect(gap).toBeCloseTo(0.075)
  })

  it('gives a one-letter line the whole start of the window', () => {
    expect(letterWindow(0, 1, line, 0.1)[0]).toBeCloseTo(0.2)
  })
})
