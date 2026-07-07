// Build a srcset for catalogue images that have generated -w400/-w800 variants
// (see scripts/generate-image-variants.mjs). Only /product-images/*.webp paths
// have variants; module-imported assets (hashed by Vite) and anything else
// return undefined so the caller renders the plain src unchanged.
export function productSrcSet(src) {
  if (typeof src !== 'string' || !src.startsWith('/product-images/') || !src.endsWith('.webp')) return undefined
  const base = src.slice(0, -'.webp'.length)
  return `${base}-w400.webp 400w, ${base}-w800.webp 800w, ${src} 1600w`
}
