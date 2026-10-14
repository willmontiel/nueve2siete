import { afterEach, describe, expect, it, vi } from 'vitest'

const ENV = {
  VITE_WHATSAPP_PHONE: '573001112233',
  VITE_CONTACT_EMAIL: 'hola@example.com',
  VITE_INSTAGRAM_URL: 'https://instagram.com/otra.marca',
}

// The module reads .env when it loads, so each test loads it fresh with its own values
async function loadContact(overrides: Partial<typeof ENV> = {}) {
  vi.resetModules()
  Object.entries({ ...ENV, ...overrides }).forEach(([key, value]) => vi.stubEnv(key, value))
  return import('./contact')
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('whatsappUrl', () => {
  it('opens a chat with the configured number', async () => {
    const { whatsappUrl } = await loadContact()
    expect(whatsappUrl()).toBe('https://wa.me/573001112233')
  })

  it('accepts the number written the way people write it', async () => {
    const { whatsappUrl } = await loadContact({ VITE_WHATSAPP_PHONE: '+57 300 111 2233' })
    expect(whatsappUrl()).toBe('https://wa.me/573001112233')
  })

  it('prefills the message, encoded for a URL', async () => {
    const { whatsappUrl } = await loadContact()
    expect(whatsappUrl('Hola, ¿tienen llaveros?')).toBe(
      'https://wa.me/573001112233?text=Hola%2C%20%C2%BFtienen%20llaveros%3F',
    )
  })

  it('leaves out a blank message', async () => {
    const { whatsappUrl } = await loadContact()
    expect(whatsappUrl('   ')).toBe('https://wa.me/573001112233')
  })
})

describe('contact details shown on the page', () => {
  it('shows a Colombian mobile number grouped like +57 300 1112233', async () => {
    const { WHATSAPP_DISPLAY } = await loadContact()
    expect(WHATSAPP_DISPLAY).toBe('+57 300 1112233')
  })

  it('shows any other number with a plus and its digits', async () => {
    const { WHATSAPP_DISPLAY } = await loadContact({ VITE_WHATSAPP_PHONE: '14155550100' })
    expect(WHATSAPP_DISPLAY).toBe('+14155550100')
  })

  it('takes the Instagram handle from the profile link', async () => {
    const { INSTAGRAM_HANDLE } = await loadContact({ VITE_INSTAGRAM_URL: 'https://www.instagram.com/otra.marca/' })
    expect(INSTAGRAM_HANDLE).toBe('@otra.marca')
  })
})
