const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Sync flag — safe to read at module load for initial UI state.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Lazily import the SDK so it stays out of the entry chunk. The vast majority
// of visitors (anonymous catalogue browsers) never hit an auth/enquiry path,
// so the client only loads on first real need. Memoized: created once.
let clientPromise = null
export function getSupabase() {
  if (!isSupabaseConfigured) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(supabaseUrl, supabaseAnonKey),
    )
  }
  return clientPromise
}
