import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import keychainExample from '@/assets/products/keychain-lucia.svg'
import { MicSvg, Pedestal } from '@/components/mic/MicSvg'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Diseña el tuyo',
  description: 'Elige qué quieres personalizar: un micrófono con tu logo o un llavero con tu nombre. Lo ves en 3D antes de pedirlo.',
}

const PRODUCTS = [
  {
    href: routes.designMicrophone,
    title: 'Micrófono con tu logo',
    detail: 'Sube tu logo, te decimos al instante si se puede imprimir y lo ves en 3D en tu micrófono.',
    cta: 'Diseñar micrófono',
    art: (
      <div className="flex w-[110px] flex-col items-center sm:w-[130px]">
        <MicSvg head="#1F1B16" box="#E95C21" handle="#1F1B16" logo="#FAFAF7" />
        <Pedestal className="-mt-3 w-[130%]" />
      </div>
    ),
  },
  {
    href: routes.designKeychain,
    title: 'Llavero con tu nombre',
    detail: 'Escribe un nombre, agrégale un emoji y míralo en 3D. Eliges la letra, el tamaño y los colores.',
    cta: 'Diseñar llavero',
    art: <Image src={keychainExample} alt="" unoptimized className="w-full max-w-[340px]" />,
  },
]

export default function DesignYourOwnPage() {
  return (
    <>
      <PageHeader
        overline="Diseña el tuyo"
        title={
          <>
            ¿Qué quieres <Accent>personalizar</Accent>?
          </>
        }
        intro="Lo diseñas aquí, lo ves en 3D y nos lo pides por WhatsApp o por el formulario."
      />
      <Container className="grid gap-6 pb-16 md:grid-cols-2 lg:pb-24">
        {PRODUCTS.map((product) => (
          <Link
            key={product.href}
            href={product.href}
            className="group flex flex-col overflow-hidden rounded-[40px] bg-sand transition-transform hover:-translate-y-1"
          >
            <div className="flex h-[260px] items-center justify-center p-8 sm:h-[300px]">{product.art}</div>
            <div className="flex flex-1 flex-col gap-3 bg-snow p-7">
              <h2 className="text-2xl font-semibold">{product.title}</h2>
              <p className="text-[17px] leading-relaxed text-ink-soft">{product.detail}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-2 font-semibold underline decoration-2 underline-offset-[6px] group-hover:text-orange-deep">
                {product.cta}
                <ArrowRightIcon />
              </span>
            </div>
          </Link>
        ))}
      </Container>
    </>
  )
}
