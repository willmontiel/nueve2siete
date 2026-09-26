'use client'

import {
  filamentById,
  previewLogoColor,
  type Filament,
  type ProductDefinition,
  type Selection,
} from '@nueve2siete/configurator'
import React, { useState } from 'react'

import { MicSvg, Pedestal } from './MicSvg'
import { SwatchPicker } from './SwatchPicker'

/** Compact version of the configurator for the hero: colors only. */
export function MicPlayground({
  product,
  filaments,
  initial,
}: {
  product: ProductDefinition
  filaments: Filament[]
  initial: Selection
}) {
  const [colors, setColors] = useState(initial.colors)
  const hex = (part: string) => filamentById(filaments, colors[part])?.hex ?? '#1F1B16'

  return (
    <div
      className="relative flex flex-col items-center gap-5 rounded-[40px] bg-sand p-6 sm:rounded-[48px] sm:p-8"
      style={{ '--swatch-bg': 'var(--color-sand)' } as React.CSSProperties}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-cream">Pruébalo</span>
        <span className="text-right text-sm text-ink-soft">Toca un color para cambiarlo</span>
      </div>

      <div className="flex w-[170px] flex-col items-center sm:w-[200px]">
        <MicSvg head={hex('head')} box={hex('box')} handle={hex('handle')} logo={previewLogoColor(hex('box'))} />
        <Pedestal className="-mt-3 w-[130%]" />
      </div>

      <div className="flex w-full flex-col gap-4">
        {product.parts.map((part) => (
          <SwatchPicker
            key={part.key}
            label={part.label}
            filaments={filaments}
            value={colors[part.key]}
            onChange={(id) => setColors((c) => ({ ...c, [part.key]: id }))}
          />
        ))}
      </div>
    </div>
  )
}
