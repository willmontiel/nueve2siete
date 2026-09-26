'use client'

import { Popover as BasePopover } from '@base-ui/react/popover'
import React from 'react'

import { cn } from '@/lib/cn'

/**
 * Floating panel anchored to a button, on top of Base UI: it closes with Esc or a click outside, returns focus to
 * the trigger, and flips or shifts when there's no room (phones).
 *
 *   <Popover open={open} onOpenChange={setOpen}>
 *     <PopoverTrigger>…</PopoverTrigger>
 *     <PopoverPanel title="Caja">…</PopoverPanel>
 *   </Popover>
 */
export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

export function PopoverPanel({
  title,
  side = 'bottom',
  align = 'start',
  className,
  children,
}: {
  /** Shown at the top and read by screen readers as the panel's name. */
  title?: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  className?: string
  children: React.ReactNode
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={8} collisionPadding={12} className="z-50">
        <BasePopover.Popup
          className={cn(
            'max-w-(--available-width) origin-(--transform-origin) rounded-3xl bg-snow p-4 text-ink shadow-[0_18px_50px_-12px_rgba(31,27,22,0.35)] ring-1 ring-ink/10 outline-none',
            'transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0',
            className,
          )}
        >
          {title && <BasePopover.Title className="text-[15px] font-semibold">{title}</BasePopover.Title>}
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

/** Style shared by the compact selectors' buttons (color, font, emoji…). */
export const selectTrigger =
  'flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-2xl bg-snow px-4 py-2 text-left ring-1 ring-ink/15 transition-shadow hover:ring-ink/50 data-popup-open:ring-2 data-popup-open:ring-ink focus-visible:ring-2 focus-visible:ring-lilac-deep focus-visible:outline-none'
