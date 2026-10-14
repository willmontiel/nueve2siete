import { findColor, type PartColors, type Product } from '../data/products'
import { getSupabase } from './supabase'

/** A row of the Supabase orders table (supabase/migrations). Visitors may only insert these, never read them. */
export interface OrderRow {
  code: string
  product_slug: string
  product_name: string
  colors: { part: string; color: string; hex: string }[]
  custom_text: string | null
  price_cop: number
  message: string
}

// Characters that cannot be mistaken for one another when read aloud or copied by hand
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** A short code that travels in the WhatsApp message and in the order log, so the two can be matched */
export function orderCode(random: () => number = Math.random): string {
  let code = ''
  for (let i = 0; i < 4; i++) code += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)]
  return `N2S-${code}`
}

export function orderRow(product: Product, colors: PartColors, customText: string, code: string, message: string): OrderRow {
  return {
    code,
    product_slug: product.slug,
    product_name: product.name,
    colors: product.parts.map(part => {
      const color = findColor(colors[part.id])
      return { part: part.name, color: color?.name ?? colors[part.id], hex: color?.hex ?? '' }
    }),
    custom_text: customText.trim() || null,
    price_cop: product.basePrice,
    message,
  }
}

// Keeps a record of the order even if the chat is lost. The visitor's order goes out by WhatsApp whatever
// happens here, so a failure is only reported to the console.
export async function logOrder(row: OrderRow): Promise<void> {
  try {
    const supabase = await getSupabase()
    if (!supabase) return
    const { error } = await supabase.from('orders').insert(row)
    if (error) throw error
  } catch (error) {
    console.warn('The order could not be logged', error)
  }
}
