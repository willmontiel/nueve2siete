import React from 'react'

import { MicSvg } from '@/components/mic/MicSvg'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { Accent } from '@/components/ui/Typography'

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center gap-6 py-16 text-center">
      <div className="w-[110px]">
        <MicSvg head="#1F1B16" box="#A9B6EE" handle="#1F1B16" logo="#1F1B16" label="404" title="Micrófono con el número 404" />
      </div>
      <h1 className="text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
        Esta página <Accent>no existe</Accent>
      </h1>
      <p className="max-w-md text-lg text-ink-soft">Puede que el enlace esté mal escrito o que la página ya no esté.</p>
      <ButtonLink href="/">Volver al inicio</ButtonLink>
    </Container>
  )
}
