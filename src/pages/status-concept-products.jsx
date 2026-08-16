import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import NoImagePlaceholder from '../components/NoImagePlaceholder'
import { productSrcSet } from '../utils/imageVariants'
import { demoProducts } from '../data/demoProducts'
import { kitchenCollectionMeta } from '../data/kitchenProducts'
import {
  CATEGORY_ALIASES,
  PRODUCT_CATEGORIES,
  filterProducts,
  formatFacetLabel,
  getCategory,
  getFacetOptions,
  getProductFacets,
  normalizeProduct,
} from '../data/productTaxonomy'
import { getLangFromPath, withLang } from '../utils/language'
import kitchenHeroImg from '../assets/images/kitchen/kitchen-hero.webp'
import furnitureSeriesImg from '../assets/images/enhanced/furniture-series-golf-hero.webp'
import sicilyCornerImg from '../assets/images/sicily-corner.jpg'

const shadeHeroImg = '/product-images/glatz/ambiente-nova/01.webp'
const shadeChipImg = '/product-images/glatz/sombrano-s-plus/05.webp'

const catalogProducts = demoProducts.map(normalizeProduct)

const productImage = (product) => product.images?.[0] || product.img || product.image || ''
const productHasImage = (product) => Boolean(productImage(product))
const productRoute = (product) => product.route || `/product/${product.id || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

function categoryImage(category) {
  if (category.key === 'lounge') return sicilyCornerImg
  if (category.key === 'shade') return shadeChipImg
  if (category.key === 'kitchen') return kitchenHeroImg
  return catalogProducts.find((product) => product.category === category.key)?.img || furnitureSeriesImg
}

function collectionOptions(products, category) {
  const values = new Map()
  products
    .filter((product) => !category || product.category === category)
    .forEach((product) => {
      const facets = getProductFacets(product)
      if (facets.collection) values.set(facets.collection, facets.collectionName || formatFacetLabel(facets.collection))
    })
  return [...values.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

function FilterGroup({ label, options, value, onChange }) {
  if (!options.length) return null
  return (
    <fieldset className="rd-filter-group">
      <legend className="fs">{label}</legend>
      <div className="rd-filter-options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value === option.value ? 'active' : ''}
            aria-pressed={value === option.value}
            onClick={() => onChange(value === option.value ? '' : option.value)}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function FilterPanel({ category, products, filters, onChange, onClear, open, onClose }) {
  const categoryDefinition = getCategory(category)
  const typeValues = new Set(categoryDefinition?.types?.map((option) => option.value))
  const materialValues = new Set(categoryDefinition?.materials?.map((option) => option.value))
  const typeOptions = getFacetOptions(products, category, 'type').filter((option) => !categoryDefinition || typeValues.has(option.value))
  const materialOptions = getFacetOptions(products, category, 'material').filter((option) => !categoryDefinition || materialValues.has(option.value))
  const collections = collectionOptions(products, category)
  const hasFilters = Boolean(filters.type || filters.material || filters.collection)

  return (
    <>
      {open && <button type="button" className="rd-filter-backdrop" onClick={onClose} aria-label="Close filters" />}
      <aside className={`rd-filter-panel ${open ? 'is-open' : ''}`} aria-label="Product filters">
        <div className="rd-filter-header">
          <span className="rd-kicker fs">Refine</span>
          <button type="button" className="rd-filter-close" onClick={onClose} aria-label="Close filters">×</button>
        </div>
        <FilterGroup label="Type" options={typeOptions} value={filters.type} onChange={(value) => onChange('type', value)} />
        <FilterGroup label="Material" options={materialOptions} value={filters.material} onChange={(value) => onChange('material', value)} />
        <FilterGroup label="Collection" options={collections} value={filters.collection} onChange={(value) => onChange('collection', value)} />
        {hasFilters && (
          <button type="button" className="rd-clear-filters fs" onClick={onClear}>Clear all</button>
        )}
      </aside>
    </>
  )
}

function ProductCard({ product, categoryLabel, onNavigate }) {
  const image = productImage(product)
  const isLifestyle = product.imageMode === 'lifestyle'
  return (
    <article className={`rd-product-card ${isLifestyle ? 'lifestyle-product' : 'studio-product'}`}>
      <div className="rd-product-media">
        {productHasImage(product) ? (
          <img
            src={image}
            srcSet={productSrcSet(image)}
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 300px"
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        ) : <NoImagePlaceholder />}
      </div>
      <div className="rd-product-info">
        <span className="rd-product-cat fs">{categoryLabel}</span>
        <h3 className="ff">
          <LocalizedLink
            className="rd-card-link"
            data-no-translate
            to={productRoute(product)}
            state={{ product }}
            onClick={onNavigate}
          >{product.name}</LocalizedLink>
        </h3>
      </div>
    </article>
  )
}

const PRODUCTS_PAGE = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentLang = getLangFromPath(location.pathname)
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const rawCategory = searchParams.get('cat') || ''
  const activeCategory = getCategory(CATEGORY_ALIASES[rawCategory] || rawCategory)?.key || ''
  const queryParam = searchParams.get('q')?.trim() || ''
  const typeParam = searchParams.get('type')?.trim().toLowerCase() || ''
  const materialParam = searchParams.get('material')?.trim().toLowerCase() || ''
  const collectionParam = searchParams.get('collection')?.trim().toLowerCase() || ''
  const filters = {
    category: activeCategory,
    type: typeParam,
    material: materialParam,
    collection: collectionParam,
    query: queryParam,
  }
  const selectedCategory = PRODUCT_CATEGORIES.find((category) => category.key === activeCategory)
  const hasSearch = Boolean(queryParam)
  const isLanding = !activeCategory && !hasSearch

  const categories = useMemo(() => PRODUCT_CATEGORIES.map((category) => ({
    ...category,
    image: categoryImage(category),
    count: catalogProducts.filter((product) => product.category === category.key).length,
  })), [])

  const filteredProducts = useMemo(() => {
    const products = filterProducts(catalogProducts, {
      category: activeCategory,
      type: typeParam,
      material: materialParam,
      collection: collectionParam,
      query: queryParam,
    })
    return [...products].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (a.tag && !b.tag) return -1
      if (!a.tag && b.tag) return 1
      return 0
    })
  }, [activeCategory, collectionParam, materialParam, queryParam, sortBy, typeParam])

  const searchMatches = useMemo(() => filterProducts(catalogProducts, { query: queryParam }), [queryParam])
  const searchCategoryCounts = categories
    .map((category) => ({ ...category, count: searchMatches.filter((product) => product.category === category.key).length }))
    .filter((category) => category.count > 0)

  const goTo = (path) => navigate(withLang(path, currentLang))
  const updateSearch = (mutator) => {
    const next = new URLSearchParams(searchParams)
    mutator(next)
    const query = next.toString()
    goTo(`/products${query ? `?${query}` : ''}`)
  }
  const setFilter = (key, value) => updateSearch((next) => {
    if (value) next.set(key, value)
    else next.delete(key)
  })
  const clearFilters = () => updateSearch((next) => {
    next.delete('type')
    next.delete('material')
    next.delete('collection')
  })
  const clearAll = () => goTo(activeCategory ? `/products?cat=${activeCategory}` : '/products')
  const submitSearch = (event) => {
    event.preventDefault()
    const cleanQuery = searchInput.trim()
    goTo(cleanQuery ? `/products?q=${encodeURIComponent(cleanQuery)}` : '/products')
  }
  const setSearchScope = (key) => {
    const query = encodeURIComponent(queryParam)
    goTo(key ? `/products?q=${query}&cat=${key}` : `/products?q=${query}`)
  }
  const categoryLabel = (product) => product.categoryLabel || selectedCategory?.label || 'Outdoor living'

  return (
    <Layout>
      {isLanding ? (
        <>
          <section className="prod-banner" aria-label="Outdoor furniture collection">
            <img src={furnitureSeriesImg} alt="Outdoor furniture collection" style={{ objectPosition: 'center 40%' }} />
          </section>
          <div className="rd-page-head">
            <span className="rd-kicker fs">Products</span>
            <h1 className="rd-title ff">Outdoor living, considered.</h1>
            <p className="rd-lede fs">Browse furniture, shade and kitchens by category, material and collection.</p>
          </div>
          <main className="rd-products-layout">
            <div className="rd-category-grid">
              {categories.map((category) => (
                <LocalizedLink key={category.key} className="rd-category-card" to={`/products?cat=${category.key}`}>
                  <div className="rd-category-card-media"><img src={category.image} alt="" loading="lazy" /></div>
                  <div className="rd-category-card-copy">
                    <span className="rd-kicker fs">{String(category.count).padStart(2, '0')} pieces</span>
                    <h2 className="ff">{category.label}</h2>
                    <p className="fs">{category.copy}</p>
                    <span className="rd-category-card-link fs">Explore <span aria-hidden="true">→</span></span>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </main>
        </>
      ) : (
        <>
          {!hasSearch && (
            <section className="prod-banner">
              <img src={activeCategory === 'shade' ? shadeHeroImg : activeCategory === 'kitchen' ? kitchenHeroImg : selectedCategory ? categoryImage(selectedCategory) : furnitureSeriesImg} alt="" />
            </section>
          )}
          <div className={`rd-page-head ${hasSearch ? 'search-head' : ''}`}>
            <button type="button" className="rd-back-to-cats" onClick={() => goTo('/products')}><span aria-hidden="true">←</span> Products</button>
            {hasSearch ? (
              <>
                <span className="rd-kicker fs">Search</span>
                <h1 className="rd-title ff">Search results</h1>
                <p className="rd-lede fs">Find products by name, category, collection or material.</p>
              </>
            ) : (
              <>
                <span className="rd-kicker fs">Products / {selectedCategory?.label}</span>
                <h1 className="rd-title ff">{selectedCategory?.title}</h1>
                <p className="rd-lede fs">{selectedCategory?.copy}</p>
              </>
            )}
          </div>

          <main className="rd-products-layout rd-catalog-layout">
            <FilterPanel
              category={activeCategory}
              products={catalogProducts}
              filters={filters}
              open={filtersOpen}
              onClose={() => setFiltersOpen(false)}
              onChange={(key, value) => { setFilter(key, value); setFiltersOpen(false) }}
              onClear={() => { clearFilters(); setFiltersOpen(false) }}
            />

            <section className="rd-catalog-results">
              {hasSearch && (
                <>
                  <form className="rd-results-search" role="search" onSubmit={submitSearch}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none"><circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    <label className="sr-only" htmlFor="results-search-input">Search products, collections or materials</label>
                    <input id="results-search-input" className="ff" type="search" value={searchInput} autoComplete="off" placeholder="Search products, collections or materials" onChange={(event) => setSearchInput(event.target.value)} />
                    <button type="submit" className="fs">Search <span aria-hidden="true">→</span></button>
                  </form>
                  <div className="rd-search-scopes" role="group" aria-label="Filter search results by category">
                    <button type="button" className={!activeCategory ? 'active' : ''} aria-pressed={!activeCategory} onClick={() => setSearchScope('')}><span>All</span><small data-no-translate>{searchMatches.length}</small></button>
                    {searchCategoryCounts.map((category) => <button key={category.key} type="button" className={activeCategory === category.key ? 'active' : ''} aria-pressed={activeCategory === category.key} onClick={() => setSearchScope(category.key)}><span>{category.label}</span><small data-no-translate>{category.count}</small></button>)}
                  </div>
                </>
              )}

              {activeCategory === 'kitchen' && (
                <div className="rd-range-strip" aria-label="Kitchen collections">
                  {kitchenCollectionMeta.map((collection) => (
                    <button key={collection.key} type="button" className={`rd-range-chip ${filters.collection === collection.key ? 'active' : ''}`} onClick={() => setFilter('collection', filters.collection === collection.key ? '' : collection.key)}>{collection.label}</button>
                  ))}
                </div>
              )}

              <div className="rd-products-toolbar">
                <div>
                  <span className="rd-kicker fs">{hasSearch ? `“${queryParam}”` : selectedCategory?.label}</span>
                  <p className="rd-count fs">{filteredProducts.length} products shown</p>
                </div>
                <div className="rd-toolbar-actions">
                  <button type="button" className="rd-filter-trigger fs" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen}>Filter products</button>
                  <button type="button" className="rd-clear-inline fs" onClick={clearAll}>Clear all</button>
                  <select className="rd-select fs" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort products">
                    <option value="featured">Featured</option>
                    <option value="name">Name</option>
                  </select>
                  <div className="rd-view-toggle" role="group" aria-label="View mode">
                    <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view" aria-pressed={viewMode === 'grid'}>▦</button>
                    <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view" aria-pressed={viewMode === 'list'}>☰</button>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rd-search-empty" role="status">
                  <span className="rd-kicker fs">No products found</span>
                  <h2 className="ff">Try a broader selection</h2>
                  <p className="fs">Clear one of the filters or ask our showroom team to help you find the right piece.</p>
                  <div className="rd-search-empty-actions"><button type="button" onClick={clearAll}>Clear all filters</button><LocalizedLink className="rd-search-empty-contact fs" to="/contact">Ask the showroom team <span aria-hidden="true">→</span></LocalizedLink></div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="rd-product-grid editorial">
                  {filteredProducts.map((product) => <ProductCard key={product.id || product.name} product={product} categoryLabel={categoryLabel(product)} />)}
                </div>
              ) : (
                <div className="rd-product-list">
                  {filteredProducts.map((product) => {
                    const image = productImage(product)
                    return (
                      <article key={product.id || product.name} className="rd-product-row">
                        {productHasImage(product) ? <img src={image} srcSet={productSrcSet(image)} sizes="220px" alt={product.name} loading="lazy" decoding="async" /> : <NoImagePlaceholder list />}
                        <div><span className="rd-kicker fs">{categoryLabel(product)}</span><h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={productRoute(product)} state={{ product }}>{product.name}</LocalizedLink></h3>{product.desc && <p className="rd-lede fs">{product.desc}</p>}</div>
                      </article>
                    )
                  })}
                </div>
              )}
            </section>
          </main>
        </>
      )}
    </Layout>
  )
}

export default PRODUCTS_PAGE
