// Vite's public-file lookup uses decodeURI, which intentionally retains
// escaped URI-reserved characters. In a path (not a query), +, & and commas
// can remain literal. Keep ? and # encoded so they never become delimiters.
export function publicAssetUrl(src) {
  return src.replace(/%(?:2B|26|2C|3B|3A|3D|40|24)/gi, (encoded) => decodeURIComponent(encoded))
}
