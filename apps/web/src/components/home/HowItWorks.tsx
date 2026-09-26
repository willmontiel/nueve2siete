import React from 'react'

import { Container } from '@/components/ui/Container'
import { Accent, Overline, SectionTitle } from '@/components/ui/Typography'
import { cn } from '@/lib/cn'

const steps = [
  {
    title: 'Envíanos tu logo',
    text: 'Por WhatsApp o por el formulario. Revisamos que se pueda imprimir en 3D.',
    circle: 'bg-yellow',
  },
  {
    title: 'Elige tamaño y colores',
    text: 'Cuatro tamaños y una paleta para la cabeza, la caja y el palo.',
    circle: 'bg-lilac',
  },
  {
    title: 'Lo imprimimos',
    text: 'Tu logo queda en relieve sobre la caja, capa por capa.',
    circle: 'bg-orange',
  },
  {
    title: 'Pon tu micrófono',
    text: 'Atrás va tu micrófono inalámbrico tipo DJI. Listo para grabar.',
    circle: 'bg-ink text-yellow',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-6 py-20 lg:py-24">
      <Container className="flex flex-col items-center gap-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <Overline>Paso a paso</Overline>
          <SectionTitle>
            Cómo <Accent>funciona</Accent>
          </SectionTitle>
        </div>

        <div className="relative w-full">
          <svg
            viewBox="0 0 1280 90"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-[90px] w-full lg:block"
          >
            <path
              d="M148 44 C 260 -4, 364 92, 476 44 C 588 -4, 692 92, 804 44 C 916 -4, 1020 92, 1132 44"
              fill="none"
              stroke="var(--color-lilac)"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <ol className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col items-center gap-3.5 text-center">
                <span
                  className={cn(
                    'flex size-[88px] items-center justify-center rounded-full font-serif text-[38px] italic',
                    step.circle,
                  )}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="text-[22px] font-semibold">{step.title}</h3>
                <p className="max-w-[17rem] text-[17px] leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
