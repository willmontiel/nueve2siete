import type { Metadata } from 'next'
import React from 'react'

import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { getFaqs } from '@/lib/faqs'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Qué logos se pueden imprimir, colores, tamaños y cómo hacer un pedido.',
}

export default async function FaqPage() {
  const faqs = await getFaqs()

  return (
    <>
      <PageHeader
        overline="Preguntas frecuentes"
        title={
          <>
            Todo lo que quieres <Accent tone="lilac">saber</Accent>
          </>
        }
      />
      <Container className="flex flex-col gap-10 pb-16">
        <div className="flex max-w-3xl flex-col gap-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-3xl bg-snow ring-1 ring-ink/10 open:bg-sand open:ring-0">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cream text-xl transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-6 pb-6 text-[17px] leading-relaxed text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
        <div className="flex flex-col items-start gap-3">
          <p className="text-lg text-ink-soft">¿No encontraste tu respuesta?</p>
          <ButtonLink href={routes.contact}>Escríbenos</ButtonLink>
        </div>
      </Container>
    </>
  )
}
