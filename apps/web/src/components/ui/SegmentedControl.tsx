'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import React, { useId } from 'react'

import { cn } from '@/lib/cn'

export interface SegmentedOption {
  value: string
  label: React.ReactNode
  /** Second line: measurements, a hint… */
  detail?: React.ReactNode
}

/** One choice out of a few, side by side (S · M · L). The arrow keys move between options. */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: React.ReactNode
  options: SegmentedOption[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  const labelId = useId()
  return (
    <div className={className}>
      <span id={labelId} className="text-[15px] font-semibold">
        {label}
      </span>
      <RadioGroup
        aria-labelledby={labelId}
        value={value}
        onValueChange={(next) => onChange(String(next))}
        className="mt-2 grid auto-cols-fr grid-flow-col gap-2"
      >
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            className={cn(
              'group flex min-h-16 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-2xl bg-snow px-3 py-2 text-center ring-1 ring-ink/15 transition-colors hover:ring-ink/50',
              'data-checked:bg-ink data-checked:text-cream data-checked:ring-ink focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none',
            )}
          >
            <span className="text-lg leading-tight font-semibold">{option.label}</span>
            {option.detail && (
              <span className="text-sm text-muted group-data-checked:text-cream/80">{option.detail}</span>
            )}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}
