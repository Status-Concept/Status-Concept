import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import LocalizedLink from './LocalizedLink'
import { getLangFromPath } from '../utils/language'

const NAV_ROUTES = {
  "Products": "/products",
  "Furniture": "/products",
  "Lounge": "/products?cat=lounge",
  "Dining": "/products?cat=dining",
  "Sun Loungers": "/products?cat=sunlounger",
  "Day Beds": "/products?cat=daybed",
  "Coffee Tables": "/products?cat=coffee",
  "Bar & Patio": "/products?cat=bar",
  "Shade Solutions": "/products?cat=shade",
  "Upholstered": "/products?cat=lounge&subcat=upholstered",
  "Rope": "/products?cat=lounge&subcat=rope",
  "Aluminium": "/products?cat=lounge&subcat=aluminium",
  "Pergolas": "/products?cat=shade&subcat=pergolas",
  "Glatz Parasols": "/glatz-parasols",
  "Awnings": "/products?cat=shade&subcat=awnings",
  "Outdoor Kitchens": "/products?cat=kitchen",
  "Modular Kitchens": "/products?cat=kitchen",
  "Built-in Kitchens": "/products?cat=kitchen&mode=built-in",
  "Black Stainless Steel": "/products?cat=kitchen&collection=black-stainless-steel",
  "Carbon Line Teak": "/products?cat=kitchen&collection=carbon-line-teak",
  "Teak": "/products?cat=kitchen&collection=teak",
  "Attachments & Accessories": "/products?cat=kitchen&subcat=accessories",
  "BBQs": "/products?cat=kitchen&subcat=bbq",
  "Projects": "/projects",
  "Why Us": "/about",
  "After Care": "/after-care",
  "Contact": "/contact",
}

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
    document.addEventListener("keydown", onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  // Keep a closed modal out of both the tab order and accessibility tree.
  // Mounting only while open is more reliable than `inert` across browsers.
  if (!open) return null

  return (
    <>
      <div className="moo op" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="mo op" role="dialog" aria-modal="true" aria-label={isPortuguese ? 'Menu de navegação' : 'Navigation menu'}>
        <button type="button" ref={closeRef} onClick={onClose} aria-label={isPortuguese ? 'Fechar menu' : 'Close menu'} style={{position:"absolute",top:28,right:28,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300}}>×</button>
        <nav style={{display:"flex",flexDirection:"column"}}>
          {[
            {l:"Products",s:["Lounge","Upholstered","Rope","Aluminium","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},
            {l:"Shade Solutions",s:["Pergolas","Glatz Parasols","Awnings"]},
            {l:"Outdoor Kitchens",s:[]},
            {l:"Modular Kitchens",s:["Black Stainless Steel","Carbon Line Teak","Teak","Attachments & Accessories","BBQs"]},
            {l:"Built-in Kitchens",s:[]},
            {l:"Leisure",s:["Sound Systems"]},
            {l:"Projects",s:[]},
            {l:"Why Us",s:[]},
            {l:"After Care",s:[]},
            {l:"Contact",s:[]},
          ].map(item => (
            <div key={item.l} style={{borderBottom:"1px solid var(--sand-l)",padding:"16px 0"}}>
              {NAV_ROUTES[item.l] ? (
                <LocalizedLink className="ff" to={NAV_ROUTES[item.l]} onClick={onClose}
                  style={{font:"inherit",fontSize:22,fontWeight:400,color:"var(--stone)",cursor:"pointer",textDecoration:"none",display:"inline-block"}}
                >{item.l}</LocalizedLink>
              ) : (
                <span className="ff" style={{font:"inherit",fontSize:22,fontWeight:400,color:"var(--stone)"}}>{item.l}</span>
              )}
              {item.s.length > 0 && (
                <div className="fs" style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                  {item.s.map(s => NAV_ROUTES[s] ? (
                    <LocalizedLink key={s} to={NAV_ROUTES[s]} onClick={onClose}
                      style={{font:"inherit",fontSize:12,letterSpacing:1,color:"var(--sand-d)",cursor:"pointer",textDecoration:"none",padding:"8px 0 12px 12px"}}
                    >{s}</LocalizedLink>
                  ) : (
                    <span key={s} style={{font:"inherit",fontSize:12,letterSpacing:1,color:"var(--sand-d)",padding:"8px 0 12px 12px"}}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div style={{marginTop:32,display:"flex",gap:12}}>
          <span className="mb">Sunbrella®</span>
          <span className="mb">Glatz</span>
        </div>
      </div>
    </>
  )
}
