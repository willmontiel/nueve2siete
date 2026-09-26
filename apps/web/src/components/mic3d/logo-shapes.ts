import { Box2, ShapePath, Vector2, type Shape } from 'three'

import type { LogoLayer } from '@/lib/engine/schema'

export interface LayerShapes {
  colorIndex: number
  shapes: Shape[]
}

export interface LogoShapes {
  layers: LayerShapes[]
  /** The logo's actual outline (without the analyzed image's margin), in engine px with y pointing up. */
  bounds: Box2
}

const TOKEN = /[MLZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi

/**
 * Converts an engine path into three.js shapes. Paths are polygons ("M x y x y … Z") with the even-odd
 * rule: an outline inside another is a hole (the inside of an "o").
 * The y axis is flipped: in SVG it grows downward, in three.js upward.
 */
export function pathToShapes(d: string, bounds?: Box2): Shape[] {
  const path = new ShapePath()
  path.userData.style = { fillRule: 'evenodd' }
  const tokens = d.match(TOKEN) ?? []
  let startSubpath = false

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    const command = token.toUpperCase()
    if (command === 'M') {
      startSubpath = true
      continue
    }
    if (command === 'L' || command === 'Z') continue

    const x = Number(token)
    const y = -Number(tokens[++i])
    if (startSubpath) path.moveTo(x, y)
    else path.lineTo(x, y)
    startSubpath = false
    bounds?.expandByPoint(new Vector2(x, y))
  }
  return path.toShapes()
}

export function logoShapes(layers: LogoLayer[]): LogoShapes {
  const bounds = new Box2()
  return {
    layers: layers.map((layer) => ({ colorIndex: layer.colorIndex, shapes: pathToShapes(layer.path, bounds) })),
    bounds,
  }
}

/**
 * Scale and offset that fit the logo (contain) into the box's printable area, centered.
 * It's the same fit the engine uses to measure details in millimeters.
 */
export function fitToArea(
  bounds: Box2,
  areaWidthMm: number,
  areaHeightMm: number,
): { scale: number; x: number; y: number } {
  if (bounds.isEmpty()) return { scale: 1, x: 0, y: 0 }
  const size = bounds.getSize(new Vector2())
  const center = bounds.getCenter(new Vector2())
  const scale = Math.min(areaWidthMm / size.x, areaHeightMm / size.y)
  return { scale, x: -center.x * scale, y: -center.y * scale }
}
