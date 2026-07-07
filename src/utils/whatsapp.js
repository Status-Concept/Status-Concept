import { CONTACT } from '../data/showrooms'

export function whatsappUrl(message) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

// Build a shortlist enquiry message, capping the joined product list so the
// wa.me URL stays comfortably short.
export function whatsappShortlistMessage(names, limit = 600) {
  const list = names.filter(Boolean)
  let joined = ''
  let shown = 0
  for (const name of list) {
    const next = joined ? `${joined}, ${name}` : name
    if (next.length > limit) break
    joined = next
    shown += 1
  }
  const remaining = list.length - shown
  const tail = remaining > 0 ? `${joined} and ${remaining} more` : joined
  return `Hello STATVS, I'd like a proposal for: ${tail}.`
}
