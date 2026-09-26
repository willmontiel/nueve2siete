import { describe, expect, it } from 'vitest'

import { contactLink, whatsappHref } from '@/lib/whatsapp'

describe('whatsappHref', () => {
  it('builds the link with the encoded message', () => {
    expect(whatsappHref('573001234567', 'Hola, ¿qué tal?')).toBe(
      'https://wa.me/573001234567?text=Hola%2C%20%C2%BFqu%C3%A9%20tal%3F',
    )
  })

  it('strips spaces and symbols from the number', () => {
    expect(whatsappHref('+57 300 123 4567', 'x')).toBe('https://wa.me/573001234567?text=x')
  })

  it('returns null without a number', () => {
    expect(whatsappHref(null, 'x')).toBeNull()
    expect(whatsappHref('', 'x')).toBeNull()
  })
})

describe('contactLink', () => {
  it('uses the form when there is no WhatsApp', () => {
    expect(contactLink(null, 'Hola')).toEqual({ href: '/contacto?mensaje=Hola', external: false })
  })

  it('uses WhatsApp when configured', () => {
    expect(contactLink('573001234567', 'Hola').external).toBe(true)
  })
})
