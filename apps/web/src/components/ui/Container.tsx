import React from 'react'

import { cn } from '@/lib/cn'

export function Container({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-20', className)}>{children}</div>
}
