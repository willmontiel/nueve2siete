import { describe, expect, it } from 'vitest'
import { buildOrderMessage, projectMessage } from './order'
import { PRODUCTS } from '../data/products'

const mic = PRODUCTS.find(p => p.slug === 'portamicrofono')!
const colors = { handle: '#F6F3EF', box: '#8576ea', head: '#123456' }

describe('buildOrderMessage', () => {
  it('names the product', () => {
    expect(buildOrderMessage(mic, colors, '')).toContain('Adaptador Portamicrófono Inalámbrico')
  })

  it('lists every part with its filament name and hex', () => {
    const message = buildOrderMessage(mic, colors, '')
    expect(message).toContain('• Mango: Crema Nueve2Siete (#F6F3EF)')
    expect(message).toContain('• Caja de Marca: Violeta Suave (#8576ea)')
  })

  it('marks a color outside the filament list as custom', () => {
    expect(buildOrderMessage(mic, colors, '')).toContain('• Cabeza: Personalizado (#123456)')
  })

  it('includes the trimmed brand text', () => {
    expect(buildOrderMessage(mic, colors, '  Spectrum  ')).toContain('"Spectrum"')
  })

  it('leaves out the brand text line when the text is blank', () => {
    expect(buildOrderMessage(mic, colors, '   ')).not.toContain('Texto / Marca')
  })

  it('states the price in pesos', () => {
    expect(buildOrderMessage(mic, colors, '')).toContain('55.000')
  })
})

describe('projectMessage', () => {
  it('names the project the visitor saw in the magazine', () => {
    expect(projectMessage('Un clic para cada invitado')).toBe(
      '¡Hola nueve2siete! Vi el proyecto "Un clic para cada invitado" en la revista y quiero algo así.',
    )
  })
})
