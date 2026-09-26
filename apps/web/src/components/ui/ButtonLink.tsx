import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'text'

const variants: Record<Variant, string> = {
  primary: 'min-h-12 rounded-full bg-ink px-6 text-cream hover:bg-ink-soft',
  secondary: 'min-h-12 rounded-full bg-snow px-6 text-ink ring-1 ring-ink/15 hover:ring-ink/50',
  text: 'min-h-11 text-ink underline decoration-2 underline-offset-[6px] hover:text-orange-deep',
}

export function ButtonLink({
  href,
  external = false,
  variant = 'primary',
  icon,
  className,
  children,
}: {
  href: string
  external?: boolean
  variant?: Variant
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2.5 text-base font-semibold transition-colors',
    variants[variant],
    className,
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {icon}
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {icon}
      {children}
    </Link>
  )
}
