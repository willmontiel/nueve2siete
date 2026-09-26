import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ChatIcon } from '@/components/ui/icons'
import { MAIN_NAV } from '@/lib/navigation'
import { getSiteSettings } from '@/lib/site'
import { contactLink } from '@/lib/whatsapp'

import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

export async function SiteHeader() {
  const settings = await getSiteSettings()
  const contact = contactLink(settings.whatsappNumber, settings.whatsappMessage)

  return (
    <header className="relative z-20">
      <Container className="flex h-20 items-center justify-between lg:h-[100px]">
        <Link href="/" aria-label="nueve2siete, ir al inicio" className="flex items-center">
          <Image
            src="/brand/nueve2siete-logo.png"
            alt="nueve2siete 3d studio"
            width={1489}
            height={472}
            priority
            className="h-10 w-auto lg:h-[52px]"
          />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <NavLinks items={MAIN_NAV} className="flex gap-9 text-base font-medium whitespace-nowrap" />
        </nav>

        <div className="hidden xl:block">
          <ButtonLink href={contact.href} external={contact.external} icon={<ChatIcon />}>
            Hablemos
          </ButtonLink>
        </div>

        <MobileMenu items={MAIN_NAV} contact={contact} />
      </Container>
    </header>
  )
}
