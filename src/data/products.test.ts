import { describe, expect, it } from 'vitest'
import { COLORS, PRODUCTS, findColor, findProduct } from './products'

describe('findProduct', () => {
  it('finds a product by its slug', () => {
    expect(findProduct('clicker-fidget')?.id).toBe('prod-clicker')
  })

  it('keeps the old photo holder link working', () => {
    expect(findProduct('portarretratos-minimal')?.id).toBe('prod-frame')
  })

  it('returns nothing for an unknown slug instead of another product', () => {
    expect(findProduct('no-existe')).toBeUndefined()
  })

  it('returns nothing when there is no slug', () => {
    expect(findProduct(undefined)).toBeUndefined()
  })
})

describe('COLORS', () => {
  it('gives every colour its own id', () => {
    expect(new Set(COLORS.map(c => c.id)).size).toBe(COLORS.length)
  })

  it('finds a colour by its id', () => {
    expect(findColor('negro')?.name).toBe('Negro')
    expect(findColor('no-existe')).toBeUndefined()
  })
})

describe('PRODUCTS', () => {
  it('gives every part a colour from the list in every colour combination', () => {
    for (const product of PRODUCTS) {
      expect(product.colorways.length, product.id).toBeGreaterThan(0)
      for (const colorway of product.colorways) {
        expect(Object.keys(colorway).sort(), product.id).toEqual(product.parts.map(p => p.id).sort())
        for (const id of Object.values(colorway)) expect(findColor(id), `${product.id}: ${id}`).toBeDefined()
      }
    }
  })

  // The name is set huge on its poster; past this length it breaks into a third line on a phone
  it('keeps every name short enough for two lines', () => {
    for (const product of PRODUCTS) expect(product.name.length, product.name).toBeLessThanOrEqual(20)
  })
})
