import { describe, it, expect } from 'vitest'
import { sanitizeText, sanitizePhone } from './sanitize'

describe('sanitizeText', () => {
  it('strips angle brackets', () => {
    expect(sanitizeText('<b>Ana</b>')).toBe('bAna/b')
  })
  it('contains no angle brackets after sanitizing', () => {
    const out = sanitizeText('<script>alert(1)</script>')
    expect(out).not.toMatch(/[<>]/)
  })
  it('trims surrounding whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })
  it('coerces nullish input to an empty string', () => {
    expect(sanitizeText(null)).toBe('')
    expect(sanitizeText(undefined)).toBe('')
  })
})

describe('sanitizePhone', () => {
  it('keeps digits, +, spaces, parens, dots and dashes', () => {
    expect(sanitizePhone('+351 (289) 030-179')).toBe('+351 (289) 030-179')
  })
  it('drops letters and other symbols', () => {
    expect(sanitizePhone('351abc289!')).toBe('351289')
  })
})
