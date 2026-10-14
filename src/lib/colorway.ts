import { findColor, type PartColors, type Product } from '../data/products'

/** Where the configurator starts: the product's first colour combination */
export function defaultColors(product: Product): PartColors {
  return { ...product.colorways[0] }
}

/**
 * The colours a poster hands to the product page, as `?colores=negro,lavanda,negro`: one colour id per part, in
 * the order of the parts, so the link stays short and readable.
 */
export function colorsToParam(product: Product, colors: PartColors): string {
  return product.parts.map(part => colors[part.id]).join(',')
}

/** Reads a `colores` link back; a part the link leaves out, or names an unknown colour for, keeps its default */
export function colorsFromParam(product: Product, param: string | null): PartColors {
  const ids = param?.split(',') ?? []
  const colors = defaultColors(product)
  product.parts.forEach((part, i) => {
    const id = ids[i]
    if (id && findColor(id)) colors[part.id] = id
  })
  return colors
}
