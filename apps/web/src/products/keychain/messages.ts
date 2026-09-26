import type { KeychainDefinition, KeychainIssue } from '@nueve2siete/products'

import { cm } from '@/lib/format'

/** What to tell the customer about each issue, plus the size it suggests (if any). */
export function keychainIssueMessage(
  issue: KeychainIssue,
  sizeKey: string,
): { text: string; suggestSize?: string } | null {
  switch (issue.code) {
    case 'empty':
      return null
    case 'unsupported':
      return { text: `No podemos imprimir ${issue.chars.join(' ')}. Usa letras, números y los emojis del botón.` }
    case 'too_many_chars':
      return { text: `Máximo ${issue.max} caracteres, contando espacios y emojis (llevas ${issue.count}).` }
    case 'too_many_emojis':
      return { text: `Máximo ${issue.max} emojis por llavero.` }
    case 'too_long':
      return issue.fitsIn
        ? {
            text: `Mide ${cm(issue.widthMm)} cm y en ${sizeKey} el máximo es ${cm(issue.maxMm)} cm. En un tamaño más pequeño sí cabe:`,
            suggestSize: issue.fitsIn,
          }
        : { text: `Mide ${cm(issue.widthMm)} cm y el máximo es ${cm(issue.maxMm)} cm. Prueba con un texto más corto.` }
    case 'thin':
      return issue.betterSize
        ? { text: 'Algunos trazos quedan muy finos en este tamaño. Se imprimen mejor en', suggestSize: issue.betterSize }
        : { text: 'Algunos trazos quedan muy finos: revisaremos el diseño contigo antes de imprimir.' }
  }
}

/** The order message for WhatsApp or the contact form. */
export function keychainSummary({
  product,
  text,
  fontLabel,
  sizeKey,
  widthMm,
  heightMm,
  baseName,
  lettersName,
}: {
  product: KeychainDefinition
  text: string
  fontLabel: string
  sizeKey: string
  widthMm: number
  heightMm: number
  baseName: string
  lettersName: string
}): string {
  const size = product.sizes.find((s) => s.key === sizeKey)
  return [
    `Hola, quiero este ${product.name.toLowerCase()}:`,
    `• Texto: ${text}`,
    `• Letra: ${fontLabel}`,
    `• Tamaño: ${sizeKey}${size ? ` · ${size.label}` : ''} (${cm(widthMm)} × ${cm(heightMm)} cm)`,
    `• Colores: base ${baseName}, letras ${lettersName}`,
  ].join('\n')
}
