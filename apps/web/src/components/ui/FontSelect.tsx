'use client'

import { Radio } from '@base-ui/react/radio'
import { RadioGroup } from '@base-ui/react/radio-group'
import React, { useState } from 'react'

import { ChevronDownIcon } from './icons'
import { Popover, PopoverPanel, PopoverTrigger, selectTrigger } from './Popover'

export interface FontOption {
  key: string
  label: string
  /** CSS font-family the sample is drawn with (the same file that shapes the print). */
  family: string
}

/** Font picker that shows the customer's own text written in each font. */
export function FontSelect({
  label,
  options,
  value,
  onChange,
  sample,
}: {
  label: string
  options: FontOption[]
  value: string
  onChange: (key: string) => void
  /** Text to draw in each font (the customer's, without emojis). */
  sample: string
}) {
  const [open, setOpen] = useState(false)
  const current = options.find((o) => o.key === value) ?? options[0]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger aria-label={`${label}: ${current?.label}`} className={selectTrigger}>
        <span className="text-[15px] font-semibold">{label}</span>
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate text-xl leading-none" style={{ fontFamily: current?.family }}>
            {sample}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted" />
        </span>
      </PopoverTrigger>
      <PopoverPanel title={label} align="end" className="w-[320px]">
        <RadioGroup
          aria-label={label}
          value={value}
          onValueChange={(key, details) => {
            onChange(String(key))
            if (details.event.type !== 'keydown') setOpen(false)
          }}
          className="mt-3 flex flex-col gap-2"
        >
          {options.map((option) => (
            <Radio.Root
              key={option.key}
              value={option.key}
              aria-label={option.label}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left ring-1 ring-ink/10 transition-colors hover:ring-ink/40 data-checked:bg-ink data-checked:text-cream focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none"
            >
              <span className="truncate text-2xl leading-tight" style={{ fontFamily: option.family }}>
                {sample}
              </span>
              <span className="shrink-0 text-sm opacity-75">{option.label}</span>
            </Radio.Root>
          ))}
        </RadioGroup>
      </PopoverPanel>
    </Popover>
  )
}
