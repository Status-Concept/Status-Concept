import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFavorites } from './FavoritesContext'

const pages = [
  { path: '/', label: 'Homepage' },
  { path: '/products', label: 'Products' },
  { path: '/collection', label: 'Collection' },
  { path: '/product/sicily', label: 'Product Detail' },
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

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Outfit', sans-serif", display: 'flex', gap: 8, alignItems: 'flex-end' }}>
      {/* Favorites FAB */}
      <button
        onClick={() => navigate('/favorites')}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          background: pathname === '/favorites' ? '#b8965a' : '#1a1a18',
          border: '1px solid rgba(184,150,90,.5)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s', position: 'relative',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={pathname === '/favorites' ? '#fff' : '#b8965a'} stroke={pathname === '/favorites' ? '#fff' : '#b8965a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {favorites.length > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#b8965a', color: '#fff', fontSize: 10,
            fontWeight: 500, width: 20, height: 20, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #1a1a18', letterSpacing: 0,
          }}>{favorites.length}</span>
        )}
      </button>

      {/* Pages menu */}
      <div>
        {open && (
          <div style={{
            position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
            background: '#1a1a18', border: '1px solid rgba(196,181,160,.3)',
            padding: '8px 0', minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          }}>
            {pages.map(p => (
              <div
                key={p.path}
                onClick={() => { navigate(p.path); setOpen(false) }}
                style={{
                  padding: '10px 20px', fontSize: 12, letterSpacing: 1.5,
                  textTransform: 'uppercase', cursor: 'pointer',
                  color: pathname === p.path ? '#b8965a' : 'rgba(255,255,255,.7)',
                  background: pathname === p.path ? 'rgba(184,150,90,.1)' : 'transparent',
                  transition: 'color .2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (pathname !== p.path) e.target.style.color = '#b8965a' }}
                onMouseLeave={e => { if (pathname !== p.path) e.target.style.color = 'rgba(255,255,255,.7)' }}
              >
                {p.label === 'Favorites' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#b8965a" stroke="#b8965a" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                )}
                {p.label}
                {p.label === 'Favorites' && favorites.length > 0 && (
                  <span style={{marginLeft:'auto',fontSize:10,opacity:.6}}>({favorites.length})</span>
                )}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          style={{
            padding: '10px 20px', background: '#1a1a18', color: '#b8965a',
            border: '1px solid rgba(184,150,90,.5)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,.3)', transition: 'all .3s',
          }}
        >
          Pages {open ? '▲' : '▼'}
        </button>
      </div>
    </div>
  )
}
