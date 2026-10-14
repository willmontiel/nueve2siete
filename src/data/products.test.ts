import { describe, expect, it } from 'vitest'
import { findProduct } from './products'

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
