import { useState } from 'react'
import Header from './Header'
import MobileMenu from './MobileMenu'
import Footer from './Footer'

export default function Layout({ children, transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <Header transparent={transparent} onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
      <Footer />
    </div>
  )
}
