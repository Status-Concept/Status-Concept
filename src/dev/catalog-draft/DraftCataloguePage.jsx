import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import draftProducts from 'virtual:status-concept-draft-catalog'
import DraftImagePlaceholder, { privateAssetPath } from './DraftImagePlaceholder'
import { draftProductImages } from './draftProductMedia'
import './draft-catalog.css'

function usePrivateRobots() {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]')
    const previous = robots?.getAttribute('content')
    const previousTitle = document.title
    robots?.setAttribute('content', 'noindex,nofollow,noarchive')
    document.title = 'Private product catalogue | STATVS'
    return () => {
      document.title = previousTitle
      if (!robots) return
      if (previous == null) robots.removeAttribute('content')
      else robots.setAttribute('content', previous)
    }
  }, [])
}

export default function DraftCataloguePage() {
  usePrivateRobots()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 72
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return draftProducts
    return draftProducts.filter((product) => {
      const searchable = [
        product.canonicalName,
        product.supplier,
        product.category,
        product.productType,
        product.sourceFamily,
        ...(product.variants || []).flatMap((variant) => [variant.sku, variant.sourceDescription]),
      ].join(' ').toLowerCase()
      return searchable.includes(normalizedQuery)
    })
  }, [query])
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize)
  const imageCount = draftProducts.reduce((total, product) => total + draftProductImages(product).length, 0)

  useEffect(() => {
    setPage(1)
  }, [query])

  return (
    <Layout>
      <main className="draft-catalog-page" data-no-translate>
        <section className="draft-catalog-intro">
          <div className="draft-private-badge">LOCAL DEV · PRIVATE DRAFT</div>
          <span className="rd-kicker fs">Status Concept catalogue preparation</span>
          <h1 className="ff">Private product catalogue</h1>
          <p className="fs">
            This localhost preview combines the organised products, professional white-background images and safe
            inventory matches. Everything remains private while grouping, SKU and final-image approval are pending.
          </p>
        </section>

        <section className="draft-readiness-grid" aria-label="Draft readiness">
          <div><strong>{draftProducts.length}</strong><span>organised products</span></div>
          <div><strong>{draftProducts.reduce((total, product) => total + (product.variants?.length || 0), 0)}</strong><span>variants</span></div>
          <div><strong>{imageCount}</strong><span>local product images</span></div>
          <div><strong>0</strong><span>public products changed</span></div>
        </section>

        {draftProducts.length === 0 ? (
          <section className="draft-empty-state">
            <DraftImagePlaceholder label="Final images will appear after review" />
            <div>
              <span className="rd-kicker fs">Awaiting human review</span>
              <h2 className="ff">No products are ready for this preview yet.</h2>
              <p className="fs">
                All inventory rows are currently unreviewed. This is intentional: unclear marks in the photographs
                are not converted into candidates automatically.
              </p>
              <ul className="fs">
                <li>Review every visible line in the private selection matrix.</li>
                <li>Approve product and variant groupings.</li>
                <li>Add final images before any future publication task.</li>
              </ul>
            </div>
          </section>
        ) : (
          <>
            <section className="draft-catalog-toolbar" aria-label="Search private inventory">
              <label className="fs" htmlFor="draft-catalog-search">Search inventory</label>
              <input
                id="draft-catalog-search"
                type="search"
                value={query}
                placeholder="Reference, product, supplier..."
                onChange={(event) => setQuery(event.target.value)}
              />
              <span className="fs">{filteredProducts.length} records · page {page} of {totalPages}</span>
            </section>
            <section className="draft-product-grid" aria-label="Draft products">
            {visibleProducts.map((product) => {
              const image = draftProductImages(product)[0]
              const imageSrc = privateAssetPath(image)
              return (
                <article className="draft-product-card" key={product.id}>
                  <Link to={'/__dev/catalog-draft/' + product.id} className="draft-product-card-media">
                    {imageSrc ? <img src={imageSrc} alt={image?.alt || product.canonicalName} loading="lazy" /> : <DraftImagePlaceholder label="Reference image pending" />}
                  </Link>
                  <div className="draft-product-card-copy">
                    <span className="rd-kicker fs">{product.category} · {product.selectionStatus}</span>
                    <h2 className="ff"><Link to={'/__dev/catalog-draft/' + product.id}>{product.canonicalName}</Link></h2>
                    <p className="fs">{product.supplier} · {product.variants?.length || 0} variants</p>
                  </div>
                </article>
              )
            })}
            </section>
            <nav className="draft-pagination" aria-label="Private inventory pages">
              <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</button>
              <span className="fs">Page {page} / {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</button>
            </nav>
          </>
        )}
      </main>
    </Layout>
  )
}
