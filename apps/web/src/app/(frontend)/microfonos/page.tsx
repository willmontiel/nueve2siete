import { NOZZLE_LIMITS, defaultSelection } from '@nueve2siete/configurator'
import type { Metadata } from 'next'
import React from 'react'

import { MicConfigurator } from '@/components/mic/MicConfigurator'
import { Container } from '@/components/ui/Container'
import { CheckIcon, XIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent, SectionTitle } from '@/components/ui/Typography'
import { getMicCatalog } from '@/lib/catalog'
import { decimal } from '@/lib/format'
import { getSiteSettings } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Micrófonos personalizados',
  description:
    'Elige tamaño, forma de la caja y colores de tu micrófono personalizado con logo en relieve, impreso en 3D en Colombia.',
}

export default async function MicrophonesPage() {
  const [{ product, filaments }, settings] = await Promise.all([getMicCatalog(), getSiteSettings()])
  const rules = product.logoRules

  const works = [
    'Colores planos, sin degradados',
    `Hasta ${rules.separateMaxLogoColors} colores`,
    'Formas simples y trazos gruesos',
    `Detalles de al menos ${decimal(NOZZLE_LIMITS[rules.nozzleMm].minFeatureMm)} mm`,
  ]
  const doesNot = [
    'Degradados o sombras',
    'Fotos o ilustraciones realistas',
    'Texto muy pequeño o líneas muy finas',
    'Muchos detalles en poco espacio',
  ]

  return (
    <>
      <PageHeader
        overline="Micrófonos personalizados"
        title={
          <>
            Tu micrófono, <Accent>a tu manera</Accent>
          </>
        }
        intro="Elige el tamaño, la forma de la caja y los colores de cada parte. Cuando lo tengas, cotízalo con un clic."
      />

      <Container>
        <MicConfigurator
          product={product}
          filaments={filaments}
          initial={defaultSelection(product, filaments)}
          whatsappNumber={settings.whatsappNumber}
        />
      </Container>

      <section className="py-20 lg:py-24">
        <Container className="flex flex-col gap-10">
          <SectionTitle>
            ¿Qué logos se pueden <Accent tone="lilac">imprimir</Accent>?
          </SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[32px] bg-tint-green p-8">
              <h3 className="text-xl font-semibold">Funcionan bien</h3>
              <ul className="mt-4 flex flex-col gap-3 text-[17px]">
                {works.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 size-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[32px] bg-tint-orange p-8">
              <h3 className="text-xl font-semibold">No se pueden imprimir</h3>
              <ul className="mt-4 flex flex-col gap-3 text-[17px]">
                {doesNot.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XIcon className="mt-0.5 size-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-ink-soft">
            Si tu logo es muy complejo, no te preocupes: te proponemos una versión simplificada que se vea bien impresa y
            mantenga tu marca.
          </p>
        </Container>
      </section>
    </>
  )
}
