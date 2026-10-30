import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it.each(['en', 'pt'])('uses the Antigua film on the %s collection page', async (lang) => {
  render(<MemoryRouter initialEntries={[`/${lang}/products?cat=lounge&collection=antigua`]}><App /></MemoryRouter>)
  await screen.findAllByRole('article')
  const video = document.querySelector('.collection-hero-banner video')
  expect(video?.querySelector('source').getAttribute('src')).toBe('/videos/antigua-collection-hero.mp4')
  expect(video.getAttribute('poster')).toBe('/videos/antigua-collection-hero-poster.jpg')
  expect(video.closest('section').style.aspectRatio).toBe('2068 / 1000')
  expect(video.autoplay && video.loop && video.muted && video.hasAttribute('playsinline')).toBe(true)
})

it('uses the Antigua poster for reduced motion', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  render(<MemoryRouter initialEntries={['/en/products?cat=lounge&collection=antigua']}><App /></MemoryRouter>)
  await screen.findAllByRole('article')
  expect(document.querySelector('.collection-hero-banner video')).toBeNull()
  expect(document.querySelector('.collection-hero-banner img').getAttribute('src')).toBe('/videos/antigua-collection-hero-poster.jpg')
})

it.each(['Antigua', 'Oxford'])('uses the plaster-wall studio cover for the %s collection card', async (name) => {
  render(<MemoryRouter initialEntries={['/en/products?cat=lounge&browse=collections']}><App /></MemoryRouter>)
  const card = await screen.findByRole('link', { name: new RegExp(name) })
  expect(card.querySelector('img').getAttribute('src')).toBe(`/product-images/${name.toLowerCase()}-collection-cover-studio.webp`)
})
