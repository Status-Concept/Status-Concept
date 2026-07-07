// jsdom lacks a few browser APIs the app touches on mount (scroll-animation
// observers, media queries). Stub them so component mounts don't throw.
import { vi } from 'vitest'

class IONoop {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
globalThis.IntersectionObserver = globalThis.IntersectionObserver || IONoop
globalThis.ResizeObserver = globalThis.ResizeObserver || IONoop

if (!globalThis.matchMedia) {
  globalThis.matchMedia = () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  })
}

// jsdom ships a scrollTo that logs "Not implemented" — replace it outright.
globalThis.scrollTo = vi.fn()
if (globalThis.window) globalThis.window.scrollTo = globalThis.scrollTo
