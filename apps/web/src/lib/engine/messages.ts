import type { ProductDefinition } from '@nueve2siete/configurator'

import type { LogoIssue, LogoStatus } from './schema'

/** Customer-facing copy built from the engine's response, which comes with codes in English. */

export const STATUS_LABEL: Record<LogoStatus, string> = {
  viable: 'Viable',
  adjust: 'Con ajustes',
  not_viable: 'No viable',
}

export const STATUS_COPY: Record<LogoStatus, { title: string; body: string }> = {
  viable: {
    title: '¡Tu logo se puede imprimir!',
    body: 'Así se va a ver en tu micrófono. Cambia el tamaño y los colores hasta que te guste.',
  },
  adjust: {
    title: 'Se puede imprimir con algunos ajustes',
    body: 'Lo simplificamos para que salga bien impreso. Revisa la vista previa; si algo no te convence, lo ajustamos contigo.',
  },
  not_viable: {
    title: 'Así no se puede imprimir',
    body: 'Con filamentos de colores planos este logo no queda bien. Si tienes una versión más simple, súbela; si no, escríbenos y te ayudamos a simplificarlo.',
  },
}

const list = new Intl.ListFormat('es', { type: 'conjunction' })

function sizeNames(keys: string[], product: ProductDefinition): string {
  return list.format(keys.map((key) => product.sizes.find((s) => s.key === key)?.label ?? key))
}

/** Explanation of an engine issue, or null if it doesn't need to be shown (or we don't know it). */
export function issueMessage(issue: LogoIssue, product: ProductDefinition): string | null {
  const sizes = issue.sizes.length === product.sizes.length ? null : sizeNames(issue.sizes, product)
  const inSizes = sizes ? ` en ${sizes}` : ''

  switch (issue.code) {
    case 'not_flat':
      return 'Tiene degradados, sombras o partes de foto: no hay una versión en colores planos que se le parezca.'
    case 'shading':
      return 'Tiene degradados o sombras suaves. Los pasamos a colores planos.'
    case 'too_many_colors':
      return `Tiene ${issue.detail.found} colores y podemos imprimir hasta ${issue.detail.max}: unimos los más parecidos.`
    case 'fine_detail':
      return issue.severity === 'error'
        ? 'Tiene demasiados detalles finos para imprimirlo en cualquier tamaño.'
        : `Algunas líneas, puntos o letras pequeñas son muy finos para imprimirse${inSizes}. Los simplificamos.`
    case 'color_lost':
      return `Uno de sus colores es tan fino que desaparece${inSizes}.`
    case 'low_resolution':
      return `La imagen es pequeña (${issue.detail.side_px} px). Si tienes una más grande, el resultado sale más nítido.`
    case 'enclosed_background':
      return 'Las partes del color del fondo dentro del logo (como el hueco de una “o”) quedan del color de la caja.'
    case 'no_close_filament':
      return `No tenemos un filamento parecido a uno de sus colores (${issue.detail.hex}). Usamos el más cercano.`
    case 'shared_filament':
      return 'Dos de sus colores son tan parecidos que se imprimen con el mismo filamento.'
    case 'animated':
      return 'Es una imagen animada: usamos el primer cuadro.'
    default:
      return null
  }
}

/** Logo lines for the quote message (WhatsApp or form). */
export function logoSummaryLines({
  status,
  sizeLabel,
  colorNames,
  single,
  finish,
}: {
  status: LogoStatus
  sizeLabel: string
  /** Names of the logo's filaments. */
  colorNames: string[]
  single: boolean
  finish?: string
}): string[] {
  const lines = [`• Logo: ${STATUS_LABEL[status].toLowerCase()} en ${sizeLabel} (les envío el archivo por aquí)`]
  if (single && colorNames[0]) lines.push(`• Color del logo: ${colorNames[0]} (un solo color)`)
  else if (colorNames.length) lines.push(`• Colores del logo: ${list.format([...new Set(colorNames)])}`)
  if (finish) lines.push(`• Acabado del logo: ${finish.toLowerCase()}`)
  return lines
}
