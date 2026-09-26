import Image from 'next/image'
import React from 'react'

import lucia from '@/assets/products/keychain-lucia.svg'
import mateo from '@/assets/products/keychain-mateo.svg'
import sofi from '@/assets/products/keychain-sofi.svg'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Accent } from '@/components/ui/Typography'
import { routes } from '@/lib/routes'

export function KeychainPromo() {
  return (
    <section className="py-10 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 rounded-[40px] bg-tint-yellow p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12 lg:rounded-[48px] lg:p-14">
          <div className="flex flex-col gap-5">
            <p className="text-sm font-semibold tracking-[0.14em] uppercase">Nuevo · Llaveros</p>
            <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.02em] text-balance sm:text-5xl lg:text-[56px]">
              Tu nombre, <Accent tone="ink">en relieve</Accent>.
            </h2>
            <p className="max-w-xl text-lg leading-relaxed">
              Escribe un nombre, agrégale un emoji y míralo en 3D con los colores que quieras antes de pedirlo.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={routes.designKeychain} icon={<ArrowRightIcon />}>
                Diseña tu llavero
              </ButtonLink>
              <ButtonLink href={routes.keychains} variant="secondary">
                Ver llaveros
              </ButtonLink>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Image src={lucia} alt="Llavero azul con «Lucía» y un moño" unoptimized className="w-[85%] -rotate-3" />
            <Image src={mateo} alt="Llavero negro con «Mateo» y un balón" unoptimized className="w-full self-end rotate-2" />
            <Image src={sofi} alt="Llavero lila con «Sofi» y un corazón" unoptimized className="ml-6 w-[62%] -rotate-2" />
          </div>
        </div>
      </Container>
    </section>
  )
}
