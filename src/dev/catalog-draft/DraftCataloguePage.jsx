import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import draftProducts from 'virtual:status-concept-draft-catalog'
import DraftImagePlaceholder, { privateAssetPath } from './DraftImagePlaceholder'
import './draft-catalog.css'

function usePrivateRobots() {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]')
    const previous = robots?.getAttribute('content')
    robots?.setAttribute('content', 'noindex,nofollow,noarchive')
    return () => {
      if (!robots) return
      if (previous == null) robots.removeAttribute('content')
      else robots.setAttribute('content', previous)
    }
  }, [])
}

function productImage(product) {
  const variantImage = product.variants?.flatMap((variant) => variant.images || [])[0]
  return privateAssetPath(variantImage || product.finalImages?.[0] || product.referenceImages?.[0])
}

export default function DraftCataloguePage() {
  usePrivateRobots()
  return (
    <Layout>
      <main className="draft-catalog-page" data-no-translate>
        <section className="draft-catalog-intro">
          <div className="draft-private-badge">LOCAL DEV · PRIVATE DRAFT</div>
          <span className="rd-kicker fs">Status Concept catalogue preparation</span>
          <h1 className="ff">Private product catalogue</h1>
          <p className="fs">
            This preview is isolated from the public catalogue. Products only appear after explicit photo review,
            grouping approval and final-image approval.
          </p>
        </section>

        <section className="draft-readiness-grid" aria-label="Draft readiness">
          <div><strong>{draftProducts.length}</strong><span>draft products</span></div>
          <div><strong>{draftProducts.reduce((total, product) => total + (product.variants?.length || 0), 0)}</strong><span>variants</span></div>
          <div><strong>0</strong><span>public products changed</span></div>
          <div><strong>NO</strong><span>publication enabled</span></div>
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
          <section className="draft-product-grid" aria-label="Draft products">
            {draftProducts.map((product) => {
              const image = productImage(product)
              return (
                <article className="draft-product-card" key={product.id}>
                  <Link to={'/__dev/catalog-draft/' + product.id} className="draft-product-card-media">
                    {image ? <img src={image} alt="" loading="lazy" /> : <DraftImagePlaceholder label="Reference image pending" />}
                  </Link>
                  <div className="draft-product-card-copy">
                    <span className="rd-kicker fs">{product.category}</span>
                    <h2 className="ff"><Link to={'/__dev/catalog-draft/' + product.id}>{product.canonicalName}</Link></h2>
                    <p className="fs">{product.supplier} · {product.variants?.length || 0} variants</p>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>
    </Layout>
  )
}
