import { describe, expect, it } from 'vitest'

import { contactInputFromFormData, contactSchema } from '@/lib/contact-schema'

const valid = {
  name: 'Ana',
  email: 'ana@example.com',
  whatsapp: '',
  interest: 'microphone',
  message: 'Quiero 20 micrófonos para un evento.',
  consent: true,
}

describe('contactSchema', () => {
  it('accepts a valid message', () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it('requires email or WhatsApp', () => {
    const result = contactSchema.safeParse({ ...valid, email: '', whatsapp: '' })
    expect(result.success).toBe(false)
  })

  it('reports missing email or WhatsApp even with other errors', () => {
    const result = contactSchema.safeParse({ ...valid, email: '', whatsapp: '', message: 'corto', consent: false })
    expect(result.success).toBe(false)
    const paths = result.error!.issues.map((issue) => issue.path[0])
    expect(paths).toEqual(expect.arrayContaining(['email', 'message', 'consent']))
  })

  it('accepts WhatsApp only', () => {
    expect(contactSchema.safeParse({ ...valid, email: '', whatsapp: '+57 300 123 4567' }).success).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'ana@' }).success).toBe(false)
  })

  it('requires accepting the data policy', () => {
    expect(contactSchema.safeParse({ ...valid, consent: false }).success).toBe(false)
  })
})

describe('contactInputFromFormData', () => {
  it('converts the checkbox to a boolean', () => {
    const form = new FormData()
    form.set('name', 'Ana')
    form.set('consent', 'on')
    expect(contactInputFromFormData(form)).toMatchObject({ name: 'Ana', consent: true, email: '' })
  })

  it('normalizes textarea line breaks', () => {
    const form = new FormData()
    form.set('message', 'línea 1\r\nlínea 2')
    expect(contactInputFromFormData(form).message).toBe('línea 1\nlínea 2')
  })
})
