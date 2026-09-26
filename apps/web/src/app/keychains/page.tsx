import type { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'

import lucia from '@/assets/products/keychain-lucia.svg'
import mateo from '@/assets/products/keychain-mateo.svg'
import sofi from '@/assets/products/keychain-sofi.svg'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent, SectionTitle } from '@/components/ui/Typography'
import { getKeychainCatalog } from '@/lib/catalog'
import { cm, decimal } from '@/lib/format'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Llaveros con tu nombre',
  description:
    'Llaveros impresos en 3D con tu nombre en relieve y un emoji, en los colores que quieras. Míralo en 3D antes de pedirlo.',
}

const EXAMPLES = [
  { image: lucia, alt: 'Llavero azul con «Lucía» en letras blancas redondeadas y un moño' },
  { image: mateo, alt: 'Llavero negro con «Mateo» en letras amarillas gruesas y un balón de fútbol' },
  { image: sofi, alt: 'Llavero lila con «Sofi» en letra cursiva blanca y un corazón' },
]

export default async function KeychainsPage() {
  const { product } = await getKeychainCatalog()

  const steps = [
    { title: 'Escribe', detail: `Un nombre o una palabra de hasta ${product.maxChars} caracteres.` },
    { title: 'Agrega un emoji', detail: `Hasta ${product.maxEmojis}, de los que se pueden imprimir en relieve.` },
    { title: 'Elige', detail: 'El tipo de letra, el tamaño y los colores de la base y las letras.' },
  ]

  return (
    <>
      <PageHeader
        overline="Llaveros personalizados"
        title={
          <>
            Tu nombre, <Accent>en relieve</Accent>
          </>
        }
        intro="Letras y emojis en relieve sobre una base que sigue su forma, con argolla. Lo diseñas y lo ves en 3D antes de pedirlo."
      />

      <Container className="flex flex-col gap-10 pb-6">
        <div className="grid gap-6 rounded-[40px] bg-sand p-8 sm:p-12 md:grid-cols-3 md:items-center">
          {EXAMPLES.map((example) => (
            <Image key={example.alt} src={example.image} alt={example.alt} unoptimized className="mx-auto w-full max-w-[320px]" />
          ))}
        </div>
        <ButtonLink href={routes.designKeychain} icon={<ArrowRightIcon />} className="self-start">
          Diseña el tuyo
        </ButtonLink>
      </Container>

      <section className="py-16 lg:py-20">
        <Container className="flex flex-col gap-10">
          <SectionTitle>
            Así de <Accent tone="lilac">fácil</Accent>
          </SectionTitle>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-2 rounded-[32px] bg-snow p-7 ring-1 ring-ink/10">
                <span className="text-sm font-semibold text-muted">{index + 1}</span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-[17px] leading-relaxed text-ink-soft">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="pb-20 lg:pb-24">
        <Container className="flex flex-col gap-8">
          <SectionTitle>Tamaños</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {product.sizes.map((size) => (
              <div key={size.key} className="rounded-[32px] bg-snow p-7 ring-1 ring-ink/10">
                <p className="text-3xl font-semibold">{size.key}</p>
                <p className="text-muted">{size.label}</p>
                <ul className="mt-4 flex flex-col gap-1.5 text-[16px]">
                  <li>Letras de {cm(size.letterHeightMm)} cm de alto</li>
                  <li>Hasta {cm(size.maxLengthMm)} cm de largo</li>
                  <li>{decimal(size.baseMm + size.reliefMm)} mm de grosor</li>
                </ul>
              </div>
            ))}
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-ink-soft">
            El largo depende de tu texto: el creador te muestra la medida exacta mientras escribes.
          </p>
        </Container>
      </section>
    </>
  )
}
