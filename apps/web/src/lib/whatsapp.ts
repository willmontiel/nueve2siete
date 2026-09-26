/** WhatsApp link with a prefilled message, or null if no number is configured. */
export function whatsappHref(number: string | null | undefined, message: string): string | null {
  const digits = (number ?? '').replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export interface ContactLink {
  href: string
  external: boolean
}

/** WhatsApp if configured; otherwise the contact form (with the message prefilled). */
export function contactLink(number: string | null | undefined, message: string): ContactLink {
  const wa = whatsappHref(number, message)
  if (wa) return { href: wa, external: true }
  return { href: `/contacto?mensaje=${encodeURIComponent(message)}`, external: false }
}
