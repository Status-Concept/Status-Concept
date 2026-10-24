import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { refineProductResults } from './status-concept-products'
import { searchProducts } from '../utils/productSearch'

afterEach(cleanup)

function open(path) {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
}

describe('combined catalogue search filters', () => {
  it.each(['Sicily', 'Bermuda'])('counts and scopes the three separate %s pieces consistently', async (collection) => {
    open(`/en/products?q=${collection}`)
    expect(await screen.findByRole('region', { name: 'Matching collection' })).toBeTruthy()
    expect(screen.getByRole('button', { name: /^All\s*3$/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /^Lounge\s*3$/ }))
    expect(await screen.findByText('3 results')).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('region', { name: 'Matching collection' })).toBeNull()
  })

  it('finds the Sicily ottoman by type without requiring a separate collection parameter', async () => {
    open('/en/products?q=Sicily&cat=lounge&type=pouf')
    expect(await screen.findByRole('heading', { name: 'Sicily Ottoman', exact: true })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(1)
  })

  it.each(['type=nonexistent-type', 'subcat=rope&type=nonexistent-type'])(
    'does not replace an empty direct category filter with all collections: %s', async (filter) => {
      open(`/en/products?cat=lounge&${filter}`)
      expect(await screen.findByText('0 products shown')).toBeTruthy()
      expect(screen.queryByRole('region', { name: 'Collections' })).toBeNull()
      expect(screen.queryAllByRole('article')).toHaveLength(0)
      fireEvent.click(screen.getByRole('button', { name: 'Clear filters', exact: true }))
      expect(await screen.findByRole('region', { name: 'Collections' })).toBeTruthy()
    },
  )

  it('shows modular products when following the direct menu filter', async () => {
    open('/en/products?cat=lounge&type=modular')
    expect(await screen.findByRole('heading', { name: 'Berlin Modular Sofa', exact: true })).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Collections' })).toBeNull()
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
  })

  it.each([
    ['q=Berlin&cat=lounge&collection=berlin&subcat=upholstered&type=modular', 'Berlin Modular Sofa'],
    ['q=Sicily&cat=lounge&collection=sicily&subcat=upholstered&type=pouf', 'Sicily Ottoman'],
    ['q=Bermuda&cat=lounge&type=pouf', 'Bermuda Ottoman'],
  ])('renders the exact positive intersection for %s', async (query, name) => {
    open(`/en/products?${query}`)
    expect(await screen.findByRole('heading', { name, exact: true })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByText('1 results')).toBeTruthy()
  })

  it('does not offer a Lounge collection in an empty Dining search', async () => {
    open('/en/products?q=Bali&cat=dining')
    expect(await screen.findByText('0 results')).toBeTruthy()
    expect(screen.queryByRole('region', { name: 'Matching collection' })).toBeNull()
    expect(screen.queryAllByRole('article')).toHaveLength(0)
    fireEvent.click(screen.getByRole('button', { name: /^All\s*3$/ }))
    expect(await screen.findByRole('region', { name: 'Matching collection' })).toBeTruthy()
  })

  it.each(['type=nonexistent-type', 'subcat=rope', 'collection=nonexistent-collection'])(
    'applies %s instead of replacing filtered results with the Berlin shortcut', async (filter) => {
      open(`/en/products?q=Berlin&cat=lounge&${filter}`)
      expect(await screen.findByText('0 results')).toBeTruthy()
      expect(screen.queryByRole('region', { name: 'Matching collection' })).toBeNull()
      expect(screen.queryAllByRole('article')).toHaveLength(0)
      fireEvent.click(screen.getByRole('button', { name: 'Clear filters', exact: true }))
      expect(await screen.findByText('2 results')).toBeTruthy()
      expect(screen.getAllByRole('article')).toHaveLength(2)
    },
  )
})

describe('filter intersection contract', () => {
  const categories = ['lounge', 'dining', 'sunlounger', 'shade', 'kitchen', 'carpets', 'decor', 'statues']
  const fixtures = categories.flatMap((category) => ['alpha', 'beta'].flatMap((collection) => (
    ['upholstered', 'rope', 'aluminium'].flatMap((material) => ['sofa', 'armchair'].map((type) => ({
      id: `${category}-${collection}-${material}-${type}`,
      name: `Needle ${category} ${collection}`,
      category,
      collection,
      productType: [type],
      subcategories: [material],
    })))
  )))

  it.each(categories)('keeps search, collection, material and type intersections in %s', (category) => {
    for (const collection of ['', 'alpha', 'beta', 'missing']) {
      for (const subcategory of ['', 'upholstered', 'rope', 'aluminium', 'missing']) {
        for (const type of ['', 'sofa', 'armchair', 'missing']) {
          for (const query of ['Needle', 'Needle alpha', 'absent']) {
            const results = refineProductResults(searchProducts(fixtures, query), { category, collection, subcategory, type })
            const expected = fixtures.filter((product) => (
              product.category === category
              && (!collection || product.collection === collection)
              && (!subcategory || product.subcategories[0] === subcategory)
              && (!type || product.productType[0] === type)
              && (query === 'Needle' || (query === 'Needle alpha' && product.collection === 'alpha'))
            ))
            expect(results.map(({ id }) => id).sort()).toEqual(expected.map(({ id }) => id).sort())
          }
        }
      }
    }
  })
})
