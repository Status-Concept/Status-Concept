import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react'
import { vi } from 'vitest'
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
  it('keeps the kitchen range and Browse by choice together when searching', async () => {
    renderAt('/en/products?cat=kitchen&collection=carbon-line-teak&subcat=accessories&q=cabinet')
    const articles = await screen.findAllByRole('article')
    expect(articles.length).toBeGreaterThan(0)
    expect(articles.every((article) => article.textContent.includes('Teak Carbon Line'))).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Teak', exact: true }))
    expect(screen.getByRole('button', { name: 'Attachments & accessories', exact: true }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getAllByRole('article').every((article) => !article.textContent.includes('Teak Carbon Line'))).toBe(true)
  })

  it('loads the image library in batches and resets the batch when filtering', async () => {
    renderAt('/en/images')
    const gallery = await screen.findByRole('region', { name: 'Image gallery' })
    expect(within(gallery).getAllByRole('article')).toHaveLength(36)
    fireEvent.click(screen.getByRole('button', { name: 'Load more images' }))
    expect(within(gallery).getAllByRole('article')).toHaveLength(72)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Sicily' } })
    expect(within(gallery).getAllByRole('article').length).toBeLessThanOrEqual(36)
  })
  it('mounts the homepage at the root', async () => {
    renderAt('/')
    expect(await screen.findAllByText(/TVS/i)).not.toHaveLength(0)
  })

  it('mounts the contact page under /en', async () => {
    renderAt('/en/contact')
    expect(await screen.findByText('Tell us what you need')).toBeTruthy()
    expect(screen.getByLabelText('Name').tagName).toBe('INPUT')
    expect(screen.getByLabelText('Email').type).toBe('email')
    expect(screen.getByLabelText('Phone').type).toBe('tel')
    expect(screen.getByLabelText('Interest').tagName).toBe('SELECT')
    expect(screen.getByLabelText('Message').tagName).toBe('TEXTAREA')
  })

  it('mounts the contact page under /pt', async () => {
    renderAt('/pt/contact')
    // The heading translates to PT via TranslationLayer; assert the page mounted
    // by its stable structure rather than copy.
    expect(await screen.findAllByText(/Almancil/i)).not.toHaveLength(0)
  })

  it('resolves disabled future-phase links without a 404', async () => {
    renderAt('/en/projects')
    expect(await screen.findByText('This feature is planned for a future phase.')).toBeTruthy()

    cleanup()
    renderAt('/en/after-care')
    expect(await screen.findByText('This feature is planned for a future phase.')).toBeTruthy()
  })

  it('keeps disabled accounts out of the public registration flow', async () => {
    renderAt('/en/register')
    expect(await screen.findByText('This feature is planned for a future phase.')).toBeTruthy()
    expect(screen.queryByText('Create your client account')).toBeNull()
  })

  it('focuses content without changing the route when using the skip link', async () => {
    const { container } = renderAt('/en/contact')
    await screen.findByText('Tell us what you need')
    const content = container.querySelector('#main')
    content.scrollIntoView = vi.fn()
    const skip = screen.getByText('Skip to content')
    expect(fireEvent.click(skip)).toBe(false)
    expect(document.activeElement).toBe(content)
    expect(content.scrollIntoView).toHaveBeenCalled()
  })

  it('does not expose unknown public product ids', async () => {
    renderAt('/en/product/private-draft-that-must-not-exist')
    expect(await screen.findByText('This page does not exist.')).toBeTruthy()
  })

  it('keeps carpets, decor and statues visible with their own category photos', async () => {
    const { container } = renderAt('/en/products')
    expect(await screen.findByRole('heading', { name: 'Products', level: 1 })).toBeTruthy()

    const carousel = container.querySelector('.cat-carousel')
    expect(carousel).toBeTruthy()
    const categoryImages = []
    for (const name of ['Carpets', 'Decor', 'Statues']) {
      const category = within(carousel).getByRole('button', { name })
      const image = category.querySelector('img')
      expect(image).toBeTruthy()
      expect(image.getAttribute('src')).toContain(`category-${name.toLowerCase()}-studio`)
      categoryImages.push(image.getAttribute('src'))
    }
    expect(new Set(categoryImages).size).toBe(3)
    expect(within(carousel).getByRole('button', { name: 'Lounge' }).querySelector('img')).toBeTruthy()
  })

  it('keeps the statues URL available with its own category image', async () => {
    const { container } = renderAt('/en/products?cat=statues')
    expect(await screen.findByRole('heading', { name: 'Statues', level: 1 })).toBeTruthy()
    expect(container.querySelector('.prod-banner img')?.getAttribute('src')).toContain('category-statues-studio')
  })
})
