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
  it('keeps Duna visible in Lounge and delists Macau', async () => {
    renderProductsAt('/en/products?cat=lounge')
    const product = await screen.findByRole('heading', { name: 'Duna', exact: true })
    expect(screen.queryByRole('heading', { name: 'Macau Lounge', exact: true })).toBeNull()
    expect(screen.queryByRole('region', { name: 'Collections' })).toBeNull()
    fireEvent.click(within(product).getByRole('link'))
    expect(await screen.findByRole('heading', { name: 'Duna', level: 1, exact: true })).toBeTruthy()
  })

  it('separates editorial collections from single products and product filters', async () => {
    renderProductsAt('/en/products?cat=lounge')
    fireEvent.click(await screen.findByRole('link', { name: 'Collections', exact: true }))
    const collections = await screen.findByRole('region', { name: 'Collections' })
    expect(within(collections).getByRole('heading', { name: 'Sicily', exact: true })).toBeTruthy()
    expect(within(collections).queryByText('Macau Lounge')).toBeNull()
    expect(within(collections).queryByText('BARCELONA')).toBeNull()
    expect(within(collections).queryByRole('heading', { name: /maya|bermuda/i })).toBeNull()
    expect(within(collections).queryByText(/\d+ products/)).toBeNull()
    expect(within(collections).queryByText('Explore collection')).toBeNull()
    expect(screen.queryByText('Explore families and coordinated spaces.')).toBeNull()
    expect(screen.queryByRole('combobox', { name: 'Collection' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Share selection' })).toBeNull()
    expect(screen.queryByRole('group', { name: 'Filter by product type or material' })).toBeNull()
    fireEvent.click(within(collections).getByRole('link', { name: /Sicily/ }))
    expect(await screen.findByRole('heading', { name: 'Sicily Centre Module', exact: true })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('shows applied filters separately and clears only the chosen filter', async () => {
    renderProductsAt('/en/products?cat=lounge&type=armchair&subcat=aluminium')
    const active = await screen.findByRole('group', { name: 'Applied filters' })
    expect(screen.queryByRole('combobox', { name: 'Product type' })).toBeNull()
    fireEvent.click(within(active).getByRole('button', { name: 'Remove filter: Armchairs' }))
    expect(within(active).queryByRole('button', { name: 'Remove filter: Armchairs' })).toBeNull()
    expect(within(active).getByRole('button', { name: 'Remove filter: Aluminium' })).toBeTruthy()
    fireEvent.click(within(active).getByRole('button', { name: 'Clear filters', exact: true }))
    expect(screen.queryByRole('group', { name: 'Applied filters' })).toBeNull()
  })

  it('opens inline filters, applies a selection immediately and returns focus on Escape', async () => {
    renderProductsAt('/en/products?cat=lounge');
    const trigger = await screen.findByRole('button', { name: 'Filters', exact: true });
    expect(screen.queryByRole('combobox', { name: 'Product type' })).toBeNull();
    fireEvent.click(trigger);
    const type = screen.getByRole('combobox', { name: 'Product type' });
    expect(type.closest('.catalogue-bar')).toBe(trigger.closest('.catalogue-bar'));
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.change(type, { target: { value: 'armchair' } });
    expect(screen.getByRole('button', { name: 'Remove filter: Armchairs' })).toBeTruthy();
    type.focus();
    fireEvent.keyDown(type, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    expect(screen.queryByRole('combobox', { name: 'Product type' })).toBeNull();
  })

  it('filters a collection on the category grid without navigating to its editorial page', async () => {
    renderProductsAt('/en/products?cat=lounge&family=berlin')
    expect(await screen.findByRole('button', { name: 'Remove filter: Berlin' })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Lounge', level: 1 })).toBeTruthy()
  })

  it.each(['macau-lounge', 'barcelona'])('returns old %s collection links to active Lounge products', async (collection) => {
    renderProductsAt(`/en/products?cat=lounge&collection=${collection}`)
    expect(await screen.findByRole('heading', { name: 'Duna', exact: true })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /macau|barcelona/i })).toBeNull()
  })
  it('returns the product rather than an intermediary collection card for singleton searches', async () => {
    renderProductsAt('/en/products?q=Duna')
    expect(await screen.findByRole('heading', { name: 'Duna', exact: true })).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Matching collection' })).toBeNull()
  })
  it.each(['berlin', 'berlin-modular'])('plays the tailored Berlin replacement, not the rejected film, for %s', async (collection) => {
    renderProductsAt(`/en/products?cat=lounge&collection=${collection}`)
    await screen.findByRole('heading', { name: 'Berlin Modular Sofa', exact: true }, { timeout: 5000 })
    const video = document.querySelector('.berlin-collection-hero video')
    expect(video).toBeTruthy()
    expect(video.querySelector('source').getAttribute('src')).toBe('/videos/berlin-collection-hero-20261105.mp4')
    expect(video.getAttribute('poster')).toBe('/videos/berlin-collection-hero-20261105-poster.jpg')
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
    expect(document.querySelector('.berlin-collection-hero img').getAttribute('src')).toBe('/videos/berlin-collection-hero-20261105-poster.jpg')
  })

  it.each([
    '/en/products?cat=dining&collection=florida',
    '/en/products?cat=lounge&collection=florida',
    '/en/products?cat=dining&collection=florida-dining',
    '/en/product/local-product-76d9292a9635',
  ])('redirects legacy Florida catalogue links to active Dining products from %s', async (path) => {
    renderProductsAt(path)
    expect(await screen.findByRole('heading', { name: /Lisbon Dining Table Permateak/i })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /Florida/i })).toBeNull()
    expect(document.querySelector('.florida-collection-hero')).toBeNull()
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

  it.each(['lounge', 'sunlounger'])('uses the neutral Bali cover in the %s collection grid', async (category) => {
    renderProductsAt(`/en/products?cat=${category}&browse=collections`)
    const collections = await screen.findByRole('region', { name: 'Collections' })
    const cover = within(collections).getByRole('link', { name: 'Bali', exact: true })
    expect(cover.querySelector('img').getAttribute('src')).toBe('/product-images/bali-reference-v2/collection-cover-neutral-v4.webp')
  })
  it('keeps individual product cards on white without lifestyle swaps or shrinking transforms', async () => {
    renderProductsAt('/en/products?q=Miami%20Sofa&cat=lounge')
    const cards = await screen.findAllByRole('article')
    expect(screen.queryByRole('button', { name: 'View in setting' })).toBeNull()
    for (const card of cards) {
      expect(card.classList.contains('product-white-card')).toBe(true)
      expect(card.querySelector('.rd-product-image-hero')).toBeNull()
      expect(card.querySelector('.rd-product-media img').getAttribute('src')).toContain('/cards-white-v1/')
      expect(card.querySelector('.rd-product-media img').style.transform).toBe('')
    }
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

  it('keeps Bali product cards on white rather than swapping to scenery', async () => {
    renderProductsAt('/en/products?cat=lounge&collection=bali')
    await screen.findByRole('heading', { name: 'Bali Sun Lounger' })
    for (const card of screen.getAllByRole('article')) {
      expect(card.classList.contains('product-white-card')).toBe(true)
      expect(card.querySelector('.rd-product-image-hero')).toBeNull()
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

    expect(card.classList.contains('image-scale-adjusted')).toBe(false)
    expect(card.querySelector('img').getAttribute('src')).toContain('/cards-white-v1/sicily-ottoman.webp')
  })
})
