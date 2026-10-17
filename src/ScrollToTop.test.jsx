import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'
import ScrollToTop from './ScrollToTop'

function RouteControls() {
  const navigate = useNavigate()
  return <>
    <button onClick={() => navigate('/en/products?cat=lounge&collection=sicily')}>Open Sicily</button>
    <button onClick={() => navigate('/en/products?cat=lounge&type=corner')}>Change filter</button>
    <button onClick={() => navigate('/en/contact')}>Open another page</button>
  </>
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('ScrollToTop', () => {
  it('scrolls to the top when opening a collection on the same route', () => {
    const scrollTo = vi.fn()
    vi.stubGlobal('scrollTo', scrollTo)

    const { getByRole } = render(
      <MemoryRouter initialEntries={['/en/products?cat=lounge']}>
        <ScrollToTop />
        <RouteControls />
      </MemoryRouter>,
    )

    scrollTo.mockClear()
    fireEvent.click(getByRole('button', { name: 'Open Sicily' }))
    expect(scrollTo).toHaveBeenCalledWith(0, 0)

    scrollTo.mockClear()
    fireEvent.click(getByRole('button', { name: 'Change filter' }))
    expect(scrollTo).not.toHaveBeenCalled()

    fireEvent.click(getByRole('button', { name: 'Open another page' }))
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
