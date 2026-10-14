// Variables from .env (see .env.example). The contact ones are required: vite.config.ts checks them at build time.
interface ImportMetaEnv {
  readonly VITE_WHATSAPP_PHONE: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_INSTAGRAM_URL: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
}
