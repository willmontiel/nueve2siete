'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { cn } from '@/lib/cn'
import type { NavItem } from '@/lib/navigation'

export function NavLinks({
  items,
  className,
  linkClassName,
  onNavigate,
}: {
  items: NavItem[]
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  return (
    <ul className={className}>
      {items.map((item) => {
        const current = !item.href.includes('#') && pathname.startsWith(item.href)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? 'page' : undefined}
              onClick={onNavigate}
              className={cn(
                'underline-offset-[6px] transition-colors hover:text-orange-deep',
                current && 'underline decoration-orange decoration-2',
                linkClassName,
              )}
            >
              {item.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
