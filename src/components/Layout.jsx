import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import MobileMenu from './MobileMenu'
import Footer from './Footer'
import { getLangFromPath, stripLangFromPath, withLang } from '../utils/language'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const pagePath = stripLangFromPath(location.pathname)
  const hasPageSpecificBack = pagePath === '/products'
    || pagePath.startsWith('/product/')
    || /^\/staff\/deliveries\/[^/]+$/.test(pagePath)
  const showHistoryBack = pagePath !== '/' && !hasPageSpecificBack

  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }
    navigate(withLang('/', getLangFromPath(location.pathname)))
  }

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
      {showHistoryBack && (
        <div className="site-history-back-wrap">
          <button type="button" className="rd-detail-back" onClick={goBack}>
            <span aria-hidden="true">←</span>
            <span>{getLangFromPath(location.pathname) === 'pt' ? 'Voltar' : 'Back'}</span>
          </button>
        </div>
      )}
      <div id="main" tabIndex={-1} style={{ scrollMarginTop: 'var(--header-h)' }}>{children}</div>
      <Footer />
    </div>
  )
}
