import { previewLogoColor, type Filament, type ProductDefinition } from '@nueve2siete/configurator'
import React from 'react'

import { MicSvg, Pedestal } from '@/components/mic/MicSvg'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Accent, Overline, SectionTitle } from '@/components/ui/Typography'
import { pickHex } from '@/lib/catalog'
import { cm } from '@/lib/format'
import { routes } from '@/lib/routes'

// Sample combinations so each size looks different.
const looks = [
  { head: 'negro', box: 'lila', handle: 'negro' },
  { head: 'negro', box: 'naranja', handle: 'negro' },
  { head: 'blanco', box: 'amarillo', handle: 'blanco' },
  { head: 'negro', box: 'negro', handle: 'negro' },
]

export function SizesShowcase({ product, filaments }: { product: ProductDefinition; filaments: Filament[] }) {
  const maxHeight = Math.max(...product.sizes.map((s) => s.totalHeightMm))

  return (
    <section className="bg-sand py-20 lg:py-24">
      <Container className="grid gap-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-end lg:gap-10">
        <div className="flex flex-col gap-4">
          <Overline>Tamaños</Overline>
          <SectionTitle>
            Cuatro <Accent>tamaños</Accent>
          </SectionTitle>
          <p className="text-lg leading-relaxed text-ink-soft">Elige el que mejor se vea en tu cámara.</p>
          <ButtonLink href={routes.microphones} variant="text" icon={<ArrowRightIcon />} className="self-start">
            Ver medidas y personalizar
          </ButtonLink>
        </div>

        <ul className="grid grid-cols-2 items-end gap-x-6 gap-y-12 sm:grid-cols-4">
          {product.sizes.map((size, index) => {
            const look = looks[index % looks.length]!
            const box = pickHex(filaments, look.box, index + 2)
            return (
              <li key={size.key} className="flex flex-col items-center">
                <div className="max-w-full" style={{ width: `${Math.round(170 * (size.totalHeightMm / maxHeight))}px` }}>
                  <MicSvg
                    head={pickHex(filaments, look.head)}
                    box={box}
                    handle={pickHex(filaments, look.handle)}
                    logo={previewLogoColor(box)}
                  />
                </div>
                <Pedestal className="-mt-2 w-full max-w-[170px]" />
                <p className="mt-3 font-serif text-3xl italic">{size.key}</p>
                <p className="text-sm text-muted">
                  {size.label} · {cm(size.totalHeightMm)} cm
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
