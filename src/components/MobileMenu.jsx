import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'

const NAV_ROUTES = {
  "Furniture": "/products",
  "Lounge": "/products?cat=lounge",
  "Dining": "/products?cat=dining",
  "Sun Loungers": "/products?cat=sunlounger",
  "Day Beds": "/products?cat=daybed",
  "Coffee Tables": "/products?cat=coffee",
  "Bar & Patio": "/products?cat=bar",
  "Shade Solutions": "/products?cat=shade",
  "Parasols": "/products?cat=shade",
  "Bioclimatic Pergolas": "/products?cat=shade",
  "Retractable Pergolas": "/products?cat=shade",
  "Outdoor Kitchens": "/products?cat=kitchen",
  "BBQ Systems": "/products?cat=kitchen",
  "Pizza Ovens": "/products?cat=kitchen",
  "Full Kitchens": "/products?cat=kitchen",
  "Decor": "/products?cat=decor",
  "Carpets": "/products?cat=decor",
  "Vases & Statues": "/products?cat=decor",
  "Leisure": "/products?cat=decor",
  "Sound Systems": "/products?cat=decor",
  "Projects": "/projects",
  "Why Us": "/about",
  "After Care": "/after-care",
  "Contact": "/contact",
}

export default function MobileMenu({ open, onClose }) {
  const navigate = useLocalizedNavigate()
  const go = (path) => { navigate(path); onClose() }

  return (
    <>
      <div className={`moo ${open ? "op" : ""}`} onClick={onClose} />
      <div className={`mo ${open ? "op" : ""}`}>
        <button onClick={onClose} style={{position:"absolute",top:28,right:28,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300}}>×</button>
        <nav style={{display:"flex",flexDirection:"column"}}>
          {[
            {l:"Furniture",s:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},
            {l:"Shade Solutions",s:["Parasols","Bioclimatic Pergolas","Retractable Pergolas"]},
            {l:"Outdoor Kitchens",s:["BBQ Systems","Pizza Ovens","Full Kitchens"]},
            {l:"Decor",s:["Carpets","Vases & Statues"]},
            {l:"Leisure",s:["Sound Systems"]},
            {l:"Projects",s:[]},
            {l:"Why Us",s:[]},
            {l:"After Care",s:[]},
            {l:"Contact",s:[]},
          ].map(item => (
            <div key={item.l} style={{borderBottom:"1px solid var(--sand-l)",padding:"16px 0"}}>
              <span className="ff" style={{fontSize:22,fontWeight:400,color:"var(--stone)",cursor:"pointer"}}
                onClick={() => NAV_ROUTES[item.l] && go(NAV_ROUTES[item.l])}
              >{item.l}</span>
              {item.s.length > 0 && (
                <div className="fs" style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
                  {item.s.map(s => (
                    <span key={s} style={{fontSize:12,letterSpacing:1,color:"var(--sand-d)",cursor:"pointer",paddingLeft:12}}
                      onClick={() => NAV_ROUTES[s] && go(NAV_ROUTES[s])}
                    >{s}</span>
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
