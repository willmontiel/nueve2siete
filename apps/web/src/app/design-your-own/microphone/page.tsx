import { defaultSelection } from '@nueve2siete/configurator'
import type { Metadata } from 'next'
import React from 'react'

import { LogoCreator } from '@/components/creator/LogoCreator'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { getMicCatalog } from '@/lib/catalog'
import { getSiteSettings } from '@/lib/site'

import { analyzeLogo } from './actions'

export const metadata: Metadata = {
  title: 'Micrófono con tu logo',
  description:
    'Sube tu logo, revisa al instante si se puede imprimir en 3D y míralo en tu micrófono con los colores que quieras.',
}

export default async function MicrophoneCreatorPage() {
  const [{ product, filaments }, settings] = await Promise.all([getMicCatalog(), getSiteSettings()])

  return (
    <>
      <PageHeader
        overline="Micrófono con tu logo"
        title={
          <>
            Sube tu logo y <Accent>míralo</Accent> en tu micrófono
          </>
        }
        intro="Te decimos al instante si se puede imprimir y en qué tamaños, y lo ves en 3D con los colores que elijas."
      />
      <Container className="pb-16 lg:pb-24">
        <LogoCreator
          product={product}
          filaments={filaments}
          initial={defaultSelection(product, filaments)}
          whatsappNumber={settings.whatsappNumber}
          analyze={analyzeLogo}
        />
      </Container>
    </>
  )
}
