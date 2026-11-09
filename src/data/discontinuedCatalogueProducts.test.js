import { expect, it } from 'vitest'
import { discontinuedCatalogueProductIds } from './discontinuedCatalogueProducts'
import { publicSearchProducts, routableProducts } from './productCatalog'
import sales from './sales2026.json'

it('delists the 47 approved records without dropping any other products or Sales offers', () => {
  const active = new Set(publicSearchProducts.map(({ id }) => id))
  expect(new Set(routableProducts.map(({ id }) => id).filter(id => !active.has(id))))
    .toEqual(discontinuedCatalogueProductIds)
  expect(discontinuedCatalogueProductIds.size).toBe(47)
  expect(publicSearchProducts).toHaveLength(101)
  for (const id of [
    'duna', 'antigua-lounge', 'antigua-xl-lounge', 'oxford-2', 'oxford-modular-sofa',
    'oxford', 'gibraltar', 'crete-lounger', 'local-product-d4a5fba0f1ba',
    'local-product-2c87b088d9e8',
  ]) expect(active.has(id), id).toBe(true)
  expect(sales).toHaveLength(57)
  expect(sales.some(({ name }) => name === 'CUBA')).toBe(true)
})
