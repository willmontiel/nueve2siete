import { describe, expect, it } from 'vitest'
import { colorsFromParam, colorsToParam, defaultColors } from './colorway'
import { findProduct } from '../data/products'

const mic = findProduct('portamicrofono')!

describe('defaultColors', () => {
  it('starts from the first colour combination', () => {
    expect(defaultColors(mic)).toEqual(mic.colorways[0])
  })
})

describe('colorsToParam', () => {
  it('lists the colour of each part in the order of the parts', () => {
    expect(colorsToParam(mic, { head: 'rojo', box: 'lavanda', handle: 'negro' })).toBe('negro,lavanda,rojo')
  })
})

describe('colorsFromParam', () => {
  it('reads back the colours it wrote', () => {
    const colors = { handle: 'negro', box: 'lavanda', head: 'rojo' }
    expect(colorsFromParam(mic, colorsToParam(mic, colors))).toEqual(colors)
  })

  it('starts from the defaults when the link carries no colours', () => {
    expect(colorsFromParam(mic, null)).toEqual(defaultColors(mic))
  })

  it('keeps the default for a part whose colour it does not know', () => {
    expect(colorsFromParam(mic, 'negro,no-existe,rojo').box).toBe(defaultColors(mic).box)
  })

  it('fills the parts a short link leaves out and ignores extra colours', () => {
    expect(colorsFromParam(mic, 'rojo')).toEqual({ ...defaultColors(mic), handle: 'rojo' })
    expect(colorsFromParam(mic, 'rojo,rojo,rojo,azul')).toEqual({ handle: 'rojo', box: 'rojo', head: 'rojo' })
  })
})
