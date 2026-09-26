import type { CollectionConfig } from 'payload'

import { anyone } from '../access'

export const Filaments: CollectionConfig = {
  slug: 'filaments',
  labels: { singular: 'Filamento', plural: 'Filamentos' },
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'hex', 'material', 'available', 'sortOrder'],
    group: 'Catálogo',
    description: 'Colores disponibles para la cabeza, la caja, el palo y el logo.',
  },
  access: {
    read: anyone,
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'hex',
      label: 'Color (hex)',
      type: 'text',
      required: true,
      admin: { description: 'Formato #RRGGBB, por ejemplo #E95C21.' },
      validate: (value: string | null | undefined) =>
        /^#[0-9A-Fa-f]{6}$/.test(value ?? '') || 'Usa el formato #RRGGBB',
    },
    {
      name: 'material',
      label: 'Material',
      type: 'select',
      defaultValue: 'PLA Basic',
      options: ['PLA Basic', 'PLA Matte', 'PLA Silk', 'PETG'],
    },
    {
      name: 'brand',
      label: 'Marca',
      type: 'text',
      defaultValue: 'Bambu Lab',
    },
    {
      name: 'available',
      label: 'Disponible',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Los no disponibles no aparecen en el sitio.' },
    },
    {
      name: 'sortOrder',
      label: 'Orden',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
