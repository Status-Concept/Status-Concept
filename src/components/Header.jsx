import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLangFromPath, stripLangFromPath, withLang } from '../utils/language'
import SocialLinks from './SocialIcons'

export default function Header({ transparent = false, onOpenMenu }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [headerSolid, setHeaderSolid] = useState(!transparent)
  const [langOpen, setLangOpen] = useState(false)
  const currentLang = getLangFromPath(location.pathname)

  useEffect(() => {
    if (!transparent) return
    const handleScroll = () => setHeaderSolid(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparent])

  const solid = !transparent || headerSolid
  const goTo = (path) => navigate(withLang(path, currentLang))
  const changeLanguage = (lang) => {
    const currentPath = `${stripLangFromPath(location.pathname)}${location.search}`
    navigate(withLang(currentPath, lang))
    setLangOpen(false)
  }

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: solid ? "rgba(232,240,248,.97)" : "transparent",
      backdropFilter: solid ? "blur(16px)" : "none",
      borderBottom: solid ? "1px solid rgba(163,180,200,.3)" : "1px solid transparent",
      transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)",
    }}>
      <div className="fs header-top" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 48px", fontSize: "11px", letterSpacing: "1.5px",
        color: solid ? "var(--sand-d)" : "rgba(255,255,255,.7)",
        borderBottom: solid ? "1px solid rgba(163,180,200,.15)" : "1px solid rgba(255,255,255,.1)",
        transition: "all .4s",
      }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <span>+351 289 030 179</span>
          <span style={{ opacity: .4 }}>|</span>
          <span>info@statusconcept.com</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {transparent && (
            <button
              className="fs"
              onClick={() => goTo(isAuthenticated ? "/cliente" : "/login")}
              style={{
                padding: "5px 12px",
                border: `1px solid ${solid ? "rgba(196,30,58,.35)" : "rgba(255,255,255,.28)"}`,
                background: solid ? "rgba(196,30,58,.06)" : "rgba(255,255,255,.08)",
                color: solid ? "var(--gold)" : "rgba(255,255,255,.82)",
                borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: 2,
                textTransform: "uppercase", transition: "all .3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--gold)"
                e.currentTarget.style.color = solid ? "var(--gold-l)" : "#fff"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = solid ? "rgba(196,30,58,.35)" : "rgba(255,255,255,.28)"
                e.currentTarget.style.color = solid ? "var(--gold)" : "rgba(255,255,255,.82)"
              }}
            >
              {isAuthenticated ? "A Minha Conta" : "Login"}
            </button>
          )}
          <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            <SocialLinks linkStyle={{ opacity: .65, color: solid ? "var(--sand-d)" : "rgba(255,255,255,.7)" }} />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px" }}>
        <div style={{ cursor: "pointer", lineHeight: 1 }} onClick={() => goTo('/')}>
          <span className="ff" style={{ fontSize: 28, fontWeight: 400, letterSpacing: 8, color: solid ? "var(--stone)" : "#fff", transition: "color .4s" }}>
            ST<span style={{ color: "var(--gold)" }}>A</span>TVS
          </span>
          <div className="fs" style={{ fontSize: 7, letterSpacing: 3, color: solid ? "var(--sand-d)" : "rgba(255,255,255,.6)", transition: "color .4s", marginTop: 2 }}>
            OUTDOOR FURNITURE SPECIALISTS
          </div>
        </div>
        <nav className="fs nav-desktop" style={{
          display: "flex", gap: "32px", alignItems: "center", fontSize: "12px",
          letterSpacing: "2px", textTransform: "uppercase",
          color: solid ? "var(--stone-l)" : "rgba(255,255,255,.9)",
          transition: "color .4s",
        }}>
          {["Furniture", "Shade", "Kitchens", "Decor", "Projects", "Showrooms", "Contact"].map(i => (
            <a key={i} className="nl" href="#" style={{ color: "inherit" }}>{i}</a>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div data-no-translate style={{ position: "relative" }}>
            <button className="fs" onClick={() => setLangOpen(!langOpen)} style={{
              background: "none", border: "none", cursor: "pointer", fontSize: "11px",
              letterSpacing: "2px", color: solid ? "var(--sand-d)" : "rgba(255,255,255,.7)", transition: "color .4s",
            }}>
              {currentLang.toUpperCase()} v
            </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "var(--cream)", border: "1px solid var(--sand-l)", padding: "8px 0", minWidth: 80, boxShadow: "0 8px 24px rgba(0,0,0,.12)" }}>
                {["EN", "PT"].map(l => (
                  <div key={l} className="fs" style={{ padding: "6px 16px", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", color: "var(--stone-l)", transition: "color .2s" }}
                    onClick={() => changeLanguage(l.toLowerCase())}
                    onMouseEnter={e => e.target.style.color = "var(--gold)"}
                    onMouseLeave={e => e.target.style.color = "var(--stone-l)"}
                  >{l}</div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onOpenMenu} className="nav-burger" style={{
            background: "none", border: "none", cursor: "pointer", padding: 4,
            color: solid ? "var(--stone)" : "#fff",
            transition: "color .4s", display: "none", flexDirection: "column", gap: "5px",
          }}>
            <div style={{ width: 24, height: 1.5, background: "currentColor", transition: "all .3s" }} />
            <div style={{ width: 18, height: 1.5, background: "currentColor", marginLeft: "auto", transition: "all .3s" }} />
          </button>
        </div>
      </div>
    </header>
  )
}
