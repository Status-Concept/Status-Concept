// Keep previously shared hash-router links usable without reloading the page.
export function legacyUrlTarget(href) {
  const current = new URL(href)
  if (!current.hash.startsWith('#/') || current.hash.startsWith('#//')) return null
  const target = new URL(current.hash.slice(1), current.origin)
  if (target.origin !== current.origin) return null
  for (const [key, value] of current.searchParams) {
    if (!target.searchParams.has(key)) target.searchParams.append(key, value)
  }
  return `${target.pathname}${target.search}${target.hash}`
}
