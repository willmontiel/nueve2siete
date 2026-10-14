import { describe, expect, it } from 'vitest'
import { OCCASION_LABELS, PROJECTS } from './projects'
import { COLORS, findProduct } from './products'

describe('PROJECTS', () => {
  it('links only to products that exist in the catalog', () => {
    const linked = PROJECTS.filter(p => p.productSlug)
    expect(linked.length).toBeGreaterThan(0)
    for (const project of linked) expect(findProduct(project.productSlug), project.id).toBeDefined()
  })

  it('shows only colours from the colour list', () => {
    const ids = new Set(COLORS.map(c => c.id))
    for (const project of PROJECTS) {
      expect(project.colorIds.length, project.id).toBeGreaterThan(0)
      for (const id of project.colorIds) expect(ids.has(id), `${project.id}: ${id}`).toBe(true)
    }
  })

  // The story shares the back of a tag with the title, the colours and two buttons
  it('keeps every story short enough for the back of a tag', () => {
    for (const project of PROJECTS) expect(project.summary.length, project.id).toBeLessThanOrEqual(160)
  })

  it('gives every occasion a label', () => {
    for (const project of PROJECTS) expect(OCCASION_LABELS[project.occasion], project.id).toBeTruthy()
  })

  // A page title is set large on a narrow page; past this length it breaks into a third line
  it('keeps every title short enough for two lines', () => {
    for (const project of PROJECTS) expect(project.title.length, project.title).toBeLessThanOrEqual(28)
  })
})
