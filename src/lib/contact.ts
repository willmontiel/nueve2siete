// Contact details come from .env so they change in one place; vite.config.ts stops the build if one is missing

// People write the number with spaces or a plus; wa.me wants digits only
export const WHATSAPP_PHONE = import.meta.env.VITE_WHATSAPP_PHONE.replace(/\D/g, '')
export const WHATSAPP_DISPLAY = formatPhone(WHATSAPP_PHONE)
export const EMAIL = import.meta.env.VITE_CONTACT_EMAIL
export const INSTAGRAM_URL = import.meta.env.VITE_INSTAGRAM_URL
export const INSTAGRAM_HANDLE = `@${new URL(INSTAGRAM_URL).pathname.split('/').filter(Boolean)[0]}`

// Colombian mobiles read as +57 321 3527921; anything else keeps its digits as they are
function formatPhone(digits: string): string {
  if (digits.length === 12 && digits.startsWith('57')) return `+57 ${digits.slice(2, 5)} ${digits.slice(5)}`
  return `+${digits}`
}

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_PHONE}`
  const text = message?.trim()
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
