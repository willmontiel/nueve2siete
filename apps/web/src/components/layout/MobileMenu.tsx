'use client'

import React, { useId, useState } from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { ChatIcon, CloseIcon, MenuIcon } from '@/components/ui/icons'
import type { NavItem } from '@/lib/navigation'
import type { ContactLink } from '@/lib/whatsapp'

import { NavLinks } from './NavLinks'

export function MobileMenu({ items, contact }: { items: NavItem[]; contact: ContactLink }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        onClick={() => setOpen((v) => !v)}
        className="flex size-11 items-center justify-center rounded-full bg-snow ring-1 ring-ink/15"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full z-30 border-t border-line bg-cream px-5 pt-4 pb-8 shadow-[0_24px_40px_-24px_rgba(31,27,22,0.35)] sm:px-8"
      >
        <nav aria-label="Principal (móvil)">
          <NavLinks
            items={items}
            groups="inline"
            onNavigate={() => setOpen(false)}
            className="flex flex-col"
            linkClassName="flex min-h-12 items-center text-xl font-medium"
          />
        </nav>
        <ButtonLink href={contact.href} external={contact.external} icon={<ChatIcon />} className="mt-4 w-full">
          Hablemos
        </ButtonLink>
      </div>
    </div>
  )
}
