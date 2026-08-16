import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLangFromPath, stripLangFromPath, withLang } from '../utils/language'
import LocalizedLink from './LocalizedLink'
import SocialLinks from './SocialIcons'
import { CONTACT } from '../data/showrooms'
import { PRODUCT_MENU } from '../data/productMenu'
import { SITE_FEATURES } from '../config/sitePhase'

const SearchPanel = lazy(() => import('./SearchPanel'))

export default function Header({ onOpenMenu }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [hoverCat, setHoverCat] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const closeProducts = () => { setProductsOpen(false); setHoverCat(null) }
  const activeSub = PRODUCT_MENU.find((category) => category.key === hoverCat)
  const currentLang = getLangFromPath(location.pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'k') return
      event.preventDefault()
      setSearchOpen(true)
    }
    document.addEventListener('keydown', handleSearchShortcut)
    return () => document.removeEventListener('keydown', handleSearchShortcut)
  }, [])

  const changeLanguage = (lang) => {
    const currentPath = `${stripLangFromPath(location.pathname)}${location.search}`
    navigate(withLang(currentPath, lang))
    setLangOpen(false)
  }

  return (
    <>
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--cream)",
      boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,.08)" : "none",
      borderBottom: scrolled ? "none" : "1px solid var(--light-grey)",
      transition: "box-shadow .3s ease",
    }}>
      <div className="fs header-top" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "7px 48px", fontSize: "11px", letterSpacing: "1px",
        color: "var(--text-grey)",
        background: "var(--light-grey)",
      }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <a href={CONTACT.phoneHref} data-no-translate style={{ color: "inherit", textDecoration: "none" }}>{CONTACT.phone}</a>
          <span style={{ opacity: .4 }}>|</span>
          <a href={CONTACT.emailHref} data-no-translate style={{ color: "inherit", textDecoration: "none" }}>{CONTACT.email}</a>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            className="fs"
            aria-label={currentLang === 'pt' ? 'Login' : 'Login'}
            onClick={() => navigate(withLang('/login', currentLang))}
            style={{
              background: "transparent",
              border: "1px solid var(--mid-grey)",
              color: "var(--text-dark)",
              cursor: "pointer",
              fontSize: "11px",
              letterSpacing: "2px",
              padding: "8px 16px",
            }}
          >
            LOGIN
          </button>
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <SocialLinks linkStyle={{ color: "var(--text-dark)" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <LocalizedLink to="/" aria-label="STATVS — home" style={{ display: "block", lineHeight: 1, textDecoration: "none" }}>
          <span className="logo-serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: 8, color: "var(--text-dark)" }}>
            ST<span style={{ color: "var(--accent)" }}>A</span>TVS
          </span>
          <div className="fs" style={{ fontSize: 9, letterSpacing: 2, color: "var(--text-grey)", marginTop: 2 }}>
            OUTDOOR FURNITURE SPECIALISTS
          </div>
        </LocalizedLink>
        <nav className="fs nav-desktop" style={{
          display: "flex", gap: "32px", alignItems: "center", fontSize: "12px",
          letterSpacing: "2px", textTransform: "uppercase",
          color: "var(--text-dark)",
        }}>
          {SITE_FEATURES.products && <div
            style={{ position: "relative" }}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={closeProducts}
            onFocus={() => setProductsOpen(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) closeProducts() }}
            onKeyDown={(e) => { if (e.key === "Escape") closeProducts() }}
          >
            <LocalizedLink
              className="nl"
              aria-haspopup="true"
              aria-expanded={productsOpen}
              to="/products"
              onClick={closeProducts}
              style={{ color: "inherit", font: "inherit", letterSpacing: "inherit", textTransform: "inherit", cursor: "pointer", padding: "8px 0", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              Products
              <span aria-hidden="true" style={{ fontSize: 8, opacity: .6, transform: productsOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
            </LocalizedLink>
            {productsOpen && (
              <div style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, zIndex: 120 }}>
                <div style={{ display: "flex", alignItems: "stretch", background: "var(--white)", border: "1px solid var(--mid-grey)", boxShadow: "var(--shadow-md)", borderRadius: 2 }}>
                  {/* Level 1 — categories */}
                  <div role="menu" aria-label="Products" style={{ padding: "10px 0", minWidth: 236, flex: "0 0 auto" }}>
                    {PRODUCT_MENU.map((category) => {
                      const hasSub = category.items?.length > 0
                      const isActive = hoverCat === category.key
                      return (
                        <LocalizedLink
                          key={category.key}
                          role="menuitem"
                          to={category.to}
                          aria-haspopup={hasSub ? "true" : undefined}
                          aria-expanded={hasSub ? isActive : undefined}
                          onMouseEnter={() => setHoverCat(category.key)}
                          onFocus={() => setHoverCat(category.key)}
                          onClick={closeProducts}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", font: "inherit", fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", color: isActive ? "var(--accent)" : "var(--text-body)", background: isActive ? "var(--light-grey)" : "none", padding: "11px 22px", cursor: "pointer", transition: "color .2s, background .2s" }}
                        >
                          <span>{category.label}</span>
                          {hasSub && <span aria-hidden="true" style={{ fontSize: 11, opacity: isActive ? .9 : .4 }}>›</span>}
                        </LocalizedLink>
                      )
                    })}
                  </div>
                  {/* Level 2 — type sub-menu */}
                  {activeSub?.items?.length > 0 && (
                    <div role="menu" aria-label={activeSub.label} style={{ borderLeft: "1px solid var(--light-grey)", padding: "10px 0", minWidth: 220, alignSelf: "stretch" }}>
                      {activeSub.items.map((item) => (
                        <LocalizedLink
                          key={item.to}
                          role="menuitem"
                          to={item.to}
                          onClick={closeProducts}
                          style={{ display: "block", font: "inherit", fontSize: 12, letterSpacing: ".3px", textTransform: "none", textDecoration: "none", color: "var(--text-body)", padding: "11px 24px", whiteSpace: "nowrap", cursor: "pointer", transition: "color .2s, background .2s" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--light-grey)" }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-body)"; e.currentTarget.style.background = "none" }}
                        >{item.name}</LocalizedLink>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>}
          {[[SITE_FEATURES.showrooms && "Showrooms", SITE_FEATURES.showrooms && "/about"], ["Contact", "/contact"]].filter(([label]) => label).map(([label, path]) => (
            <LocalizedLink key={label} className="nl" to={path} style={{ color: "inherit" }}>{label}</LocalizedLink>
          ))}
        </nav>
        <div className="header-actions">
          {SITE_FEATURES.search && <button
            type="button"
            className="header-search-trigger fs"
            aria-label={currentLang === 'pt' ? 'Pesquisar' : 'Search'}
            aria-haspopup="dialog"
            aria-expanded={searchOpen}
            aria-keyshortcuts="Control+K Meta+K"
            onClick={() => setSearchOpen(true)}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none">
              <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </button>}
          <div data-no-translate style={{ position: "relative" }}>
            <button
              type="button"
              className="fs"
              aria-label={currentLang === 'pt' ? 'Escolher idioma' : 'Choose language'}
              aria-haspopup="menu"
              aria-expanded={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              onKeyDown={(event) => { if (event.key === 'Escape') setLangOpen(false) }}
              style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "12px",
              letterSpacing: "2px", color: "var(--text-grey)", padding: "10px 12px",
              }}
            >
              {currentLang.toUpperCase()} v
            </button>
            {langOpen && (
              <div role="menu" aria-label={currentLang === 'pt' ? 'Idiomas' : 'Languages'} style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "var(--cream)", border: "1px solid var(--mid-grey)", padding: "8px 0", minWidth: 80, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
                {["EN", "PT"].map(l => (
                  <button key={l} type="button" role="menuitemradio" aria-checked={currentLang === l.toLowerCase()} className="fs" style={{ display: 'block', width: '100%', padding: "8px 16px", border: 0, background: 'transparent', textAlign: 'left', fontSize: "11px", letterSpacing: "2px", cursor: "pointer", color: "var(--text-body)", transition: "color .2s" }}
                    onClick={() => changeLanguage(l.toLowerCase())}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--accent)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-body)"}
                  >{l}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={onOpenMenu} className="nav-burger" aria-label={currentLang === 'pt' ? 'Abrir menu' : 'Open menu'} aria-haspopup="dialog" style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            width: 44, height: 44,
            color: "var(--text-dark)",
            display: "none", flexDirection: "column", justifyContent: "center", alignItems: "flex-end", gap: "5px",
          }}>
            <div style={{ width: 24, height: 1.5, background: "currentColor" }} />
            <div style={{ width: 18, height: 1.5, background: "currentColor" }} />
          </button>
        </div>
      </div>
    </header>
    {searchOpen && (
      <Suspense fallback={<div className="site-search-loading" role="status">Loading search</div>}>
        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      </Suspense>
    )}
    </>
  )
}
