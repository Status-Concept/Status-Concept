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
