import type { SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
// The publishable (or legacy anon) key: public by design, the tables' row level security decides what it may do
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

let client: Promise<SupabaseClient | null> | undefined

// supabase-js loads only when something first asks for it, so it never weighs on the first paint. The site has
// no logins, so nothing is kept in the visitor's storage.
export function getSupabase(): Promise<SupabaseClient | null> {
  client ??= isSupabaseConfigured
    ? import('@supabase/supabase-js').then(({ createClient }) =>
        createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } }),
      )
    : Promise.resolve(null)
  return client
}
