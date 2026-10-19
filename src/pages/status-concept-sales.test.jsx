import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { existsSync } from 'node:fs'
import App from '../App'
import offers from '../data/sales2026.json'
import { salesEnquiry, salesPrice } from '../utils/salesEnquiry'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
beforeAll(() => Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
  configurable: true, value() { this.setAttribute('open', '') },
}))
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else delete HTMLDialogElement.prototype.showModal
})

afterEach(cleanup)

describe('Sales catalogue', () => {
  it('retains all 57 source offers, valid prices, assets and quantity options', () => {
    expect(offers).toHaveLength(57)
    expect(new Set(offers.map(offer => offer.id)).size).toBe(57)
    expect(offers.filter(offer => !offer.image).map(offer => offer.page)).toEqual([44])
    for (const offer of offers) {
      if (offer.image) expect(existsSync(`public${offer.image}`)).toBe(true)
      expect(offer.details.length).toBeGreaterThan(0)
      for (const option of offer.options) {
        expect(option.sale * 100).toBe(option.original * (100 - offer.discount))
      }
    }
    expect(offers.find(offer => offer.page === 42).options.map(option => option.quantity)).toEqual([10, 8, 6])
    expect(existsSync('public/sales/2026/status-concept-sales-2026.pdf')).toBe(true)
  })

  it.each(['/sales', '/en/sales', '/pt/sales'])('opens %s with the header link and complete catalogue', async (path) => {
    render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Sales 2026' }, { timeout: 5000 })
    expect(screen.getAllByRole('article')).toHaveLength(57)
    expect(screen.getByRole('link', { name: 'Sales', exact: true }).getAttribute('href')).toContain('/sales')
    expect(screen.getByText(/26 (October|de outubro)/)).toBeTruthy()
    expect(document.title).toBe('Sales 2026 | STATVS')
  })

  it('filters offers and carries the selected product and customer details into the enquiry', async () => {
    render(<MemoryRouter initialEntries={['/en/sales']}><App /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Sales 2026' }, { timeout: 5000 })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'LOUNGE LIVING' } })
    expect(screen.getAllByRole('article')).toHaveLength(11)
    const first = screen.getAllByRole('article')[0]
    fireEvent.click(within(first).getByRole('button', { name: 'Check availability' }))
    const dialog = screen.getByRole('dialog', { name: 'Let’s check availability.' })
    fireEvent.change(within(dialog).getByLabelText('Name'), { target: { value: 'Test Customer' } })
    fireEvent.change(within(dialog).getByLabelText('Email'), { target: { value: 'customer@example.com' } })
    const message = new URL(within(dialog).getByRole('link', { name: 'Use WhatsApp instead' }).href).searchParams.get('text')
    expect(message).toContain('ANTIGUA — Lounge Arrangement')
    expect(message).toContain('Sales 2026 catalogue, page 2')
    expect(message).toContain('Name: Test Customer\nEmail: customer@example.com')
    expect(message).toContain('4012,50')
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close enquiry' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'all' } })
    expect(screen.getAllByRole('article')).toHaveLength(57)
    expect(screen.getByText('Photograph not supplied in the original catalogue')).toBeTruthy()
  })

  it('prepares the availability email in Portuguese when the Portuguese route is used', async () => {
    render(<MemoryRouter initialEntries={['/pt/sales']}><App /></MemoryRouter>)
    await screen.findByRole('heading', { name: 'Sales 2026' }, { timeout: 5000 })
    fireEvent.click(screen.getAllByRole('button', { name: 'Confirmar disponibilidade' })[0])
    const dialog = screen.getByRole('dialog', { name: 'Vamos confirmar.' })
    expect(within(dialog).getByRole('button', { name: 'Abrir email preparado' })).toBeTruthy()
    const request = salesEnquiry(offers[0], { pt: true })
    const email = new URL(request.emailHref)
    expect(email.searchParams.get('subject')).toContain('Disponibilidade Sales 2026')
    expect(email.searchParams.get('body')).toContain('Os meus dados de contacto:\nNome: \nEmail: \nTelefone: ')
    expect(email.searchParams.get('body')).toContain('catálogo Sales 2026, página 2')
  })

  it('opens a direct offer link and requests only the chosen quantity and price', async () => {
    const offer = offers.find(item => item.page === 42)
    render(<MemoryRouter initialEntries={[`/en/sales?offer=${offer.id}`]}><App /></MemoryRouter>)
    const dialog = await screen.findByRole('dialog', { name: 'Let’s check availability.' })
    fireEvent.change(within(dialog).getByLabelText('Choose an option'), { target: { value: '2' } })
    const message = new URL(within(dialog).getByRole('link', { name: 'Use WhatsApp instead' }).href).searchParams.get('text')
    expect(message).toContain('Option: 6 chairs')
    expect(message).not.toContain('Option: 10 chairs')
    expect(message).toContain(`Sale price: ${salesPrice(offer.options[2].sale)}`)
    const email = new URL(salesEnquiry(offer, { optionIndex: 2, origin: 'https://statusconcept.site' }).emailHref)
    expect(email.pathname).toBe('info@statusconcept.com')
    expect(email.searchParams.get('body')).toContain(`https://statusconcept.site/#/en/sales?offer=${offer.id}`)
  })

  it('searches the catalogue, handles no matches and resets the filters', async () => {
    render(<MemoryRouter initialEntries={['/en/sales']}><App /></MemoryRouter>)
    const search = await screen.findByRole('searchbox', { name: 'Search offers' })
    fireEvent.change(search, { target: { value: 'no-such-product' } })
    expect(screen.queryAllByRole('article')).toHaveLength(0)
    expect(screen.getByRole('heading', { name: 'No offers found.' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'View all offers' }))
    expect(screen.getAllByRole('article')).toHaveLength(57)
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'price' } })
    const cheapest = [...offers].sort((a, b) => Math.min(...a.options.map(option => option.sale)) - Math.min(...b.options.map(option => option.sale)))[0]
    expect(within(screen.getAllByRole('article')[0]).getByRole('heading').textContent).toBe(cheapest.name)
  })
})
