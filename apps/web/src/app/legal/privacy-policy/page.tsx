import type { Metadata } from 'next'
import React from 'react'

import { Container } from '@/components/ui/Container'
import { PageHeader } from '@/components/ui/PageHeader'
import { getSiteSettings } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Política de tratamiento de datos personales',
  description: 'Cómo tratamos tus datos personales, según la Ley 1581 de 2012.',
}

export default async function PrivacyPolicyPage() {
  const settings = await getSiteSettings()
  const { legalName, taxId, address, privacyEmail } = settings.legal
  const email = privacyEmail ?? settings.contactEmail
  const incomplete = !legalName || !taxId || !address || !email
  const missing = (value: string | null, placeholder: string) => value ?? `[${placeholder}]`

  return (
    <>
      <PageHeader overline="Legal" title="Política de tratamiento de datos personales" />
      <Container className="pb-16">
        <article className="flex max-w-3xl flex-col gap-8 text-[17px] leading-relaxed text-ink-soft [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-ink">
          {incomplete && (
            <p role="note" className="rounded-2xl bg-tint-yellow px-5 py-4 text-ink">
              <strong>Borrador.</strong> Completa los datos del responsable en el panel (Ajustes del sitio → Datos
              legales) y revisa esta política con un asesor legal antes de publicar el sitio.
            </p>
          )}

          <section className="flex flex-col gap-3">
            <h2>1. Responsable del tratamiento</h2>
            <p>
              {missing(legalName, 'Nombre o razón social')}, identificado con {missing(taxId, 'cédula o NIT')}, con
              domicilio en {missing(address, 'dirección')}, que opera la marca nueve2siete 3d studio. Correo para temas
              de datos personales: {missing(email, 'correo')}.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>2. Marco legal</h2>
            <p>
              Esta política se rige por la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de
              2015) y las demás normas que los modifiquen o complementen.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>3. Datos que recolectamos</h2>
            <p>
              Nombre, correo electrónico, número de WhatsApp, y el contenido de los mensajes y archivos (por ejemplo,
              logos) que nos envíes a través del sitio, WhatsApp o correo.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>4. Finalidades</h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-6">
              <li>Responder tus solicitudes y cotizaciones.</li>
              <li>Diseñar y fabricar los productos que nos pidas.</li>
              <li>Comunicarnos contigo sobre tu pedido.</li>
              <li>Cumplir obligaciones legales.</li>
            </ul>
            <p>
              No vendemos tus datos. Podemos apoyarnos en proveedores tecnológicos (por ejemplo, alojamiento web) que
              actúan como encargados del tratamiento y solo los usan para prestarnos ese servicio.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>5. Tus derechos</h2>
            <p>Como titular de los datos puedes:</p>
            <ul className="flex list-disc flex-col gap-1.5 pl-6">
              <li>Conocer, actualizar y rectificar tus datos.</li>
              <li>Solicitar prueba de la autorización que nos diste.</li>
              <li>Ser informado sobre el uso que les damos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
              <li>Revocar la autorización o pedir que eliminemos tus datos.</li>
              <li>Acceder gratis a tus datos.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-3">
            <h2>6. Consultas y reclamos</h2>
            <p>
              Escríbenos a {missing(email, 'correo')}. Respondemos las consultas en máximo diez (10) días hábiles y los
              reclamos en máximo quince (15) días hábiles, prorrogables en los términos de la ley.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2>7. Vigencia</h2>
            <p>
              Esta política rige desde su publicación en este sitio. Conservamos tus datos durante el tiempo necesario para
              las finalidades descritas o el que exija la ley.
            </p>
          </section>
        </article>
      </Container>
    </>
  )
}
