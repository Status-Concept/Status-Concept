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
  it.each(['lounge', 'sunlounger'])('uses the neutral Bali cover in the %s collection grid', async (category) => {
    renderProductsAt(`/en/products?cat=${category}`)
    const collections = await screen.findByRole('region', { name: 'Collections' })
    const cover = within(collections).getByRole('button', { name: /^Collection Bali 3 products$/i })
    expect(cover.querySelector('img').getAttribute('src')).toBe('/product-images/bali-reference-v2/collection-cover-neutral-v4.webp')
  })
  it('shows a touch-friendly setting toggle for products with a lifestyle image', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=miami')
    await screen.findAllByRole('article')
    const card = screen.getAllByRole('article').find((item) => item.querySelector('.rd-product-image-hero'))
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
    const gallery = screen.getByRole('region', { name: 'Product gallery' })
    expect(within(gallery).getAllByRole('button', { name: /^View image / })).toHaveLength(1)
    expect(gallery.querySelector('img[src$="-minimal.webp"]')).toBeNull()
  })

  it('keeps Bali setting photos hover-only, without an extra toggle', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=bali')
    await screen.findByRole('heading', { name: 'Bali Sun Lounger' })
    for (const card of screen.getAllByRole('article')) {
      expect(card.classList.contains('hover-only-setting')).toBe(true)
      expect(card.querySelector('.rd-product-image-hero')).toBeTruthy()
      expect(within(card).queryByRole('button', { name: 'View in setting' })).toBeNull()
    }
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
