import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { existsSync } from 'node:fs'
import App from '../App'
import offers from '../data/sales2026.json'

afterEach(cleanup)

describe('Sales catalogue', () => {
  it('retains all 57 source offers, valid prices, assets and quantity options', () => {
    expect(offers).toHaveLength(57)
    expect(new Set(offers.map(offer => offer.id)).size).toBe(57)
    expect(offers.filter(offer => !offer.image).map(offer => offer.page)).toEqual([44])
    for (const offer of offers) {
      if (offer.image) expect(existsSync(`public${offer.image}`)).toBe(true)
      expect(offer.details.length).toBeGreaterThan(0)
      for (const option of offer.options) {
        expect(option.sale * 100).toBe(option.original * (100 - offer.discount))
      }
    }
    expect(offers.find(offer => offer.page === 42).options.map(option => option.quantity)).toEqual([10, 8, 6])
    expect(existsSync('public/sales/2026/status-concept-sales-2026.pdf')).toBe(true)
  })

  it.each(['/sales', '/en/sales', '/pt/sales'])('opens %s with the header link and complete catalogue', async (path) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Sales 2026' }, { timeout: 5000 })
    expect(screen.getAllByRole('article')).toHaveLength(57)
    expect(screen.getByRole('link', { name: 'Sales', exact: true }).getAttribute('href')).toContain('/sales')
    expect(screen.getByText(/26 (October|de outubro)/)).toBeTruthy()
    expect(document.title).toBe('Sales 2026 | STATVS')
  })

  it('filters categories without losing source variants and links enquiries to the correct PDF offer', async () => {
    render(<MemoryRouter initialEntries={['/en/sales']}><App /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Sales 2026' }, { timeout: 5000 })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'LOUNGE LIVING' } })
    expect(screen.getAllByRole('article')).toHaveLength(11)
    const first = screen.getAllByRole('article')[0]
    expect(within(first).getByRole('link', { name: 'Check availability' }).getAttribute('href')).toContain('PDF%20p.%202')
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'all' } })
    expect(screen.getAllByRole('article')).toHaveLength(57)
    expect(screen.getByText('Photograph not supplied in the original catalogue')).toBeTruthy()
  })
})
