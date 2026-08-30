import { describe, expect, it } from 'vitest'
import { applyLegacyImageOverrides, buildNormalLocalCatalog, toNormalProduct } from './normalProductAdapter'

const candidate = {
  id: 'local-product-antigua',
  canonicalName: 'Antigua 3 Seater',
  collection: 'Antigua',
  supplier: 'DIVANO',
  category: 'Lounge',
  productType: 'Sofa',
  description: 'Three-seater outdoor sofa.',
  selectionStatus: 'candidate',
  imageStatus: 'reference-only',
  referenceImages: [
    { path: '.catalog-private/reference-images/antigua/01.png', alt: 'Antigua front' },
    { path: '.catalog-private/reference-images/antigua/02.png', alt: 'Antigua side' },
  ],
  specs: [{ label: 'Type', value: 'Sofa' }],
  dimensions: [],
  materials: ['Aluminium'],
  variants: [
    { sku: 'JY12.10040/WH', sourceDescription: 'White / Nature Grey', stockQuantity: 4 },
  ],
}

describe('normal local product adapter', () => {
  it('maps an approved checklist candidate into the normal catalogue shape', () => {
    const product = toNormalProduct(candidate)

    expect(product).toMatchObject({
      id: 'local-product-antigua',
      name: 'Antigua 3 Seater',
      collectionName: 'Antigua',
      category: 'lounge',
      supplier: 'DIVANO',
      fit: 'contain',
      localCatalog: true,
    })
    expect(product.images).toEqual([
      '/__status-private/reference-images/antigua/01.png',
      '/__status-private/reference-images/antigua/02.png',
    ])
    expect(product.img).toBe(product.images[0])
    expect(product.specs).toContainEqual({ label: 'SKU', value: 'JY12.10040/WH' })
    expect(product.specs).toContainEqual({ label: 'Supplier', value: 'DIVANO' })
    expect(product.specs.some((spec) => spec.label === 'Original folder')).toBe(false)
    expect(product).not.toHaveProperty('stockQuantity')
  })

  it('cleans numeric folder prefixes from customer-facing product names', () => {
    const product = toNormalProduct({ ...candidate, canonicalName: '89-aruba Sofa Beige' })

    expect(product.name).toBe('Aruba Sofa Beige')
  })

  it('keeps only checklist-linked candidates with a recognised taxonomy', () => {
    const products = buildNormalLocalCatalog([
      candidate,
      { ...candidate, id: 'no-sku', variants: [] },
      { ...candidate, id: 'unreviewed', selectionStatus: 'unreviewed' },
      { ...candidate, id: 'unknown-taxonomy', category: 'Pending taxonomy' },
    ])

    expect(products.map((product) => product.id)).toEqual(['local-product-antigua'])
  })

  it('maps tables and accessories to existing normal catalogue categories', () => {
    expect(toNormalProduct({ ...candidate, id: 'table', category: 'Tables' }).category).toBe('dining')
    expect(toNormalProduct({ ...candidate, id: 'decor', category: 'Accessories & Décor' }).category).toBe('decor')
  })

  it('adds approved private images to legacy localhost products without mutating the source', () => {
    const source = [{ id: 'legacy-chair', name: 'Legacy chair', img: '/placeholder.webp' }]
    const result = applyLegacyImageOverrides(source, {
      'legacy-chair': {
        images: ['.catalog-private/final-images/legacy/legacy-chair/01.png'],
      },
    })

    expect(result[0]).toMatchObject({
      img: '/__status-private/final-images/legacy/legacy-chair/01.png',
      images: ['/__status-private/final-images/legacy/legacy-chair/01.png'],
      fit: 'contain',
      hasApprovedImage: true,
      localCatalogImage: true,
    })
    expect(source[0].img).toBe('/placeholder.webp')
  })

  it('leaves products untouched when no approved override exists', () => {
    const source = [{ id: 'legacy-chair', img: '/original.webp' }]
    expect(applyLegacyImageOverrides(source, {})).toEqual(source)
  })
})
