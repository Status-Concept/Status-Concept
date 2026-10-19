import { CONTACT } from '../data/showrooms'
import { whatsappUrl } from './whatsapp'

export const salesPrice = value => new Intl.NumberFormat('pt-PT', {
  style: 'currency', currency: 'EUR',
}).format(value / 100)

export function salesEnquiry(offer, { pt = false, optionIndex = 0, contact = {}, origin = '' } = {}) {
  const option = offer.options[optionIndex] || offer.options[0]
  const subject = `${pt ? 'Disponibilidade Sales 2026' : 'Sales 2026 availability'} — ${offer.name} · ${offer.subtitle}`
  const productUrl = `${origin}/#/${pt ? 'pt' : 'en'}/sales?offer=${encodeURIComponent(offer.id)}`
  const details = offer.details.join('\n')
  const body = pt
    ? `Olá equipa Status Concept,\n\nGostaria de confirmar a disponibilidade desta oferta:\n\n${offer.name} — ${offer.subtitle}\n${option.quantity ? `Opção: ${option.quantity} cadeiras\n` : ''}Preço de saldo: ${salesPrice(option.sale)}\nPreço original: ${salesPrice(option.original)}\nDesconto: ${offer.discount}%\nReferência: catálogo Sales 2026, página ${offer.page}\n${productUrl}\n\nArtigos e acabamentos (catálogo original):\n${details}\n\nOs meus dados de contacto:\nNome: ${contact.name?.trim() || ''}\nEmail: ${contact.email?.trim() || ''}\nTelefone: ${contact.phone?.trim() || ''}\n\nObrigado/a.`
    : `Hello Status Concept team,\n\nI would like to check availability of this offer:\n\n${offer.name} — ${offer.subtitle}\n${option.quantity ? `Option: ${option.quantity} chairs\n` : ''}Sale price: ${salesPrice(option.sale)}\nOriginal price: ${salesPrice(option.original)}\nDiscount: ${offer.discount}%\nReference: Sales 2026 catalogue, page ${offer.page}\n${productUrl}\n\nItems & finishes (original catalogue):\n${details}\n\nMy contact details:\nName: ${contact.name?.trim() || ''}\nEmail: ${contact.email?.trim() || ''}\nPhone: ${contact.phone?.trim() || ''}\n\nThank you.`
  return {
    subject, body,
    emailHref: `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    whatsappHref: whatsappUrl(body),
  }
}
