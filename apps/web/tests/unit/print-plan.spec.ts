import { EXAMPLE_FILAMENTS } from '@nueve2siete/configurator'
import { describe, expect, it } from 'vitest'

import { initialColorMode, initialSingleFilament, printPlan } from '@/lib/engine/print-plan'
import type { LogoAnalysis, LogoSize } from '@/lib/engine/schema'

const white = EXAMPLE_FILAMENTS.find((f) => f.id === 'white')!

function size(key: string, status: LogoSize['status'], mono: Partial<LogoSize['mono']> = {}): LogoSize {
  return {
    key,
    status,
    lostRatio: 0,
    removedFeatures: 0,
    filledRatio: 0,
    layers: [
      { colorIndex: 0, path: `M0 0 ${key}` },
      { colorIndex: 1, path: `M1 1 ${key}` },
    ],
    mono: { status: 'viable', simplified: false, path: `M9 9 ${key}`, ...mono },
  }
}

// Like the Microsoft logo: five colors don't fit in four, so full color needs adjustments.
const analysis: LogoAnalysis = {
  status: 'adjust',
  width: 1024,
  height: 1024,
  issues: [
    { code: 'too_many_colors', severity: 'warning', sizes: [], detail: { found: 5, max: 4 } },
    { code: 'fine_detail', severity: 'warning', sizes: ['S'], detail: {} },
    { code: 'enclosed_background', severity: 'info', sizes: [], detail: { share: 0.1 } },
  ],
  colors: [
    { index: 0, hex: '#F24F1C', share: 0.5, filamentId: 'orange', filamentHex: '#E95C21' },
    { index: 1, hex: '#787878', share: 0.5, filamentId: 'gray', filamentHex: '#6E706B' },
  ],
  sizes: [size('S', 'adjust', { status: 'adjust', simplified: true }), size('M', 'adjust')],
  monoLosesDetail: false,
}

describe('printPlan', () => {
  it('in full color uses the engine layers and filaments', () => {
    const plan = printPlan(analysis, 'original', undefined)
    expect(plan.status).toBe('adjust')
    expect(plan.inkColors).toEqual(['#E95C21', '#6E706B'])
    expect(plan.filamentIds).toEqual(['orange', 'gray'])
    expect(plan.sizes[1]!.layers).toHaveLength(2)
  })

  it('in single color uses the merged version and the chosen filament', () => {
    const plan = printPlan(analysis, 'single', white)
    expect(plan.status).toBe('viable') // Medium no longer loses any color
    expect(plan.sizes.map((s) => s.status)).toEqual(['adjust', 'viable'])
    expect(plan.sizes[1]!.layers).toEqual([{ colorIndex: 0, path: 'M9 9 M' }])
    expect(plan.inkColors).toEqual([white.hex])
    expect(plan.filamentIds).toEqual(['white'])
  })

  it('in single color drops the color issues and uses the detail of the merged version', () => {
    const codes = printPlan(analysis, 'single', white).issues.map((i) => `${i.code}:${i.sizes.join(',')}`)
    expect(codes).toEqual(['enclosed_background:', 'fine_detail:S'])
  })
})

describe('initial values', () => {
  it('a one-color logo starts in single color with its filament', () => {
    const oneColor = { ...analysis, colors: [analysis.colors[1]!] }
    expect(initialColorMode(oneColor)).toBe('single')
    expect(initialSingleFilament(oneColor, EXAMPLE_FILAMENTS, '#1F1B16')?.id).toBe('gray')
  })

  it('for several colors suggests the one that contrasts most with the box', () => {
    expect(initialColorMode(analysis)).toBe('original')
    expect(initialSingleFilament(analysis, EXAMPLE_FILAMENTS, '#1F1B16')?.id).toBe('white')
    expect(initialSingleFilament(analysis, EXAMPLE_FILAMENTS, '#E9BF0F')?.id).toBe('black')
  })
})
