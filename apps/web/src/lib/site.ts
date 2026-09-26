import { getPayloadClient } from '@nueve2siete/cms'
import { cache } from 'react'

export interface SiteInfo {
  whatsappNumber: string | null
  whatsappMessage: string
  contactEmail: string | null
  location: string
  legal: {
    legalName: string | null
    taxId: string | null
    address: string | null
    privacyEmail: string | null
  }
}

const DEFAULT_MESSAGE = 'Hola, quiero cotizar un micrófono personalizado.'

export const getSiteSettings = cache(async (): Promise<SiteInfo> => {
  try {
    const payload = await getPayloadClient()
    const s = await payload.findGlobal({ slug: 'site-settings' })
    return {
      whatsappNumber: s.whatsappNumber || null,
      whatsappMessage: s.whatsappMessage || DEFAULT_MESSAGE,
      contactEmail: s.contactEmail || null,
      location: s.location || 'Colombia',
      legal: {
        legalName: s.legalName || null,
        taxId: s.taxId || null,
        address: s.address || null,
        privacyEmail: s.privacyEmail || null,
      },
    }
  } catch (error) {
    console.error('[site] Settings unavailable, using defaults:', error)
    return {
      whatsappNumber: null,
      whatsappMessage: DEFAULT_MESSAGE,
      contactEmail: null,
      location: 'Colombia',
      legal: { legalName: null, taxId: null, address: null, privacyEmail: null },
    }
  }
})

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
