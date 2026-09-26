import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3001/admin')
    await expect(page).toHaveURL('http://localhost:3001/admin')
    for (const group of ['Ventas', 'Catálogo', 'Contenido']) {
      await expect(page.getByRole('heading', { level: 2, name: group })).toBeVisible()
    }
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3001/admin/collections/users')
    await expect(page).toHaveURL('http://localhost:3001/admin/collections/users')
    const listViewArtifact = page.locator('h1', { hasText: 'Usuarios' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3001/admin/collections/users/create')
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })

  test('each product kind shows its own tabs', async () => {
    // Payload draws the tabs as buttons.
    await page.goto('http://localhost:3001/admin/collections/products')
    await page.getByRole('link', { name: 'Llavero con tu nombre' }).first().click()
    await expect(page.getByRole('button', { name: 'Llavero', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reglas del logo', exact: true })).toBeHidden()

    await page.goto('http://localhost:3001/admin/collections/products')
    await page.getByRole('link', { name: 'Micrófono personalizado' }).first().click()
    await expect(page.getByRole('button', { name: 'Reglas del logo', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Llavero', exact: true })).toBeHidden()
  })
})
