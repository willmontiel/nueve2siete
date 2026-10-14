import { describe, expect, it } from 'vitest'
import { projectsFromRows, type ProjectRow } from './projectRows'

const publicUrl = (path: string) => `https://abc.supabase.co/storage/v1/object/public/projects/${path}`

const row: ProjectRow = {
  id: 'f3b1',
  title: 'Animales para la jungla',
  occasion: 'party',
  summary: 'Un león, una jirafa y un mono para cada invitado de un cumpleaños.',
  photo: 'jungla.jpg',
  photo_alt: 'Animales de colores sobre una mesa de fiesta',
  photo_position: '40% 50%',
  color: 'pine',
  color_ids: ['mostaza', 'verde'],
  product_slug: null,
}

describe('projectsFromRows', () => {
  it('turns a row of the projects table into a garland tag', () => {
    expect(projectsFromRows([row], publicUrl)).toEqual([
      {
        id: 'f3b1',
        title: 'Animales para la jungla',
        occasion: 'party',
        summary: 'Un león, una jirafa y un mono para cada invitado de un cumpleaños.',
        photo: 'https://abc.supabase.co/storage/v1/object/public/projects/jungla.jpg',
        photoAlt: 'Animales de colores sobre una mesa de fiesta',
        photoPosition: '40% 50%',
        color: 'pine',
        colorIds: ['mostaza', 'verde'],
        productSlug: undefined,
      },
    ])
  })

  it('keeps a photo given as a full address or as a path of the site', () => {
    const [full, site] = projectsFromRows(
      [
        { ...row, photo: 'https://example.com/foto.jpg' },
        { ...row, photo: '/photos/regalo_empaque.jpg' },
      ],
      publicUrl,
    )
    expect(full.photo).toBe('https://example.com/foto.jpg')
    expect(site.photo).toBe('/photos/regalo_empaque.jpg')
  })

  it('leaves out colours the catalog does not know', () => {
    const [project] = projectsFromRows([{ ...row, color_ids: ['rojo', 'dorado-brillante', 'azul'] }], publicUrl)
    expect(project.colorIds).toEqual(['rojo', 'azul'])
  })

  it('links to a catalog piece only when the piece exists', () => {
    const [linked, unknown] = projectsFromRows(
      [
        { ...row, product_slug: 'clicker-fidget' },
        { ...row, product_slug: 'no-existe' },
      ],
      publicUrl,
    )
    expect(linked.productSlug).toBe('clicker-fidget')
    expect(unknown.productSlug).toBeUndefined()
  })
})
