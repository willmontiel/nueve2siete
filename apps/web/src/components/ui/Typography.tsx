import React from 'react'

import { cn } from '@/lib/cn'

/** Accented word in serif italics, the hallmark of the "Hilo" design direction. */
export function Accent({
  tone = 'orange',
  children,
}: {
  tone?: 'orange' | 'lilac' | 'ink'
  children: React.ReactNode
}) {
  const color = { orange: 'text-orange', lilac: 'text-lilac-deep', ink: 'text-ink' }[tone]
  return <em className={cn('font-serif font-normal italic', color)}>{children}</em>
}

/** Yellow highlighter-style underline. */
export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="shadow-[inset_0_-0.24em_0_var(--color-yellow)]">{children}</span>
}

export function Overline({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-sm font-semibold tracking-[0.14em] text-lilac-deep uppercase', className)}>
      {children}
    </p>
  )
}

export function SectionTitle({
  as: Tag = 'h2',
  className,
  children,
}: {
  as?: 'h1' | 'h2'
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag
      className={cn(
        'text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
