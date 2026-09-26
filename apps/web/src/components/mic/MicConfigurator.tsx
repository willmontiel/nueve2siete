'use client'

import {
  NOZZLE_LIMITS,
  describeSelection,
  filamentById,
  previewLogoColor,
  type Filament,
  type ProductDefinition,
  type Selection,
} from '@nueve2siete/configurator'
import Link from 'next/link'
import React, { useId, useState } from 'react'

import { ChatIcon, MailIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { cm, decimal } from '@/lib/format'
import { whatsappHref } from '@/lib/whatsapp'

import { MicSvg, Pedestal } from './MicSvg'
import { SwatchPicker } from './SwatchPicker'

const MAX_TEXT = 14

const optionButton =
  'flex cursor-pointer flex-col items-center justify-center rounded-2xl px-3 py-2.5 text-center transition-colors'
const optionIdle = 'bg-snow ring-1 ring-ink/15 hover:ring-ink/50'
const optionActive = 'bg-ink text-cream'

/**
 * Creator prototype: size, box shape, colors and a sample text.
 * Logo upload, the viability check and the 3D viewer live in the creator (/disena-el-tuyo).
 */
export function MicConfigurator({
  product,
  filaments,
  initial,
  whatsappNumber,
}: {
  product: ProductDefinition
  filaments: Filament[]
  initial: Selection
  whatsappNumber: string | null
}) {
  const [selection, setSelection] = useState<Selection>(initial)
  const textId = useId()

  const size = product.sizes.find((s) => s.key === selection.sizeKey) ?? product.sizes[0]!
  const maxHeight = Math.max(...product.sizes.map((s) => s.totalHeightMm))
  const ratio = size.totalHeightMm / maxHeight
  const hex = (part: string) => filamentById(filaments, selection.colors[part])?.hex ?? '#1F1B16'

  const summary = describeSelection(product, selection, filaments)
  const wa = whatsappHref(whatsappNumber, summary)
  const formHref = `/contacto?mensaje=${encodeURIComponent(summary)}`
  const rules = product.logoRules

  const update = (patch: Partial<Selection>) => setSelection((s) => ({ ...s, ...patch }))

  return (
    <div
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-12"
      style={{ '--swatch-bg': 'var(--color-cream)' } as React.CSSProperties}
    >
      {/* Preview */}
      <div className="relative flex min-h-[460px] flex-col items-center justify-end rounded-[40px] bg-sand px-6 pt-10 pb-8 sm:min-h-[560px] lg:sticky lg:top-6 lg:min-h-[680px] lg:self-start lg:rounded-[48px]">
        <span className="absolute top-6 left-6 rounded-full bg-snow px-3 py-1.5 text-[13px] font-semibold">
          Vista previa
        </span>
        <div
          className="flex flex-col items-center transition-[width] duration-500 [--mic-max:190px] sm:[--mic-max:230px] lg:[--mic-max:260px]"
          style={{ width: `calc(var(--mic-max) * ${ratio})` }}
        >
          <MicSvg
            head={hex('head')}
            box={hex('box')}
            handle={hex('handle')}
            logo={previewLogoColor(hex('box'))}
            label={selection.text}
          />
          <Pedestal className="-mt-3 w-[140%]" />
        </div>
        <p className="mt-4 text-[15px] text-ink-soft" aria-live="polite">
          {size.label} · {cm(size.totalHeightMm)} cm de alto
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-8">
        <fieldset>
          <legend className="text-[15px] font-semibold">Tamaño</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {product.sizes.map((s) => {
              const active = s.key === size.key
              return (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update({ sizeKey: s.key })}
                  className={cn(optionButton, 'min-h-[76px]', active ? optionActive : optionIdle)}
                >
                  <span className="text-lg leading-tight font-semibold">{s.label}</span>
                  <span className={cn('text-sm', active ? 'text-cream/80' : 'text-muted')}>
                    {cm(s.totalHeightMm)} cm
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {product.boxShapes.length > 1 && (
          <fieldset>
            <legend className="text-[15px] font-semibold">Forma de la caja</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {product.boxShapes.map((shape) => {
                const active = shape.key === selection.shapeKey
                return (
                  <button
                    key={shape.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ shapeKey: shape.key })}
                    className={cn(optionButton, 'min-h-12 text-base font-semibold', active ? optionActive : optionIdle)}
                  >
                    {shape.label}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        <div className="flex flex-col gap-5">
          {product.parts.map((part) => (
            <SwatchPicker
              key={part.key}
              label={part.label}
              filaments={filaments}
              value={selection.colors[part.key]}
              onChange={(id) => update({ colors: { ...selection.colors, [part.key]: id } })}
            />
          ))}
        </div>

        <div>
          <label htmlFor={textId} className="text-[15px] font-semibold">
            Texto de muestra en la caja
          </label>
          <input
            id={textId}
            type="text"
            value={selection.text}
            maxLength={MAX_TEXT}
            placeholder="tu logo"
            autoComplete="off"
            onChange={(e) => update({ text: e.target.value })}
            className="mt-2 block min-h-12 w-full rounded-2xl bg-snow px-4 text-base ring-1 ring-ink/15 outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac-deep"
          />
          <p className="mt-2 text-sm text-muted">
            ¿Ya tienes tu logo?{' '}
            <Link href="/disena-el-tuyo" className="font-semibold text-ink underline underline-offset-4">
              Súbelo y míralo en tu micrófono
            </Link>
            .
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-3xl bg-snow p-6 ring-1 ring-ink/10">
          <Spec term="Alto total" value={`${cm(size.totalHeightMm)} cm`} />
          <Spec term="Cabeza" value={`${cm(size.headDiameterMm)} cm de diámetro`} />
          <Spec
            term="Caja"
            value={`${cm(size.box.widthMm)} × ${cm(size.box.heightMm)} × ${cm(size.box.depthMm)} cm`}
          />
          <Spec term="Área para tu logo" value={`${cm(size.logoArea.widthMm)} × ${cm(size.logoArea.heightMm)} cm`} />
          <Spec term="Colores del logo" value={`Hasta ${rules.separateMaxLogoColors}`} />
          <Spec term="Detalle mínimo" value={`${decimal(NOZZLE_LIMITS[rules.nozzleMm].minFeatureMm)} mm`} />
        </dl>

        <div className="flex flex-col gap-3 sm:flex-row">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-6 font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              <ChatIcon />
              Cotizar por WhatsApp
            </a>
          )}
          <Link
            href={formHref}
            className={cn(
              'inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full px-6 font-semibold transition-colors',
              wa ? 'bg-snow ring-1 ring-ink/15 hover:ring-ink/50' : 'bg-ink text-cream hover:bg-ink-soft',
            )}
          >
            <MailIcon />
            Cotizar por formulario
          </Link>
        </div>
      </div>
    </div>
  )
}

function Spec({ term, value }: { term: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{term}</dt>
      <dd className="mt-0.5 text-base font-semibold">{value}</dd>
    </div>
  )
}
