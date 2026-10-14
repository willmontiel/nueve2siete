import { findColor, findProduct } from '../data/products'
import type { Occasion, PageColor, Project } from '../data/projects'

/** A row of the Supabase projects table (supabase/migrations), as the garland selects it */
export interface ProjectRow {
  id: string
  title: string
  occasion: Occasion
  summary: string
  /** A file in the projects bucket, or a full address, or a path of the site (/photos/…) */
  photo: string
  photo_alt: string
  photo_position: string | null
  color: PageColor
  color_ids: string[] | null
  product_slug: string | null
}

// The table's checks already hold titles, occasions and tag colours to what the garland can show. Colours and
// catalog links are checked here, against the catalog the site was built with.
export function projectsFromRows(rows: ProjectRow[], publicUrl: (path: string) => string): Project[] {
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    occasion: row.occasion,
    summary: row.summary,
    photo: /^(https?:)?\//.test(row.photo) ? row.photo : publicUrl(row.photo),
    photoAlt: row.photo_alt,
    photoPosition: row.photo_position ?? undefined,
    color: row.color,
    colorIds: (row.color_ids ?? []).filter(id => findColor(id)),
    productSlug: row.product_slug && findProduct(row.product_slug) ? row.product_slug : undefined,
  }))
}
