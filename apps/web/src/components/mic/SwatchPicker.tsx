'use client'

import type { Filament } from '@nueve2siete/configurator'
import React from 'react'

import { cn } from '@/lib/cn'

/**
 * Per-part color picker. The selected swatch's ring uses --swatch-bg as a gap,
 * so it looks right on any background.
 */
export function SwatchPicker({
  label,
  filaments,
  value,
  onChange,
  className,
}: {
  label: string
  filaments: Filament[]
  value: string | undefined
  onChange: (id: string) => void
  className?: string
}) {
  const current = filaments.find((f) => f.id === value)

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="text-[15px] font-semibold">
        {label} <span className="font-normal text-muted">· {current?.name ?? 'Elige un color'}</span>
      </legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {filaments.map((filament) => {
          const selected = filament.id === value
          return (
            <button
              key={filament.id}
              type="button"
              aria-label={`${label}: ${filament.name}`}
              aria-pressed={selected}
              onClick={() => onChange(filament.id)}
              className="size-10 cursor-pointer rounded-full border border-ink/20 transition-shadow sm:size-11"
              style={{
                backgroundColor: filament.hex,
                boxShadow: selected ? '0 0 0 3px var(--swatch-bg, #f0f0eb), 0 0 0 5px #1f1b16' : undefined,
              }}
            />
          )
        })}
      </div>
    </fieldset>
  )
}
