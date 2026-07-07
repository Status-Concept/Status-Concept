import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, act, cleanup } from '@testing-library/react'

// Mock auth so the test can flip the user from logged-in to logged-out.
let mockUser = { id: 'u1' }
vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser, loading: false }),
}))
// No backend in the test — keep the guest path.
vi.mock('./lib/supabase', () => ({
  getSupabase: () => Promise.resolve(null),
  isSupabaseConfigured: false,
}))

import { FavoritesProvider, useFavorites } from './FavoritesContext'

const STORAGE_KEY = 'status_concept_favorites'
const DETAILS_KEY = 'status_concept_favorite_details'

function Harness() {
  const { favorites } = useFavorites()
  return <div data-testid="count">{favorites.length}</div>
}

beforeEach(() => {
  localStorage.clear()
  mockUser = { id: 'u1' }
})
afterEach(cleanup)

describe('FavoritesContext logout wipe', () => {
  it('clears favorites storage and state when the user logs out', async () => {
    // Seed as if an account had favorites cached in storage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'p1' }, { id: 'p2' }]))
    localStorage.setItem(DETAILS_KEY, JSON.stringify({ p1: { id: 'p1' } }))

    const { rerender } = render(
      <FavoritesProvider><Harness /></FavoritesProvider>,
    )

    // Log out: flip the mocked user to null and re-render.
    await act(async () => {
      mockUser = null
      rerender(<FavoritesProvider><Harness /></FavoritesProvider>)
    })

    // No account favorites data survives: the ID list is gone and the details
    // cache holds no entries (null or an empty object both satisfy "no data").
    const ids = localStorage.getItem(STORAGE_KEY)
    expect(ids === null || JSON.parse(ids).length === 0).toBe(true)
    const details = localStorage.getItem(DETAILS_KEY)
    expect(details === null || Object.keys(JSON.parse(details)).length === 0).toBe(true)
  })

  it('does not wipe an anonymous visitor on first mount', async () => {
    mockUser = null
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ id: 'guest1' }]))

    await act(async () => {
      render(<FavoritesProvider><Harness /></FavoritesProvider>)
    })

    // Guest favorites survive the initial mount (no logout transition).
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(1)
  })
})
