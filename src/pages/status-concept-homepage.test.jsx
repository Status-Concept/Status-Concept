import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Homepage from './status-concept-homepage'

vi.mock('../components/Layout', () => ({ default: ({ children }) => children }))

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(document, 'hidden', 'get').mockReturnValue(false)
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks() })
const mount = () => render(<MemoryRouter><Homepage /></MemoryRouter>)
const advance = (ms) => act(() => vi.advanceTimersByTime(ms))
const active = (index) => screen.getByRole('button', { name: `Go to slide ${index}` }).getAttribute('aria-pressed')

describe('homepage autoplay carousel', () => {
  it('automatically advances every five seconds and loops', () => {
    mount()
    expect(active(1)).toBe('true')
    for (let slide = 2; slide <= 5; slide += 1) { advance(5000); expect(active(slide)).toBe('true') }
    advance(5000)
    expect(active(1)).toBe('true')
  })
  it('pauses, resumes and restarts the timer after manual navigation', () => {
    mount()
    advance(4000)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    advance(1000)
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }))
    advance(10000)
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Play slideshow' }))
    advance(5000)
    expect(active(3)).toBe('true')
  })
  it('keeps requested autoplay available with reduced motion and a Pause control', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true })
    mount()
    advance(5000)
    expect(active(2)).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' }))
    advance(10000)
    expect(active(2)).toBe('true')
  })
})
