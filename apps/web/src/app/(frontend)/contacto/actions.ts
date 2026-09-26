'use server'

import { z } from 'zod'

import { contactInputFromFormData, contactSchema } from '@/lib/contact-schema'
import { getPayloadClient } from '@/lib/payload'

export interface ContactState {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<string, string[]>>
  values?: Record<string, string>
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot field: humans don't see it; bots fill it in.
  if (formData.get('company')) return { status: 'success' }

  const raw = contactInputFromFormData(formData)
  const parsed = contactSchema.safeParse(raw)

  if (!parsed.success) {
    const { consent: _consent, ...values } = raw
    return {
      status: 'error',
      message: 'Revisa los campos marcados.',
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values,
    }
  }

  try {
    const payload = await getPayloadClient()
    const { email, whatsapp, ...rest } = parsed.data
    await payload.create({
      collection: 'leads',
      overrideAccess: true,
      data: {
        ...rest,
        email: email || undefined,
        whatsapp: whatsapp || undefined,
        status: 'new',
      },
    })
    return { status: 'success' }
  } catch (error) {
    console.error('[contact] Could not save the lead:', error)
    const { consent: _consent, ...values } = raw
    return {
      status: 'error',
      message: 'No pudimos enviar tu mensaje. Intenta de nuevo en un momento.',
      values,
    }
  }
}
