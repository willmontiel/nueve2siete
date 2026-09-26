'use client'

import { RoundedBox } from '@react-three/drei'
import React, { useEffect, useMemo } from 'react'
import { CanvasTexture, LatheGeometry, RepeatWrapping, Vector2 } from 'three'

import type { MicLayout } from './mic-layout'

/** Matte PLA: low shine and not metallic at all. */
const PLA = { roughness: 0.62, metalness: 0 } as const

let grille: CanvasTexture | null = null

/** Bump map for the head's grille: staggered rows of holes, drawn only once. */
function grilleTexture(): CanvasTexture {
  if (grille) return grille
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#000'
  const columns = 64
  const rows = 32
  const step = canvas.width / columns
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x = (column + (row % 2 ? 0.5 : 0)) * step
      const y = (row + 0.5) * (canvas.height / rows)
      ctx.beginPath()
      ctx.arc(x, y, step * 0.28, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  grille = new CanvasTexture(canvas)
  grille.wrapS = RepeatWrapping
  return grille
}

/** Turned handle: tapers downward and ends rounded. */
function handleGeometry({ length, topRadius, bottomRadius }: MicLayout['handle']): LatheGeometry {
  const round = bottomRadius * 0.6
  const points = [new Vector2(0, 0)]
  for (let i = 0; i <= 8; i++) {
    const angle = -Math.PI / 2 + (i / 8) * (Math.PI / 2)
    points.push(new Vector2(bottomRadius - round + Math.cos(angle) * round, round + Math.sin(angle) * round))
  }
  points.push(new Vector2(topRadius, length), new Vector2(0, length))
  return new LatheGeometry(points, 64)
}

export function MicModel({
  layout,
  colors,
  children,
}: {
  layout: MicLayout
  colors: { head: string; box: string; handle: string }
  /** The logo, in the coordinates of the box's front face. */
  children?: React.ReactNode
}) {
  const { head, box, handle } = layout
  const handleGeo = useMemo(() => handleGeometry(handle), [handle])
  useEffect(() => () => handleGeo.dispose(), [handleGeo])
  const texture = useMemo(() => grilleTexture(), [])

  return (
    <group>
      <mesh geometry={handleGeo}>
        <meshStandardMaterial color={colors.handle} {...PLA} />
      </mesh>

      <RoundedBox
        args={[box.width, box.height, box.depth]}
        radius={box.radius}
        smoothness={4}
        position={[0, box.y, 0]}
      >
        <meshStandardMaterial color={colors.box} {...PLA} />
      </RoundedBox>
      <group position={[0, box.y, box.depth / 2]}>{children}</group>

      <mesh position={[0, head.y, 0]}>
        <sphereGeometry args={[head.radius, 96, 64]} />
        <meshStandardMaterial color={colors.head} bumpMap={texture} bumpScale={1.5} {...PLA} />
      </mesh>
    </group>
  )
}
