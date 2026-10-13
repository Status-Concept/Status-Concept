import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchPanel from './SearchPanel'

afterEach(() => cleanup())

function renderSearch() {
  const onClose = vi.fn()
  render(
    <MemoryRouter initialEntries={['/en/products']}>
      <SearchPanel open onClose={onClose} />
    </MemoryRouter>,
  )
  return onClose
}

describe('SearchPanel', () => {
  it('focuses the search field and returns product suggestions as the user types', async () => {
    renderSearch()
    const input = screen.getByRole('combobox', { name: /Search products/i })
    await waitFor(() => expect(document.activeElement).toBe(input))

    fireEvent.change(input, { target: { value: 'Sicily modular' } })
    expect(await screen.findByRole('option', { name: /Sicily Modular Set/i })).toBeTruthy()
  })

  it('supports Portuguese catalogue intent even when product data is English', async () => {
    renderSearch()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'cozinha teca' } })
    expect((await screen.findAllByRole('option')).length).toBeGreaterThan(0)
  })

  it('shows Bermuda as a collection result that opens its collection page', async () => {
    renderSearch()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'bermuda' } })

    const result = await screen.findByRole('option', { name: /BERMUDA.*3 products.*Open collection/i })
    expect(result.getAttribute('href')).toContain('/products?cat=lounge&collection=bermuda')
    expect(screen.queryByRole('option', { name: /BERMUDA \(Divano\)/i })).toBeNull()
  })

  it('submits search with Enter', async () => {
    const onClose = renderSearch()
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'teak table' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('offers recovery paths instead of a dead end when nothing matches', async () => {
    renderSearch()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'volcanic glass sculpture' } })
    expect((await screen.findByRole('status')).textContent).toContain('Try a product type')
    expect(screen.getByRole('link', { name: /Ask the showroom team/i })).toBeTruthy()
  })
})
