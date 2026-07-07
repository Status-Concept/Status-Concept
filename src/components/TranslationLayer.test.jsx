import { describe, it, expect, afterEach } from 'vitest'
import { render, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TranslationLayer from './TranslationLayer'

// The layer walks document.getElementById('root'), so tests must render into a
// container carrying that id.
function renderInRoot(ui) {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
  return render(ui, { container: root })
}

afterEach(() => {
  cleanup()
  document.querySelectorAll('#root').forEach((n) => n.remove())
})

describe('TranslationLayer', () => {
  it('translates an exact dictionary key under /pt', async () => {
    const { getByTestId } = renderInRoot(
      <MemoryRouter initialEntries={['/pt']}>
        <TranslationLayer />
        <span data-testid="t">Products</span>
      </MemoryRouter>,
    )
    await waitFor(() => expect(getByTestId('t').textContent).toBe('Produtos'))
  })

  it('preserves leading/trailing whitespace around the translation', async () => {
    const { getByTestId } = renderInRoot(
      <MemoryRouter initialEntries={['/pt']}>
        <TranslationLayer />
        <span data-testid="t">{'  Products  '}</span>
      </MemoryRouter>,
    )
    await waitFor(() => expect(getByTestId('t').textContent).toBe('  Produtos  '))
  })

  it('skips nodes inside a data-no-translate subtree', async () => {
    const { getByTestId } = renderInRoot(
      <MemoryRouter initialEntries={['/pt']}>
        <TranslationLayer />
        <span data-no-translate data-testid="t">Products</span>
      </MemoryRouter>,
    )
    // give the observer a couple of frames to (not) act
    await new Promise((r) => setTimeout(r, 60))
    expect(getByTestId('t').textContent).toBe('Products')
  })

  it('leaves text untranslated under /en', async () => {
    const { getByTestId } = renderInRoot(
      <MemoryRouter initialEntries={['/en']}>
        <TranslationLayer />
        <span data-testid="t">Products</span>
      </MemoryRouter>,
    )
    await new Promise((r) => setTimeout(r, 60))
    expect(getByTestId('t').textContent).toBe('Products')
  })
})
