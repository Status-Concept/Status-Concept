import { describe, it, expect } from 'vitest'
import { whatsappUrl, whatsappShortlistMessage } from './whatsapp'

describe('whatsappUrl', () => {
  it('URL-encodes the message into a wa.me link', () => {
    const url = whatsappUrl('a b?&')
    expect(url.startsWith('https://wa.me/351937573600?text=')).toBe(true)
    expect(url).toContain('a%20b%3F%26')
  })
})

describe('whatsappShortlistMessage', () => {
  it('joins a short list of names', () => {
    expect(whatsappShortlistMessage(['Sofa', 'Table'])).toBe(
      "Hello STATVS, I'd like a proposal for: Sofa, Table.",
    )
  })
  it('drops falsy entries', () => {
    expect(whatsappShortlistMessage(['Sofa', '', null, 'Table'])).toBe(
      "Hello STATVS, I'd like a proposal for: Sofa, Table.",
    )
  })
  it('truncates a long list with an "and N more" tail', () => {
    const names = Array.from({ length: 60 }, (_, i) => `Product-${i}`)
    const msg = whatsappShortlistMessage(names, 100)
    expect(msg).toMatch(/and \d+ more\.$/)
    expect(msg.length).toBeLessThan(200)
  })
})
