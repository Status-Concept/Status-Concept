// Storage may be blocked by browser privacy settings or full. Browsing must
// continue even when preferences cannot be persisted.
export function readPreference(key, fallback = null) {
  try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
}
export function savePreference(key, value) {
  try { localStorage.setItem(key, value); return true } catch { return false }
}
export function removePreference(key) {
  try { localStorage.removeItem(key) } catch { /* Keep in-memory state usable. */ }
}
export function readJsonPreference(key, fallback) {
  try {
    const stored = readPreference(key)
    if (!stored) return fallback
    const value = JSON.parse(stored)
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback
    if (fallback && typeof fallback === 'object') return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback
    return value
  } catch { return fallback }
}
