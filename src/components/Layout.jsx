import { useState } from 'react'
import Header from './Header'
import MobileMenu from './MobileMenu'
import Footer from './Footer'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--text-dark)", background: "var(--white)", minHeight: "100vh", overflowX: "clip", paddingTop: "var(--header-h)" }}>
      <Header onOpenMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {children}
      <Footer />
    </div>
  )
}
