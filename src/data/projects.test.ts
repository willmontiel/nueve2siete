import { describe, expect, it } from 'vitest'
import { PROJECTS } from './projects'
import { FILAMENT_COLORS, findProduct } from './products'

describe('PROJECTS', () => {
  it('links only to products that exist in the catalog', () => {
    const linked = PROJECTS.filter(p => p.productSlug)
    expect(linked.length).toBeGreaterThan(0)
    for (const project of linked) expect(findProduct(project.productSlug), project.id).toBeDefined()
  })

  it('shows only colors from the filament list', () => {
    const ids = new Set(FILAMENT_COLORS.map(c => c.id))
    for (const project of PROJECTS) {
      expect(project.colorIds.length, project.id).toBeGreaterThan(0)
      for (const id of project.colorIds) expect(ids.has(id), `${project.id}: ${id}`).toBe(true)
    }
  })

  // A page title is set large on a narrow page; past this length it breaks into a third line
  it('keeps every title short enough for two lines', () => {
    for (const project of PROJECTS) expect(project.title.length, project.title).toBeLessThanOrEqual(28)
  })
})
