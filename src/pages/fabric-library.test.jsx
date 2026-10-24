import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StrictMode } from 'react'
import App from '../App'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
  configurable: true, value() { this.setAttribute('open', '') },
}))
beforeAll(() => Object.defineProperty(HTMLDialogElement.prototype, 'close', {
  configurable: true, value() { this.removeAttribute('open') },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else delete HTMLDialogElement.prototype.showModal
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else delete HTMLDialogElement.prototype.close
})

afterEach(cleanup)
const openLibrary = (lang = 'en') => render(<StrictMode><MemoryRouter initialEntries={[`/${lang}/fabric-library`]}><App /></MemoryRouter></StrictMode>)

it('lists only the requested fabrics and searches without unrelated supplier samples', async () => {
  openLibrary()
  expect(await screen.findByRole('heading', { name: 'Fabric & finish library', exact: true })).toBeTruthy()
  expect(screen.getAllByRole('article')).toHaveLength(5)
  expect(screen.queryByText('LUNGO 003')).toBeNull()
  fireEvent.change(screen.getByLabelText('Search finishes'), { target: { value: 'lungo' } })
  expect(screen.getAllByRole('article')).toHaveLength(1)
  fireEvent.change(screen.getByLabelText('Search finishes'), { target: { value: 'LUZ' } })
  expect(screen.queryAllByRole('article')).toHaveLength(0)
  expect(screen.getByRole('button', { name: 'Clear filters' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
  expect(screen.getAllByRole('article')).toHaveLength(5)
})

it('opens a named sample with its source and a prefilled enquiry', async () => {
  openLibrary()
  const trigger = await screen.findByRole('button', { name: 'View Lungo 002' })
  trigger.focus()
  fireEvent.click(trigger)
  const dialog = screen.getByRole('dialog', { name: 'Lungo 002' })
  expect(dialog.querySelector('img').getAttribute('src')).toBe('/materials/divano/lungo-002.webp')
  expect(screen.getByRole('link', { name: 'Ask about this finish' }).getAttribute('href'))
    .toContain('product=Fabric%20%E2%80%94%20Lungo%20002')
  fireEvent.click(screen.getByRole('button', { name: 'Close sample' }))
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

it('provides a Portuguese library without changing fabric codes', async () => {
  openLibrary('pt')
  expect(await screen.findByRole('heading', { name: 'Biblioteca de tecidos e acabamentos', exact: true })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Ver Lungo 002' })).toBeTruthy()
})

it('separates Able rope from the confirmed Divano aluminium finish names', async () => {
  openLibrary()
  await screen.findByRole('heading', { name: 'Fabric & finish library', exact: true })
  fireEvent.change(screen.getByLabelText('Material'), { target: { value: 'rope' } })
  expect(screen.getAllByRole('article')).toHaveLength(2)
  expect(screen.getByRole('heading', { name: 'Biscuit', exact: true })).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Carbon Grey', exact: true })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: 'Lead Chine', exact: true })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'View Biscuit' }))
  expect(screen.getByRole('dialog').querySelector('img')).toBeNull()
  expect(within(screen.getByRole('dialog')).getByText('Able model and rope reference still to be confirmed.')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close sample' }))
  fireEvent.change(screen.getByLabelText('Material'), { target: { value: 'base' } })
  expect(screen.getAllByRole('article')).toHaveLength(3)
  for (const name of ['White', 'Charcoal', 'Permateak']) expect(screen.getByRole('heading', { name, exact: true })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'View Permateak' }))
  expect(screen.getByRole('dialog').querySelector('img')).toBeNull()
  expect(screen.getByRole('link', { name: 'Ask about this finish' }).getAttribute('href')).toContain('product=Base%20')
})

it.each([
  ['3758', 'Sooty', 'Solids', 'sooty-3758'],
  ['3756', 'Lead Chine', 'Solids', 'lead-chine-3756'],
  ['J349', 'Savane Whisper', 'Savane', 'savane-whisper-j349'],
  ['10040', 'Nature Grey', 'Natté', 'nature-grey-10040'],
])('finds the confirmed Sunbrella fabric %s by code', async (code, name, range, image) => {
  openLibrary()
  await screen.findByRole('heading', { name: 'Fabric & finish library', exact: true })
  fireEvent.change(screen.getByLabelText('Search finishes'), { target: { value: code } })
  expect(screen.getAllByRole('article')).toHaveLength(1)
  fireEvent.click(screen.getByRole('button', { name: `View ${name}` }))
  const dialog = screen.getByRole('dialog')
  expect(within(dialog).getByText(`${range} · ${code}`)).toBeTruthy()
  expect(within(dialog).getByRole('img', { name, exact: true }).getAttribute('src')).toBe(`/materials/sunbrella/${image}.webp`)
  expect(within(dialog).getByRole('link', { name: 'Supplier reference' }).getAttribute('href')).toContain('sunbrella.dickson-constant.com/')
})
