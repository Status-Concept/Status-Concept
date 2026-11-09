import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Homepage from './status-concept-homepage'

vi.mock('../components/Layout', () => ({ default: ({ children }) => children }))

beforeEach(() => vi.useFakeTimers())
afterEach(() => { cleanup(); vi.useRealTimers() })

const mount = () => render(<MemoryRouter><Homepage /></MemoryRouter>)
const active = (index) => screen.getByRole('button', { name: `Go to slide ${index}` }).getAttribute('aria-pressed')

describe('homepage carousel', () => {
  it('advances automatically and lets visitors pause and resume', () => {
    mount()
    expect(active(1)).toBe('true')
    act(() => vi.advanceTimersByTime(6500))
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }))
    act(() => vi.advanceTimersByTime(13000))
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Resume slideshow' }))
    act(() => vi.advanceTimersByTime(6500))
    expect(active(3)).toBe('true')
  })

  it('supports direct slide selection without arrows', () => {
    mount()
    expect(screen.queryByRole('button', { name: /previous slide|next slide/i })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 4' }))
    act(() => vi.advanceTimersByTime(6500))
    expect(active(4)).toBe('true')
  })

  it('takes the visitor from the hero to the category links', () => {
    mount()
    const cue = screen.getByRole('link', { name: 'Scroll to see more' })
    const categories = screen.getByRole('region', { name: 'Explore the catalogue' })
    categories.scrollIntoView = vi.fn()
    expect(cue.getAttribute('href')).toBe(`#${categories.id}`)
    fireEvent.click(cue)
    expect(document.activeElement).toBe(categories)
    expect(categories.scrollIntoView).toHaveBeenCalledOnce()
  })
})
