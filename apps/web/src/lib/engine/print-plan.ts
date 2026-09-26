import { contrastRatio, type Filament } from '@nueve2siete/configurator'

import type { LogoAnalysis, LogoIssue, LogoLayer, LogoStatus } from './schema'

/** Full color (the logo's colors with their closest filament) or in a single filament. */
export type LogoColorMode = 'original' | 'single'

export interface PlannedSize {
  key: string
  status: LogoStatus
  layers: LogoLayer[]
}

/** What will be printed for the color mode: verdict, layers per size and colors. */
export interface PrintPlan {
  /** The best size's status. */
  status: LogoStatus
  sizes: PlannedSize[]
  /** Print color for each layer, by index. */
  inkColors: string[]
  /** The logo's filaments (or its hex if there's no close one), to decide the fabrication mode. */
  filamentIds: string[]
  issues: LogoIssue[]
}

const RANK: Record<LogoStatus, number> = { viable: 0, adjust: 1, not_viable: 2 }

// In a single color the issues about the logo's colors don't apply, and the per-size detail issues
// are replaced by those of the single-color version.
const COLOR_ISSUES = new Set(['shading', 'too_many_colors', 'no_close_filament', 'shared_filament'])
const SIZE_ISSUES = new Set(['fine_detail', 'color_lost'])

export function bestStatus(statuses: LogoStatus[]): LogoStatus {
  return statuses.reduce((best, status) => (RANK[status] < RANK[best] ? status : best), 'not_viable')
}

export function statusRank(status: LogoStatus): number {
  return RANK[status]
}

export function printPlan(analysis: LogoAnalysis, mode: LogoColorMode, single: Filament | undefined): PrintPlan {
  if (mode === 'single' && single) {
    const sizes = analysis.sizes.map((size) => ({
      key: size.key,
      status: size.mono.status,
      layers: [{ colorIndex: 0, path: size.mono.path }],
    }))
    const issues = analysis.issues.filter((i) => !COLOR_ISSUES.has(i.code) && !SIZE_ISSUES.has(i.code))
    const simplified = analysis.sizes.filter((size) => size.mono.simplified).map((size) => size.key)
    if (simplified.length && !issues.some((i) => i.severity === 'error')) {
      const nothingPrints = sizes.every((size) => size.status === 'not_viable')
      issues.push({ code: 'fine_detail', severity: nothingPrints ? 'error' : 'warning', sizes: simplified, detail: {} })
    }
    return {
      status: bestStatus(sizes.map((size) => size.status)),
      sizes,
      inkColors: [single.hex],
      filamentIds: [single.id],
      issues,
    }
  }

  const inkColors: string[] = []
  for (const color of analysis.colors) inkColors[color.index] = color.filamentHex ?? color.hex
  return {
    status: analysis.status,
    sizes: analysis.sizes.map(({ key, status, layers }) => ({ key, status, layers })),
    inkColors,
    filamentIds: analysis.colors.map((color) => color.filamentId ?? color.hex),
    issues: analysis.issues,
  }
}

/** Initial mode: a one-color logo is already "single color" (so the customer can change it). */
export function initialColorMode(analysis: LogoAnalysis): LogoColorMode {
  return analysis.colors.length === 1 ? 'single' : 'original'
}

/**
 * Initial filament for printing in a single color: the logo's if it's already one color; otherwise the one
 * that contrasts most with the box (in practice, white or black).
 */
export function initialSingleFilament(
  analysis: LogoAnalysis,
  filaments: Filament[],
  boxHex: string,
): Filament | undefined {
  if (analysis.colors.length === 1) {
    const matched = filaments.find((f) => f.id === analysis.colors[0]!.filamentId)
    if (matched) return matched
  }
  return filaments.reduce<Filament | undefined>(
    (best, filament) => (!best || contrastRatio(filament.hex, boxHex) > contrastRatio(best.hex, boxHex) ? filament : best),
    undefined,
  )
}
