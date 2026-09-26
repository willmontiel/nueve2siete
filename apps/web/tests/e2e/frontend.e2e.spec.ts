import { expect, test } from '@playwright/test'

test.describe('Site', () => {
  test('home shows the headline and the color picker', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/nueve2siete/)
    await expect(page.locator('h1').first()).toContainText('Tu marca')

    // Compact color picker: the button shows the current color and opens the palette.
    const box = page.getByRole('button', { name: 'Caja: Naranja' }).first()
    await expect(box).toBeVisible()
    await box.click()
    await expect(page.getByRole('radio', { name: 'Naranja', exact: true })).toBeChecked()
    await page.getByRole('radio', { name: 'Lila', exact: true }).click()

    await expect(page.getByRole('radio', { name: 'Lila', exact: true })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Caja: Lila' }).first()).toBeVisible()
  })

  test('the configurator changes size', async ({ page }) => {
    await page.goto('http://localhost:3000/microfonos')

    await page.getByRole('button', { name: /Extra Large/ }).click()
    await expect(page.getByText('Extra Large · 25 cm de alto')).toBeVisible()
  })
})
