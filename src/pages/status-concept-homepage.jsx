import { useMemo, useState } from 'react'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import { getSupabase } from '../lib/supabase'
import { SHOWROOMS, HOURS } from '../data/showrooms'
import { demoProducts } from '../data/demoProducts'
import { PRODUCT_CATEGORIES, normalizeProduct } from '../data/productTaxonomy'
import hero1Img from '../assets/images/enhanced/hero-1.webp'
import showroomQuintaImg from '../assets/images/enhanced/showroom-quinta-ai.webp'
import showroomAlmancilImg from '../assets/images/enhanced/showroom-almancil-ai.webp'
import kitchenHeroImg from '../assets/images/kitchen/kitchen-hero.webp'
import sicilyCornerImg from '../assets/images/sicily-corner.jpg'

const showroomMeta = {
  'quinta-do-lago': { img: showroomQuintaImg, pos: 'center 65%' },
  almancil: { img: showroomAlmancilImg, pos: 'center 30%' },
}

const productImage = (product) => product.images?.[0] || product.img || product.image || ''

function ProductPreview({ product }) {
  const image = productImage(product)
  return (
    <article className="home-product-card">
      <LocalizedLink to={product.route || `/product/${product.id}`} className="home-product-media">
        {image && <img src={image} alt="" loading="lazy" />}
      </LocalizedLink>
      <span className="rd-kicker fs">{product.categoryLabel}</span>
      <h3 className="ff"><LocalizedLink data-no-translate to={product.route || `/product/${product.id}`}>{product.name}</LocalizedLink></h3>
    </article>
  )
}

const STATUS_CONCEPT_HOMEPAGE = () => {
  const [nlEmail, setNlEmail] = useState('')
  const [nlStatus, setNlStatus] = useState('idle')

  const categories = useMemo(() => PRODUCT_CATEGORIES.map((category) => {
    const products = demoProducts.map(normalizeProduct).filter((product) => product.category === category.key)
    const image = category.key === 'lounge'
      ? sicilyCornerImg
      : category.key === 'kitchen'
        ? kitchenHeroImg
        : productImage(products[0]) || hero1Img
    return { ...category, image, count: products.length }
  }), [])

  const featuredProducts = useMemo(() => {
    const products = demoProducts.map(normalizeProduct)
    const preferred = ['sicily-modular-set', 'berlin-modular-sofa', 'glatz-alu-smart', 'teak-modular-outdoor-kitchen-barbecue-unit-with-6-burner-barbecue']
    const selected = preferred.map((id) => products.find((product) => product.id === id)).filter(Boolean)
    return selected.length >= 4 ? selected.slice(0, 4) : products.filter((product) => productImage(product)).slice(0, 4)
  }, [])

  const subscribe = async (event) => {
    event.preventDefault()
    if (nlStatus === 'sending') return
    const email = nlEmail.trim().toLowerCase().slice(0, 320)
    if (!email) return
    setNlStatus('sending')
    try {
      const supabase = await getSupabase()
      if (!supabase) throw new Error('no-backend')
      const { error } = await supabase.from('subscribers').insert({ email, source: 'homepage_newsletter' })
      if (error && error.code !== '23505') throw error
      setNlStatus('sent')
      setNlEmail('')
    } catch {
      setNlStatus('error')
    }
  }

  const showrooms = SHOWROOMS.map((showroom) => ({
    ...showroom,
    ...(showroomMeta[showroom.key] || {}),
  }))

  return (
    <Layout>
      <section className="home-hero">
        <img src={hero1Img} alt="Outdoor lounge overlooking the Algarve coast" />
        <div className="home-hero-overlay" />
        <div className="home-hero-copy">
          <span className="fs">Outdoor furniture specialists · Algarve</span>
          <h1 className="ff">Outdoor rooms,<br />considered.</h1>
          <LocalizedLink className="cb home-hero-cta" to="/products">Explore products <span aria-hidden="true">→</span></LocalizedLink>
        </div>
      </section>

      <main>
        <section className="home-section home-categories" aria-labelledby="home-categories-title">
          <div className="home-section-head">
            <div><span className="rd-kicker fs">The collection</span><h2 id="home-categories-title" className="ff">Made for life outside.</h2></div>
            <LocalizedLink className="rd-back-link fs" to="/products">View all products</LocalizedLink>
          </div>
          <div className="home-category-grid">
            {categories.map((category) => (
              <LocalizedLink key={category.key} to={`/products?cat=${category.key}`} className="home-category-card">
                <div className="home-category-media"><img src={category.image} alt="" loading="lazy" /></div>
                <div className="home-category-copy"><span className="rd-kicker fs">{String(category.count).padStart(2, '0')} pieces</span><h3 className="ff">{category.label}</h3><span className="fs">Explore <span aria-hidden="true">→</span></span></div>
              </LocalizedLink>
            ))}
          </div>
        </section>

        <section className="home-section home-featured" aria-labelledby="home-featured-title">
          <div className="home-section-head"><div><span className="rd-kicker fs">A considered edit</span><h2 id="home-featured-title" className="ff">Featured pieces.</h2></div><LocalizedLink className="rd-back-link fs" to="/products">Explore the catalogue</LocalizedLink></div>
          <div className="home-product-grid">{featuredProducts.map((product) => <ProductPreview key={product.id} product={product} />)}</div>
        </section>

        <section className="home-services" aria-label="Status Concept services">
          <div><span className="rd-kicker fs">Showrooms</span><strong className="ff">See the collection in person.</strong><LocalizedLink to="/contact">Plan your visit <span aria-hidden="true">→</span></LocalizedLink></div>
          <div><span className="rd-kicker fs">Installation</span><strong className="ff">Delivered and placed with care.</strong><LocalizedLink to="/contact">Talk to the team <span aria-hidden="true">→</span></LocalizedLink></div>
          <div><span className="rd-kicker fs">After Care</span><strong className="ff">Kept beautiful, season after season.</strong><LocalizedLink to="/after-care">Discover After Care <span aria-hidden="true">→</span></LocalizedLink></div>
        </section>

        <section className="home-section home-showrooms" aria-labelledby="home-showrooms-title">
          <div className="home-section-head"><div><span className="rd-kicker fs">Visit us</span><h2 id="home-showrooms-title" className="ff">Two Algarve showrooms.</h2></div><LocalizedLink className="rd-back-link fs" to="/contact">Contact the team</LocalizedLink></div>
          <div className="home-showroom-grid">
            {showrooms.map((showroom) => (
              <a key={showroom.key} className="home-showroom-card" href={showroom.maps} target="_blank" rel="noopener noreferrer">
                <div className="home-showroom-media"><img src={showroom.img} alt={showroom.name} style={{ objectPosition: showroom.pos }} loading="lazy" /></div>
                <div><span className="rd-kicker fs">Showroom</span><h3 className="ff">{showroom.name}</h3><p className="fs">{showroom.address}</p><span className="fs">Get directions <span aria-hidden="true">→</span></span></div>
              </a>
            ))}
          </div>
          <div className="home-hours">{HOURS.map((hours) => <span key={hours.label} className="fs"><strong>{hours.label}</strong> {hours.value}</span>)}</div>
        </section>

        <section className="home-newsletter" aria-labelledby="newsletter-title">
          <span className="rd-kicker fs">From the showroom</span>
          <h2 id="newsletter-title" className="ff">New collections and quiet notes from the Algarve.</h2>
          {nlStatus === 'sent' ? <p className="fs">Thank you — you're on the list.</p> : (
            <form onSubmit={subscribe}>
              <label className="sr-only" htmlFor="homepage-newsletter-email">Email address</label>
              <input id="homepage-newsletter-email" type="email" required placeholder="Your email address" value={nlEmail} onChange={(event) => setNlEmail(event.target.value)} />
              <button type="submit" disabled={nlStatus === 'sending'}>{nlStatus === 'sending' ? 'Sending…' : 'Subscribe'}</button>
            </form>
          )}
          {nlStatus === 'error' && <p className="fs" role="alert">Something went wrong. Please try again.</p>}
        </section>
      </main>
    </Layout>
  )
}

export default STATUS_CONCEPT_HOMEPAGE
