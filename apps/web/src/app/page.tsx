import { defaultSelection } from '@nueve2siete/configurator'
import React from 'react'

import { CreatorPromo } from '@/components/home/CreatorPromo'
import { FinalCta } from '@/components/home/FinalCta'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { KeychainPromo } from '@/components/home/KeychainPromo'
import { ProjectGrid } from '@/components/home/ProjectGrid'
import { SizesShowcase } from '@/components/home/SizesShowcase'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { ArrowRightIcon } from '@/components/ui/icons'
import { Accent, SectionTitle } from '@/components/ui/Typography'
import { getMicCatalog, getProjects } from '@/lib/catalog'
import { routes } from '@/lib/routes'
import { getSiteSettings } from '@/lib/site'
import { contactLink } from '@/lib/whatsapp'

export default async function HomePage() {
  const [{ product, filaments }, settings, projects] = await Promise.all([
    getMicCatalog(),
    getSiteSettings(),
    getProjects({ featuredOnly: true, limit: 6 }),
  ])
  const contact = contactLink(settings.whatsappNumber, settings.whatsappMessage)

  return (
    <>
      <Hero
        product={product}
        filaments={filaments}
        initial={defaultSelection(product, filaments)}
        contact={contact}
      />
      <HowItWorks />
      <SizesShowcase product={product} filaments={filaments} />

      {projects.length > 0 && (
        <section className="py-20 lg:py-24">
          <Container className="flex flex-col gap-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionTitle>
                Trabajos <Accent tone="lilac">recientes</Accent>
              </SectionTitle>
              <ButtonLink href={routes.projects} variant="text" icon={<ArrowRightIcon />}>
                Ver todos
              </ButtonLink>
            </div>
            <ProjectGrid projects={projects} />
          </Container>
        </section>
      )}

      <CreatorPromo />
      <KeychainPromo />
      <FinalCta contact={contact} />
    </>
  )
}
