'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { ChevronDownIcon } from '@/components/ui/icons'
import { Popover, PopoverPanel, PopoverTrigger } from '@/components/ui/Popover'
import { cn } from '@/lib/cn'
import { isNavGroup, type NavGroup, type NavItem, type NavLink } from '@/lib/navigation'

const isCurrent = (pathname: string, link: NavLink) => !link.href.includes('#') && pathname.startsWith(link.href)

const linkStyle = 'underline-offset-[6px] transition-colors hover:text-orange-deep'
const currentStyle = 'underline decoration-orange decoration-2'

/**
 * The main links. Groups open as a dropdown (`groups="dropdown"`, desktop) or are listed under their heading
 * (`groups="inline"`, the phone menu).
 */
export function NavLinks({
  items,
  groups = 'dropdown',
  className,
  linkClassName,
  onNavigate,
}: {
  items: NavItem[]
  groups?: 'dropdown' | 'inline'
  className?: string
  linkClassName?: string
  onNavigate?: () => void
}) {
  const pathname = usePathname()

  const renderLink = (link: NavLink) => {
    const current = isCurrent(pathname, link)
    return (
      <Link
        href={link.href}
        aria-current={current ? 'page' : undefined}
        onClick={onNavigate}
        className={cn(linkStyle, current && currentStyle, linkClassName)}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <ul className={className}>
      {items.map((item) =>
        !isNavGroup(item) ? (
          <li key={item.href}>{renderLink(item)}</li>
        ) : groups === 'dropdown' ? (
          <li key={item.label}>
            <NavDropdown group={item} pathname={pathname} />
          </li>
        ) : (
          <li key={item.label}>
            <span className="mt-2 block text-[13px] font-semibold tracking-[0.12em] text-lilac-deep uppercase">
              {item.label}
            </span>
            <ul className="pl-3">
              {item.links.map((link) => (
                <li key={link.href}>{renderLink(link)}</li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  )
}

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false)
  const current = group.links.some((link) => isCurrent(pathname, link))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn('flex cursor-pointer items-center gap-1', linkStyle, current && currentStyle)}>
        {group.label}
        <ChevronDownIcon className="size-4 transition-transform in-data-popup-open:rotate-180" />
      </PopoverTrigger>
      <PopoverPanel align="center" className="w-[280px] p-2">
        <ul className="flex flex-col">
          {group.links.map((link) => {
            const here = isCurrent(pathname, link)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={here ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="flex flex-col rounded-2xl px-4 py-3 transition-colors hover:bg-sand aria-[current=page]:bg-sand"
                >
                  <span className="font-semibold">{link.label}</span>
                  {link.detail && <span className="text-sm text-muted">{link.detail}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </PopoverPanel>
    </Popover>
  )
}
