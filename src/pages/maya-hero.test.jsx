import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(cleanup)

it.each(['en', 'pt'])('redirects the discontinued MAYA collection to Lounge in %s', async (lang) => {
  render(<MemoryRouter initialEntries={[`/${lang}/products?cat=lounge&collection=maya`]}><App /></MemoryRouter>)
  expect(await screen.findByRole('heading', { name: 'Duna', exact: true })).toBeTruthy()
  expect(screen.queryByRole('heading', { name: /maya/i })).toBeNull()
  expect(document.querySelector('.collection-hero-banner')).toBeNull()
})
