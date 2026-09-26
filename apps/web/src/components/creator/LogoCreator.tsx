'use client'

import {
  NOZZLE_LIMITS,
  chooseFabricationMode,
  describeSelection,
  filamentById,
  previewLogoColor,
  type FabricationDecision,
  type Filament,
  type ProductDefinition,
  type Selection,
} from '@nueve2siete/configurator'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useRef, useState, useTransition } from 'react'

import type { LogoFinish } from '@/components/mic3d/LogoRelief'
import type { MicView } from '@/components/mic3d/MicViewer'
import { MicSvg, Pedestal } from '@/components/mic/MicSvg'
import { ColorSelect } from '@/components/ui/ColorSelect'
import { ChatIcon, MailIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { STATUS_COPY, STATUS_LABEL, issueMessage, logoSummaryLines } from '@/lib/engine/messages'
import {
  bestStatus,
  initialColorMode,
  initialSingleFilament,
  printPlan,
  statusRank,
  type LogoColorMode,
  type PlannedSize,
} from '@/lib/engine/print-plan'
import type { LogoAnalysis, LogoAnalysisResult, LogoIssue, LogoStatus } from '@/lib/engine/schema'
import { checkLogoFile } from '@/lib/engine/upload'
import { cm, decimal } from '@/lib/format'
import { routes } from '@/lib/routes'
import { whatsappHref } from '@/lib/whatsapp'

import { LogoArtwork } from './LogoArtwork'
import { LogoDropzone } from './LogoDropzone'
import { StatusPill } from './StatusPill'

// three.js only runs in the browser and is heavy: it's loaded separately, once the page is visible.
const MicViewer = dynamic(() => import('@/components/mic3d/MicViewer'), { ssr: false })

const VIEWS: { key: MicView; label: string }[] = [
  { key: 'full', label: 'Completo' },
  { key: 'close', label: 'De cerca' },
]

const FINISHES: { key: LogoFinish; label: string; detail: string }[] = [
  { key: 'relief', label: 'En relieve', detail: 'El logo sobresale de la caja.' },
  { key: 'flat', label: 'Plano', detail: 'El logo queda al ras de la caja.' },
]

const finishLabel = (key: LogoFinish) => FINISHES.find((f) => f.key === key)!.label

const CHECKER = 'bg-[repeating-conic-gradient(#e6e0d4_0_25%,#fafaf7_0_50%)] bg-[length:16px_16px]'

const optionButton =
  'flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 text-center transition-colors'
const optionIdle = 'bg-snow ring-1 ring-ink/15 hover:ring-ink/50'
const optionActive = 'bg-ink text-cream'

interface Upload {
  url: string
  name: string
}

/**
 * Mic creator: the customer uploads their logo, the engine says whether it can be printed and in which sizes,
 * and they see it in 3D on the box with their colors, in relief or flat.
 */
export function LogoCreator({
  product,
  filaments,
  initial,
  whatsappNumber,
  analyze,
}: {
  product: ProductDefinition
  filaments: Filament[]
  initial: Selection
  whatsappNumber: string | null
  analyze: (formData: FormData) => Promise<LogoAnalysisResult>
}) {
  const [selection, setSelection] = useState<Selection>(initial)
  const [upload, setUpload] = useState<Upload | null>(null)
  const [analysis, setAnalysis] = useState<LogoAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [view, setView] = useState<MicView>('full')
  const [finish, setFinish] = useState<LogoFinish>('relief')
  const [viewerReady, setViewerReady] = useState(false)
  const [colorMode, setColorMode] = useState<LogoColorMode>('original')
  const [singleId, setSingleId] = useState<string | undefined>(undefined)
  // If the customer uploads another logo before the previous one finishes, the stale response is discarded.
  const latestRequest = useRef(0)

  useEffect(() => {
    if (!upload) return
    return () => URL.revokeObjectURL(upload.url)
  }, [upload])

  const handleFile = (file: File) => {
    const invalid = checkLogoFile(file)
    if (invalid) {
      setError(invalid)
      return
    }
    const request = ++latestRequest.current
    setUpload({ url: URL.createObjectURL(file), name: file.name })
    setAnalysis(null)
    setError(null)

    const data = new FormData()
    data.append('logo', file)
    startTransition(async () => {
      const result = await analyze(data).catch(
        (): LogoAnalysisResult => ({ ok: false, error: 'No pudimos revisar tu logo. Intenta de nuevo.' }),
      )
      if (request !== latestRequest.current) return
      if (result.ok) {
        setAnalysis(result.analysis)
        setColorMode(initialColorMode(result.analysis))
        setSingleId(initialSingleFilament(result.analysis, filaments, hex('box'))?.id)
        // Move the camera closer to the box to see the logo.
        if (result.analysis.status !== 'not_viable') setView('close')
      } else setError(result.error)
    })
  }

  const update = (patch: Partial<Selection>) => setSelection((s) => ({ ...s, ...patch }))

  const size = product.sizes.find((s) => s.key === selection.sizeKey) ?? product.sizes[0]!
  const maxHeight = Math.max(...product.sizes.map((s) => s.totalHeightMm))
  const hex = (part: string) => filamentById(filaments, selection.colors[part])?.hex ?? '#1F1B16'
  const rules = product.logoRules

  // What gets printed for the color mode: full color or a single filament.
  const plan = analysis ? printPlan(analysis, colorMode, filamentById(filaments, singleId)) : null
  const sizePlan = plan?.sizes.find((s) => s.key === size.key)
  const printable = plan && plan.status !== 'not_viable' && sizePlan ? sizePlan : null
  const inkColors = plan?.inkColors ?? []

  const recommended = plan?.sizes.find((s) => s.status === plan.status)
  const betterSize =
    sizePlan && recommended && statusRank(sizePlan.status) > statusRank(recommended.status)
      ? product.sizes.find((s) => s.key === recommended.key)
      : undefined

  // In a single color no color is lost and lines touching another color merge: sometimes it comes out better.
  const singleStatus = analysis ? bestStatus(analysis.sizes.map((s) => s.mono.status)) : null
  const canPrint = Boolean(analysis) && (analysis!.status !== 'not_viable' || singleStatus !== 'not_viable')
  // Not suggested if merging the colors loses the design (a crest or an illustration ends up as a blob).
  const suggestSingle =
    analysis && singleStatus && colorMode === 'original' && analysis.colors.length > 1 && !analysis.monoLosesDetail
      ? statusRank(singleStatus) < statusRank(analysis.status) ||
        analysis.issues.some((i) => i.code === 'too_many_colors')
      : false

  const fabrication = plan ? chooseFabricationMode(plan.filamentIds, selection.colors.box ?? '', rules) : null

  const summary = [
    describeSelection(product, { ...selection, text: '' }, filaments),
    ...(plan
      ? logoSummaryLines({
          status: sizePlan?.status ?? plan.status,
          sizeLabel: size.label,
          colorNames: plan.filamentIds.map((id) => filamentById(filaments, id)?.name ?? id),
          single: colorMode === 'single',
          finish: printable ? finishLabel(finish) : undefined,
        })
      : []),
  ].join('\n')
  const wa = whatsappHref(whatsappNumber, summary)
  const formHref = `${routes.contact}?mensaje=${encodeURIComponent(summary)}`
  const needsHelp = plan?.status === 'not_viable'

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-12">
      {/* Preview: 3D, with the 2D illustration while it loads (or if the browser has no WebGL) */}
      <div className="relative h-[460px] overflow-hidden rounded-[40px] bg-sand sm:h-[560px] lg:sticky lg:top-6 lg:h-[680px] lg:self-start lg:rounded-[48px]">
        <div
          aria-hidden={viewerReady}
          className={cn(
            'absolute inset-0 flex flex-col items-center justify-end px-6 pb-20 transition-opacity duration-500',
            viewerReady && 'pointer-events-none opacity-0',
          )}
        >
          <div
            className="flex flex-col items-center transition-[width] duration-500 [--mic-max:170px] sm:[--mic-max:210px] lg:[--mic-max:240px]"
            style={{ width: `calc(var(--mic-max) * ${size.totalHeightMm / maxHeight})` }}
          >
            <MicSvg
              head={hex('head')}
              box={hex('box')}
              handle={hex('handle')}
              logo={previewLogoColor(hex('box'))}
              artworkRatio={size.logoArea.widthMm / size.box.widthMm}
              artwork={
                printable && analysis
                  ? (area) => (
                      <LogoArtwork
                        layers={printable.layers}
                        width={analysis.width}
                        height={analysis.height}
                        colors={inkColors}
                        relief
                        x={area.x}
                        y={area.y}
                        areaWidth={area.width}
                        areaHeight={area.height}
                      />
                    )
                  : undefined
              }
            />
            <Pedestal className="-mt-3 w-[140%]" />
          </div>
        </div>

        <MicViewer
          className="absolute inset-0"
          size={size}
          maxHeightMm={maxHeight}
          colors={{ head: hex('head'), box: hex('box'), handle: hex('handle') }}
          logo={
            printable
              ? { layers: printable.layers, colors: inkColors, finish, reliefHeightMm: rules.reliefHeightMm }
              : null
          }
          view={view}
          label={`Vista 3D del micrófono ${size.label}${printable ? ' con tu logo' : ''}`}
          onReady={() => setViewerReady(true)}
        />

        <span className="pointer-events-none absolute top-6 left-6 rounded-full bg-snow px-3 py-1.5 text-[13px] font-semibold">
          Vista previa{viewerReady && ' 3D'}
        </span>
        {pending && (
          <span className="pointer-events-none absolute top-6 right-6 animate-pulse rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-cream">
            Revisando tu logo…
          </span>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2.5 px-4 text-center">
          {viewerReady && (
            <div role="group" aria-label="Vista" className="pointer-events-auto flex rounded-full bg-snow p-1 ring-1 ring-ink/10">
              {VIEWS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={view === key}
                  onClick={() => setView(key)}
                  className={cn(
                    'min-h-9 cursor-pointer rounded-full px-4 text-sm font-semibold transition-colors',
                    view === key ? 'bg-ink text-cream' : 'hover:bg-sand',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
          <p className="text-[15px] text-ink-soft" aria-live="polite">
            {size.label} · {cm(size.totalHeightMm)} cm de alto
            {viewerReady && <span className="text-muted"> · arrastra para girar</span>}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold">1. Tu logo</h2>
          {upload && (
            <div className="flex items-center gap-4 rounded-3xl bg-snow p-4 ring-1 ring-ink/10">
              {/* Local view of the file (blob:), doesn't go through the image optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={upload.url} alt="" className={cn('size-16 rounded-xl object-contain', CHECKER)} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{upload.name}</p>
                <p className="text-sm text-muted">{pending ? 'Revisando…' : analysis ? 'Revisado' : ''}</p>
              </div>
            </div>
          )}
          <LogoDropzone onFile={handleFile} disabled={pending} compact={Boolean(upload)} />
          {error && (
            <p role="alert" className="rounded-2xl bg-tint-orange px-4 py-3 text-[15px]">
              {error}
            </p>
          )}
        </section>

        {analysis && plan && upload && (
          <Verdict
            status={plan.status}
            issues={plan.issues}
            analysis={analysis}
            product={product}
            originalUrl={upload.url}
            printable={printable}
            inkColors={inkColors}
            boxColor={hex('box')}
            sizeLabel={size.label}
            singleSuggestion={suggestSingle && singleStatus ? singleStatus : null}
            onUseSingle={() => setColorMode('single')}
          />
        )}

        <fieldset>
          <legend className="text-[15px] font-semibold">2. Tamaño</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {product.sizes.map((s) => {
              const active = s.key === size.key
              const status = plan?.sizes.find((r) => r.key === s.key)?.status
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
                  {status && <StatusPill status={status} className="px-2 py-0.5 text-[11px]" />}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-sm text-muted">
            Área del logo: {cm(size.logoArea.widthMm)} × {cm(size.logoArea.heightMm)} cm · detalle mínimo{' '}
            {decimal(NOZZLE_LIMITS[rules.nozzleMm].minFeatureMm)} mm
          </p>
          {betterSize && (
            <p className="mt-2 text-[15px]">
              Tu logo se ve mejor desde{' '}
              <button
                type="button"
                onClick={() => update({ sizeKey: betterSize.key })}
                className="cursor-pointer font-semibold underline underline-offset-4"
              >
                {betterSize.label}
              </button>
              .
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <h2 className="text-[15px] font-semibold">3. Colores del micrófono</h2>
          {product.parts.map((part) => (
            <ColorSelect
              key={part.key}
              label={part.label}
              filaments={filaments}
              value={selection.colors[part.key]}
              onChange={(id) => update({ colors: { ...selection.colors, [part.key]: id } })}
            />
          ))}
        </div>

        {printable && rules.allowFlat && (
          <fieldset>
            <legend className="text-[15px] font-semibold">Acabado del logo</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {FINISHES.map((option) => {
                const active = finish === option.key
                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFinish(option.key)}
                    className={cn(optionButton, 'min-h-[68px]', active ? optionActive : optionIdle)}
                  >
                    <span className="text-base leading-tight font-semibold">{option.label}</span>
                    <span className={cn('text-sm', active ? 'text-cream/80' : 'text-muted')}>{option.detail}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        {analysis && plan && canPrint && (
          <LogoColors
            analysis={analysis}
            filaments={filaments}
            mode={colorMode}
            onModeChange={setColorMode}
            singleId={singleId}
            onSingleChange={setSingleId}
            filamentIds={plan.filamentIds}
            fabrication={needsHelp ? null : fabrication}
            boxFilamentId={selection.colors.box}
          />
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-6 font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              <ChatIcon />
              {needsHelp ? 'Pedir ayuda por WhatsApp' : 'Cotizar por WhatsApp'}
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
            {needsHelp ? 'Pedir ayuda por formulario' : 'Cotizar por formulario'}
          </Link>
        </div>
        {upload && (
          <p className="-mt-4 text-sm text-muted">
            Tu imagen solo se usa para revisarla; no la guardamos. Al cotizar te pedimos el archivo.
          </p>
        )}
      </div>
    </div>
  )
}

function Verdict({
  status,
  issues,
  analysis,
  product,
  originalUrl,
  printable,
  inkColors,
  boxColor,
  sizeLabel,
  singleSuggestion,
  onUseSingle,
}: {
  status: LogoStatus
  issues: LogoIssue[]
  analysis: LogoAnalysis
  product: ProductDefinition
  originalUrl: string
  printable: PlannedSize | null
  inkColors: string[]
  boxColor: string
  sizeLabel: string
  /** How it would look in a single color, when it's worth suggesting. */
  singleSuggestion: LogoStatus | null
  onUseSingle: () => void
}) {
  const copy = STATUS_COPY[status]
  // With an error, the rest is noise: explain only why it can't be printed.
  const errors = issues.filter((i) => i.severity === 'error')
  const messages = (errors.length ? errors : issues)
    .map((issue) => issueMessage(issue, product))
    .filter((message): message is string => Boolean(message))

  return (
    <section aria-live="polite" className="rounded-3xl bg-snow p-6 ring-1 ring-ink/10">
      <StatusPill status={status} />
      <h2 className="mt-3 text-2xl leading-tight font-semibold">{copy.title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{copy.body}</p>
      {messages.length > 0 && (
        <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-5 text-[15px]">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
      {singleSuggestion && (
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl bg-tint-lilac px-4 py-3 text-[15px]">
          <span>
            En un solo color, del filamento que elijas, queda <b>{STATUS_LABEL[singleSuggestion].toLowerCase()}</b>.
          </span>
          <button
            type="button"
            onClick={onUseSingle}
            className="cursor-pointer font-semibold underline underline-offset-4"
          >
            Probar en un solo color
          </button>
        </div>
      )}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={originalUrl} alt="Tu logo original" className={cn('aspect-square w-full rounded-2xl object-contain p-3', CHECKER)} />
          <figcaption className="mt-1.5 text-sm text-muted">Original</figcaption>
        </figure>
        {printable && (
          <figure>
            <div className="aspect-square w-full rounded-2xl p-3 transition-colors duration-300" style={{ backgroundColor: boxColor }}>
              <LogoArtwork
                layers={printable.layers}
                width={analysis.width}
                height={analysis.height}
                colors={inkColors}
                className="size-full"
                title={`Tu logo como se imprime en ${sizeLabel}`}
              />
            </div>
            <figcaption className="mt-1.5 text-sm text-muted">Así se imprime en {sizeLabel}</figcaption>
          </figure>
        )}
      </div>
    </section>
  )
}

function LogoColors({
  analysis,
  filaments,
  mode,
  onModeChange,
  singleId,
  onSingleChange,
  filamentIds,
  fabrication,
  boxFilamentId,
}: {
  analysis: LogoAnalysis
  filaments: Filament[]
  mode: LogoColorMode
  onModeChange: (mode: LogoColorMode) => void
  singleId: string | undefined
  onSingleChange: (id: string) => void
  filamentIds: string[]
  fabrication: FabricationDecision | null
  boxFilamentId: string | undefined
}) {
  const multicolor = analysis.colors.length > 1
  const sameAsBox = filamentIds.some((id) => id === boxFilamentId)
  const boxHex = filaments.find((f) => f.id === boxFilamentId)?.hex
  const note =
    fabrication?.mode === 'integrated'
      ? `Sale en una sola impresión con la caja (${fabrication.filamentsInPrint} filamentos).`
      : fabrication?.mode === 'separate'
        ? 'El logo se imprime como pieza aparte y se pega sobre la caja.'
        : null
  const modes: { key: LogoColorMode; label: string; detail: string }[] = [
    { key: 'original', label: 'A todo color', detail: fullColorDetail(analysis) },
    { key: 'single', label: 'Un solo color', detail: 'El que elijas de la lista' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[15px] font-semibold">Colores de tu logo</h2>
      {multicolor && (
        <div role="group" aria-label="Colores de tu logo" className="grid grid-cols-2 gap-2">
          {modes.map((option) => {
            const active = mode === option.key
            return (
              <button
                key={option.key}
                type="button"
                aria-pressed={active}
                onClick={() => onModeChange(option.key)}
                className={cn(optionButton, 'min-h-[68px]', active ? optionActive : optionIdle)}
              >
                <span className="text-base leading-tight font-semibold">{option.label}</span>
                <span className={cn('text-sm', active ? 'text-cream/80' : 'text-muted')}>{option.detail}</span>
              </button>
            )
          })}
        </div>
      )}

      {mode === 'single' ? (
        <>
          <ColorSelect
            label="Color del logo"
            filaments={filaments}
            value={singleId}
            onChange={onSingleChange}
            contrastWith={boxHex ? { label: 'La caja', hex: boxHex } : undefined}
          />
          {multicolor &&
            (analysis.monoLosesDetail ? (
              <p className="rounded-2xl bg-tint-orange px-4 py-3 text-[15px]">
                En tu logo varios colores se tocan: en un solo color se unen y se pierde parte del diseño. Revisa la
                vista previa.
              </p>
            ) : (
              <p className="text-sm text-muted">En un solo color, las partes del logo que se tocan se unen en una.</p>
            ))}
        </>
      ) : (
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {analysis.colors.map((color) => {
            const filament = filaments.find((f) => f.id === color.filamentId)
            return (
              <li key={color.index} className="flex items-center gap-2 text-[15px]">
                <span
                  className="size-7 rounded-full border border-ink/20"
                  style={{ backgroundColor: color.filamentHex ?? color.hex }}
                />
                {filament?.name ?? color.hex}
              </li>
            )
          })}
        </ul>
      )}

      {sameAsBox && (
        <p className="text-[15px]">
          {mode === 'single' ? 'El logo es del mismo color de la caja' : 'Un color de tu logo es el mismo de la caja'}
          : esa parte solo se va a notar por el relieve. Si quieres que resalte, cambia el color.
        </p>
      )}
      {note && <p className="text-sm text-muted">{note}</p>}
    </div>
  )
}

function fullColorDetail(analysis: LogoAnalysis): string {
  const found = analysis.issues.find((i) => i.code === 'too_many_colors')?.detail.found
  return found ? `${analysis.colors.length} de sus ${found} colores` : `${analysis.colors.length} colores, como tu logo`
}
