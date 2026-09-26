import type { CollectionConfig } from 'payload'

import { anyone } from '../access'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: { singular: 'Trabajo', plural: 'Trabajos' },
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'sortOrder'],
    group: 'Contenido',
    description: 'Fotos de trabajos para la galería. Los destacados salen en el inicio.',
  },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    {
      name: 'image',
      label: 'Foto',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'description', label: 'Descripción', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'featured', label: 'Destacado en el inicio', type: 'checkbox', defaultValue: false },
        { name: 'sortOrder', label: 'Orden', type: 'number', defaultValue: 0 },
      ],
    },
  ],
}
