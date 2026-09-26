'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import { deltaE, LOW_CONTRAST_DELTA_E, previewLogoColor, type Filament } from '@nueve2siete/configurator'
import React, { useState } from 'react'

import { cn } from '@/lib/cn'

import { CheckIcon, ChevronDownIcon } from './icons'
import { Popover, PopoverPanel, PopoverTrigger, selectTrigger } from './Popover'

export interface ColorSelectProps {
  /** Part being colored: "Caja", "Base", "Letras"… */
  label: string
  filaments: Filament[]
  value: string | undefined
  onChange: (id: string) => void
  /** The part this one touches (the base under the letters, the box around the logo): warns if they blend. */
  contrastWith?: { label: string; hex: string }
  className?: string
}

/**
 * Filament picker for one part: a compact button with the current color that opens the palette. A tap picks and
 * closes; with the keyboard the arrows move through the colors and Esc closes.
 */
export function ColorSelect({ label, filaments, value, onChange, contrastWith, className }: ColorSelectProps) {
  const [open, setOpen] = useState(false)
  const current = filaments.find((f) => f.id === value)
  const lowContrast =
    current && contrastWith ? deltaE(current.hex, contrastWith.hex) < LOW_CONTRAST_DELTA_E : false

  return (
    <div className={cn('min-w-0', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger aria-label={`${label}: ${current?.name ?? 'sin color'}`} className={selectTrigger}>
          <span className="text-[15px] font-semibold">{label}</span>
          <span className="flex min-w-0 items-center gap-2 text-[15px]">
            <span
              aria-hidden="true"
              className="size-7 shrink-0 rounded-full border border-ink/20"
              style={{ backgroundColor: current?.hex ?? 'transparent' }}
            />
            <span className="truncate">{current?.name ?? 'Elige un color'}</span>
            <ChevronDownIcon className="size-4 shrink-0 text-muted" />
          </span>
        </PopoverTrigger>
        <PopoverPanel title={label} align="end" className="w-[300px]">
          <RadioGroup
            aria-label={label}
            value={value}
            onValueChange={(id, details) => {
              onChange(String(id))
              // Arrow keys also select: only close on a tap or click, so the keyboard can keep browsing.
              if (details.event.type !== 'keydown') setOpen(false)
            }}
            className="mt-3 grid grid-cols-5 gap-2.5"
          >
            {filaments.map((filament) => (
              <Radio.Root
                key={filament.id}
                value={filament.id}
                aria-label={filament.name}
                title={filament.name}
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-ink/20 transition-shadow data-checked:shadow-[0_0_0_3px_var(--color-snow),0_0_0_5px_var(--color-ink)] focus-visible:shadow-[0_0_0_3px_var(--color-snow),0_0_0_5px_var(--color-lilac-deep)] focus-visible:outline-none"
                style={{ backgroundColor: filament.hex, color: previewLogoColor(filament.hex) }}
              >
                <Radio.Indicator>
                  <CheckIcon className="size-5" />
                </Radio.Indicator>
              </Radio.Root>
            ))}
          </RadioGroup>
        </PopoverPanel>
      </Popover>
      {lowContrast && contrastWith && (
        <p className="mt-1.5 text-sm text-orange-deep">
          Casi del mismo color que {contrastWith.label.toLowerCase()}: no se van a distinguir bien.
        </p>
      )}
    </div>
  )
}
