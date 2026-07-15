import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MobileMenu from './MobileMenu'

afterEach(() => cleanup())

describe('MobileMenu', () => {
  it('keeps a closed menu out of the accessibility tree', () => {
    render(
      <MemoryRouter>
        <MobileMenu open={false} onClose={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('dialog', { name: 'Menu' })).toBeNull()
  })

  it('opens as a dialog and closes with Escape', () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <MobileMenu open onClose={onClose} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
