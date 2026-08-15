import { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import draftProducts from 'virtual:status-concept-draft-catalog'
import DraftImagePlaceholder, { privateAssetPath } from './DraftImagePlaceholder'
import VariantSelector from './VariantSelector'
import './draft-catalog.css'

function usePrivateRobots(title) {
  useEffect(() => {
    const robots = document.querySelector('meta[name="robots"]')
    const previous = robots?.getAttribute('content')
    robots?.setAttribute('content', 'noindex,nofollow,noarchive')
    document.title = title + ' · Private draft | STATVS'
    return () => {
      if (!robots) return
      if (previous == null) robots.removeAttribute('content')
      else robots.setAttribute('content', previous)
    }
  }, [title])
}

function valueRows(values = []) {
  return values.map((item) => {
    if (typeof item === 'string') return { label: item, value: 'Source value' }
    return { label: item.label || item.piece || 'Source value', value: item.value || item.w || item.description || 'Pending' }
  })
}

export default function DraftProductPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const product = draftProducts.find((item) => item.id === id)
  const variants = product?.variants || []
  const requestedSku = searchParams.get('variant')
  const variant = variants.find((item) => item.sku === requestedSku) || variants[0] || null
  usePrivateRobots(product?.canonicalName || 'Product')

  if (!product) {
    return (
      <Layout>
        <main className="draft-catalog-page draft-not-found" data-no-translate>
          <span className="rd-kicker fs">Private draft</span>
          <h1 className="ff">Draft product not found</h1>
          <Link className="draft-text-link fs" to="/__dev/catalog-draft">Back to the draft catalogue</Link>
        </main>
      </Layout>
    )
  }

  const variantImage = variant?.images?.[0]
  const referenceImage = variantImage || product.finalImages?.[0] || product.referenceImages?.[0]
  const imageSrc = privateAssetPath(referenceImage)
  const isReference = Boolean(imageSrc && !variantImage && product.imageStatus !== 'final-approved')
  const dimensions = valueRows(product.dimensions)
  const specs = valueRows(product.specs)
  const materials = product.materials || []

  function selectVariant(nextVariant) {
    setSearchParams({ variant: nextVariant.sku })
  }

  return (
    <Layout>
      <main className="draft-product-page" data-no-translate>
        <div className="draft-product-topline">
          <Link className="draft-text-link fs" to="/__dev/catalog-draft">← Back to private catalogue</Link>
          <span className="draft-private-badge">DEV ONLY · HIDDEN</span>
        </div>
        <div className="draft-product-layout">
          <section className="draft-product-gallery" aria-label="Draft product gallery">
            <div className="draft-product-image">
              {imageSrc ? <img src={imageSrc} alt="" /> : <DraftImagePlaceholder label="Awaiting final product images" />}
              {isReference && <span className="draft-image-label">Reference image — not approved</span>}
            </div>
          </section>
          <section className="draft-product-content">
            <span className="rd-kicker fs">{product.collection} · {product.category}</span>
            <h1 className="ff">{product.canonicalName}</h1>
            <p className="draft-product-meta fs">{product.supplier} · {product.productType}</p>
            <p className="draft-product-description fs">{product.description}</p>
            <VariantSelector variants={variants} selectedSku={variant?.sku} onChange={selectVariant} />
            {variant && (
              <div className="draft-selected-variant fs">
                <span>Selected SKU</span>
                <strong>{variant.sku}</strong>
                <span>{variant.sourceDescription}</span>
                <span>Stock in private preview: {variant.stockQuantity ?? 'Not available'}</span>
              </div>
            )}
            {!!specs.length && <InfoList title="Specs" rows={specs} />}
            {!!dimensions.length && <InfoList title="Dimensions" rows={dimensions} />}
            {!!materials.length && <InfoList title="Materials" rows={materials.map((item) => ({ label: item, value: 'Source value' }))} />}
            <p className="draft-warning fs">
              This record is private, draft-only and not available for purchase. External facts and final images
              still require approval.
            </p>
          </section>
        </div>
      </main>
    </Layout>
  )
}

function InfoList({ title, rows }) {
  return (
    <section className="draft-info-section">
      <h2 className="draft-section-label">{title}</h2>
      <dl>
        {rows.map((row, index) => (
          <div key={row.label + index}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
