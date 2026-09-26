import type { Filament, ProductDefinition, Selection } from './types'

/** Initial colors per part, matched by filament display name (Spanish CMS content), not id; else the first filament. */
const PREFERRED_COLORS: Record<string, string> = {
  head: 'negro',
  box: 'naranja',
  handle: 'negro',
}

function findByName(filaments: Filament[], name: string): Filament | undefined {
  return filaments.find((f) => f.name.trim().toLowerCase() === name)
}

export function defaultSelection(product: ProductDefinition, filaments: Filament[]): Selection {
  const colors: Record<string, string> = {}
  for (const part of product.parts) {
    const preferred = PREFERRED_COLORS[part.key]
    const filament = (preferred && findByName(filaments, preferred)) ?? filaments[0]
    if (filament) colors[part.key] = filament.id
  }
  const middleSize = product.sizes[Math.min(1, product.sizes.length - 1)]
  return {
    sizeKey: middleSize?.key ?? '',
    shapeKey: product.boxShapes[0]?.key ?? '',
    colors,
    text: '',
  }
}

export function filamentById(filaments: Filament[], id: string | undefined): Filament | undefined {
  return filaments.find((f) => f.id === id)
}

/** Readable summary for requesting a quote via WhatsApp or the contact form. */
export function describeSelection(
  product: ProductDefinition,
  selection: Selection,
  filaments: Filament[],
): string {
  const size = product.sizes.find((s) => s.key === selection.sizeKey)
  const shape = product.boxShapes.find((s) => s.key === selection.shapeKey)
  const lines = [`Hola, quiero cotizar un ${product.name.toLowerCase()}:`]
  if (size) lines.push(`• Tamaño: ${size.label} (${size.totalHeightMm / 10} cm de alto)`)
  if (shape && product.boxShapes.length > 1) lines.push(`• Forma de la caja: ${shape.label}`)
  for (const part of product.parts) {
    const filament = filamentById(filaments, selection.colors[part.key])
    if (filament) lines.push(`• ${part.label}: ${filament.name}`)
  }
  const text = selection.text.trim()
  if (text) lines.push(`• Texto o marca: ${text}`)
  return lines.join('\n')
}
