import type { CollectionConfig } from 'payload'

import { anyone } from '../access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Pregunta frecuente', plural: 'Preguntas frecuentes' },
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
    group: 'Contenido',
  },
  access: {
    read: anyone,
  },
  fields: [
    { name: 'question', label: 'Pregunta', type: 'text', required: true },
    { name: 'answer', label: 'Respuesta', type: 'textarea', required: true },
    { name: 'sortOrder', label: 'Orden', type: 'number', defaultValue: 0 },
  ],
}
