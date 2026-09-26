import type { GlobalConfig } from 'payload'

import { anyone } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Ajustes del sitio',
  admin: {
    group: 'Administración',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contacto',
          fields: [
            {
              name: 'whatsappNumber',
              label: 'Número de WhatsApp',
              type: 'text',
              admin: {
                description:
                  'Solo números, con indicativo de país. Ej: 573001234567. Si está vacío, los botones llevan al formulario.',
              },
              validate: (value: string | null | undefined) =>
                !value || /^\d{10,15}$/.test(value) || 'Solo números, con indicativo (ej: 573001234567)',
            },
            {
              name: 'whatsappMessage',
              label: 'Mensaje inicial de WhatsApp',
              type: 'text',
              defaultValue: 'Hola, quiero cotizar un micrófono personalizado.',
            },
            { name: 'contactEmail', label: 'Correo de contacto', type: 'email' },
            { name: 'location', label: 'Ubicación', type: 'text', defaultValue: 'Colombia' },
          ],
        },
        {
          label: 'Datos legales',
          description: 'Aparecen en la política de tratamiento de datos (Ley 1581 de 2012).',
          fields: [
            { name: 'legalName', label: 'Nombre o razón social del responsable', type: 'text' },
            { name: 'taxId', label: 'Cédula o NIT', type: 'text' },
            { name: 'address', label: 'Dirección', type: 'text' },
            { name: 'privacyEmail', label: 'Correo para temas de datos personales', type: 'email' },
          ],
        },
      ],
    },
  ],
}
