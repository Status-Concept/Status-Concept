import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { demoProducts } from '../data/demoProducts'
import { publishedCorrectionProducts } from '../data/productCatalog'
import ProductDetail from './status-concept-product-detail'

const renderProduct = (id) => render(
  <MemoryRouter initialEntries={[`/en/product/${id}`]}>
    <AuthProvider>
      <Routes>
        <Route path="/en/product/:id" element={<ProductDetail />} />
      </Routes>
    </AuthProvider>
  </MemoryRouter>,
)

afterEach(cleanup)

describe('product recommendation filters', () => {
  it('filters the Berlin corner sofa recommendations to other corner sofas', async () => {
    renderProduct('local-product-96d0949d7c3e')

    const heading = await screen.findByRole('heading', { name: 'You may also like' })
    const recommendations = heading.closest('section')
    const cornerFilter = within(recommendations).getByRole('button', { name: 'Corner sofas' })
    fireEvent.click(cornerFilter)

    expect(cornerFilter.getAttribute('aria-pressed')).toBe('true')
    const cards = [...recommendations.querySelectorAll('.rd-product-card')]
    expect(cards.length).toBeGreaterThan(0)
    const sourceProducts = [...demoProducts, ...publishedCorrectionProducts]
    expect(cards.every((card) => {
      const name = card.querySelector('h3')?.textContent
      const source = sourceProducts.find((item) => item.name === name)
      return source && /\bcorner\b|\bsectional\b|\bl[- ]shaped\b/i.test(`${source.name} ${source.tagline || ''} ${source.desc || ''}`)
    })).toBe(true)
    expect(within(recommendations).getByRole('button', { name: 'Clear' })).toBeTruthy()
  })
})
