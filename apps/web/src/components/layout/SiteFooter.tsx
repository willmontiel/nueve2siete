import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import logo from '@/assets/brand/nueve2siete-logo.png'
import { Container } from '@/components/ui/Container'
import { routes } from '@/lib/routes'
import { getSiteSettings } from '@/lib/site'
import { whatsappHref } from '@/lib/whatsapp'

const heading = 'text-[13px] font-semibold tracking-[0.12em] text-lilac-deep uppercase'
const link = 'flex min-h-8 items-center hover:text-orange-deep'

export async function SiteFooter() {
  const settings = await getSiteSettings()
  const wa = whatsappHref(settings.whatsappNumber, settings.whatsappMessage)

  return (
    <footer className="mt-12 rounded-t-[48px] bg-sand">
      <Container className="flex flex-col gap-12 pt-14 pb-7">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <Image
              src={logo}
              alt="nueve2siete 3d studio"
              className="h-14 w-auto self-start"
            />
            <p className="max-w-xs text-[15px] leading-relaxed text-ink-soft">
              Estudio de impresión 3D. Hecho capa por capa en {settings.location}.
            </p>
          </div>

          <nav aria-label="Explora">
            <p className={heading}>Explora</p>
            <ul className="mt-3 text-[15px]">
              <li><Link className={link} href={routes.microphones}>Micrófonos</Link></li>
              <li><Link className={link} href={routes.keychains}>Llaveros</Link></li>
              <li><Link className={link} href="/#como-funciona">Cómo funciona</Link></li>
              <li><Link className={link} href={routes.projects}>Trabajos</Link></li>
              <li><Link className={link} href={routes.about}>Nosotros</Link></li>
              <li><Link className={link} href={routes.faq}>Preguntas frecuentes</Link></li>
            </ul>
          </nav>

          <div>
            <p className={heading}>Contacto</p>
            <ul className="mt-3 text-[15px]">
              {wa && (
                <li>
                  <a className={link} href={wa} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.contactEmail && (
                <li>
                  <a className={link} href={`mailto:${settings.contactEmail}`}>
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              <li><Link className={link} href={routes.contact}>Formulario de contacto</Link></li>
            </ul>
          </div>

          <div>
            <p className={heading}>Legal</p>
            <ul className="mt-3 text-[15px]">
              <li><Link className={link} href={routes.privacyPolicy}>Tratamiento de datos</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-5 text-sm text-muted sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} nueve2siete 3d studio</span>
          <span>Hecho en {settings.location}</span>
        </div>
      </Container>
    </footer>
  )
}
