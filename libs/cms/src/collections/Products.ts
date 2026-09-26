import type { CollectionConfig, Field } from 'payload'

import { anyone } from '../access'

const mm = (name: string, label: string, min = 1): Field => ({
  name,
  label,
  type: 'number',
  required: true,
  min,
  admin: { width: '25%' },
})

type ProductKind = 'microphone' | 'keychain'
/** Shows a tab only for one kind of product (hidden fields aren't validated either). */
const onlyFor = (kind: ProductKind) => ({
  condition: (data: Partial<{ kind: ProductKind }>) => (data?.kind ?? 'microphone') === kind,
})

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'slug', 'status'],
    group: 'Catálogo',
    description: 'Cada producto define sus tamaños y reglas. El sitio los lee de aquí.',
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
          admin: { description: 'Identificador. El micrófono usa "microfono" y el llavero "llavero".' },
        },
        {
          name: 'kind',
          label: 'Tipo',
          type: 'select',
          required: true,
          defaultValue: 'microphone',
          options: [
            { label: 'Micrófono con logo', value: 'microphone' },
            { label: 'Llavero con nombre', value: 'keychain' },
          ],
          admin: { description: 'Define qué campos tiene y qué creador lo usa.' },
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
          admin: onlyFor('microphone'),
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
          admin: onlyFor('microphone'),
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
          admin: onlyFor('microphone'),
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
        {
          label: 'Llavero',
          admin: onlyFor('keychain'),
          fields: [
            {
              name: 'keychain',
              label: false,
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'maxChars',
                      label: 'Máximo de caracteres',
                      type: 'number',
                      defaultValue: 12,
                      min: 1,
                      admin: { description: 'Letras, espacios y emojis: cada uno cuenta como uno.' },
                    },
                    {
                      name: 'maxEmojis',
                      label: 'Máximo de emojis',
                      type: 'number',
                      defaultValue: 2,
                      min: 0,
                    },
                  ],
                },
                {
                  name: 'sizes',
                  label: 'Tamaños',
                  type: 'array',
                  admin: {
                    description:
                      'Medidas en milímetros. Grosores en múltiplos de la capa (0,2 mm). Si bajas la altura de letra de 10 mm, hay que volver a revisar los emojis.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'key', label: 'Clave', type: 'text', required: true, admin: { width: '25%' } },
                        { name: 'label', label: 'Nombre', type: 'text', required: true, admin: { width: '25%' } },
                        mm('letterHeightMm', 'Alto de letra'),
                        mm('maxLengthMm', 'Largo máximo'),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        mm('borderMm', 'Borde de la base', 0.5),
                        mm('baseMm', 'Grosor base', 0.4),
                        mm('reliefMm', 'Alto letras', 0.2),
                      ],
                    },
                    {
                      type: 'row',
                      fields: [mm('ringOuterMm', 'Argolla: diámetro'), mm('ringHoleMm', 'Argolla: hueco')],
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
