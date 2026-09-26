import type { Filament, ProductDefinition, Selection } from '@nueve2siete/configurator'
import React from 'react'

import { Thread } from '@/components/decor/Thread'
import { MicPlayground } from '@/components/mic/MicPlayground'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ChatIcon } from '@/components/ui/icons'
import { Accent, Highlight, Overline } from '@/components/ui/Typography'
import { routes } from '@/lib/routes'
import type { ContactLink } from '@/lib/whatsapp'

const facts = [
  { label: 'Logo en relieve', dot: 'bg-orange' },
  { label: '4 tamaños', dot: 'bg-yellow' },
  { label: 'Hecho en Colombia', dot: 'bg-lilac' },
]

export function Hero({
  product,
  filaments,
  initial,
  contact,
}: {
  product: ProductDefinition
  filaments: Filament[]
  initial: Selection
  contact: ContactLink
}) {
  return (
    <section className="relative overflow-hidden">
      <Thread
        className="inset-0 hidden h-full w-full lg:block"
        viewBox="0 0 1440 880"
        d="M-40 770 C 180 640, 330 860, 560 740 C 760 630, 690 400, 880 310 C 1060 230, 1170 430, 1300 360 C 1380 320, 1420 250, 1480 210"
      />
      <Container className="relative grid items-center gap-12 pt-4 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:pt-8 lg:pb-24">
        <div className="flex flex-col gap-6 lg:gap-7">
          <Overline>3d studio · Colombia</Overline>
          <h1 className="text-[44px] leading-[1.02] font-semibold tracking-[-0.025em] text-balance sm:text-6xl lg:text-[80px]">
            Tu marca, <Accent>impresa</Accent> <Highlight>en 3D</Highlight> y lista para{' '}
            <Accent tone="lilac">hablar.</Accent>
          </h1>
          <p className="max-w-[34rem] text-lg leading-relaxed text-ink-soft sm:text-xl">
            Mini micrófonos personalizados con tu logo en relieve. Atrás va tu micrófono inalámbrico y listo:
            entrevistas, reels y eventos con tu marca al frente.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href={contact.href} external={contact.external} icon={<ChatIcon />}>
              Cotiza tu micrófono
            </ButtonLink>
            <ButtonLink href={routes.microphones} variant="text">
              Ver tamaños y colores
            </ButtonLink>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] font-medium text-ink-soft">
            {facts.map((fact) => (
              <li key={fact.label} className="flex items-center gap-2">
                <span className={`size-3 rounded-full ${fact.dot}`} aria-hidden="true" />
                {fact.label}
              </li>
            ))}
          </ul>
        </div>

        <MicPlayground product={product} filaments={filaments} initial={initial} />
      </Container>
    </section>
  )
}
