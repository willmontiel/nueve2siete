import React from 'react'

import { cn } from '@/lib/cn'
import { STATUS_LABEL } from '@/lib/engine/messages'
import type { LogoStatus } from '@/lib/engine/schema'

const TONE: Record<LogoStatus, string> = {
  viable: 'bg-tint-green',
  adjust: 'bg-tint-yellow',
  not_viable: 'bg-tint-orange',
}

export function StatusPill({ status, className }: { status: LogoStatus; className?: string }) {
  return (
    <span
      className={cn('inline-flex rounded-full px-3 py-1 text-[13px] font-semibold text-ink', TONE[status], className)}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
