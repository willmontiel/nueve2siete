import type { Metadata } from 'next'
import React from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'nueve2siete es un estudio de impresión 3D en Colombia.',
}

const facts = [
  { title: 'Bambu Lab A1 + AMS Lite', text: 'Impresión multicolor, hasta 4 colores por pieza.', tint: 'bg-tint-yellow' },
  { title: 'Logo en relieve', text: 'Tu marca sobresale de la caja y se ve en cámara.', tint: 'bg-tint-lilac' },
  { title: 'Hecho en Colombia', text: 'Diseñamos e imprimimos cada pieza aquí.', tint: 'bg-tint-orange' },
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        overline="Nosotros"
        title={
          <>
            Un estudio de impresión 3D con <Accent>mucho color</Accent>
          </>
        }
      />

      <Container className="grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-5 text-lg leading-relaxed text-ink-soft">
          <p>
            nueve2siete es un estudio de impresión 3D en Colombia. Empezamos con mini micrófonos personalizados: piezas
            con el logo de tu marca, pensadas para que se vea en cámara en entrevistas, reels y eventos.
          </p>
          <p>
            Cada micrófono parte de tu logo. Lo adaptamos para imprimirlo en colores planos, con el logo en relieve, y lo
            imprimimos capa por capa en los colores que elijas.
          </p>
          <p>Y esto es solo el comienzo: vienen más productos personalizados.</p>
          <ButtonLink href={routes.microphones} icon={<ArrowRightIcon />} className="mt-2 self-start">
            Conoce los micrófonos
          </ButtonLink>
        </div>

        <ul className="flex flex-col gap-4">
          {facts.map((fact) => (
            <li key={fact.title} className={`rounded-[32px] p-7 ${fact.tint}`}>
              <p className="text-xl font-semibold">{fact.title}</p>
              <p className="mt-1 text-[17px] text-ink-soft">{fact.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
