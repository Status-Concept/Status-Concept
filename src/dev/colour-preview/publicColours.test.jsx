import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { publicSearchProducts } from '../../data/productCatalog'
import { localColourPages } from './targets'

afterEach(cleanup)

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
