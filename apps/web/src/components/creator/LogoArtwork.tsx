import React from 'react'

import type { LogoLayer } from '@/lib/engine/schema'

export interface LogoArtworkProps {
  layers: LogoLayer[]
  /** Size of the analyzed logo; the layers come in that coordinate system. */
  width: number
  height: number
  /** Print color for each logo color, by index. */
  colors: string[]
  /** Offset shadow that simulates the relief. */
  relief?: boolean
  className?: string
  title?: string
  /** Position inside another <svg> (the mic box). */
  x?: number
  y?: number
  areaWidth?: number
  areaHeight?: number
}

/** The engine's vector layers (one per color), exactly as they're printed. */
export function LogoArtwork({
  layers,
  width,
  height,
  colors,
  relief = false,
  className,
  title,
  x,
  y,
  areaWidth,
  areaHeight,
}: LogoArtworkProps) {
  const shadow = Math.max(width, height) * 0.012
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      x={x}
      y={y}
      width={areaWidth}
      height={areaHeight}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {relief && (
        <g transform={`translate(${shadow} ${shadow * 1.3})`} fill="#000" opacity={0.22}>
          {layers.map((layer) => (
            <path key={layer.colorIndex} d={layer.path} fillRule="evenodd" />
          ))}
        </g>
      )}
      {layers.map((layer) => (
        <path
          key={layer.colorIndex}
          d={layer.path}
          fillRule="evenodd"
          fill={colors[layer.colorIndex] ?? '#1F1B16'}
          className="transition-[fill] duration-300"
        />
      ))}
    </svg>
  )
}
