import { describe, expect, it } from 'vitest'
import { kitchenProducts, kitchenProductDetails } from './kitchenProducts'

describe('kitchen detail configurations', () => {
  it('preserves every supplier size option on its product page', () => {
    const configurable = kitchenProducts.filter((product) => product.sizeOptions?.length)
    expect(configurable.length).toBeGreaterThan(0)
    for (const product of configurable) {
      expect(kitchenProductDetails[product.id].sizeOptions).toEqual(product.sizeOptions)
    }
  })
})
