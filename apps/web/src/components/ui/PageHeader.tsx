import React from 'react'

import { Container } from './Container'
import { Overline } from './Typography'

export function PageHeader({
  overline,
  title,
  intro,
}: {
  overline: string
  title: React.ReactNode
  intro?: React.ReactNode
}) {
  return (
    <Container className="flex flex-col gap-4 pt-6 pb-10 lg:pt-10 lg:pb-14">
      <Overline>{overline}</Overline>
      <h1 className="max-w-4xl text-[44px] leading-[1.03] font-semibold tracking-[-0.025em] text-balance sm:text-6xl lg:text-[72px]">
        {title}
      </h1>
      {intro && <p className="max-w-2xl text-lg leading-relaxed text-ink-soft sm:text-xl">{intro}</p>}
    </Container>
  )
}
