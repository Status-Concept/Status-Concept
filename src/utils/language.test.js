import { describe, it, expect } from 'vitest'
import { getLangFromPath, stripLangFromPath, withLang } from './language'

describe('getLangFromPath', () => {
  it('reads an explicit pt prefix', () => {
    expect(getLangFromPath('/pt/products')).toBe('pt')
  })
  it('defaults to en for an unprefixed path', () => {
    expect(getLangFromPath('/products')).toBe('en')
  })
  it('defaults to en for the root', () => {
    expect(getLangFromPath('/')).toBe('en')
  })
  it('reads an explicit en prefix', () => {
    expect(getLangFromPath('/en/contact')).toBe('en')
  })
})

describe('stripLangFromPath', () => {
  it('removes a pt prefix', () => {
    expect(stripLangFromPath('/pt/products')).toBe('/products')
  })
  it('reduces a bare lang prefix to root', () => {
    expect(stripLangFromPath('/en')).toBe('/')
  })
  it('leaves an unprefixed path untouched', () => {
    expect(stripLangFromPath('/products')).toBe('/products')
  })
})

describe('withLang', () => {
  it('prefixes a path and preserves the query string', () => {
    expect(withLang('/products?cat=shade', 'pt')).toBe('/pt/products?cat=shade')
  })
  it('maps the root to a bare lang prefix', () => {
    expect(withLang('/', 'en')).toBe('/en')
  })
  it('re-prefixes an already-prefixed path', () => {
    expect(withLang('/en/products', 'pt')).toBe('/pt/products')
  })
  it('falls back to en for an unknown lang', () => {
    expect(withLang('/products', 'de')).toBe('/en/products')
  })
})
