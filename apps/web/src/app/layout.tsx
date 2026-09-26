import type { Metadata, Viewport } from 'next'
import { Fraunces } from 'next/font/google'
import localFont from 'next/font/local'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SITE_URL } from '@/lib/site'

import './styles.css'

// The logo's typeface (Cal Sans, variable 400–700; SemiBold is weight 600).
const calSans = localFont({
  src: '../../node_modules/cal-sans/fonts/calsans-var-full/CalSansVF.woff2',
  variable: '--font-cal-sans',
  weight: '400 700',
  display: 'swap',
})

// Editorial italic for the accented words.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['400'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'nueve2siete · Micrófonos personalizados impresos en 3D',
    template: '%s · nueve2siete',
  },
  description:
    'Mini micrófonos con tu logo en relieve, impresos en 3D en Colombia. Elige tamaño y colores, y lleva tu marca frente a la cámara.',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'nueve2siete 3d studio',
  },
}

export const viewport: Viewport = {
  themeColor: '#f0f0eb',
}

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${calSans.variable} ${fraunces.variable}`}>
      <body className="flex min-h-dvh flex-col bg-cream font-sans text-ink">
        <a
          href="#contenido"
          className="sr-only rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
