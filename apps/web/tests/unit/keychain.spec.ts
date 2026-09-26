import { KEYCHAIN } from '@nueve2siete/products'
import { describe, expect, it } from 'vitest'

import { interestFromProduct } from '@/lib/contact-schema'
import { PAGES, translatedPages } from '@/lib/routes'
import { keychainIssueMessage, keychainSummary } from '@/products/keychain/messages'
import { regionsToPathData, regionsToShapes } from '@/products/keychain/shapes'

const square = { outer: [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }], holes: [] }
const withHole = { ...square, holes: [[{ x: 4, y: 4 }, { x: 6, y: 4 }, { x: 6, y: 6 }, { x: 4, y: 6 }]] }

describe('keychain shapes', () => {
  it('turns regions into three.js shapes with their holes', () => {
    const [shape] = regionsToShapes([withHole])
    expect(shape!.getPoints()).toHaveLength(4)
    expect(shape!.holes).toHaveLength(1)
  })

  it('draws SVG paths with y flipped', () => {
    expect(regionsToPathData([square], 10)).toBe('M0.00 10.00L10.00 10.00L10.00 0.00L0.00 0.00Z')
  })
})

describe('keychain messages', () => {
  it('explains each issue in Spanish, and suggests a size when there is one', () => {
    expect(keychainIssueMessage({ code: 'empty' }, 'M')).toBeNull()
    expect(keychainIssueMessage({ code: 'unsupported', chars: ['🇨🇴'] }, 'M')?.text).toContain('🇨🇴')
    const tooLong = keychainIssueMessage({ code: 'too_long', widthMm: 120, maxMm: 115, fitsIn: 'S' }, 'M')
    expect(tooLong?.text).toContain('12 cm')
    expect(tooLong?.suggestSize).toBe('S')
    expect(keychainIssueMessage({ code: 'thin', betterSize: null }, 'S')?.suggestSize).toBeUndefined()
  })

  it('builds the order message', () => {
    const summary = keychainSummary({
      product: KEYCHAIN,
      text: 'Lucía 🎀',
      fontLabel: 'Redondeada',
      sizeKey: 'M',
      widthMm: 81.2,
      heightMm: 22.4,
      baseName: 'Azul',
      lettersName: 'Blanco',
    })
    expect(summary.split('\n')).toEqual([
      'Hola, quiero este llavero con tu nombre:',
      '• Texto: Lucía 🎀',
      '• Letra: Redondeada',
      '• Tamaño: M · Mediano (8,1 × 2,2 cm)',
      '• Colores: base Azul, letras Blanco',
    ])
  })
})

describe('routes', () => {
  it('maps every translated page and keeps URLs unique', () => {
    const urls = Object.values(PAGES).map((p) => p.url)
    expect(new Set(urls).size).toBe(urls.length)
    expect(translatedPages()).toContainEqual({ url: '/disena-el-tuyo/llavero', folder: '/design-your-own/keychain' })
    expect(translatedPages()).toContainEqual({ url: '/llaveros', folder: '/keychains' })
  })

  it('reads the product the contact form should preselect', () => {
    expect(interestFromProduct('llavero')).toBe('keychain')
    expect(interestFromProduct('microfono')).toBe('microphone')
    expect(interestFromProduct(['llavero'])).toBeUndefined()
    expect(interestFromProduct('otro')).toBeUndefined()
  })
})
