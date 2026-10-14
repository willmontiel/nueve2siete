import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Without these the WhatsApp buttons and footer links would ship broken, so fail loudly instead
const REQUIRED_ENV = ['VITE_WHATSAPP_PHONE', 'VITE_CONTACT_EMAIL', 'VITE_INSTAGRAM_URL']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const missing = REQUIRED_ENV.filter(key => !env[key])
  if (missing.length) {
    throw new Error(`Missing ${missing.join(', ')} in .env (copy them from .env.example)`)
  }

  return {
    plugins: [react(), tailwindcss()],
  }
})
