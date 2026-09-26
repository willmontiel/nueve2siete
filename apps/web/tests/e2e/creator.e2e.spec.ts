import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { expect, test } from '@playwright/test'

const FIXTURES = fileURLToPath(new URL('../../../engine/tests/fixtures', import.meta.url))
const ENGINE_URL = process.env.ENGINE_URL || 'http://127.0.0.1:8000'

test.describe('Microphone creator', () => {
  test.beforeAll(async () => {
    const up = await fetch(`${ENGINE_URL}/health`).then((r) => r.ok, () => false)
    test.skip(!up, 'The logo engine is not running (pnpm engine)')
  })

  test('checks a logo, shows the verdict per size and puts it on the box', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.locator('input[type=file]').setInputFiles(path.join(FIXTURES, 'nueve2siete_transparent.png'))

    await expect(page.getByRole('heading', { name: 'Se puede imprimir con algunos ajustes' })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByText('Revisado')).toBeVisible()
    await expect(page.getByRole('img', { name: 'Tu logo como se imprime en Medium' })).toBeVisible()
    await expect(page.getByText('Naranja', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: /Extra Large/ }).click()
    await expect(page.getByRole('img', { name: 'Tu logo como se imprime en Extra Large' })).toBeVisible()
  })

  test('shows the 3D microphone with the logo and switches view and finish', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await expect(page.getByText('Vista previa 3D')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByRole('img', { name: 'Vista 3D del micrófono Medium' })).toBeVisible()

    await page.locator('input[type=file]').setInputFiles(path.join(FIXTURES, 'flat_four_colors_transparent.png'))
    await expect(page.getByRole('img', { name: 'Vista 3D del micrófono Medium con tu logo' })).toBeVisible({
      timeout: 30_000,
    })
    // When the logo arrives the camera zooms in on the box.
    await expect(page.getByRole('button', { name: 'De cerca' })).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('button', { name: 'Completo' }).click()
    await expect(page.getByRole('button', { name: 'Completo' })).toHaveAttribute('aria-pressed', 'true')

    await page.getByRole('button', { name: /Plano/ }).click()
    const quote = page.getByRole('link', { name: /formulario/ })
    await expect(quote).toHaveAttribute('href', /Acabado%20del%20logo%3A%20plano/)
  })

  test('offers single-color printing when there are too many colors', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.locator('input[type=file]').setInputFiles(path.join(FIXTURES, 'six_colors.png'))

    await expect(page.getByRole('heading', { name: 'Se puede imprimir con algunos ajustes' })).toBeVisible({
      timeout: 30_000,
    })
    await expect(page.getByRole('button', { name: /A todo color\s*4 de sus 6 colores/ })).toBeVisible()
    await page.getByRole('button', { name: 'Probar en un solo color' }).click()

    await expect(page.getByRole('heading', { name: '¡Tu logo se puede imprimir!' })).toBeVisible()
    await page.getByRole('button', { name: 'Color del logo: Blanco', exact: true }).click()
    await expect(page.getByRole('link', { name: /formulario/ })).toHaveAttribute(
      'href',
      /Color%20del%20logo%3A%20Blanco%20\(un%20solo%20color\)/,
    )
  })

  test('warns when single color loses the design', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.locator('input[type=file]').setInputFiles(path.join(FIXTURES, 'flat_four_colors_transparent.png'))
    await expect(page.getByText('Revisado')).toBeVisible({ timeout: 30_000 })

    await expect(page.getByRole('button', { name: 'Probar en un solo color' })).toHaveCount(0)
    await page.getByRole('button', { name: /Un solo color/ }).click()
    await expect(page.getByText(/en un solo color se unen y se pierde parte del diseño/)).toBeVisible()
  })

  test('explains why a photo cannot be printed', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.locator('input[type=file]').setInputFiles(path.join(FIXTURES, 'photo.jpg'))

    await expect(page.getByRole('heading', { name: 'Así no se puede imprimir' })).toBeVisible({ timeout: 30_000 })
    await expect(page.getByText(/degradados, sombras o partes de foto/)).toBeVisible()
    await expect(page.getByRole('link', { name: /Pedir ayuda/ })).toBeVisible()
  })

  test('rejects non-image files before uploading', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.locator('input[type=file]').setInputFiles({
      name: 'logo.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4'),
    })
    // Filter by text: the Next route announcer also has role="alert".
    await expect(page.getByRole('alert').filter({ hasText: 'Sube tu logo en PNG, JPG, WebP o GIF.' })).toBeVisible()
  })
})
