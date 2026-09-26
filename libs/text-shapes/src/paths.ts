/// <reference path="./opentype.d.ts" />
import type { PathCommand } from 'opentype.js'

import type { Contour, Point } from './geometry'

/** Longest straight segment used to approximate a curve, in mm (well below what the nozzle resolves). */
const MAX_SEGMENT_MM = 0.25

type Transform = (x: number, y: number) => Point

/**
 * Turns path commands (lines and quadratic/cubic curves) into polygons, mapping each point with `transform`.
 * `mmPerUnit` sizes the curve steps so they're about MAX_SEGMENT_MM long once in millimeters.
 */
export function commandsToContours(commands: PathCommand[], transform: Transform, mmPerUnit: number): Contour[] {
  const contours: Contour[] = []
  let current: Contour = []
  let x = 0
  let y = 0
  const steps = (controlLength: number) => Math.min(64, Math.max(2, Math.ceil((controlLength * mmPerUnit) / MAX_SEGMENT_MM)))
  const close = () => {
    if (current.length >= 3) contours.push(current)
    current = []
  }

  for (const c of commands) {
    switch (c.type) {
      case 'M':
        close()
        x = c.x!
        y = c.y!
        current.push(transform(x, y))
        break
      case 'L':
        x = c.x!
        y = c.y!
        current.push(transform(x, y))
        break
      case 'Q': {
        const n = steps(Math.hypot(c.x1! - x, c.y1! - y) + Math.hypot(c.x! - c.x1!, c.y! - c.y1!))
        for (let i = 1; i <= n; i++) {
          const t = i / n
          const u = 1 - t
          current.push(transform(u * u * x + 2 * u * t * c.x1! + t * t * c.x!, u * u * y + 2 * u * t * c.y1! + t * t * c.y!))
        }
        x = c.x!
        y = c.y!
        break
      }
      case 'C': {
        const n = steps(
          Math.hypot(c.x1! - x, c.y1! - y) + Math.hypot(c.x2! - c.x1!, c.y2! - c.y1!) + Math.hypot(c.x! - c.x2!, c.y! - c.y2!),
        )
        for (let i = 1; i <= n; i++) {
          const t = i / n
          const u = 1 - t
          const a = u * u * u
          const b = 3 * u * u * t
          const d = 3 * u * t * t
          const e = t * t * t
          current.push(transform(a * x + b * c.x1! + d * c.x2! + e * c.x!, a * y + b * c.y1! + d * c.y2! + e * c.y!))
        }
        x = c.x!
        y = c.y!
        break
      }
      case 'Z':
        close()
        break
    }
  }
  close()
  return contours
}

/**
 * Parses the path data this package stores for emojis: absolute M, L, Q, C and Z with space-separated numbers
 * (what `toPathData` produces, normalized by scripts/build-emojis.ts).
 */
export function parsePathData(d: string): PathCommand[] {
  const tokens = d.match(/[MLQCZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []
  const commands: PathCommand[] = []
  let i = 0
  const num = () => Number(tokens[i++])
  while (i < tokens.length) {
    const type = tokens[i++] as PathCommand['type']
    switch (type) {
      case 'M':
      case 'L':
        commands.push({ type, x: num(), y: num() })
        break
      case 'Q':
        commands.push({ type, x1: num(), y1: num(), x: num(), y: num() })
        break
      case 'C':
        commands.push({ type, x1: num(), y1: num(), x2: num(), y2: num(), x: num(), y: num() })
        break
      case 'Z':
        commands.push({ type })
        break
      default:
        throw new Error(`Unexpected path token: ${type}`)
    }
  }
  return commands
}

/** Box around a path's points (control points included, so it may be a little larger than the shape). */
export function pathDataBounds(d: string): { minX: number; minY: number; maxX: number; maxY: number } {
  const numbers = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number)
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    const x = numbers[i]!
    const y = numbers[i + 1]!
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  return { minX, minY, maxX, maxY }
}
