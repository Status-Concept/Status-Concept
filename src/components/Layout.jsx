import { useState } from 'react'
import Header from './Header'
import MobileMenu from './MobileMenu'
import Footer from './Footer'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text-dark)", background: "var(--white)", minHeight: "100vh", overflowX: "clip", paddingTop: "var(--header-h)" }}>
      <a href="#main" className="skip-link" onClick={(event) => {
        event.preventDefault()
        const content = document.getElementById('main')
        content?.focus({ preventScroll: true })
        content?.scrollIntoView({ block: 'start' })
      }}>Skip to content</a>
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div id="main" tabIndex={-1} style={{ scrollMarginTop: 'var(--header-h)' }}>{children}</div>
      <Footer />
    </div>
  )
}
