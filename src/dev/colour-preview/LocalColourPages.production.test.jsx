import { afterEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { localColourPages } from './targets'

afterEach(() => { cleanup(); vi.unstubAllEnvs() })

// Isolated file: lazy product modules capture DEV when they are first imported.
it.each(Object.keys(localColourPages))('offers the approved %s configuration outside development', async id => {
  vi.stubEnv('DEV', false)
  render(<MemoryRouter initialEntries={[`/en/product/${id}`]}><App /></MemoryRouter>)
  expect(await screen.findByRole('heading', { name: localColourPages[id].name, level: 1 })).toBeTruthy()
  fireEvent.click(await screen.findByRole('button', { name: 'Lead Chine', exact: true }))
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open full-size image' }).querySelector('img').getAttribute('src')).toContain('-lead-chine-'))
  expect(screen.getByRole('combobox', { name: 'Frame finish' })).toBeTruthy()
})
