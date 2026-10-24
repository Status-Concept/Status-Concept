import { describe, expect, it } from 'vitest'
import { allProducts } from './productCatalog'
import { demoProducts, demoProductIds } from './demoProducts'
import { MAX_DEMO_PRODUCTS } from '../config/contentLimits'
import { validateCatalogProducts } from './catalogValidation'
import { filterProducts, getProductFacets, productMatchesFilters } from './productTaxonomy'

describe('canonical product taxonomy', () => {
  it('separates standalone coffee and side tables without moving furniture sets', () => {
    for (const name of ['Conrad Side Table', 'Round Coffee Table']) {
      expect(getProductFacets({ name, category: 'dining' }).category).toBe('tables')
    }
    expect(getProductFacets({ name: 'Bella Sofa Set with Coffee Table', category: 'lounge' }).category).toBe('lounge')
    expect(getProductFacets({ name: 'Armchair with modular sofa side table', category: 'lounge', productType: ['sofa'] }).category).toBe('lounge')
    expect(productMatchesFilters({ name: 'Conrad Side Table', category: 'dining' }, { category: 'tables', type: 'side-table' })).toBe(true)
    expect(productMatchesFilters({ name: 'Conrad Side Table', category: 'dining' }, { category: 'dining' })).toBe(false)
  })

  it('includes dining chairs with arms in the dining chair filter only in that category', () => {
    expect(productMatchesFilters({ name: 'Antalya Dining Armchair', category: 'dining' }, { category: 'dining', type: 'chair' })).toBe(true)
    expect(productMatchesFilters({ name: 'Lounge Armchair', category: 'lounge' }, { category: 'dining', type: 'chair' })).toBe(false)
    expect(productMatchesFilters({ name: 'Dining Armchair', category: 'dining', productType: ['armchair'] }, { type: 'chair' })).toBe(true)
  })

  it('does not classify dining sets, detail shots or bar tables as individual dining seating', () => {
    expect(getProductFacets({ name: 'Laguna Dining Table + Reno Dining Armchiar', category: 'dining' }).productType).toEqual(['dining-set'])
    expect(getProductFacets({ name: 'Laguna Dining Table Wood Detail', category: 'dining' }).productType).toEqual(['detail'])
    expect(getProductFacets({ name: 'Bar Table Reno', category: 'dining' }).productType).toEqual(['bar-table'])
    expect(getProductFacets({ name: 'Celia Living Armchair', category: 'dining' }).category).toBe('lounge')
  })

  it('validates the current catalogue without missing identity or image data', () => {
    const report = validateCatalogProducts(allProducts)
    expect(report.valid).toBe(true)
    expect(report.total).toBeGreaterThan(100)
  })

  it('uses structured facets instead of matching a type inside the product name', () => {
    const product = { id: 'woven-sofa', name: 'Armchair with modular sofa side table', category: 'lounge', productType: ['sofa'], images: ['/chair.webp'] }
    expect(productMatchesFilters(product, { category: 'lounge', type: 'armchair' })).toBe(false)
    expect(productMatchesFilters(product, { category: 'lounge', type: 'sofa' })).toBe(true)
  })

  it('normalizes kitchen source fields into the canonical shape', () => {
    const product = { id: 'kitchen-module', name: 'Teak BBQ Cabinet', category: 'kitchen', collection: 'teak', specs: { dimensions: '90 x 60 cm', material: 'Reclaimed teak and ceramic top' }, image: '/kitchen.webp' }
    const facets = getProductFacets(product)
    expect(facets.collection).toBe('teak')
    expect(facets.productType).toContain('bbq')
    expect(facets.materialFamilies).toEqual(expect.arrayContaining(['teak', 'ceramic']))
    expect(facets.dimensions).toHaveLength(1)
  })

  it('combines category, type and material filters', () => {
    const products = [
      { id: 'rope-chair', name: 'Chair', category: 'lounge', productType: ['armchair'], materialFamilies: ['rope'], images: ['/chair.webp'] },
      { id: 'alu-sofa', name: 'Sofa', category: 'lounge', productType: ['sofa'], materialFamilies: ['aluminium'], images: ['/sofa.webp'] },
    ]
    expect(filterProducts(products, { category: 'lounge', type: 'armchair', material: 'rope' }).map((item) => item.id)).toEqual(['rope-chair'])
  })

  it('searches approved facet values as well as the visible product copy', () => {
    const products = [{ id: 'rope-chair', name: 'Outdoor chair', category: 'lounge', productType: ['armchair'], materialFamilies: ['rope'], images: ['/chair.webp'] }]
    expect(filterProducts(products, { query: 'rope' }).map((item) => item.id)).toEqual(['rope-chair'])
  })

  it('keeps the public catalogue on the earlier demonstration selection', () => {
    const counts = demoProducts.reduce((result, product) => {
      result[product.category] = (result[product.category] || 0) + 1
      return result
    }, {})

    Object.entries(counts).forEach(([category, count]) => {
      if (category === 'kitchen') return
      expect(count).toBeLessThanOrEqual(MAX_DEMO_PRODUCTS)
    })
    expect(counts.kitchen).toBeGreaterThan(0)
    expect(demoProductIds.size).toBe(demoProducts.length)
    expect(demoProducts.length).toBeLessThan(allProducts.length)
  })
})
