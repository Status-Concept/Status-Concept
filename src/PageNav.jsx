import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useFavorites } from './FavoritesContext'
import { getLangFromPath, stripLangFromPath, withLang } from './utils/language'

const pages = [
  { path: '/', label: 'Homepage' },
  { path: '/products', label: 'Products' },
  { path: '/collection', label: 'Collection' },
  { path: '/product/sicily-modular-set', label: 'Product Detail' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
  { path: '/favorites', label: 'Favorites' },
]

export default function PageNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { favorites } = useFavorites()
  const { isAuthenticated } = useAuth()
  const currentLang = getLangFromPath(pathname)
  const cleanPathname = stripLangFromPath(pathname)
  const goTo = (path) => navigate(withLang(path, currentLang))
  const accountPage = isAuthenticated
    ? { path: '/cliente', label: 'A Minha Conta' }
    : { path: '/login', label: 'Login' }
  const menuPages = [...pages, accountPage]
  const isFavoritesPage = cleanPathname === '/favorites'

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Outfit', sans-serif", display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      <button
        onClick={() => goTo('/favorites')}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: isFavoritesPage ? '#c41e3a' : 'var(--stone, #1a1a2e)',
          border: '1px solid rgba(196,30,58,.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavoritesPage ? '#fff' : '#c41e3a'} stroke={isFavoritesPage ? '#fff' : '#c41e3a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {favorites.length > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#c41e3a', color: '#fff', fontSize: 10,
            fontWeight: 500, width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #1a1a2e', letterSpacing: 0,
          }}>{favorites.length}</span>
        )}
      </button>

      <div>
        {open && (
          <div style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
            background: 'var(--stone, #1a1a2e)', border: '1px solid rgba(163,180,200,.3)',
            padding: '8px 0', minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
            borderRadius: 3,
          }}>
            {menuPages.map(p => {
              const active = cleanPathname === p.path
              return (
                <div
                  key={p.path}
                  onClick={() => { goTo(p.path); setOpen(false) }}
                  style={{
                    padding: '10px 20px', fontSize: 12, letterSpacing: 1.5,
                    textTransform: 'uppercase', cursor: 'pointer',
                    color: active ? '#c41e3a' : 'rgba(255,255,255,.7)',
                    background: active ? 'rgba(196,30,58,.1)' : 'transparent',
                    transition: 'all .2s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#c41e3a'; e.currentTarget.style.background = 'rgba(196,30,58,.05)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,.7)'; e.currentTarget.style.background = 'transparent' } }}
                >
                  {p.label === 'Favorites' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#c41e3a" stroke="#c41e3a" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                  )}
                  {p.label}
                  {p.label === 'Favorites' && favorites.length > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, opacity: .6 }}>({favorites.length})</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          style={{
            padding: '10px 20px', background: 'var(--stone, #1a1a2e)', color: '#c41e3a',
            border: '1px solid rgba(196,30,58,.5)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8, borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          Pages {open ? '^' : 'v'}
        </button>
      </div>
    </div>
  )
}
