import React from 'react'

import { cn } from '@/lib/cn'

/** Filament thread: the logo's curve turned into a stroke that runs across the sections. */
export function Thread({ className, d, viewBox }: { className?: string; d: string; viewBox: string }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('pointer-events-none absolute', className)}
    >
      <path d={d} fill="none" stroke="var(--color-lilac)" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
