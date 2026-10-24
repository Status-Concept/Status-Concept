import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { publicSearchProducts } from '../../data/productCatalog'
import { getColourTarget, localColourPages } from './targets'
import { fabrics } from '../../data/fabrics'

afterEach(cleanup)

it.each([
  '/en/product/berlin-modular-sofa', '/en/product/sicily-modular-set?part=centre',
  '/en/colour-preview?model=berlin', '/pt/colour-preview?model=sicily',
])('uses the central supplier sample images for the fabric buttons at %s', async path => {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
  const group = await screen.findByRole('group', { name: path.startsWith('/pt/') ? 'Cor do tecido' : 'Fabric colour' })
  const buttons = [...group.querySelectorAll('button')]
  expect(buttons).toHaveLength(3)
  for (const button of buttons) {
    const fabric = fabrics.find(item => item.name === button.textContent.trim())
    const sample = button.querySelector('img.colour-studio-chip')
    expect(sample, fabric.name).not.toBeNull()
    expect(sample.getAttribute('src')).toBe(fabric.image)
    expect(sample.getAttribute('alt')).toBe('')
    expect(sample.getAttribute('aria-hidden')).toBe('true')
  }
})

it('offers both fabric finishes on the identified Luanda armchair without changing fixed Luanda combinations', async () => {
  for (const id of ['local-product-0b480251a4ef', 'local-product-7794651d9fa7', 'local-product-cca8c97d28dc', 'local-product-2b4c98b554df']) expect(getColourTarget(id)).toBeNull()
  render(<MemoryRouter initialEntries={['/en/product/local-product-79d24eb70f26']}><App /></MemoryRouter>)
  const lead = await screen.findByRole('button', { name: 'Lead Chine', exact: true })
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  const original = image.getAttribute('src')
  fireEvent.click(lead)
  expect(image.getAttribute('src')).toContain('luanda-armchair-lead-chine-v1.webp')
  fireEvent.click(screen.getByRole('button', { name: 'Nature Grey', exact: true }))
  expect(image.getAttribute('src')).toContain('luanda-armchair-nature-grey-v1.webp')
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(image.getAttribute('src')).toBe(original)
})

it('makes every approved configuration discoverable exactly once', () => {
  for (const id of Object.keys(localColourPages)) {
    const products = publicSearchProducts.filter(product => product.id === id)
    expect(products, id).toHaveLength(1)
    expect(products[0].images.length, id).toBeGreaterThan(0)
    expect(products[0].img, id).toBeTruthy()
  }
})

it('carries independently selected fabric and frame finishes into enquiries without recolouring the frame', async () => {
  render(<MemoryRouter initialEntries={['/en/product/gibraltar']}><App /></MemoryRouter>)
  const base = await screen.findByRole('combobox', { name: 'Frame finish' })
  expect([...base.options].map(option => option.value)).toEqual(['', 'White', 'Charcoal', 'Permateak'])
  fireEvent.click(await screen.findByRole('button', { name: 'Nature Grey', exact: true }))
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  const fabricImage = image.getAttribute('src')
  fireEvent.change(base, { target: { value: 'Permateak' } })
  expect(image.getAttribute('src')).toBe(fabricImage)
  expect(decodeURIComponent(screen.getByRole('link', { name: 'WhatsApp us' }).getAttribute('href'))).toContain('Fabric: Nature Grey; Frame: Permateak')
  expect(screen.getByText('Frame finish selection is included in your enquiry; the image retains its reference frame.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(decodeURIComponent(screen.getByRole('link', { name: 'WhatsApp us' }).getAttribute('href'))).not.toContain('Nature Grey')
  expect(base.value).toBe('Permateak')
})
