import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { demoProducts } from '../data/demoProducts'
import { publishedCorrectionProducts } from '../data/productCatalog'
import { getProductFacets } from '../data/productTaxonomy'
import { berlinProducts, retiredBerlinProductIds } from '../data/berlinCollection'
import ProductDetail from './status-concept-product-detail'

const renderProduct = (id) => render(
  <MemoryRouter initialEntries={[`/en/product/${id}`]}>
    <AuthProvider>
      <Routes>
        <Route path="/en/product/:id" element={<ProductDetail />} />
        <Route path="/en/products" element={<h1>Berlin collection destination</h1>} />
      </Routes>
    </AuthProvider>
  </MemoryRouter>,
)

afterEach(cleanup)

describe('Berlin reference galleries and legacy links', () => {
  it.each(berlinProducts)('shows only studio gallery images for $name', (product) => {
    renderProduct(product.id)
    const gallery = screen.getByRole('region', { name: 'Product gallery' })
    const thumbnails = within(gallery).getAllByRole('button', { name: /View image/ })
    expect(thumbnails).toHaveLength(product.images.length)
    for (let index = 0; index < thumbnails.length; index++) {
      fireEvent.click(thumbnails[index])
      expect(within(gallery).getByRole('img', { name: product.name, exact: true }).getAttribute('src')).toBe(product.images[index])
    }
    expect(gallery.querySelector(`img[src="${product.heroImage}"]`)).toBeNull()
  })

  it.each([...retiredBerlinProductIds])('redirects retired product %s to its collection', async (id) => {
    renderProduct(id)
    expect(await screen.findByRole('heading', { name: 'Berlin collection destination' })).toBeTruthy()
  })
})

describe('product recommendation filters', () => {
  it('filters the Berlin modular sofa recommendations to other modular sofas', async () => {
    renderProduct('berlin-modular-sofa')

    const heading = await screen.findByRole('heading', { name: 'You may also like' })
    const recommendations = heading.closest('section')
    const cornerFilter = within(recommendations).getByRole('button', { name: 'Modular sofas' })
    fireEvent.click(cornerFilter)

    expect(cornerFilter.getAttribute('aria-pressed')).toBe('true')
    const cards = [...recommendations.querySelectorAll('.rd-product-card')]
    expect(cards.length).toBeGreaterThan(0)
    const sourceProducts = [...demoProducts, ...publishedCorrectionProducts]
    expect(cards.every((card) => {
      const name = card.querySelector('h3')?.textContent
      const source = sourceProducts.find((item) => item.name === name)
      return source && getProductFacets(source).productType.includes('modular')
    })).toBe(true)
    expect(within(recommendations).getByRole('button', { name: 'Clear' })).toBeTruthy()
  })
})
