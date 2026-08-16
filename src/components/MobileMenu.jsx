import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import LocalizedLink from './LocalizedLink'
import { PRODUCT_MENU } from '../data/productMenu'
import { getLangFromPath } from '../utils/language'
import { SITE_FEATURES } from '../config/sitePhase'

const UTILITY_ITEMS = [
  { label: 'About', to: '/about', feature: 'showrooms' },
  { label: 'Contact', to: '/contact' },
].filter((item) => !item.feature || SITE_FEATURES[item.feature])

export default function MobileMenu({ open, onClose }) {
  const closeRef = useRef(null)
  const panelRef = useRef(null)
  const previousFocusRef = useRef(null)
  const location = useLocation()
  const isPortuguese = getLangFromPath(location.pathname) === 'pt'

  useEffect(() => {
    if (!open) return undefined
    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const linkStyle = {
    fontSize: 22,
    fontWeight: 400,
    color: 'var(--stone)',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  }
  const subLinkStyle = {
    fontSize: 12,
    letterSpacing: 1,
    color: 'var(--sand-d)',
    cursor: 'pointer',
    textDecoration: 'none',
    padding: '8px 0 12px 12px',
  }

  return (
    <>
      <div className="moo op" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="mo op" role="dialog" aria-modal="true" aria-label={isPortuguese ? 'Menu de navegação' : 'Navigation menu'}>
        <button
          type="button"
          ref={closeRef}
          onClick={onClose}
          aria-label={isPortuguese ? 'Fechar menu' : 'Close menu'}
          style={{ position: 'absolute', top: 28, right: 28, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: 'var(--stone)', fontWeight: 300, minWidth: 44, minHeight: 44 }}
        >×</button>

        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '1px solid var(--sand-l)', padding: '16px 0' }}>
            <LocalizedLink className="ff" to="/products" onClick={onClose} style={linkStyle}>Products</LocalizedLink>
            <div className="fs" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PRODUCT_MENU.map((category) => (
                <div key={category.key}>
                  <LocalizedLink to={category.to} onClick={onClose} style={{ ...subLinkStyle, display: 'block', color: 'var(--text-dark)', fontWeight: 500 }}>{category.label}</LocalizedLink>
                  {category.items?.map((item) => (
                    <LocalizedLink key={item.to} to={item.to} onClick={onClose} style={subLinkStyle}>{item.name}</LocalizedLink>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {UTILITY_ITEMS.map((item) => (
            <div key={item.to} style={{ borderBottom: '1px solid var(--sand-l)', padding: '16px 0' }}>
              <LocalizedLink className="ff" to={item.to} onClick={onClose} style={linkStyle}>{item.label}</LocalizedLink>
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <span className="mb">Sunbrella®</span>
          <span className="mb">Glatz</span>
        </div>
      </div>
    </>
  )
}
