import type { Region } from '@nueve2siete/text-shapes'
import React from 'react'

import { regionsToPathData } from './shapes'

/**
 * Flat drawing of the keychain, shown while the 3D loads or when the browser has no WebGL. A darker copy of the
 * base, slightly lower, stands in for its thickness.
 */
export function KeychainSvg({
  base,
  relief,
  widthMm,
  heightMm,
  colors,
  className,
}: {
  base: Region[]
  relief: Region[]
  widthMm: number
  heightMm: number
  colors: { base: string; letters: string }
  className?: string
}) {
  const depth = 1.6
  const baseD = regionsToPathData(base, heightMm)
  return (
    <svg viewBox={`-1 -1 ${widthMm + 2} ${heightMm + depth + 2}`} aria-hidden="true" className={className}>
      <path d={baseD} transform={`translate(0 ${depth})`} fill={colors.base} fillRule="nonzero" />
      <path d={baseD} transform={`translate(0 ${depth})`} fill="#000" fillOpacity={0.28} fillRule="nonzero" />
      <path d={baseD} fill={colors.base} fillRule="nonzero" />
      <path d={regionsToPathData(relief, heightMm)} fill={colors.letters} fillRule="nonzero" />
    </svg>
  )
}
