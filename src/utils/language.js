export const SUPPORTED_LANGS = ['en', 'pt']
export const DEFAULT_LANG = 'en'

export function getLangFromPath(pathname) {
  const lang = pathname.split('/').filter(Boolean)[0]
  return SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
}

export function stripLangFromPath(pathname) {
  const parts = pathname.split('/').filter(Boolean)
  if (SUPPORTED_LANGS.includes(parts[0])) {
    const stripped = `/${parts.slice(1).join('/')}`
    return stripped === '/' ? '/' : stripped.replace(/\/$/, '') || '/'
  }
  return pathname || '/'
}

export function withLang(path, lang) {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG
  const [pathname, search = ''] = path.split('?')
  const cleanPath = stripLangFromPath(pathname)
  const prefixed = cleanPath === '/' ? `/${safeLang}` : `/${safeLang}${cleanPath}`
  return search ? `${prefixed}?${search}` : prefixed
}
