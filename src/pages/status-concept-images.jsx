import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import ImageDialog from '../components/ImageDialog'
import { getLangFromPath } from '../utils/language'
import images from '../data/statusConceptPublicImages.json'

const SOURCE_OPTIONS = [
  { key: 'all', label: 'All sources' },
  { key: 'Furniture catalogue', label: 'Furniture catalogue' },
  { key: 'Draco kitchens', label: 'Draco kitchens' },
  { key: 'Curated', label: 'Curated' },
]

const letterSort = (a, b) => {
  if (a === '_') return 1
  if (b === '_') return -1
  return a.localeCompare(b, undefined, { numeric: true })
}

export default function Images() {
  const location = useLocation()
  const isPortuguese = getLangFromPath(location.pathname) === 'pt'
  const [query, setQuery] = useState('')
  const [letter, setLetter] = useState('all')
  const [source, setSource] = useState('all')
  const [view, setView] = useState('grid')
  const [activeImage, setActiveImage] = useState(null)
  const [page, setPage] = useState({ key: '', count: 36 })

  const letters = useMemo(() => (
    [...new Set(images.map((image) => image.letter))].sort(letterSort)
  ), [])

  const filteredImages = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return images.filter((image) => {
      const matchesQuery = !needle || `${image.productName} ${image.name} ${image.source}`.toLowerCase().includes(needle)
      const matchesLetter = letter === 'all' || image.letter === letter
      const matchesSource = source === 'all' || image.source === source
      return matchesQuery && matchesLetter && matchesSource
    })
  }, [letter, query, source])
  const filterKey = JSON.stringify([letter, query, source])
  const visibleCount = page.key === filterKey ? page.count : 36
  const visibleImages = filteredImages.slice(0, visibleCount)
  const activeIndex = activeImage ? filteredImages.findIndex((image) => image.id === activeImage.id) : -1
  const moveImage = (direction) => {
    if (!filteredImages.length) return
    setActiveImage(filteredImages[(activeIndex + direction + filteredImages.length) % filteredImages.length])
  }

  const clearFilters = () => {
    setQuery('')
    setLetter('all')
    setSource('all')
    setPage({ key: '', count: 36 })
  }
  const changeFilter = (setter, value) => {
    setter(value)
    setPage({ key: '', count: 36 })
  }

  const hasFilters = Boolean(query.trim()) || letter !== 'all' || source !== 'all'

  return (
    <Layout>
      <div className="rd-page-head images-page-head">
        <span className="rd-kicker fs">Images</span>
        <h1 className="rd-title ff">Image library</h1>
        <p className="rd-lede fs">A working library of Status Concept imagery, organised by product name for quick review.</p>
      </div>

      <main className="images-page">
        <section className="images-toolbar" aria-label={isPortuguese ? 'Filtros de imagens' : 'Image filters'}>
          <div className="images-search fs">
            <label className="sr-only" htmlFor="image-library-search">{isPortuguese ? 'Pesquisar imagens' : 'Search images'}</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              id="image-library-search"
              type="search"
              value={query}
              onChange={(event) => changeFilter(setQuery, event.target.value)}
              placeholder={isPortuguese ? 'Pesquisar nomes de imagens ou produtos' : 'Search image or product names'}
            />
            {query && <button type="button" className="images-search-clear" onClick={() => changeFilter(setQuery, '')} aria-label={isPortuguese ? 'Limpar pesquisa' : 'Clear search'}>×</button>}
          </div>

          <div className="images-filter-row">
            <div className="images-source-filters" role="group" aria-label={isPortuguese ? 'Filtrar por origem' : 'Filter by source'}>
              {SOURCE_OPTIONS.map((option) => (
                <button
                  type="button"
                  key={option.key}
                  className={`images-filter-pill fs ${source === option.key ? 'active' : ''}`}
                  aria-pressed={source === option.key}
                  onClick={() => changeFilter(setSource, option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="images-toolbar-end">
              <div className="images-result-count fs">
                <span>Images shown</span>
                <strong data-no-translate>{filteredImages.length} / {images.length}</strong>
              </div>
              <div className="images-view-toggle" role="group" aria-label={isPortuguese ? 'Modo de vista' : 'View mode'}>
                <button type="button" className={`fs ${view === 'grid' ? 'active' : ''}`} aria-label={isPortuguese ? 'Vista em grelha' : 'Grid view'} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>
                  <span aria-hidden="true">▦</span>
                </button>
                <button type="button" className={`fs ${view === 'list' ? 'active' : ''}`} aria-label={isPortuguese ? 'Vista em lista' : 'List view'} aria-pressed={view === 'list'} onClick={() => setView('list')}>
                  <span aria-hidden="true">☷</span>
                </button>
              </div>
            </div>
          </div>

          <div className="images-letter-rail" role="group" aria-label={isPortuguese ? 'Filtrar por letra' : 'Filter by first letter'}>
            <button type="button" className={`fs ${letter === 'all' ? 'active' : ''}`} aria-pressed={letter === 'all'} onClick={() => changeFilter(setLetter, 'all')}>All</button>
            {letters.map((item) => (
              <button type="button" className={`fs ${letter === item ? 'active' : ''}`} aria-pressed={letter === item} key={item} onClick={() => changeFilter(setLetter, item)}>{item === '_' ? 'Other' : item}</button>
            ))}
          </div>
        </section>

        {filteredImages.length > 0 ? (
          <section className={`images-grid ${view}`} aria-label={isPortuguese ? 'Galeria de imagens' : 'Image gallery'}>
            {visibleImages.map((image, index) => (
              <article className="images-card" key={image.id}>
                <button type="button" className="images-card-media" onClick={() => setActiveImage(image)} aria-label={`${isPortuguese ? 'Abrir' : 'Open'} ${image.productName}`}>
                  <img src={image.src} alt={image.productName} loading={index < 8 ? 'eager' : 'lazy'} decoding="async" />
                  <span className="images-card-index fs" data-no-translate>{image.imageFile}</span>
                </button>
                <div className="images-card-copy">
                  <h2 className="ff" data-no-translate>{image.productName}</h2>
                  <div className="images-card-meta fs">
                    <span>{image.source}</span>
                    <span data-no-translate>{image.imageFile}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="images-empty" aria-live="polite">
            <span className="rd-kicker fs">No matches yet</span>
            <h2 className="ff">Try a broader selection.</h2>
            <p className="fs">Search by product name, choose another source, or clear the filters.</p>
            {hasFilters && <button type="button" className="cb cd fs" onClick={clearFilters}>Clear filters</button>}
          </section>
        )}
        {filteredImages.length > 0 && <div className="images-pagination fs">
          <p role="status">{isPortuguese ? 'Imagens carregadas' : 'Images loaded'}: {Math.min(visibleCount, filteredImages.length)} / {filteredImages.length}</p>
          {visibleCount < filteredImages.length && <button type="button" className="cb cd fs" onClick={() => setPage({ key: filterKey, count: visibleCount + 36 })}>{isPortuguese ? 'Carregar mais imagens' : 'Load more images'}</button>}
        </div>}
      </main>

      {activeImage && (
        <ImageDialog className="images-lightbox" label={activeImage.productName} onClose={() => setActiveImage(null)} onKeyDown={(event) => {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault()
            moveImage(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}>
          <button type="button" className="images-lightbox-close" onClick={() => setActiveImage(null)} aria-label={isPortuguese ? 'Fechar' : 'Close'}>×</button>
          <figure>
            <img src={activeImage.src} alt={activeImage.productName} />
            <figcaption className="fs">
              <strong data-no-translate>{activeImage.productName}</strong>
              <span data-no-translate>{activeImage.imageFile} · {activeImage.source}</span>
            </figcaption>
          </figure>
          {filteredImages.length > 1 && <div className="images-lightbox-navigation">
            <button type="button" onClick={() => moveImage(-1)} aria-label={isPortuguese ? 'Imagem anterior' : 'Previous image'}>←</button>
            <span role="status" className="fs">{activeIndex + 1} / {filteredImages.length}</span>
            <button type="button" onClick={() => moveImage(1)} aria-label={isPortuguese ? 'Imagem seguinte' : 'Next image'}>→</button>
          </div>}
        </ImageDialog>
      )}
    </Layout>
  )
}
