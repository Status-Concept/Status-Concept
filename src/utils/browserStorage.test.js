import { afterEach, describe, expect, it, vi } from 'vitest'
import { readJsonPreference, readPreference, removePreference, savePreference } from './browserStorage'

afterEach(() => { vi.restoreAllMocks(); localStorage.clear() })
describe('browser preference failure recovery', () => {
  it('keeps browsing usable when the browser denies storage access', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota') })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('blocked') })
    expect(readPreference('consent')).toBeNull()
    expect(readJsonPreference('favorites', [])).toEqual([])
    expect(savePreference('consent', 'rejected')).toBe(false)
    expect(() => removePreference('favorites')).not.toThrow()
  })
  it('rejects corrupted and incorrectly shaped favourite lists', () => {
    for (const value of ['{broken', 'null', '{}', '42']) {
      localStorage.setItem('favorites', value)
      expect(readJsonPreference('favorites', [])).toEqual([])
    }
    localStorage.setItem('favorites', '[{"id":"sicily"}]')
    expect(readJsonPreference('favorites', [])).toEqual([{ id: 'sicily' }])
  })
})
