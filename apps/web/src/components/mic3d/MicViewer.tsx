'use client'

import type { ProductSize } from '@nueve2siete/configurator'
import { CameraControls, CameraControlsImpl, ContactShadows } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'

import { cn } from '@/lib/cn'
import type { LogoLayer } from '@/lib/engine/schema'

import { LogoRelief, type LogoFinish } from './LogoRelief'
import { micLayout, type MicLayout } from './mic-layout'
import { MicModel } from './MicModel'

export type MicView = 'full' | 'close'

export interface MicViewerLogo {
  layers: LogoLayer[]
  colors: string[]
  finish: LogoFinish
  reliefHeightMm: number
}

export interface MicViewerProps {
  size: ProductSize
  /** Height of the largest size: the full view is framed to it, so sizes can be compared. */
  maxHeightMm: number
  colors: { head: string; box: string; handle: string }
  logo: MicViewerLogo | null
  view: MicView
  label: string
  className?: string
  /** Called once the 3D has rendered: until then the 2D illustration is shown. */
  onReady?: () => void
}

const FOV = 30
const HALF_FOV_TAN = Math.tan(((FOV / 2) * Math.PI) / 180)

type Vec3 = [number, number, number]

/** Camera for each view: slightly to the side and from above, so the volume shows. */
function cameraFor(view: MicView, layout: MicLayout, maxHeightMm: number): { position: Vec3; target: Vec3 } {
  const full = view === 'full'
  // Full: keeps the floor above the bottom buttons and the whole XL in view.
  const target: Vec3 = [0, full ? maxHeightMm * 0.4 : layout.box.y, 0]
  const distance = full ? (maxHeightMm * 0.72) / HALF_FOV_TAN : (layout.box.height * 1.15) / HALF_FOV_TAN
  const azimuth = full ? 0.5 : 0.35
  const polar = full ? 1.35 : 1.45
  return {
    target,
    position: [
      target[0] + distance * Math.sin(polar) * Math.sin(azimuth),
      target[1] + distance * Math.cos(polar),
      target[2] + distance * Math.sin(polar) * Math.cos(azimuth),
    ],
  }
}

function Controls({ view, layout, maxHeightMm }: { view: MicView; layout: MicLayout; maxHeightMm: number }) {
  const ref = useRef<CameraControlsImpl>(null)
  const moved = useRef(false)

  useEffect(() => {
    const controls = ref.current
    if (!controls) return
    const { ACTION } = CameraControlsImpl
    // Rotate only with the mouse; the wheel doesn't zoom so it doesn't steal the page's scroll.
    controls.mouseButtons.right = ACTION.NONE
    controls.mouseButtons.middle = ACTION.NONE
    controls.mouseButtons.wheel = ACTION.NONE
    controls.touches.two = ACTION.TOUCH_DOLLY
    controls.touches.three = ACTION.NONE
  }, [])

  useEffect(() => {
    const { position, target } = cameraFor(view, layout, maxHeightMm)
    // The first time it jumps straight there; after that, with a transition.
    void ref.current?.setLookAt(...position, ...target, moved.current)
    moved.current = true
  }, [view, layout, maxHeightMm])

  return (
    <CameraControls
      ref={ref}
      makeDefault
      minDistance={60}
      maxDistance={1100}
      minPolarAngle={0.35}
      maxPolarAngle={1.75}
      smoothTime={0.35}
    />
  )
}

/** 3D view of the mic with the logo. Loaded only in the browser (three.js doesn't run on the server). */
export default function MicViewer({
  size,
  maxHeightMm,
  colors,
  logo,
  view,
  label,
  className,
  onReady,
}: MicViewerProps) {
  const layout = useMemo(() => micLayout(size), [size])
  const initial = useMemo(() => cameraFor(view, layout, maxHeightMm), []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // On phones, swiping up or down still scrolls and swiping sideways rotates the mic.
    // The !important beats the touch-action: none that camera-controls sets on the canvas.
    <div role="img" aria-label={label} className={cn('[&_canvas]:touch-pan-y!', className)}>
      <Canvas
        flat
        frameloop="demand"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: FOV, near: 5, far: 5000, position: initial.position }}
        onCreated={() => onReady?.()}
      >
        <hemisphereLight args={['#ffffff', '#d6cdbe', 1.3]} />
        <directionalLight position={[220, 420, 360]} intensity={2.1} />
        <directionalLight position={[-320, 160, -180]} intensity={0.8} />

        <MicModel layout={layout} colors={colors}>
          {logo && (
            <LogoRelief
              layers={logo.layers}
              colors={logo.colors}
              areaWidthMm={size.logoArea.widthMm}
              areaHeightMm={size.logoArea.heightMm}
              finish={logo.finish}
              reliefHeightMm={logo.reliefHeightMm}
            />
          )}
        </MicModel>

        <ContactShadows position={[0, 0.05, 0]} scale={420} far={140} blur={2.6} opacity={0.35} resolution={512} color="#1f1b16" />
        <Controls view={view} layout={layout} maxHeightMm={maxHeightMm} />
      </Canvas>
    </div>
  )
}
