import { describe, expect, it } from 'vitest'

import {
  BAMBU_A1_BUILD_VOLUME_MM,
  BRAND_YELLOW,
  EXAMPLE_FILAMENTS,
  INK,
  LOGO_MARGIN_MM,
  MICROPHONE,
  SNOW,
  chooseFabricationMode,
  contrastRatio,
  defaultSelection,
  describeSelection,
  previewLogoColor,
  relativeLuminance,
} from './index'

describe('color', () => {
  it('computes the luminance of the extremes', () => {
    expect(relativeLuminance('#000000')).toBe(0)
    expect(relativeLuminance('#FFFFFF')).toBeCloseTo(1)
  })

  it('rejects invalid colors', () => {
    expect(() => relativeLuminance('orange')).toThrow()
  })

  it('sample text always contrasts with the box', () => {
    for (const filament of EXAMPLE_FILAMENTS) {
      expect(contrastRatio(filament.hex, previewLogoColor(filament.hex))).toBeGreaterThanOrEqual(3)
    }
  })

  it('uses yellow on black boxes and ink on orange', () => {
    expect(previewLogoColor('#1F1B16')).toBe(BRAND_YELLOW)
    expect(previewLogoColor('#E95C21')).toBe(INK)
    expect(previewLogoColor('#2F5BD3')).toBe(SNOW)
  })
})

describe('microphone', () => {
  it('has 4 sizes that fit on the Bambu Lab A1', () => {
    expect(MICROPHONE.sizes.map((s) => s.key)).toEqual(['S', 'M', 'L', 'XL'])
    for (const size of MICROPHONE.sizes) {
      expect(size.totalHeightMm).toBeLessThanOrEqual(BAMBU_A1_BUILD_VOLUME_MM.z)
      expect(size.box.widthMm).toBeLessThanOrEqual(BAMBU_A1_BUILD_VOLUME_MM.x)
    }
  })

  it('leaves a margin around the logo', () => {
    for (const size of MICROPHONE.sizes) {
      expect(size.logoArea.widthMm).toBe(size.box.widthMm - LOGO_MARGIN_MM * 2)
    }
  })
})

describe('chooseFabricationMode', () => {
  const rules = MICROPHONE.logoRules

  it('integrates box + 3 extra colors', () => {
    expect(chooseFabricationMode(['a', 'b', 'c'], 'box', rules)).toEqual({
      mode: 'integrated',
      filamentsInPrint: 4,
    })
  })

  it('does not count a logo color that matches the box', () => {
    expect(chooseFabricationMode(['box', 'a', 'b', 'c'], 'box', rules).mode).toBe('integrated')
  })

  it('switches to separate with 4 colors other than the box', () => {
    expect(chooseFabricationMode(['a', 'b', 'c', 'd'], 'box', rules)).toEqual({
      mode: 'separate',
      filamentsInPrint: 4,
    })
  })

  it('is not printable with more than 4 colors', () => {
    expect(chooseFabricationMode(['a', 'b', 'c', 'd', 'e'], 'box', rules).mode).toBeNull()
  })
})

describe('selection', () => {
  it('starts at Medium, cube, black head and orange box', () => {
    const selection = defaultSelection(MICROPHONE, EXAMPLE_FILAMENTS)
    expect(selection).toMatchObject({
      sizeKey: 'M',
      shapeKey: 'cube',
      colors: { head: 'black', box: 'orange', handle: 'black' },
    })
  })

  it('uses the first filament if the preferred one is missing', () => {
    const selection = defaultSelection(MICROPHONE, [{ id: '7', name: 'Rojo', hex: '#C12E1F' }])
    expect(selection.colors).toEqual({ head: '7', box: '7', handle: '7' })
  })

  it('summarizes the selection for a quote', () => {
    const selection = { ...defaultSelection(MICROPHONE, EXAMPLE_FILAMENTS), text: 'Mi Podcast' }
    const text = describeSelection(MICROPHONE, selection, EXAMPLE_FILAMENTS)
    expect(text).toContain('Tamaño: Medium (19 cm de alto)')
    expect(text).toContain('Caja: Naranja')
    expect(text).toContain('Texto o marca: Mi Podcast')
  })
})
