import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const pages = [
  { path: '/', label: 'Homepage' },
  { path: '/products', label: 'Products' },
  { path: '/collection', label: 'Collection' },
  { path: '/product/sicily', label: 'Product Detail' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/contact', label: 'Contact' },
]

export default function PageNav() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, fontFamily: "'Outfit', sans-serif" }}>
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
              }}
              onMouseEnter={e => { if (pathname !== p.path) e.target.style.color = '#b8965a' }}
              onMouseLeave={e => { if (pathname !== p.path) e.target.style.color = 'rgba(255,255,255,.7)' }}
            >
              {p.label}
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
  )
}
