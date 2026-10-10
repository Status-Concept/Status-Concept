import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Homepage from './status-concept-homepage'

vi.mock('../components/Layout', () => ({ default: ({ children }) => children }))

beforeEach(() => vi.useFakeTimers())
afterEach(() => { cleanup(); vi.useRealTimers() })

const mount = () => render(<MemoryRouter><Homepage /></MemoryRouter>)
const active = (index) => screen.getByRole('button', { name: `Go to slide ${index}` }).getAttribute('aria-pressed')

describe('homepage manual carousel', () => {
  it('shows no pause control and does not advance automatically', () => {
    mount()
    expect(active(1)).toBe('true')
    expect(screen.queryByRole('button', { name: /pause slideshow/i })).toBeNull()
    act(() => vi.advanceTimersByTime(15000))
    expect(active(1)).toBe('true')
  })

  it('moves using arrows and direct slide selection', () => {
    mount()
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(active(1)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 4' }))
    expect(active(4)).toBe('true')
  })
})
