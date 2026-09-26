import React from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ChatIcon } from '@/components/ui/icons'
import { Accent } from '@/components/ui/Typography'
import type { ContactLink } from '@/lib/whatsapp'

export function FinalCta({ contact }: { contact: ContactLink }) {
  return (
    <section className="py-16 lg:py-20">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[64px]">
          ¿Hablamos de tu <Accent>marca</Accent>?
        </h2>
        <ButtonLink href={contact.href} external={contact.external} icon={<ChatIcon />}>
          {contact.external ? 'Escríbenos por WhatsApp' : 'Escríbenos'}
        </ButtonLink>
      </Container>
    </section>
  )
}
