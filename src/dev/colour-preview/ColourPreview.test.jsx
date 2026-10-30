import { afterEach, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { colourModels, colourConfigurations } from './variants'
import { getColourTarget, getLocalColourProduct } from './targets'
import { demoProductIds } from '../../data/demoProducts'
import { publishedCorrectionProducts, publicSearchProducts } from '../../data/productCatalog'
import { fabrics } from '../../data/fabrics'

afterEach(cleanup)

it('uses revised studio originals and full-upholstery corrections for the affected configurations', () => {
  for (const key of ['antigua', 'antigua-xl', 'oxford', 'oxford-modular', 'oxford-daybed', 'gibraltar', 'crete']) {
    const configuration = colourConfigurations.find(item => item.key === key)
    const revision = key === 'gibraltar' ? 'v4' : 'v3'
    expect(configuration.original).toBe(`/src/dev/colour-preview/images/${key}-original-${revision}.webp`)
    expect(configuration.colours.every(colour => colour.image?.includes(`-${revision}.webp`))).toBe(true)
  }
  for (const key of ['luanda', 'sicily', 'sicily-centre']) {
    expect(colourConfigurations.find(item => item.key === key).colours.every(colour => colour.image?.includes('-v3.webp'))).toBe(true)
  }
})

it('does not restart loading when the already-loaded colour is clicked again', async () => {
  await openPreview('?model=berlin')
  const button = screen.getByRole('button', { name: 'Sooty', exact: true })
  fireEvent.click(button)
  const image = screen.getByRole('img', { name: 'Berlin — Sooty' })
  fireEvent.load(image)
  expect(image.parentElement.getAttribute('aria-busy')).toBe('false')
  fireEvent.click(button)
  expect(image.parentElement.getAttribute('aria-busy')).toBe('false')
  expect(screen.queryByText('Loading…')).toBeNull()
})

it('only exposes the explicit local page list, including for inherited object keys', () => {
  for (const id of ['toString', '__proto__', 'constructor', 'fiji-divano', 'ibiza-able', 'cannes', 'unknown']) {
    expect(getLocalColourProduct(id)).toBeNull()
  }
})

it('links the Portuguese studio to its local product page', async () => {
  render(<MemoryRouter initialEntries={['/pt/colour-preview?model=antigua&configuration=antigua-xl']}><App /></MemoryRouter>)
  const link = await screen.findByRole('link', { name: 'Ver página local do produto' })
  expect(link.getAttribute('href')).toBe('/pt/product/antigua-xl-lounge')
  fireEvent.click(link)
  expect(await screen.findByRole('combobox', { name: 'Acabamento da estrutura' })).toBeTruthy()
  fireEvent.click(await screen.findByRole('button', { name: 'Lead Chine', exact: true }))
  await waitFor(() => expect(document.querySelector('.rd-desktop-main-image img').getAttribute('src')).toContain('antigua-xl-lead-chine-v3.webp'))
})

it.each([
  ['antigua-lounge', 'antigua', 'Antigua Sofa Set'],
  ['antigua-xl-lounge', 'antigua-xl', 'Antigua Corner Sofa'],
  ['oxford-2', 'oxford', 'Oxford'],
  ['oxford-modular-sofa', 'oxford-modular', 'Oxford Modular Sofa'],
  ['oxford', 'oxford-daybed', 'Oxford'],
  ['gibraltar', 'gibraltar', 'Gibraltar Double Sun Lounger'],
  ['crete-lounger', 'crete', 'Crete Day Bed'],
])('makes the approved configuration %s publicly discoverable with a working picker', async (id, key, name) => {
  expect(demoProductIds.has(id)).toBe(false)
  expect(publishedCorrectionProducts.some(product => product.id === id)).toBe(false)
  expect(publicSearchProducts.filter(product => product.id === id)).toHaveLength(1)
  render(<MemoryRouter initialEntries={[`/en/product/${id}`]}><App /></MemoryRouter>)
  expect(await screen.findByRole('heading', { name, exact: true, level: 1 })).toBeTruthy()
  expect(await screen.findByRole('combobox', { name: 'Frame finish' })).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Dimensions', exact: true })).toBeNull()
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  const original = image.getAttribute('src')
  fireEvent.click(await screen.findByRole('button', { name: 'Lead Chine', exact: true }))
  await waitFor(() => expect(image.getAttribute('src')).toContain(`${key}-lead-chine-${key === 'gibraltar' ? 'v4' : 'v3'}.webp`))
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(image.getAttribute('src')).toBe(original)
})
const openPreview = async (query = '') => {
  render(<MemoryRouter initialEntries={[`/en/colour-preview${query}`]}><App /></MemoryRouter>)
  await screen.findByRole('img', { name: / — Original$/ })
}

it('uses only the requested models, excludes Cannes, Fiji and Ibiza, and includes universal Lead Chine', () => {
  expect(colourModels).toHaveLength(8)
  expect(colourModels.some(model => /cannes|fiji|ibiza/i.test(model.name))).toBe(false)
  for (const model of colourModels) {
    expect(model.colours.some(colour => colour.name === 'Lead Chine')).toBe(true)
    expect(model.colours.every(colour => colour.image)).toBe(true)
  }
  expect(colourConfigurations).toHaveLength(22)
  expect(colourConfigurations.flatMap(target => target.colours)).toHaveLength(56)
  expect(colourConfigurations.every(target => target.colours.every(colour => colour.image))).toBe(true)
  for (const colour of colourConfigurations.flatMap(target => target.colours)) {
    expect(colour.swatch).toBe(fabrics.find(fabric => fabric.name === colour.name).image)
  }
})

it('resets to the correct original when choosing another configuration of the same model', async () => {
  await openPreview('?model=bali')
  fireEvent.click(screen.getByRole('button', { name: 'Sooty', exact: true }))
  fireEvent.change(screen.getByLabelText('Configuration'), { target: { value: 'bali-double' } })
  const image = await screen.findByRole('img', { name: 'Bali · Double sun lounger — Original' })
  expect(image.getAttribute('src')).toContain('/double-studio.webp')
  fireEvent.click(screen.getByRole('button', { name: 'Nature Grey', exact: true }))
  expect(screen.getByRole('img', { name: 'Bali · Double sun lounger — Nature Grey' }).getAttribute('src')).toContain('bali-double-nature-grey.webp')
})

it.each([
  ['antigua', 'antigua-xl', 'Antigua · XL corner sofa'],
  ['oxford', 'oxford-modular', 'Oxford · Modular sofa'],
  ['oxford', 'oxford-daybed', 'Oxford · Daybed'],
])('previews the source-catalogue configuration %s/%s without publishing a product route', async (model, key, name) => {
  await openPreview(`?model=${model}&configuration=${key}`)
  const original = screen.getByRole('img', { name: `${name} — Original` }).getAttribute('src')
  fireEvent.click(screen.getByRole('button', { name: 'Lead Chine', exact: true }))
  expect(screen.getByRole('img', { name: `${name} — Lead Chine` }).getAttribute('src')).toContain(`${key}-lead-chine-v3.webp`)
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(screen.getByRole('img', { name: `${name} — Original` }).getAttribute('src')).toBe(original)
  expect(getColourTarget(key)).toBeNull()
})

it('keeps the Sicily centre module instead of substituting a corner module on colour selection', async () => {
  render(<MemoryRouter initialEntries={['/en/product/sicily-modular-set?part=centre']}><App /></MemoryRouter>)
  const button = await screen.findByRole('button', { name: 'Lead Chine', exact: true })
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  expect(image.getAttribute('src')).toContain('/sicily-centre.jpg')
  fireEvent.click(button)
  await waitFor(() => expect(image.getAttribute('src')).toContain('sicily-centre-lead-chine-v3.webp'))
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(image.getAttribute('src')).toContain('/sicily-centre.jpg')
})

it.each([
  ['berlin', 'berlin-set'], ['luanda', 'luanda-lounge'], ['bali', 'bali-single'], ['bali-double-sun-lounger', 'bali-double'],
])('uses its own matching image for product %s', async (productId, prefix) => {
  render(<MemoryRouter initialEntries={[`/en/product/${productId}`]}><App /></MemoryRouter>)
  fireEvent.click(await screen.findByRole('button', { name: 'Lead Chine', exact: true }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img').getAttribute('src')).toContain(`${prefix}-lead-chine${prefix === 'luanda-lounge' ? '-v3' : ''}.webp`))
})

it('does not apply the main image colours to unprepared views, excluded models or fixed colour combinations', () => {
  expect(getColourTarget('berlin', null, 1)?.key).toBe('berlin')
  expect(getColourTarget('berlin', null, 2)?.key).toBe('berlin-armchair')
  expect(getColourTarget('berlin', null, 3)).toBeNull()
  expect(getColourTarget('berlin-modular-sofa', null, 1)?.key).toBe('berlin-l')
  expect(getColourTarget('berlin-modular-sofa', null, 2)?.key).toBe('berlin-u')
  expect(getColourTarget('berlin-modular-sofa', null, 3)?.key).toBe('berlin-grey-set')
  expect(getColourTarget('sicily-modular-set', 'centre')?.key).toBe('sicily-centre')
  expect(getColourTarget('sicily-modular-set', 'unknown')).toBeNull()
  for (const id of ['ibiza-able', 'fiji-divano', 'cannes', 'local-product-7794651d9fa7']) expect(getColourTarget(id)).toBeNull()
})

it.each([
  ['berlin-modular-sofa', 2, 'berlin-l'],
  ['berlin-modular-sofa', 3, 'berlin-u'],
  ['berlin-modular-sofa', 4, 'berlin-grey-set'],
  ['berlin', 3, 'berlin-armchair'],
])('restores the selected view of %s after colouring gallery image %s', async (id, view, key) => {
  render(<MemoryRouter initialEntries={[`/en/product/${id}`]}><App /></MemoryRouter>)
  fireEvent.click(await screen.findByRole('button', { name: `View image ${view}`, exact: true }))
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  const original = image.getAttribute('src')
  fireEvent.click(await screen.findByRole('button', { name: 'Nature Grey', exact: true }))
  await waitFor(() => expect(image.getAttribute('src')).toContain(`${key}-nature-grey.webp`))
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(image.getAttribute('src')).toBe(original)
  expect(screen.getByRole('button', { name: `View image ${view}`, exact: true }).getAttribute('aria-pressed')).toBe('true')
})

it('switches the image without changing the product or original and can restore the original', async () => {
  await openPreview()
  const original = screen.getByRole('img', { name: 'Berlin — Original' }).getAttribute('src')
  fireEvent.click(screen.getByRole('button', { name: 'Sooty', exact: true }))
  const image = await screen.findByRole('img', { name: 'Berlin — Sooty' })
  fireEvent.load(image)
  expect(image.getAttribute('src')).not.toBe(original)
  expect(screen.getByRole('button', { name: 'Sooty', exact: true }).getAttribute('aria-pressed')).toBe('true')
  expect(screen.getByRole('heading', { name: 'Berlin', exact: true })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  expect(screen.getByRole('img', { name: 'Berlin — Original' }).getAttribute('src')).toBe(original)
})

it('resets the selected colour on model changes and handles a failed variant image', async () => {
  await openPreview('?model=bali')
  fireEvent.click(screen.getByRole('button', { name: 'Sooty', exact: true }))
  fireEvent.error(screen.getByRole('img', { name: 'Bali — Sooty' }))
  expect(screen.getByRole('alert')).toBeTruthy()
  expect(screen.getByRole('img', { name: 'Bali — Original' })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Model'), { target: { value: 'crete' } })
  await waitFor(() => expect(screen.getByRole('img', { name: 'Crete Daybed — Original' })).toBeTruthy())
  expect(screen.queryByRole('button', { name: 'Sooty', exact: true })).toBeNull()
})

it('also switches the main product gallery in the local Berlin product page', async () => {
  render(<MemoryRouter initialEntries={['/en/product/berlin-modular-sofa']}><App /></MemoryRouter>)
  const button = await screen.findByRole('button', { name: 'Sooty', exact: true })
  const image = screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img')
  const original = image.getAttribute('src')
  fireEvent.click(button)
  await waitFor(() => expect(image.getAttribute('src')).toContain('berlin-sooty.webp'))
  fireEvent.error(image)
  await waitFor(() => expect(image.getAttribute('src')).toBe(original))
  expect(screen.getByRole('alert')).toBeTruthy()
  fireEvent.click(button)
  fireEvent.click(screen.getByRole('button', { name: 'Original', exact: true }))
  await waitFor(() => expect(image.getAttribute('src')).toBe(original))
})

it('keeps Sicily gallery views available when a fabric is selected', async () => {
  render(<MemoryRouter initialEntries={['/en/product/sicily-modular-set']}><App /></MemoryRouter>)
  fireEvent.click(await screen.findByRole('button', { name: 'Lungo 002', exact: true }))
  expect(screen.getByRole('button', { name: 'View image 3' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'View image 2' }))
  expect(screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img').getAttribute('src')).toContain('sicily-centre-lungo-002')
})
