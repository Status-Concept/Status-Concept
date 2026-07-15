import { describe, expect, it } from 'vitest'
import { normalizeSearchText, searchProducts } from './productSearch'

const products = [
  {
    id: 'alu-smart',
    name: 'ALU-SMART',
    category: 'shade',
    collectionName: 'Aluminium Centre Pole Parasols',
    specs: [{ label: 'Frame', value: 'Anodised aluminium' }],
  },
  {
    id: 'sicily-sofa',
    name: 'Sicily Modular Sofa',
    category: 'lounge',
    collectionName: 'Sicily',
    description: 'A modular lounge system.',
  },
  {
    id: 'teak-kitchen',
    name: 'Carbon Line Kitchen',
    category: 'kitchen',
    materials: ['Natural teak', 'Ceramic top'],
    specs: { sku: 'DRAK-TEAK-01' },
  },
]

describe('product search', () => {
  it('normalizes accents and punctuation', () => {
    expect(normalizeSearchText('Chapéus de Sol & Alumínio')).toBe('chapeus de sol and aluminio')
  })

  it('supports Portuguese synonyms against English catalogue data', () => {
    expect(searchProducts(products, 'sofá')[0]?.id).toBe('sicily-sofa')
    expect(searchProducts(products, 'cozinha teca')[0]?.id).toBe('teak-kitchen')
  })

  it('searches deep specification values and SKUs', () => {
    expect(searchProducts(products, 'DRAK-TEAK-01')[0]?.id).toBe('teak-kitchen')
    expect(searchProducts(products, 'anodised')[0]?.id).toBe('alu-smart')
  })

  it('ranks an exact product name ahead of contextual matches', () => {
    const results = searchProducts([
      ...products,
      { id: 'secondary', name: 'Outdoor Chair', description: 'Works with the Sicily Modular Sofa' },
    ], 'Sicily Modular Sofa')
    expect(results[0]?.id).toBe('sicily-sofa')
  })

  it('returns no results for an empty or unrelated query', () => {
    expect(searchProducts(products, '')).toEqual([])
    expect(searchProducts(products, 'volcanic glass sculpture')).toEqual([])
  })
})

