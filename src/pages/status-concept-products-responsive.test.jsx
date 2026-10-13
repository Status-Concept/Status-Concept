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
    const heading = await screen.findByRole('heading', { name: 'Bali Modular Sofa Taupe' })
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

  it('normalizes the ottoman image scale against the other Sicily pieces', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=sicily')
    const heading = await screen.findByRole('heading', { name: 'Sicily Ottoman' })
    const card = heading.closest('article')

    expect(card.classList.contains('image-scale-adjusted')).toBe(true)
    expect(card.style.getPropertyValue('--product-image-scale')).toBe('0.82')
  })
})
