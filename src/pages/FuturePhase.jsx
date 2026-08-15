import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'

export default function FuturePhase() {
  return (
    <Layout>
      <main className="rd-section" style={{ minHeight: '58vh', display: 'grid', placeItems: 'center' }}>
        <div style={{ maxWidth: 620, textAlign: 'center' }}>
          <span className="rd-kicker fs">STATVS</span>
          <h1 className="rd-title ff">This feature is planned for a future phase.</h1>
          <p className="rd-lede fs">The current site is intentionally limited to Phase 1 foundations. Please contact the showroom team if you need help in the meantime.</p>
          <LocalizedLink className="cb cg" to="/contact">Contact the showroom</LocalizedLink>
        </div>
      </main>
    </Layout>
  )
}

