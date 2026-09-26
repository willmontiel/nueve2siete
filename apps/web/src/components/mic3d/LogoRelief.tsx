'use client'

import React, { useEffect, useMemo } from 'react'
import { ExtrudeGeometry } from 'three'

import type { LogoLayer } from '@/lib/engine/schema'

import { fitToArea, logoShapes } from './logo-shapes'

export type LogoFinish = 'relief' | 'flat'

// Flat: the logo sits flush with the face (peeks out a hundredth so it doesn't z-fight with it).
const FLAT_DEPTH_MM = 0.3
const FLAT_SHOW_MM = 0.02

/**
 * The engine's layers extruded onto the box face: in relief (sticking out `reliefHeightMm`) or flat.
 * The origin is the center of the face; +z points out of the box.
 */
export function LogoRelief({
  layers,
  colors,
  areaWidthMm,
  areaHeightMm,
  finish,
  reliefHeightMm,
}: {
  layers: LogoLayer[]
  /** Print color for each logo color, by index. */
  colors: string[]
  areaWidthMm: number
  areaHeightMm: number
  finish: LogoFinish
  reliefHeightMm: number
}) {
  const shapes = useMemo(() => logoShapes(layers), [layers])
  const fit = fitToArea(shapes.bounds, areaWidthMm, areaHeightMm)
  const depth = finish === 'relief' ? reliefHeightMm : FLAT_DEPTH_MM

  const geometries = useMemo(
    () =>
      shapes.layers.map(
        (layer) =>
          [layer.colorIndex, new ExtrudeGeometry(layer.shapes, { depth, bevelEnabled: false, curveSegments: 1 })] as const,
      ),
    [shapes, depth],
  )
  useEffect(() => () => geometries.forEach(([, geometry]) => geometry.dispose()), [geometries])

  const z = finish === 'relief' ? 0 : FLAT_SHOW_MM - FLAT_DEPTH_MM
  return (
    <group position={[fit.x, fit.y, z]} scale={[fit.scale, fit.scale, 1]}>
      {geometries.map(([colorIndex, geometry]) => (
        <mesh key={colorIndex} geometry={geometry}>
          <meshStandardMaterial color={colors[colorIndex] ?? '#1F1B16'} roughness={0.62} metalness={0} />
        </mesh>
      ))}
    </group>
  )
}
