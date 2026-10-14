import { FILAMENT_COLORS, type Product } from '../data/products'

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function colorName(hex: string | undefined): string | undefined {
  return FILAMENT_COLORS.find(c => c.hex.toLowerCase() === hex?.toLowerCase())?.name
}

// The WhatsApp message is the whole order: the team reads parts, colors and text from it
export function buildOrderMessage(product: Product, partColors: Record<string, string>, customText: string): string {
  const colorBreakdown = product.parts
    .map(part => {
      const hex = partColors[part.id]
      return `• ${part.name}: ${colorName(hex) ?? 'Personalizado'} (${hex})`
    })
    .join('\n')

  const text = customText.trim()
  const customTextLine = text ? `\n✍️ *Texto / Marca en caja:* "${text}"` : ''

  return `👋 ¡Hola nueve2siete! Quiero realizar un pedido personalizado:

📦 *Producto:* ${product.name}
📐 *Dimensiones:* ${product.dimensions}${customTextLine}
🎨 *Colores Seleccionados:*
${colorBreakdown}

💰 *Valor estimado:* ${formatCOP(product.basePrice)}
⏱️ *Tiempo estimado:* ${product.leadTimeDays} día(s) hábil(es)

¿Podrían confirmarme disponibilidad y coordinar el envío? ¡Gracias!`
}

// "Quiero algo así" on a magazine page: the team knows at once which project the visitor means
export function projectMessage(title: string): string {
  return `¡Hola nueve2siete! Vi el proyecto "${title}" en la revista y quiero algo así.`
}
