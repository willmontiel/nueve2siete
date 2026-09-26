import type { Metadata } from 'next'
import React from 'react'

import { Container } from '@/components/ui/Container'
import { ChatIcon, MailIcon } from '@/components/ui/icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { Accent } from '@/components/ui/Typography'
import { getSiteSettings } from '@/lib/site'
import { whatsappHref } from '@/lib/whatsapp'

import { ContactForm } from './ContactForm'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Cotiza tu micrófono personalizado o cuéntanos tu proyecto de impresión 3D.',
}

const tips = ['Tu logo (PNG, JPG o SVG)', 'El tamaño y los colores', 'Cuántos necesitas', 'Para cuándo los necesitas']

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ mensaje?: string | string[] }>
}) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams])
  const initialMessage = typeof params.mensaje === 'string' ? params.mensaje.slice(0, 2000) : ''
  const wa = whatsappHref(settings.whatsappNumber, settings.whatsappMessage)

  return (
    <>
      <PageHeader
        overline="Contacto"
        title={
          <>
            Cuéntanos de tu <Accent>marca</Accent>
          </>
        }
        intro="Te respondemos para confirmar el diseño, el tamaño y los colores."
      />

      <Container className="grid gap-12 pb-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
        <ContactForm initialMessage={initialMessage} />

        <aside className="flex flex-col gap-4">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-[32px] bg-ink p-6 text-cream transition-colors hover:bg-ink-soft"
            >
              <ChatIcon className="size-7" />
              <span>
                <span className="block text-lg font-semibold">Escríbenos por WhatsApp</span>
                <span className="text-[15px] text-cream/80">La forma más rápida</span>
              </span>
            </a>
          )}
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="flex items-center gap-4 rounded-[32px] bg-snow p-6 ring-1 ring-ink/10 transition-shadow hover:ring-ink/40"
            >
              <MailIcon className="size-7" />
              <span>
                <span className="block text-lg font-semibold">Correo</span>
                <span className="text-[15px] break-all text-ink-soft">{settings.contactEmail}</span>
              </span>
            </a>
          )}
          <div className="rounded-[32px] bg-tint-lilac p-7">
            <p className="text-lg font-semibold">Para cotizar más rápido, cuéntanos:</p>
            <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-[16px] text-ink-soft">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </>
  )
}
