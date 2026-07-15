import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

// App renders <Routes> and brings its own providers, but expects an ambient
// Router (main.jsx supplies HashRouter). Tests supply MemoryRouter instead.
// Pages are React.lazy, so assertions use findBy* to await the chunk.
function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

afterEach(() => {
  cleanup()
  document.querySelectorAll('#root').forEach((n) => n.remove())
})

describe('routing', () => {
  it('mounts the homepage at the root', async () => {
    renderAt('/')
    expect(await screen.findAllByText(/TVS/i)).not.toHaveLength(0)
  })

  it('mounts the contact page under /en', async () => {
    renderAt('/en/contact')
    expect(await screen.findByText('Tell us what you need')).toBeTruthy()
  })

  it('mounts the contact page under /pt', async () => {
    renderAt('/pt/contact')
    // The heading translates to PT via TranslationLayer; assert the page mounted
    // by its stable structure rather than copy.
    expect(await screen.findAllByText(/Almancil/i)).not.toHaveLength(0)
  })

  it('opens product search from the public header', async () => {
    renderAt('/en')
    fireEvent.click(await screen.findByRole('button', { name: 'Search products' }))

    expect(await screen.findByLabelText('Search products')).toBeTruthy()
  })

  it('shows a full product results page from a search query', async () => {
    renderAt('/en/products?q=vita%20sfera')

    expect(await screen.findByRole('heading', { name: 'Results for "vita sfera"' })).toBeTruthy()
    expect(await screen.findByText('VITA(R) Sfera')).toBeTruthy()
  })
})
