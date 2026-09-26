'use client'

import type { Region } from '@nueve2siete/text-shapes'
import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import { Box3, ExtrudeGeometry, Vector3 } from 'three'

import { cn } from '@/lib/cn'

import { regionsToShapes } from './shapes'

export interface KeychainViewerProps {
  base: Region[]
  relief: Region[]
  widthMm: number
  heightMm: number
  baseMm: number
  reliefMm: number
  colors: { base: string; letters: string }
  label: string
  className?: string
  /** Called once the 3D has rendered: until then the 2D drawing is shown. */
  onReady?: () => void
}

/** Matte PLA: low shine and not metallic at all. */
const PLA = { roughness: 0.62, metalness: 0 } as const
const FOV = 30
/** Framing never gets closer than this, so a short name isn't blown up. */
const MIN_FRAME_MM = { width: 60, height: 24 }

function useExtruded(regions: Region[], depth: number) {
  const geometry = useMemo(
    () => new ExtrudeGeometry(regionsToShapes(regions), { depth, bevelEnabled: false, curveSegments: 1 }),
    [regions, depth],
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

function Keychain({ base, relief, widthMm, heightMm, baseMm, reliefMm, colors }: Omit<KeychainViewerProps, 'label'>) {
  const baseGeometry = useExtruded(base, baseMm)
  const reliefGeometry = useExtruded(relief, reliefMm)
  // Centered on the origin; the letters face the camera (+z).
  return (
    <group position={[-widthMm / 2, -heightMm / 2, -(baseMm + reliefMm) / 2]}>
      <mesh geometry={baseGeometry}>
        <meshStandardMaterial color={colors.base} {...PLA} />
      </mesh>
      <mesh geometry={reliefGeometry} position={[0, 0, baseMm]}>
        <meshStandardMaterial color={colors.letters} {...PLA} />
      </mesh>
    </group>
  )
}

function Controls({ widthMm, heightMm, depthMm }: { widthMm: number; heightMm: number; depthMm: number }) {
  const ref = useRef<CameraControlsImpl>(null)
  const moved = useRef(false)

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    const { ACTION } = CameraControlsImpl
    // Rotate only; the wheel doesn't zoom so it doesn't steal the page's scroll.
    controls.mouseButtons.right = ACTION.NONE
    controls.mouseButtons.middle = ACTION.NONE
    controls.mouseButtons.wheel = ACTION.NONE
    controls.touches.two = ACTION.TOUCH_DOLLY
    controls.touches.three = ACTION.NONE
  }, [])

  useEffect(() => {
    const w = Math.max(widthMm, MIN_FRAME_MM.width) / 2
    const h = Math.max(heightMm, MIN_FRAME_MM.height) / 2
    const box = new Box3(new Vector3(-w, -h, -depthMm / 2), new Vector3(w, h, depthMm / 2))
    // First time straight there; after that (new text or size) with a transition, keeping the angle.
    void ref.current?.fitToBox(box, moved.current, { paddingTop: 6, paddingBottom: 6, paddingLeft: 6, paddingRight: 6 })
    moved.current = true
  }, [widthMm, heightMm, depthMm])

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={40}
      maxDistance={900}
      minPolarAngle={0.5}
      maxPolarAngle={2.4}
      smoothTime={0.3}
    />
  )
}

/** 3D view of the keychain. Loaded only in the browser (three.js doesn't run on the server). */
export default function KeychainViewer({ label, className, onReady, ...keychain }: KeychainViewerProps) {
  const depthMm = keychain.baseMm + keychain.reliefMm
  return (
    // On phones, swiping up or down still scrolls and swiping sideways rotates it.
    <div role="img" aria-label={label} className={cn('[&_canvas]:touch-pan-y!', className)}>
      <Canvas
        flat
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        // Slightly from above and to the side, so the thickness shows.
        camera={{ fov: FOV, near: 1, far: 5000, position: [60, 105, 205] }}
        onCreated={() => onReady?.()}
      >
        <hemisphereLight args={['#ffffff', '#d6cdbe', 1.3]} />
        <directionalLight position={[160, 260, 320]} intensity={2.1} />
        <directionalLight position={[-260, 90, -160]} intensity={0.8} />
        <Keychain {...keychain} />
        <Controls widthMm={keychain.widthMm} heightMm={keychain.heightMm} depthMm={depthMm} />
      </Canvas>
    </div>
  )
}
