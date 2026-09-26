'use client'

import { filamentById, type Filament } from '@nueve2siete/configurator'
import { defaultKeychainColors, evaluateKeychain, type KeychainDefinition } from '@nueve2siete/products'
import {
  EMOJI_CATEGORIES,
  EMOJIS,
  findEmoji,
  FONTS,
  looksLikeEmoji,
  splitGraphemes,
  type Font,
  type FontKey,
} from '@nueve2siete/text-shapes'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'

import { ColorSelect } from '@/components/ui/ColorSelect'
import { EmojiPicker } from '@/components/ui/EmojiPicker'
import { FontSelect } from '@/components/ui/FontSelect'
import { ChatIcon, MailIcon } from '@/components/ui/icons'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { cn } from '@/lib/cn'
import { cm, decimal } from '@/lib/format'
import { routes } from '@/lib/routes'
import { whatsappHref } from '@/lib/whatsapp'

import { cssFamily, loadKeychainFont } from './fonts'
import { KeychainSvg } from './KeychainSvg'
import { keychainIssueMessage, keychainSummary } from './messages'

const KeychainViewer = dynamic(() => import('./KeychainViewer'), { ssr: false })

/** Shown until the customer types, like the example that inspired the product. */
const EXAMPLE_TEXT = 'Lucía 🎀'

export function KeychainCreator({
  product,
  filaments,
  whatsappNumber,
}: {
  product: KeychainDefinition
  filaments: Filament[]
  whatsappNumber: string | null
}) {
  const inputId = useId()
  const hintId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState('')
  const [hint, setHint] = useState<string | null>(null)
  const [fontKey, setFontKey] = useState<FontKey>(product.fonts[0] ?? 'fredoka')
  const [sizeKey, setSizeKey] = useState(product.sizes[1]?.key ?? product.sizes[0]!.key)
  const [colors, setColors] = useState(() => defaultKeychainColors(filaments))
  const [fonts, setFonts] = useState<Partial<Record<FontKey, Font>>>({})
  const [fontFailed, setFontFailed] = useState(false)
  const [viewerReady, setViewerReady] = useState(false)

  // All fonts at once (about 20 KB each): the picker shows the text in every one of them.
  useEffect(() => {
    let active = true
    for (const key of product.fonts) {
      loadKeychainFont(key)
        .then((font) => active && setFonts((loaded) => ({ ...loaded, [key]: font })))
        .catch(() => active && setFontFailed(true))
    }
    return () => {
      active = false
    }
  }, [product.fonts])

  // Typing stays smooth: the shapes are rebuilt with the latest text as soon as there's time.
  const deferredText = useDeferredValue(text)
  const isExample = !deferredText.trim()
  const shownText = isExample ? EXAMPLE_TEXT : deferredText
  const font = fonts[fontKey]
  const evaluation = useMemo(
    () => (font ? evaluateKeychain(shownText, font, sizeKey, product) : null),
    [font, shownText, sizeKey, product],
  )

  const pieces = splitGraphemes(text)
  const emojiCount = pieces.filter((p) => findEmoji(p)).length
  const hex = (part: 'base' | 'letters') => filamentById(filaments, colors[part])?.hex ?? '#1F1B16'
  const partColors = { base: hex('base'), letters: hex('letters') }
  const size = evaluation?.size ?? product.sizes.find((s) => s.key === sizeKey)!
  const fontLabel = FONTS.find((f) => f.key === fontKey)?.label ?? fontKey

  /** Applies a new text if it keeps within the rules; returns false (and explains why) if it doesn't. */
  function applyText(next: string): boolean {
    const all = splitGraphemes(next.replace(/[\r\n\t]+/g, ' '))
    // Emojis come from the picker: pasted or typed ones stay only if they can be printed.
    const kept = all.filter((p) => !looksLikeEmoji(p) || findEmoji(p))
    if (kept.filter((p) => findEmoji(p)).length > product.maxEmojis) {
      setHint(`Máximo ${product.maxEmojis} emojis por llavero.`)
      return false
    }
    if (kept.length > product.maxChars) {
      setHint(`Máximo ${product.maxChars} caracteres, contando espacios y emojis.`)
      return false
    }
    setHint(kept.length < all.length ? 'Ese emoji no se puede imprimir. Toca «Emoji» para ver los que sí.' : null)
    setText(kept.join(''))
    return true
  }

  function insertEmoji(char: string) {
    const input = inputRef.current
    const start = input?.selectionStart ?? text.length
    const end = input?.selectionEnd ?? text.length
    if (!applyText(text.slice(0, start) + char + text.slice(end))) return
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(start + char.length, start + char.length)
    })
  }

  const issues = isExample
    ? []
    : (evaluation?.issues ?? []).flatMap((issue) => {
        const message = keychainIssueMessage(issue, sizeKey)
        return message ? [{ code: issue.code, ...message }] : []
      })
  const canOrder = !isExample && Boolean(evaluation?.printable)
  const summary =
    evaluation && canOrder
      ? keychainSummary({
          product,
          text: evaluation.text,
          fontLabel,
          sizeKey,
          widthMm: evaluation.shapes.widthMm,
          heightMm: evaluation.shapes.heightMm,
          baseName: filamentById(filaments, colors.base)?.name ?? '',
          lettersName: filamentById(filaments, colors.letters)?.name ?? '',
        })
      : ''
  const wa = canOrder ? whatsappHref(whatsappNumber, summary) : null
  const formHref = `${routes.contact}?producto=llavero&mensaje=${encodeURIComponent(summary)}`
  const sample = splitGraphemes(shownText).filter((p) => !looksLikeEmoji(p)).join('').trim() || 'Tu nombre'
  const shapes = evaluation?.shapes
  const label = `Llavero ${sizeKey} con el texto «${shownText}», base ${filamentById(filaments, colors.base)?.name}, letras ${filamentById(filaments, colors.letters)?.name}`

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-12">
      {/* Preview: 3D, with the flat drawing while it loads (or if the browser has no WebGL) */}
      <div className="relative h-[300px] overflow-hidden rounded-[40px] bg-sand sm:h-[380px] lg:sticky lg:top-6 lg:h-[440px] lg:self-start lg:rounded-[48px]">
        {shapes && shapes.base.length > 0 ? (
          <>
            <div
              aria-hidden={viewerReady}
              className={cn(
                'absolute inset-0 flex items-center justify-center p-10 transition-opacity duration-500',
                viewerReady && 'pointer-events-none opacity-0',
              )}
            >
              <KeychainSvg {...shapes} colors={partColors} className="max-h-full w-full max-w-[520px]" />
            </div>
            <KeychainViewer
              base={shapes.base}
              relief={shapes.relief}
              widthMm={shapes.widthMm}
              heightMm={shapes.heightMm}
              baseMm={size.baseMm}
              reliefMm={size.reliefMm}
              colors={partColors}
              label={label}
              onReady={() => setViewerReady(true)}
              className={cn('absolute inset-0 transition-opacity duration-500', viewerReady ? 'opacity-100' : 'opacity-0')}
            />
          </>
        ) : (
          <p className="absolute inset-0 flex items-center justify-center text-muted">
            {fontFailed ? 'No pudimos cargar las letras. Recarga la página.' : 'Cargando letras…'}
          </p>
        )}

        <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between gap-3">
          {isExample ? (
            <span className="rounded-full bg-ink px-3 py-1.5 text-[13px] font-semibold text-cream">Ejemplo</span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-snow/85 px-3 py-1.5 text-[13px] text-ink-soft">Gíralo con el dedo o el mouse</span>
        </div>
        {shapes && shapes.base.length > 0 && (
          <p className="pointer-events-none absolute inset-x-5 bottom-5 text-center text-[15px] font-semibold">
            {cm(shapes.widthMm)} × {cm(shapes.heightMm)} cm · {decimal(size.baseMm + size.reliefMm)} mm de grosor
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6">
        <div>
          <label htmlFor={inputId} className="text-[15px] font-semibold">
            1. Tu texto
          </label>
          <div className="mt-2 flex gap-2">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              value={text}
              placeholder="Escribe un nombre"
              autoComplete="off"
              enterKeyHint="done"
              aria-describedby={hintId}
              aria-invalid={issues.some((i) => i.code !== 'thin') || undefined}
              onChange={(e) => applyText(e.target.value)}
              className="block min-h-12 w-full min-w-0 rounded-2xl bg-snow px-4 text-lg ring-1 ring-ink/15 outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac-deep"
            />
            <EmojiPicker
              emojis={EMOJIS}
              categories={EMOJI_CATEGORIES}
              color={partColors.letters}
              background={partColors.base}
              onPick={insertEmoji}
              disabledReason={
                emojiCount >= product.maxEmojis
                  ? `Ya tienes ${product.maxEmojis} emojis`
                  : pieces.length >= product.maxChars
                    ? `Llegaste a ${product.maxChars} caracteres`
                    : null
              }
            />
          </div>
          <div id={hintId} className="mt-2 flex flex-col gap-1.5 text-[15px]" aria-live="polite">
            <p className="text-sm text-muted">
              {pieces.length}/{product.maxChars} caracteres · {emojiCount}/{product.maxEmojis} emojis
            </p>
            {hint && <p className="text-orange-deep">{hint}</p>}
            {issues.map((issue) => (
              <p key={issue.code} className={issue.code === 'thin' ? 'text-ink-soft' : 'text-orange-deep'}>
                {issue.text}
                {issue.suggestSize && (
                  <>
                    {' '}
                    <button
                      type="button"
                      onClick={() => setSizeKey(issue.suggestSize!)}
                      className="cursor-pointer font-semibold underline underline-offset-4"
                    >
                      {issue.suggestSize}
                    </button>
                    .
                  </>
                )}
              </p>
            ))}
          </div>
        </div>

        <FontSelect
          label="2. Tipo de letra"
          options={product.fonts.map((key) => ({
            key,
            label: FONTS.find((f) => f.key === key)?.label ?? key,
            family: `${cssFamily(key)}, var(--font-sans)`,
          }))}
          value={fontKey}
          onChange={(key) => setFontKey(key as FontKey)}
          sample={sample}
        />

        <div>
          <SegmentedControl
            label="3. Tamaño"
            options={product.sizes.map((s) => ({ value: s.key, label: s.key, detail: s.label }))}
            value={sizeKey}
            onChange={setSizeKey}
          />
          <p className="mt-2 text-sm text-muted">
            Letras de {cm(size.letterHeightMm)} cm de alto · hasta {cm(size.maxLengthMm)} cm de largo con la argolla
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[15px] font-semibold">4. Colores</h2>
          <ColorSelect
            label="Base"
            filaments={filaments}
            value={colors.base}
            onChange={(id) => setColors((c) => ({ ...c, base: id }))}
          />
          <ColorSelect
            label="Letras"
            filaments={filaments}
            value={colors.letters}
            onChange={(id) => setColors((c) => ({ ...c, letters: id }))}
            contrastWith={{ label: 'La base', hex: partColors.base }}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-ink px-6 font-semibold text-cream transition-colors hover:bg-ink-soft"
            >
              <ChatIcon />
              Pedir por WhatsApp
            </a>
          )}
          {canOrder ? (
            <Link
              href={formHref}
              className={cn(
                'inline-flex min-h-12 flex-1 items-center justify-center gap-2.5 rounded-full px-6 font-semibold transition-colors',
                wa ? 'bg-snow ring-1 ring-ink/15 hover:ring-ink/50' : 'bg-ink text-cream hover:bg-ink-soft',
              )}
            >
              <MailIcon />
              Pedir por formulario
            </Link>
          ) : (
            <p className="rounded-2xl bg-snow px-4 py-3 text-[15px] text-ink-soft ring-1 ring-ink/10">
              {isExample ? 'Escribe tu texto para pedirlo.' : 'Ajusta el texto para poder pedirlo.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
