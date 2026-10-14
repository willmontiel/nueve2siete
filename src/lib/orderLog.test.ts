import { describe, expect, it } from 'vitest'
import { orderCode, orderRow } from './orderLog'
import { findProduct } from '../data/products'

const mic = findProduct('portamicrofono')!

// Hands out the given numbers in turn, as Math.random would
const sequence = (...values: number[]) => () => values.shift()!

describe('orderCode', () => {
  it('reads as a short code with no look-alike characters (no 0/O, 1/I/L)', () => {
    expect(orderCode()).toMatch(/^N2S-[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{4}$/)
  })

  it('draws each character from the random source', () => {
    expect(orderCode(sequence(0, 0.5, 0.99, 0.1))).toBe('N2S-AS9D')
  })
})

describe('orderRow', () => {
  const colors = { handle: 'negro', box: 'lavanda', head: 'rojo' }

  it('records the piece, its colours by part, the price, the code and the message', () => {
    expect(orderRow(mic, colors, ' Spectrum ', 'N2S-AS9D', 'el mensaje')).toEqual({
      code: 'N2S-AS9D',
      product_slug: 'portamicrofono',
      product_name: 'Portamicrófono',
      colors: [
        { part: 'Mango', color: 'Negro', hex: '#1C1C1E' },
        { part: 'Caja', color: 'Lavanda', hex: '#9FAFE9' },
        { part: 'Cabeza', color: 'Rojo', hex: '#C8102E' },
      ],
      custom_text: 'Spectrum',
      price_cop: 55000,
      message: 'el mensaje',
    })
  })

  it('stores no text when the visitor left it blank', () => {
    expect(orderRow(mic, colors, '   ', 'N2S-AS9D', 'el mensaje').custom_text).toBeNull()
  })
})
