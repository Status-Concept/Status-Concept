import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLangFromPath, stripLangFromPath, withLang } from '../utils/language'
import SocialLinks from './SocialIcons'

const PRODUCT_LINKS = [
  ["Lounge", "/products?cat=lounge"],
  ["Dining", "/products?cat=dining"],
  ["Sun Loungers & Day Beds", "/products?cat=sunlounger"],
  ["Shade Solutions", "/products?cat=shade"],
  ["Glatz Parasols", "/glatz-parasols"],
  ["Outdoor Kitchens", "/products?cat=kitchen"],
]

export default function Header({ onOpenMenu }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, profile, user } = useAuth()
  const firstName = (profile?.name || user?.email || "").split(/[\s@]/)[0]
  const [scrolled, setScrolled] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const currentLang = getLangFromPath(location.pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goTo = (path) => navigate(withLang(path, currentLang))
  const changeLanguage = (lang) => {
    const currentPath = `${stripLangFromPath(location.pathname)}${location.search}`
    navigate(withLang(currentPath, lang))
    setLangOpen(false)
  }

  return (
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
          <a href="tel:+351289030179" data-no-translate style={{ color: "inherit", textDecoration: "none" }}>+351 289 030 179</a>
          <span style={{ opacity: .4 }}>|</span>
          <a href="mailto:info@statusconcept.com" data-no-translate style={{ color: "inherit", textDecoration: "none" }}>info@statusconcept.com</a>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="fs"
            data-no-translate={isAuthenticated ? true : undefined}
            onClick={() => goTo(isAuthenticated ? "/cliente" : "/login")}
            style={{
              padding: "6px 16px",
              border: "1px solid var(--mid-grey)",
              background: "transparent",
              color: "var(--text-dark)",
              borderRadius: 2, cursor: "pointer", fontSize: 12, letterSpacing: 1.5,
              textTransform: "uppercase", transition: "color .3s, border-color .3s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--accent)"
              e.currentTarget.style.color = "var(--accent)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--mid-grey)"
              e.currentTarget.style.color = "var(--text-grey)"
            }}
          >
            {isAuthenticated ? (firstName || "A Minha Conta") : "Login"}
          </button>
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <SocialLinks linkStyle={{ color: "var(--text-dark)" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", maxWidth: "var(--max-width)", margin: "0 auto" }}>
        <div style={{ cursor: "pointer", lineHeight: 1 }} onClick={() => goTo('/')}>
          <span className="logo-serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: 8, color: "var(--text-dark)" }}>
            ST<span style={{ color: "var(--accent)" }}>A</span>TVS
          </span>
          <div className="fs" style={{ fontSize: 9, letterSpacing: 2, color: "var(--text-grey)", marginTop: 2 }}>
            OUTDOOR FURNITURE SPECIALISTS
          </div>
        </div>
        <nav className="fs nav-desktop" style={{
          display: "flex", gap: "32px", alignItems: "center", fontSize: "12px",
          letterSpacing: "2px", textTransform: "uppercase",
          color: "var(--text-dark)",
        }}>
          <div
            style={{ position: "relative" }}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
            onFocus={() => setProductsOpen(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProductsOpen(false) }}
            onKeyDown={(e) => { if (e.key === "Escape") setProductsOpen(false) }}
          >
            <button
              type="button"
              className="nl"
              aria-haspopup="true"
              aria-expanded={productsOpen}
              onClick={() => { setProductsOpen(false); goTo('/products') }}
              style={{ color: "inherit", background: "none", border: "none", font: "inherit", letterSpacing: "inherit", textTransform: "inherit", cursor: "pointer", padding: "8px 0", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              Products
              <span aria-hidden="true" style={{ fontSize: 8, opacity: .6, transform: productsOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }}>▾</span>
            </button>
            {productsOpen && (
              <div role="menu" aria-label="Products" style={{ position: "absolute", top: "100%", left: 0, paddingTop: 8, minWidth: 240, zIndex: 120 }}>
                <div style={{ background: "var(--white)", border: "1px solid var(--mid-grey)", boxShadow: "var(--shadow-md)", borderRadius: 2, padding: "10px 0" }}>
                  {PRODUCT_LINKS.map(([label, path]) => (
                    <button
                      key={label}
                      type="button"
                      role="menuitem"
                      onClick={() => { setProductsOpen(false); goTo(path) }}
                      style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", font: "inherit", fontSize: 11, letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-body)", padding: "11px 22px", cursor: "pointer", transition: "color .2s, background .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--light-grey)" }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--text-body)"; e.currentTarget.style.background = "none" }}
                    >{label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {["Projects", "Showrooms", "Contact"].map(i => (
            <a key={i} className="nl" href="#" style={{ color: "inherit" }}>{i}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div data-no-translate style={{ position: "relative" }}>
            <button className="fs" onClick={() => setLangOpen(!langOpen)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "12px",
              letterSpacing: "2px", color: "var(--text-grey)", padding: "10px 12px",
            }}>
              {currentLang.toUpperCase()} v
            </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "var(--cream)", border: "1px solid var(--mid-grey)", padding: "8px 0", minWidth: 80, boxShadow: "0 8px 24px rgba(0,0,0,.08)" }}>
                {["EN", "PT"].map(l => (
                  <div key={l} className="fs" style={{ padding: "6px 16px", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", color: "var(--text-body)", transition: "color .2s" }}
                    onClick={() => changeLanguage(l.toLowerCase())}
                    onMouseEnter={e => e.target.style.color = "var(--accent)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-body)"}
                  >{l}</div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onOpenMenu} className="nav-burger" style={{
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
  )
}
