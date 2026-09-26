import { isLight } from '@nueve2siete/configurator'
import React from 'react'

import { cn } from '@/lib/cn'

const fill = 'transition-[fill] duration-300'

/** Area of the box's front face where the logo goes, in the mic viewBox's units. */
export interface ArtworkArea {
  x: number
  y: number
  width: number
  height: number
}

// Front face of the cube.
const CUBE_FACE: ArtworkArea = { x: 38, y: 106, width: 124, height: 110 }

function inset(face: ArtworkArea, ratio: number): ArtworkArea {
  const width = face.width * ratio
  const height = face.height * ratio
  return { x: face.x + (face.width - width) / 2, y: face.y + (face.height - height) / 2, width, height }
}

export interface MicSvgProps {
  head: string
  box: string
  handle: string
  /** Color of the sample text on the box. */
  logo: string
  label?: string
  className?: string
  title?: string
  /** Draws the real logo on the box instead of the sample text. */
  artwork?: (area: ArtworkArea) => React.ReactNode
  /** Share of the face the logo takes up (logo area / box side). */
  artworkRatio?: number
}

/**
 * 2D illustration of the mic (front view): head with grille, box with the logo, and handle.
 * Lightweight preview: in the creator it shows while the 3D viewer loads (or if the browser has no WebGL).
 */
export function MicSvg({
  head,
  box,
  handle,
  logo,
  label,
  className,
  title,
  artwork,
  artworkRatio = 0.82,
}: MicSvgProps) {
  const text = label?.trim() || 'tu logo'
  const n = Math.max(3, text.length)
  const cubeSize = Math.min(26, Math.floor(110 / (n * 0.6)))
  const lightHead = isLight(head)
  const mesh = lightHead ? '#1F1B16' : '#FFFFFF'
  const meshOpacity = lightHead ? 0.28 : 0.22

  return (
    <svg
      viewBox="0 0 200 460"
      role="img"
      aria-label={title ?? `Micrófono con ${artwork ? 'tu logo' : `el texto “${text}”`} en la caja`}
      className={cn('h-auto w-full', className)}
    >
      <path className={fill} d="M83 196 L125 196 L119 440 Q104 454 89 440 Z" fill={handle} />
      <path d="M91 204 L97 204 L94 432 L92 432 Z" fill="#FFFFFF" opacity={0.16} />

      <g>
        <path className={fill} d="M38 106 L52 92 L176 92 L162 106 Z" fill={box} />
        <path d="M38 106 L52 92 L176 92 L162 106 Z" fill="#FFFFFF" opacity={0.3} />
        <path className={fill} d="M162 106 L176 92 L176 202 L162 216 Z" fill={box} />
        <path d="M162 106 L176 92 L176 202 L162 216 Z" fill="#000" opacity={0.22} />
        <rect className={fill} x={38} y={106} width={124} height={110} fill={box} />
        {artwork ? (
          artwork(inset(CUBE_FACE, artworkRatio))
        ) : (
          <LogoText x={100} y={162} size={cubeSize} color={logo} text={text} />
        )}
      </g>
      <circle className={fill} cx={106} cy={60} r={50} fill={head} />
      <g fill="none" stroke={mesh} strokeOpacity={meshOpacity} strokeWidth={1.6}>
        <ellipse cx={106} cy={60} rx={50} ry={17} />
        <ellipse cx={106} cy={60} rx={50} ry={35} />
        <ellipse cx={106} cy={60} rx={17} ry={50} />
        <ellipse cx={106} cy={60} rx={35} ry={50} />
        <line x1={56} y1={60} x2={156} y2={60} />
        <line x1={106} y1={10} x2={106} y2={110} />
      </g>
      <ellipse cx={88} cy={38} rx={15} ry={9} fill="#FFFFFF" opacity={0.22} transform="rotate(-30 88 38)" />
    </svg>
  )
}

/** Text with an offset shadow to simulate the relief. */
function LogoText({ x, y, size, color, text }: { x: number; y: number; size: number; color: string; text: string }) {
  const common = {
    textAnchor: 'middle' as const,
    dominantBaseline: 'middle' as const,
    fontSize: size,
    fontWeight: 600,
    style: { fontFamily: 'var(--font-cal-sans), sans-serif' },
  }
  return (
    <>
      <text {...common} x={x + 1.5} y={y + 2} fill="#000" opacity={0.22}>
        {text}
      </text>
      <text {...common} x={x} y={y} fill={color} className="transition-[fill] duration-300">
        {text}
      </text>
    </>
  )
}

/** Elliptical shadow under the mic. */
export function Pedestal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 20" aria-hidden="true" className={cn('h-auto w-full', className)}>
      <ellipse cx={120} cy={10} rx={114} ry={9} fill="var(--color-sand-deep)" />
    </svg>
  )
}
