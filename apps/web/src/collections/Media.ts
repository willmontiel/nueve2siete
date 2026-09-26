import type { CollectionConfig } from 'payload'

import { anyone } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Archivo', plural: 'Archivos' },
  admin: {
    group: 'Contenido',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: { description: 'Describe la imagen (accesibilidad y SEO).' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
