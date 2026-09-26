import { previewLogoColor } from '@nueve2siete/configurator'
import type { Metadata } from 'next'
import React from 'react'

import { ProjectGrid } from '@/components/home/ProjectGrid'
import { MicSvg } from '@/components/mic/MicSvg'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { getMicCatalog, getProjects, pickHex } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Trabajos',
  description: 'Micrófonos personalizados y otras piezas que hemos impreso en 3D.',
}

const samples = [
  { box: 'naranja', tint: 'bg-tint-lilac' },
  { box: 'amarillo', tint: 'bg-tint-orange' },
  { box: 'lila', tint: 'bg-tint-yellow' },
]

export default async function WorkPage() {
  const [projects, { filaments }] = await Promise.all([getProjects(), getMicCatalog()])

  return (
    <>
      <PageHeader
        overline="Trabajos"
        title={
          <>
            Hechos <Accent>capa por capa</Accent>
          </>
        }
        intro="Algunas de las piezas que hemos impreso para marcas, creadores y eventos."
      />

      <Container className="pb-12">
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="flex flex-col gap-10">
            <ul className="grid gap-6 sm:grid-cols-3" aria-label="Ejemplos ilustrados">
              {samples.map((sample, index) => {
                const box = pickHex(filaments, sample.box, index + 2)
                return (
                  <li key={sample.box} className={`flex justify-center rounded-[32px] px-8 pt-10 pb-8 ${sample.tint}`}>
                    <div className="w-[130px]">
                      <MicSvg
                        head={pickHex(filaments, 'negro')}
                        box={box}
                        handle={pickHex(filaments, 'negro')}
                        logo={previewLogoColor(box)}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-col items-start gap-4">
              <p className="max-w-2xl text-lg leading-relaxed text-ink-soft">
                Muy pronto verás aquí fotos de trabajos reales. Mientras tanto, arma el tuyo y mira cómo quedaría.
              </p>
              <ButtonLink href="/microfonos" icon={<ArrowRightIcon />}>
                Personaliza tu micrófono
              </ButtonLink>
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
