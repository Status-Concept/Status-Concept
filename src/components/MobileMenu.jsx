import { useEffect, useRef } from 'react'
import LocalizedLink from './LocalizedLink'

const NAV_ROUTES = {
  "Products": "/products",
  "Furniture": "/products",
  "Glatz Parasols": "/glatz-parasols",
  "Lounge": "/products?cat=lounge",
  "Dining": "/products?cat=dining",
  "Sun Loungers": "/products?cat=sunlounger",
  "Day Beds": "/products?cat=daybed",
  "Coffee Tables": "/products?cat=coffee",
  "Bar & Patio": "/products?cat=bar",
  "Shade Solutions": "/products?cat=shade",
  "Parasols": "/glatz-parasols",
  "Bioclimatic Pergolas": "/products?cat=shade",
  "Retractable Pergolas": "/products?cat=shade",
  "Outdoor Kitchens": "/products?cat=kitchen",
  "BBQ Systems": "/products?cat=kitchen",
  "Pizza Ovens": "/products?cat=kitchen",
  "Full Kitchens": "/products?cat=kitchen",
  "Projects": "/projects",
  "Why Us": "/about",
  "After Care": "/after-care",
  "Contact": "/contact",
}

export default function MobileMenu({ open, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  return (
    <>
      <div className={`moo ${open ? "op" : ""}`} onClick={onClose} aria-hidden="true" />
      <div className={`mo ${open ? "op" : ""}`} role="dialog" aria-modal="true" aria-label="Menu" inert={!open}>
        <button ref={closeRef} onClick={onClose} aria-label="Close menu" style={{position:"absolute",top:28,right:28,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300}}>×</button>
        <nav style={{display:"flex",flexDirection:"column"}}>
          {[
            {l:"Products",s:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},
            {l:"Shade Solutions",s:["Glatz Parasols","Parasols","Bioclimatic Pergolas","Retractable Pergolas"]},
            {l:"Outdoor Kitchens",s:["BBQ Systems","Pizza Ovens","Full Kitchens"]},
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
