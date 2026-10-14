import { findColor, type PartColors, type Product } from '../data/products'

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

// The WhatsApp message is the whole order: the team reads parts, colours and text from it. The hex goes along
// with each name so a colour the team has to buy can be matched. Lead times and shipping are not confirmed yet
// (docs/deuda.md), so the message promises neither.
// The code (orderCode in orderLog.ts) matches the chat with the order log in Supabase.
export function buildOrderMessage(product: Product, colors: PartColors, customText: string, code: string): string {
  const colorLines = product.parts
    .map(part => {
      const color = findColor(colors[part.id])
      return `• ${part.name}: ${color?.name} (${color?.hex})`
    })
    .join('\n')

  const text = customText.trim()
  const textLine = text ? `\n*Texto en la caja:* "${text}"` : ''

  return `¡Hola nueve2siete! Quiero pedir esta pieza:

*Pedido:* ${code}
*Producto:* ${product.name}
*Medidas:* ${product.dimensions}${textLine}
*Colores:*
${colorLines}

*Valor de referencia:* ${formatCOP(product.basePrice)}

¿Me confirman si la pueden hacer? ¡Gracias!`
}

// "Quiero algo así" on a garland tag: the team knows at once which project the visitor means
export function projectMessage(title: string): string {
  return `¡Hola nueve2siete! Vi el proyecto "${title}" en su página y quiero algo así.`
}
