'use client'

import { pathDataBounds } from '@nueve2siete/text-shapes'
import React, { useState } from 'react'

import { cn } from '@/lib/cn'

import { SmileIcon } from './icons'
import { Popover, PopoverPanel, PopoverTrigger } from './Popover'

export interface PickerEmoji {
  char: string
  name: string
  category: string
  /** Outline in an em of 1000 units, y up. */
  d: string
}

const viewBoxes = new Map<string, string>()

/** viewBox that frames an emoji outline (y is flipped when drawing it). */
function viewBoxFor(d: string): string {
  let box = viewBoxes.get(d)
  if (!box) {
    const b = pathDataBounds(d)
    const size = Math.max(b.maxX - b.minX, b.maxY - b.minY) * 1.12
    const cx = (b.minX + b.maxX) / 2
    const cy = -(b.minY + b.maxY) / 2
    box = `${cx - size / 2} ${cy - size / 2} ${size} ${size}`
    viewBoxes.set(d, box)
  }
  return box
}

/** An emoji the way it's printed: one color, raised over the base. */
export function PrintedEmoji({ emoji, color, className }: { emoji: PickerEmoji; color: string; className?: string }) {
  return (
    <svg viewBox={viewBoxFor(emoji.d)} aria-hidden="true" className={className}>
      <path d={emoji.d} transform="scale(1,-1)" fill={color} />
    </svg>
  )
}

/**
 * Picker for the emojis that can be printed. Each one is drawn in the letters' color over the base's color, so the
 * customer sees what they'll get (not their phone's color emoji).
 */
export function EmojiPicker({
  emojis,
  categories,
  color,
  background,
  onPick,
  disabledReason,
  className,
}: {
  emojis: PickerEmoji[]
  categories: readonly { key: string; label: string }[]
  /** Letters' color. */
  color: string
  /** Base's color. */
  background: string
  onPick: (char: string) => void
  /** When set, the button is disabled and this explains why (e.g. the limit was reached). */
  disabledReason?: string | null
  className?: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={Boolean(disabledReason)}
        title={disabledReason ?? undefined}
        className={cn(
          'flex min-h-12 shrink-0 cursor-pointer items-center gap-2 rounded-2xl bg-snow px-4 text-[15px] font-semibold ring-1 ring-ink/15 transition-shadow hover:ring-ink/50 disabled:cursor-not-allowed disabled:opacity-50 data-popup-open:ring-2 data-popup-open:ring-ink focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none',
          className,
        )}
      >
        <SmileIcon />
        Emoji
      </PopoverTrigger>
      <PopoverPanel title="Emojis que se pueden imprimir" align="end" className="w-[340px]">
        <p className="mt-1 text-sm text-muted">Salen en relieve, del color de las letras.</p>
        <div className="mt-3 max-h-[min(360px,50vh)] overflow-y-auto pr-1">
          {categories.map((category) => {
            const items = emojis.filter((e) => e.category === category.key)
            if (!items.length) return null
            return (
              <section key={category.key} className="mb-3">
                <h3 className="mb-1.5 text-[13px] font-semibold text-muted">{category.label}</h3>
                <div className="grid grid-cols-6 gap-1.5">
                  {items.map((emoji) => (
                    <button
                      key={emoji.char}
                      type="button"
                      aria-label={emoji.name}
                      title={emoji.name}
                      onClick={() => {
                        onPick(emoji.char)
                        setOpen(false)
                      }}
                      className="flex aspect-square cursor-pointer items-center justify-center rounded-xl p-1.5 transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none"
                      style={{ backgroundColor: background }}
                    >
                      <PrintedEmoji emoji={emoji} color={color} className="size-full" />
                    </button>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </PopoverPanel>
    </Popover>
  )
}
