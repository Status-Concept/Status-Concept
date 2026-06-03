export function sanitizeText(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .trim()
}

export function sanitizePhone(value) {
  return sanitizeText(value).replace(/[^\d+\s().-]/g, '')
}

