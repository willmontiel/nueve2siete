import { z } from 'zod'

const emailFormat = z.email()

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, 'Escribe tu nombre').max(100, 'Máximo 100 caracteres'),
    email: z
      .string()
      .trim()
      .max(200)
      .refine((v) => v === '' || emailFormat.safeParse(v).success, 'Correo no válido'),
    whatsapp: z
      .string()
      .trim()
      .max(20, 'Máximo 20 caracteres')
      .regex(/^[+\d\s()-]*$/, 'Solo números'),
    interest: z.enum(['microphone', 'other'], { error: 'Elige una opción' }),
    message: z
      .string()
      .trim()
      .min(10, 'Cuéntanos un poco más (mínimo 10 caracteres)')
      .max(2000, 'Máximo 2000 caracteres'),
    consent: z.literal(true, { error: 'Debes aceptar la política de tratamiento de datos' }),
  })
  .refine((data) => data.email !== '' || data.whatsapp !== '', {
    message: 'Déjanos un correo o un WhatsApp para responderte',
    path: ['email'],
    // By default Zod skips this check if other fields fail; this way all errors are shown at once.
    when: ({ issues }) => !issues.some((issue) => issue.path?.[0] === 'email' || issue.path?.[0] === 'whatsapp'),
  })

export type ContactInput = z.infer<typeof contactSchema>

export function contactInputFromFormData(formData: FormData) {
  // Browsers send a <textarea>'s line breaks as \r\n.
  const text = (key: string) => String(formData.get(key) ?? '').replace(/\r\n/g, '\n')
  return {
    name: text('name'),
    email: text('email'),
    whatsapp: text('whatsapp'),
    interest: text('interest'),
    message: text('message'),
    consent: formData.get('consent') === 'on',
  }
}
