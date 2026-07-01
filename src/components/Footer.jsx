import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate'
import SocialLinks from './SocialIcons'

const ROUTES = {
  "Lounge": "/products?cat=lounge",
  "Dining": "/products?cat=dining",
  "Sun Loungers": "/products?cat=sunlounger",
  "Day Beds": "/products?cat=daybed",
  "Coffee Tables": "/products?cat=coffee",
  "Bar & Patio": "/products?cat=bar",
  "Glatz Parasols": "/glatz-parasols",
  "Parasols": "/products?cat=shade",
  "Bioclimatic Pergolas": "/products?cat=shade",
  "Outdoor Kitchens": "/products?cat=kitchen",
  "Decor": "/products?cat=decor",
  "Leisure": "/products?cat=decor",
  "Why Us": "/about",
  "After Care": "/after-care",
  "Projects": "/projects",
  "Gallery": "/gallery",
  "Catalogue": "/catalogue",
  "Showroom Quinta do Lago": "/contact",
  "Showroom Almancil": "/contact",
}

export default function Footer() {
  const navigate = useLocalizedNavigate()
  return (
    <footer style={{background:"var(--black)",color:"#fff",padding:"72px 48px 36px"}}>
      <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:"var(--max-width)",margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.1)"}}>
        <div>
          <div style={{marginBottom:20}}>
            <span className="logo-serif" style={{fontSize:24,fontWeight:400,letterSpacing:8}}>ST<span style={{color:"var(--accent)"}}>A</span>TVS</span>
            <div className="fs" style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,.4)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div>
          </div>
          <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.55)",fontWeight:300}}>High quality lifestyle furniture in the Algarve. Serving Vale do Lobo, Quinta do Lago, Vilamoura, and beyond.</p>
          <div style={{display:"flex",gap:"2px",marginTop:20}}>
            <SocialLinks linkStyle={{color:"rgba(255,255,255,.45)"}} />
          </div>
        </div>
        {[
          {t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},
          {t:"Solutions",ls:["Glatz Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor","Leisure"]},
          {t:"Company",ls:["Why Us","After Care","Projects","Gallery","Catalogue"]},
          {t:"Contact",ls:["Showroom Quinta do Lago","Showroom Almancil","+351 289 030 179","info@statusconcept.com"]},
        ].map(c => (
          <div key={c.t}>
            <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"#fff",marginBottom:16,fontWeight:400}}>{c.t}</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {c.ls.map(l => (
                <a key={l}
                  href={ROUTES[l] || "#"}
                  className="fs"
                  style={{fontSize:13,color:"rgba(255,255,255,.55)",textDecoration:"none",fontWeight:300,transition:"color .2s",cursor:"pointer",padding:"6px 0"}}
                  onClick={e => { if(ROUTES[l]) { e.preventDefault(); navigate(ROUTES[l]) } }}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.55)"}
                >{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:"var(--max-width)",margin:"0 auto",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.62)",letterSpacing:1,flexWrap:"wrap",gap:12}}>
        <span>© 2026 Statvs. All rights reserved.</span>
        <div style={{display:"flex",gap:24}}>
          <a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a>
          <a href="#" style={{color:"inherit",textDecoration:"none"}}>Cookie Policy</a>
          <a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a>
        </div>
      </div>
    </footer>
  )
}
