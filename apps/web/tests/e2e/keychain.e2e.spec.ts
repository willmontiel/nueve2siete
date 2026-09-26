import { expect, test, type Page } from '@playwright/test'

const CREATOR = 'http://localhost:3000/disena-el-tuyo/llavero'
const input = (page: Page) => page.getByLabel('1. Tu texto')
/** The measurements under the preview, e.g. "8,1 × 2,2 cm · 4 mm de grosor". */
const measurements = (page: Page) => page.getByText(/× .* cm · .* mm de grosor/)

test.describe('Keychain creator', () => {
  test('shows an example until the customer types, then their text in 3D', async ({ page }) => {
    await page.goto(CREATOR)
    await expect(page.getByText('Ejemplo', { exact: true })).toBeVisible()
    await expect(page.getByRole('img', { name: /Llavero M con el texto «Lucía 🎀»/ })).toBeVisible({ timeout: 15_000 })
    await expect(page.getByText('Escribe tu texto para pedirlo.')).toBeVisible()

    await input(page).fill('Mateo')
    await expect(page.getByText('Ejemplo', { exact: true })).toBeHidden()
    await expect(page.getByRole('img', { name: /con el texto «Mateo»/ })).toBeVisible()
    await expect(page.getByText('5/12 caracteres · 0/2 emojis')).toBeVisible()
  })

  test('adds emojis from the picker, up to the limit', async ({ page }) => {
    await page.goto(CREATOR)
    await input(page).fill('Ana ')
    await page.getByRole('button', { name: 'Emoji' }).click()
    await page.getByRole('button', { name: 'Corazón', exact: true }).click()
    await expect(input(page)).toHaveValue('Ana ❤')

    await page.getByRole('button', { name: 'Emoji' }).click()
    await page.getByRole('button', { name: 'Estrella' }).click()
    await expect(page.getByText('6/12 caracteres · 2/2 emojis')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Emoji' })).toBeDisabled()
  })

  test('removes emojis that cannot be printed and explains why', async ({ page }) => {
    await page.goto(CREATOR)
    await input(page).fill('Ana 🇨🇴')
    await expect(input(page)).toHaveValue('Ana ')
    await expect(page.getByText('Ese emoji no se puede imprimir.', { exact: false })).toBeVisible()
  })

  test('changes size and colors, and prepares the order', async ({ page }) => {
    await page.goto(CREATOR)
    await input(page).fill('Valentina')
    await expect(measurements(page)).toBeVisible({ timeout: 15_000 })
    const medium = await measurements(page).textContent()

    await page.getByRole('radio', { name: /^L/ }).click()
    await expect(measurements(page)).not.toHaveText(medium!)

    await page.getByRole('button', { name: /^Letras:/ }).click()
    await page.getByRole('radio', { name: 'Amarillo', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Letras: Amarillo' })).toBeVisible()

    const order = page.getByRole('link', { name: 'Pedir por formulario' })
    await expect(order).toHaveAttribute('href', /producto=llavero/)
    await expect(order).toHaveAttribute('href', /Texto%3A%20Valentina/)
    await expect(order).toHaveAttribute('href', /letras%20Amarillo/)

    await order.click()
    await expect(page).toHaveURL(/\/contacto\?producto=llavero/)
    await expect(page.getByLabel('¿Qué te interesa?')).toHaveValue('keychain')
    await expect(page.getByLabel('Mensaje')).toHaveValue(/Texto: Valentina/)
  })

  test('picks a font from a list that shows the text in each one', async ({ page }) => {
    await page.goto(CREATOR)
    await input(page).fill('Sofi')
    await page.getByRole('button', { name: /^2\. Tipo de letra:/ }).click()
    await page.getByRole('radio', { name: 'Cursiva' }).click()
    await expect(page.getByRole('button', { name: '2. Tipo de letra: Cursiva' })).toBeVisible()
  })
})

test.describe('Keychain pages', () => {
  test('"Diseña el tuyo" lets you pick the product', async ({ page }) => {
    await page.goto('http://localhost:3000/disena-el-tuyo')
    await page.getByRole('link', { name: /Llavero con tu nombre/ }).click()
    await expect(page).toHaveURL('http://localhost:3000/disena-el-tuyo/llavero')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mira tu nombre')
  })

  test('the products menu leads to the keychains page', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'Productos' }).click()
    // The one in the dropdown (the footer also links to it).
    await page.getByRole('link', { name: /^Llaveros Con tu nombre/ }).click()
    await expect(page).toHaveURL('http://localhost:3000/llaveros')
    await expect(page.getByRole('heading', { name: 'Tamaños' })).toBeVisible()
  })
})
