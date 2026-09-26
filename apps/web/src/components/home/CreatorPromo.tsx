import React from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Accent } from '@/components/ui/Typography'
import { routes } from '@/lib/routes'

export function CreatorPromo() {
  return (
    <section className="py-10 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 rounded-[40px] bg-lilac p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_470px] lg:gap-12 lg:rounded-[48px] lg:p-14">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold tracking-[0.14em] uppercase">Nuevo</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px]">
              Sube tu logo y <Accent tone="ink">míralo</Accent> en tu micrófono.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed">
              Subes tu logo, te decimos al instante si se puede imprimir y lo ves en 3D en tu micrófono, con tus
              colores.
            </p>
            <ButtonLink href={routes.designYourOwn} icon={<ArrowRightIcon />} className="self-start">
              Sube tu logo
            </ButtonLink>
          </div>

          <ol className="flex flex-col gap-3.5">
            <Step number={1} title="Sube tu logo" detail="PNG, JPG, WebP o GIF" />
            <Step number={2} title="Revisamos si se puede imprimir">
              <div className="mt-2 flex flex-wrap gap-2 text-[13px] font-semibold">
                <span className="rounded-full bg-tint-green px-3 py-1">Viable</span>
                <span className="rounded-full bg-tint-yellow px-3 py-1">Con ajustes</span>
                <span className="rounded-full bg-tint-orange px-3 py-1">No viable</span>
              </div>
            </Step>
            <Step number={3} title="Míralo en 3D con tus colores" detail="Y cámbialos las veces que quieras." />
          </ol>
        </div>
      </Container>
    </section>
  )
}

function Step({
  number,
  title,
  detail,
  children,
}: {
  number: number
  title: string
  detail?: string
  children?: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-4 rounded-3xl bg-cream px-5 py-4">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg text-cream italic"
        aria-hidden="true"
      >
        {number}
      </span>
      <div>
        <p className="text-lg font-semibold">{title}</p>
        {detail && <p className="text-[15px] text-ink-soft">{detail}</p>}
        {children}
      </div>
    </li>
  )
}
