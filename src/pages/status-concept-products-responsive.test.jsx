import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function renderProductsAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('responsive collection presentation', () => {
  it('filters the expanded Sicily pieces, not the parent modular set', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=sicily&type=pouf')
    expect(await screen.findByRole('heading', { name: 'Sicily Ottoman', exact: true })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.queryByRole('heading', { name: 'Sicily Centre Module', exact: true })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters', exact: true }))
    expect(await screen.findByRole('heading', { name: 'Sicily Centre Module', exact: true })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })
  it('opens Macau directly as a product from Lounge', async () => {
    renderProductsAt('/en/products?cat=lounge')
    const collections = await screen.findByRole('region', { name: 'Collections' })
    fireEvent.click(within(collections).getByRole('button', { name: /^Lounge Macau Lounge$/ }))
    expect(await screen.findByRole('region', { name: 'Product gallery' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Macau Lounge', exact: true })).toBeTruthy()
  })

  it('keeps old Macau collection links working as a product page', async () => {
    renderProductsAt('/pt/products?cat=lounge&collection=macau-lounge')
    expect(await screen.findByRole('region', { name: 'Product gallery' })).toBeTruthy()
  })
  it.each(['berlin', 'berlin-modular'])('plays the tailored Berlin replacement, not the rejected film, for %s', async (collection) => {
    renderProductsAt(`/en/products?cat=lounge&collection=${collection}`)
    await screen.findByRole('heading', { name: 'Berlin Modular Sofa', exact: true }, { timeout: 5000 })
    const video = document.querySelector('.berlin-collection-hero video')
    expect(video).toBeTruthy()
    expect(video.querySelector('source').getAttribute('src')).toBe('/videos/berlin-editorial-full-v4.mp4')
    expect(video.getAttribute('poster')).toBe('/videos/berlin-editorial-full-v4-poster.jpg')
    expect(video.autoplay && video.loop && video.muted).toBe(true)
    expect(video.hasAttribute('playsinline')).toBe(true)
    expect(video.hasAttribute('controls')).toBe(false)
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('keeps the corrected Berlin still for reduced-motion visitors', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    renderProductsAt('/en/products?cat=lounge&collection=berlin')
    await screen.findByRole('heading', { name: 'Berlin Modular Sofa', exact: true }, { timeout: 5000 })
    expect(document.querySelector('.berlin-collection-hero video')).toBeNull()
    expect(document.querySelector('.berlin-collection-hero img').getAttribute('src')).toBe('/videos/berlin-editorial-full-v4-poster.jpg')
  })

  it('retains a still poster when reduced motion is preferred', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    renderProductsAt('/en/products?cat=dining&collection=florida')
    await screen.findByRole('heading', { name: 'Florida Dining Set', exact: true }, { timeout: 5000 })
    expect(document.querySelector('.florida-collection-hero video')).toBeNull()
    expect(document.querySelector('.florida-collection-hero img').getAttribute('src')).toBe('/videos/florida-collection-hero-poster.jpg')
  })
  it.each([
    '/en/products?cat=dining&collection=florida',
    '/en/products?cat=lounge&collection=florida',
    '/en/products?cat=dining&collection=florida-dining',
  ])('plays the Florida hero film from %s', async (path) => {
    renderProductsAt(path)
    await screen.findByRole('heading', { name: 'Florida Dining Set', exact: true }, { timeout: 5000 })
    const video = document.querySelector('.florida-collection-hero video')
    expect(video).toBeTruthy()
    expect(video.querySelector('source').getAttribute('src')).toBe('/videos/florida-collection-hero.mp4')
    expect(video.getAttribute('poster')).toBe('/videos/florida-collection-hero-poster.jpg')
    expect(video.autoplay && video.loop && video.muted).toBe(true)
    expect(video.hasAttribute('playsinline')).toBe(true)
    expect(video.hasAttribute('controls')).toBe(false)
  })
  it.each([
    '/en/products?cat=lounge&collection=florida',
    '/en/products?cat=dining&collection=florida',
    '/en/products?cat=dining&collection=florida-dining',
  ])('opens only the five reference Florida products from %s', async (path) => {
    renderProductsAt(path)
    await screen.findByRole('heading', { name: 'Florida Dining Set', exact: true })
    expect(screen.getAllByRole('article')).toHaveLength(5)
    expect(screen.queryByRole('heading', { name: /Florida Modular Sofa/ })).toBeNull()
  })

  it.each([
    ['florida-dining', 1], ['florida-dining-armchair', 1],
    ['florida-dining-table-with-miami-dining-armchairs', 2],
    ['florida-dining-table-with-orlando-dining-armchairs', 1], ['florida-dining-set', 1],
  ])('keeps reference finishes, not hover settings, in the gallery for %s', async (id, count) => {
    renderProductsAt(`/en/product/${id}`)
    const gallery = await screen.findByRole('region', { name: 'Product gallery' })
    expect(within(gallery).getAllByRole('button', { name: /^View image / })).toHaveLength(count)
    expect(gallery.querySelector('img[src$="-minimal.webp"]')).toBeNull()
  })

  it('redirects a retired Florida sofa URL to the reference Dining collection', async () => {
    renderProductsAt('/en/product/local-product-76d9292a9635')
    await screen.findByRole('heading', { name: 'Florida Dining Set', exact: true })
    expect(screen.getAllByRole('article')).toHaveLength(5)
  })
  it.each(['lounge', 'sunlounger'])('uses the neutral Bali cover in the %s collection grid', async (category) => {
    renderProductsAt(`/en/products?cat=${category}`)
    const collections = await screen.findByRole('region', { name: 'Collections' })
    const cover = within(collections).getByRole('button', { name: /^Collection Bali 3 products$/i })
    expect(cover.querySelector('img').getAttribute('src')).toBe('/product-images/bali-reference-v2/collection-cover-neutral-v4.webp')
  })
  it('shows a touch-friendly setting toggle for products with a lifestyle image', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=miami')
    await screen.findAllByRole('article')
    const card = screen.getAllByRole('article').find((item) => item.querySelector('.rd-product-image-hero'))
    const toggle = within(card).getByRole('button', { name: 'View in setting' })

    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(toggle)
    expect(card.classList.contains('mobile-lifestyle-visible')).toBe(true)
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
    expect(toggle.textContent).toBe('View studio photo')

    fireEvent.click(toggle)
    expect(card.classList.contains('mobile-lifestyle-visible')).toBe(false)
    expect(toggle.textContent).toBe('View in setting')
  })

  it.each([
    ['bali-lounge-2', 'Bali Lounge Armchair & Footstool'],
    ['bali', 'Bali Sun Lounger'],
    ['bali-double-sun-lounger', 'Bali Double Sun Lounger'],
  ])('opens the curated product page for %s', async (id, name) => {
    renderProductsAt(`/en/product/${id}`)
    expect(await screen.findByRole('heading', { level: 1, name })).toBeTruthy()
    const gallery = screen.getByRole('region', { name: 'Product gallery' })
    expect(within(gallery).getAllByRole('button', { name: /^View image / })).toHaveLength(1)
    expect(gallery.querySelector('img[src$="-minimal.webp"]')).toBeNull()
  })

  it('keeps Bali setting photos hover-only, without an extra toggle', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=bali')
    await screen.findByRole('heading', { name: 'Bali Sun Lounger' })
    for (const card of screen.getAllByRole('article')) {
      expect(card.classList.contains('hover-only-setting')).toBe(true)
      expect(card.querySelector('.rd-product-image-hero')).toBeTruthy()
      expect(within(card).queryByRole('button', { name: 'View in setting' })).toBeNull()
    }
  })

  it('keeps retired Bali links useful by opening the corrected collection', async () => {
    renderProductsAt('/en/product/local-product-curated-bali-modular-sofa-taupe')
    expect(await screen.findByRole('heading', { name: 'Bali Lounge Armchair & Footstool' })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('heading', { name: 'Bali Modular Sofa Taupe' })).toBeNull()
  })

  it('counts the three curated Bali models when searching the collection', async () => {
    renderProductsAt('/en/products?q=Bali')
    expect(await screen.findByRole('button', { name: /^All\s*3$/ })).toBeTruthy()
    expect(within(screen.getByRole('region', { name: 'Matching collection' })).getByText('3 products · Open collection')).toBeTruthy()
  })

  it('normalizes the ottoman image scale against the other Sicily pieces', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=sicily')
    const heading = await screen.findByRole('heading', { name: 'Sicily Ottoman' })
    const card = heading.closest('article')

    expect(card.classList.contains('image-scale-adjusted')).toBe(true)
    expect(card.style.getPropertyValue('--product-image-scale')).toBe('0.82')
  })
})
