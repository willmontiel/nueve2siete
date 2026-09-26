import type { Metadata } from 'next'
import React from 'react'

import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { getKeychainCatalog } from '@/lib/catalog'
import { getSiteSettings } from '@/lib/site'
import { KeychainCreator } from '@/products/keychain/KeychainCreator'

export const metadata: Metadata = {
  title: 'Llavero con tu nombre',
  description:
    'Escribe un nombre, agrégale un emoji y míralo en 3D antes de pedirlo. Elige el tipo de letra, el tamaño y los colores.',
}

export default async function KeychainCreatorPage() {
  const [{ product, filaments }, settings] = await Promise.all([getKeychainCatalog(), getSiteSettings()])

  return (
    <>
      <PageHeader
        overline="Llavero con tu nombre"
        title={
          <>
            Mira tu nombre <Accent>antes</Accent> de pedirlo
          </>
        }
        intro="Escríbelo, agrégale un emoji y míralo en 3D. Puedes girarlo con el dedo o el mouse."
      />
      <Container className="pb-16 lg:pb-24">
        <KeychainCreator product={product} filaments={filaments} whatsappNumber={settings.whatsappNumber} />
      </Container>
    </>
  )
}
