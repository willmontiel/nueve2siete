import { describe, expect, it } from 'vitest'
import { buildOrderMessage, projectMessage } from './order'
import { findProduct } from '../data/products'

const mic = findProduct('portamicrofono')!
const colors = { handle: 'negro', box: 'lavanda', head: 'rojo' }

describe('buildOrderMessage', () => {
  it('names the product', () => {
    expect(buildOrderMessage(mic, colors, '', 'N2S-AS9D')).toContain('Portamicrófono')
  })

  it('lists every part with its colour name and hex', () => {
    const message = buildOrderMessage(mic, colors, '', 'N2S-AS9D')
    expect(message).toContain('• Mango: Negro (#1C1C1E)')
    expect(message).toContain('• Caja: Lavanda (#9FAFE9)')
    expect(message).toContain('• Cabeza: Rojo (#C8102E)')
  })

  it('includes the trimmed brand text', () => {
    expect(buildOrderMessage(mic, colors, '  Spectrum  ', 'N2S-AS9D')).toContain('"Spectrum"')
  })

  it('leaves out the brand text line when the text is blank', () => {
    expect(buildOrderMessage(mic, colors, '   ', 'N2S-AS9D')).not.toContain('Texto')
  })

  it('states the price in pesos', () => {
    expect(buildOrderMessage(mic, colors, '', 'N2S-AS9D')).toContain('55.000')
  })

  it('carries the order code, so the chat can be matched with the order log', () => {
    expect(buildOrderMessage(mic, colors, '', 'N2S-AS9D')).toContain('*Pedido:* N2S-AS9D')
  })

  // Lead times are not confirmed yet (docs/deuda.md)
  it('promises no lead time', () => {
    expect(buildOrderMessage(mic, colors, '', 'N2S-AS9D')).not.toMatch(/día|tiempo/i)
  })
})

describe('projectMessage', () => {
  it('names the project the visitor saw on the site', () => {
    expect(projectMessage('Un clic para cada invitado')).toBe(
      '¡Hola nueve2siete! Vi el proyecto "Un clic para cada invitado" en su página y quiero algo así.',
    )
  })
})
