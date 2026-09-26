import type { CollectionConfig, Field } from 'payload'

import { anyone } from '../access'

const mm = (name: string, label: string): Field => ({
  name,
  label,
  type: 'number',
  required: true,
  min: 1,
  admin: { width: '25%' },
})

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status'],
    group: 'Catálogo',
    description: 'Cada producto define sus partes, tamaños y reglas del logo. El sitio los lee de aquí.',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', required: true },
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Identificador en la URL. El micrófono usa "microfono".' },
        },
        {
          name: 'status',
          label: 'Estado',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: [
            { label: 'Activo', value: 'active' },
            { label: 'Próximamente', value: 'soon' },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Partes y formas',
          fields: [
            {
              name: 'parts',
              label: 'Partes coloreables',
              type: 'array',
              minRows: 1,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'key', label: 'Clave', type: 'text', required: true },
                    { name: 'label', label: 'Nombre', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'boxShapes',
              label: 'Formas de la caja',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'key', label: 'Clave', type: 'text', required: true },
                    { name: 'label', label: 'Nombre', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Tamaños',
          fields: [
            {
              name: 'sizes',
              label: 'Tamaños',
              type: 'array',
              minRows: 1,
              admin: { description: 'Medidas en milímetros.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'key', label: 'Clave', type: 'text', required: true, admin: { width: '25%' } },
                    { name: 'label', label: 'Nombre', type: 'text', required: true, admin: { width: '25%' } },
                    mm('totalHeightMm', 'Alto total'),
                    mm('headDiameterMm', 'Diámetro cabeza'),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    mm('boxWidthMm', 'Caja: ancho'),
                    mm('boxHeightMm', 'Caja: alto'),
                    mm('boxDepthMm', 'Caja: fondo'),
                  ],
                },
                {
                  type: 'row',
                  fields: [mm('logoAreaWidthMm', 'Logo: ancho'), mm('logoAreaHeightMm', 'Logo: alto')],
                },
              ],
            },
          ],
        },
        {
          label: 'Reglas del logo',
          fields: [
            {
              name: 'logoRules',
              label: false,
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'integratedMaxExtraColors',
                      label: 'Colores extra (integrado)',
                      type: 'number',
                      defaultValue: 3,
                      admin: { description: 'Además del color de la caja, en la misma impresión.' },
                    },
                    {
                      name: 'separateMaxLogoColors',
                      label: 'Colores (logo pegado)',
                      type: 'number',
                      defaultValue: 4,
                      admin: { description: 'Logo impreso aparte y pegado.' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nozzleMm',
                      label: 'Boquilla',
                      type: 'select',
                      defaultValue: '0.4',
                      options: [
                        { label: '0.4 mm (más detalle)', value: '0.4' },
                        { label: '0.6 mm', value: '0.6' },
                        { label: '0.8 mm', value: '0.8' },
                      ],
                      admin: { description: 'Con la que se imprimen los logos. Define el detalle mínimo que revisa el creador.' },
                    },
                    {
                      name: 'reliefHeightMm',
                      label: 'Alto del relieve (mm)',
                      type: 'number',
                      defaultValue: 1,
                    },
                    {
                      name: 'allowFlat',
                      label: 'Permitir logo plano',
                      type: 'checkbox',
                      defaultValue: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
