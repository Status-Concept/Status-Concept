import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(cleanup)

function renderProductsAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('responsive collection presentation', () => {
  it('shows a touch-friendly setting toggle for products with a lifestyle image', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=bali')
    const heading = await screen.findByRole('heading', { name: 'Bali Sun Lounger' })
    const card = heading.closest('article')
    const toggle = within(card).getByRole('button', { name: 'View in setting' })

    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(toggle)
    expect(card.classList.contains('mobile-lifestyle-visible')).toBe(true)
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
    expect(toggle.textContent).toBe('View studio photo')

    fireEvent.click(toggle)
    expect(card.classList.contains('mobile-lifestyle-visible')).toBe(false)
    expect(toggle.textContent).toBe('View in setting')
  })

  it.each([
    ['bali-lounge-2', 'Bali Lounge Armchair & Footstool'],
    ['bali', 'Bali Sun Lounger'],
    ['bali-double-sun-lounger', 'Bali Double Sun Lounger'],
  ])('opens the curated product page for %s', async (id, name) => {
    renderProductsAt(`/en/product/${id}`)
    expect(await screen.findByRole('heading', { level: 1, name })).toBeTruthy()
  })

  it('keeps retired Bali links useful by opening the corrected collection', async () => {
    renderProductsAt('/en/product/local-product-curated-bali-modular-sofa-taupe')
    expect(await screen.findByRole('heading', { name: 'Bali Lounge Armchair & Footstool' })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('heading', { name: 'Bali Modular Sofa Taupe' })).toBeNull()
  })

  it('counts the three curated Bali models when searching the collection', async () => {
    renderProductsAt('/en/products?q=Bali')
    expect(await screen.findByRole('button', { name: /^All\s*3$/ })).toBeTruthy()
    expect(within(screen.getByRole('region', { name: 'Matching collection' })).getByText('3 products · Open collection')).toBeTruthy()
  })

  it('normalizes the ottoman image scale against the other Sicily pieces', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=sicily')
    const heading = await screen.findByRole('heading', { name: 'Sicily Ottoman' })
    const card = heading.closest('article')

    expect(card.classList.contains('image-scale-adjusted')).toBe(true)
    expect(card.style.getPropertyValue('--product-image-scale')).toBe('0.82')
  })
})
