import type { CollectionConfig } from 'payload'

import { authenticated, nobody } from '../access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Solicitud', plural: 'Solicitudes' },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'interest', 'status', 'createdAt'],
    group: 'Ventas',
    description: 'Mensajes que llegan desde el formulario de contacto.',
  },
  access: {
    // The form creates leads from the server (Server Action), never through the public API.
    create: nobody,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        {
          name: 'status',
          label: 'Estado',
          type: 'select',
          required: true,
          defaultValue: 'new',
          options: [
            { label: 'Nueva', value: 'new' },
            { label: 'Contactada', value: 'contacted' },
            { label: 'En producción', value: 'in_production' },
            { label: 'Cerrada', value: 'closed' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', label: 'Correo', type: 'email' },
        { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
      ],
    },
    {
      name: 'interest',
      label: 'Interés',
      type: 'select',
      required: true,
      defaultValue: 'microphone',
      options: [
        { label: 'Micrófono personalizado', value: 'microphone' },
        { label: 'Llavero con nombre', value: 'keychain' },
        { label: 'Otro proyecto', value: 'other' },
      ],
    },
    { name: 'message', label: 'Mensaje', type: 'textarea', required: true },
    {
      name: 'consent',
      label: 'Aceptó la política de tratamiento de datos',
      type: 'checkbox',
      required: true,
      admin: { readOnly: true },
    },
  ],
}
