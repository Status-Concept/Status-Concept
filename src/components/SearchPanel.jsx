import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import LocalizedLink from './LocalizedLink'
import { allProducts } from '../data/productCatalog'
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import { normalizeSearchText, searchProducts } from '../utils/productSearch'
import { getLangFromPath } from '../utils/language'

const POPULAR_SEARCHES = ['Modular sofas', 'Parasols', 'Outdoor kitchens', 'Sun loungers']

const CATEGORY_LINKS = [
  { key: 'lounge', label: 'Lounge', path: '/products?cat=lounge', keywords: 'sofa sofas lounge chair armchair modular poltrona cadeira' },
  { key: 'dining', label: 'Dining', path: '/products?cat=dining', keywords: 'dining table chair mesa refeicao cadeiras coffee side' },
  { key: 'sunlounger', label: 'Sun Loungers & Day Beds', path: '/products?cat=sunlounger', keywords: 'sun lounger daybed pool espreguicadeira piscina' },
  { key: 'shade', label: 'Shade Solutions', path: '/products?cat=shade', keywords: 'shade parasol umbrella pergola glatz sombra chapeu sol' },
  { key: 'kitchen', label: 'Outdoor Kitchens', path: '/products?cat=kitchen', keywords: 'kitchen barbecue bbq grill cozinha grelhador' },
]

const PAGE_LINKS = [
  { key: 'showrooms', label: 'Showrooms', eyebrow: 'Visit', path: '/about', keywords: 'showroom showrooms visit directions almancil quinta do lago loja exposicao morada' },
  { key: 'after-care', label: 'After Care', eyebrow: 'Service', path: '/after-care', keywords: 'after care maintenance repair cleaning winter storage manutencao limpeza reparacao' },
  { key: 'projects', label: 'Projects', eyebrow: 'Inspiration', path: '/projects', keywords: 'projects portfolio villa terrace pool projectos projetos inspiracao' },
  { key: 'contact', label: 'Contact', eyebrow: 'Speak with us', path: '/contact', keywords: 'contact quote proposal appointment whatsapp email telefone contacto orcamento proposta' },
]

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const productPath = (product) => product.route || `/product/${product.id || slug(product.name)}`

function matchesQuery(item, query) {
  const document = normalizeSearchText(`${item.label} ${item.keywords}`)
  return normalizeSearchText(query).split(' ').filter(Boolean).every((token) => document.includes(token))
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
      <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export default function SearchPanel({ open, onClose }) {
  const navigate = useLocalizedNavigate()
  const location = useLocation()
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const isPortuguese = getLangFromPath(location.pathname) === 'pt'
  const searchPlaceholder = isPortuguese ? 'Pesquisar produtos, coleções ou materiais' : 'Search products, collections or materials'

  const fullProductResults = useMemo(() => searchProducts(allProducts, query), [query])
  const productResults = useMemo(() => fullProductResults.slice(0, 6), [fullProductResults])
  const categoryResults = useMemo(
    () => (query ? CATEGORY_LINKS.filter((item) => matchesQuery(item, query)).slice(0, 3) : []),
    [query],
  )
  const pageResults = useMemo(
    () => (query ? PAGE_LINKS.filter((item) => matchesQuery(item, query)).slice(0, 3) : []),
    [query],
  )

  const suggestions = useMemo(() => [
    ...productResults.map((product) => ({ key: `product-${product.id || product.name}`, path: productPath(product) })),
    ...categoryResults.map((item) => ({ key: `category-${item.key}`, path: item.path })),
    ...pageResults.map((item) => ({ key: `page-${item.key}`, path: item.path })),
  ], [categoryResults, pageResults, productResults])

  const suggestionIndexes = useMemo(
    () => new Map(suggestions.map((item, index) => [item.key, index])),
    [suggestions],
  )

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 0)

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
      previousFocusRef.current?.focus?.()
    }
  }, [onClose, open])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  if (!open) return null

  const goTo = (path) => {
    onClose()
    navigate(path)
  }

  const submitSearch = (event) => {
    event.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery) return
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goTo(suggestions[activeIndex].path)
      return
    }
    goTo(`/products?q=${encodeURIComponent(cleanQuery)}`)
  }

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && query.trim()) {
      event.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goTo(suggestions[activeIndex].path)
      } else {
        goTo(`/products?q=${encodeURIComponent(query.trim())}`)
      }
      return
    }
    if (!suggestions.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % suggestions.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
    }
  }

  const trapFocus = (event) => {
    if (event.key !== 'Tab' || !panelRef.current) return
    const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')]
      .filter((element) => !element.hasAttribute('hidden'))
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const renderOptionState = (key) => {
    const index = suggestionIndexes.get(key)
    return {
      id: `search-option-${index}`,
      'aria-selected': activeIndex === index,
      className: activeIndex === index ? 'is-active' : undefined,
      onMouseEnter: () => setActiveIndex(index),
    }
  }

  const hasAnyResults = productResults.length > 0 || categoryResults.length > 0 || pageResults.length > 0

  return (
    <div className="site-search-layer">
      <div className="site-search-scrim" aria-hidden="true" onClick={onClose} />
      <section ref={panelRef} className="site-search-panel" role="dialog" aria-modal="true" aria-label={isPortuguese ? 'Pesquisar na Statvs' : 'Search Statvs'} onKeyDown={trapFocus}>
        <div className="site-search-inner">
          <div className="site-search-heading">
            <span className="rd-kicker fs">Product discovery</span>
            <p className="ff">Find the right piece for your outdoor room.</p>
          </div>

          <form className="site-search-form" role="search" onSubmit={submitSearch}>
            <SearchIcon />
            <label className="sr-only" htmlFor="site-search-input">{searchPlaceholder}</label>
            <input
              ref={inputRef}
              id="site-search-input"
              className="ff"
              type="search"
              autoComplete="off"
              value={query}
              placeholder={searchPlaceholder}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={Boolean(query)}
              aria-controls="site-search-results"
              aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            {query && (
              <button type="button" className="site-search-clear fs" onClick={() => setQuery('')}>Clear</button>
            )}
            <button type="button" className="site-search-close" aria-label={isPortuguese ? 'Fechar pesquisa' : 'Close search'} onClick={onClose}>
              <span aria-hidden="true">×</span>
            </button>
          </form>

          <div className="site-search-content">
            {!query ? (
              <div className="site-search-start">
                <div>
                  <span className="site-search-label fs">Popular searches</span>
                  <div className="site-search-chips">
                    {POPULAR_SEARCHES.map((item) => (
                      <LocalizedLink key={item} to={`/products?q=${encodeURIComponent(item)}`} onClick={onClose}>{item}</LocalizedLink>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="site-search-label fs">Browse by category</span>
                  <div className="site-search-categories">
                    {CATEGORY_LINKS.map((item) => (
                      <LocalizedLink key={item.key} to={item.path} onClick={onClose}>
                        <span>{item.label}</span>
                        <span aria-hidden="true">↗</span>
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div id="site-search-results" className="site-search-results" role="listbox" aria-label={isPortuguese ? 'Sugestões de pesquisa' : 'Search suggestions'}>
                <p className="sr-only" aria-live="polite">{fullProductResults.length} products found</p>

                {productResults.length > 0 && (
                  <div className="site-search-group" role="group" aria-label="Products">
                    <div className="site-search-group-head">
                      <span className="site-search-label fs">Products</span>
                      <span className="fs">{fullProductResults.length} matches</span>
                    </div>
                    <div className="site-search-product-grid">
                      {productResults.map((product) => {
                        const key = `product-${product.id || product.name}`
                        const optionState = renderOptionState(key)
                        return (
                          <LocalizedLink key={key} to={productPath(product)} role="option" {...optionState} onClick={onClose}>
                            <span className="site-search-thumb">
                              {product.img
                                ? <img src={product.img} alt="" loading="eager" decoding="async" />
                                : <span aria-hidden="true">S</span>}
                            </span>
                            <span className="site-search-product-copy">
                              <span className="fs">{product.categoryLabel || product.category || 'Outdoor living'}</span>
                              <strong className="ff" data-no-translate>{product.name}</strong>
                              {(product.collectionName || product.collection) && <small className="fs" data-no-translate>{product.collectionName || product.collection}</small>}
                            </span>
                          </LocalizedLink>
                        )
                      })}
                    </div>
                    <LocalizedLink className="site-search-all fs" to={`/products?q=${encodeURIComponent(query.trim())}`} onClick={onClose}>
                      View all {fullProductResults.length} results <span aria-hidden="true">→</span>
                    </LocalizedLink>
                  </div>
                )}

                {categoryResults.length > 0 && (
                  <div className="site-search-group compact" role="group" aria-label="Categories">
                    <span className="site-search-label fs">Browse by category</span>
                    {categoryResults.map((item) => {
                      const key = `category-${item.key}`
                      return (
                        <LocalizedLink key={key} to={item.path} role="option" {...renderOptionState(key)} onClick={onClose}>
                          <span>{item.label}</span><span aria-hidden="true">→</span>
                        </LocalizedLink>
                      )
                    })}
                  </div>
                )}

                {pageResults.length > 0 && (
                  <div className="site-search-group compact" role="group" aria-label="Services and pages">
                    <span className="site-search-label fs">Services & pages</span>
                    {pageResults.map((item) => {
                      const key = `page-${item.key}`
                      return (
                        <LocalizedLink key={key} to={item.path} role="option" {...renderOptionState(key)} onClick={onClose}>
                          <span><small className="fs">{item.eyebrow}</small>{item.label}</span><span aria-hidden="true">→</span>
                        </LocalizedLink>
                      )
                    })}
                  </div>
                )}

                {!hasAnyResults && (
                  <div className="site-search-empty" role="status">
                    <span className="rd-kicker fs">No matches yet</span>
                    <h2 className="ff">Try a product type, collection or material.</h2>
                    <p className="fs">Search for terms such as “modular sofa”, “teak”, “Glatz” or “outdoor kitchen”.</p>
                    <div className="site-search-chips">
                      {POPULAR_SEARCHES.map((item) => (
                        <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>
                      ))}
                    </div>
                    <LocalizedLink className="site-search-contact fs" to="/contact" onClick={onClose}>Ask the showroom team <span aria-hidden="true">→</span></LocalizedLink>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
