import { expect, test } from '@playwright/test'

test.describe('Site', () => {
  test('home shows the headline and the color picker', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/nueve2siete/)
    await expect(page.locator('h1').first()).toContainText('Tu marca')

    const orange = page.getByRole('button', { name: 'Caja: Naranja' }).first()
    await expect(orange).toHaveAttribute('aria-pressed', 'true')

    const lilac = page.getByRole('button', { name: 'Caja: Lila' }).first()
    await lilac.click()
    await expect(lilac).toHaveAttribute('aria-pressed', 'true')
  })

  test('the configurator changes size', async ({ page }) => {
    await page.goto('http://localhost:3000/microfonos')

    await page.getByRole('button', { name: /Extra Large/ }).click()
    await expect(page.getByText('Extra Large · 25 cm de alto')).toBeVisible()
  })
})
