import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import { useFavorites } from "../FavoritesContext";
import FavoriteButton from "../FavoriteButton";

const socialIcons = [
  {n:"Facebook",url:"https://facebook.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",url:"https://instagram.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",url:"https://pinterest.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",url:"https://linkedin.com/company/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const FAVORITES_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const { favorites, clearFavorites } = useFavorites();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);
  const S = (id) => ({
    opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  const handleClear = () => {
    if (confirmClear) { clearFavorites(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 3000); }
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .fav-card{position:relative;cursor:pointer;overflow:hidden;transition:all .4s cubic-bezier(0.16, 1, 0.3, 1);border-radius:3px}
        .fav-card:hover{transform:translateY(-6px)}
        .fav-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1),filter .5s}
        .fav-card:hover img{transform:scale(1.06);filter:brightness(.9)}
        .fav-card .fav-overlay{position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(0,0,0,.45));opacity:0;transition:opacity .4s}
        .fav-card:hover .fav-overlay{opacity:1}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(232,240,248,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(163,180,200,.3)",transition:"all .4s"}}>
        <div className="fs header-top" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",borderBottom:"1px solid rgba(163,180,200,.15)"}}>
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
            {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{opacity:.65,color:"var(--sand-d)"}}>{svg}</a>))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{cursor:"pointer",lineHeight:1}}>
            <span className="ff" style={{fontSize:28,fontWeight:400,letterSpacing:8,color:"var(--stone)"}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span>
            <div className="fs" style={{fontSize:7,letterSpacing:3,color:"var(--sand-d)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div>
          </div>
          <nav className="fs nav-desktop" style={{display:"flex",gap:"32px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div className="fs" style={{fontSize:"11px",letterSpacing:"2px",color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* PAGE HERO */}
      <section style={{paddingTop:"140px",paddingBottom:"60px",paddingLeft:"48px",paddingRight:"48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
        <div style={{maxWidth:"800px"}}>
          <div className="fs" style={{fontSize:"11px",letterSpacing:"3px",color:"var(--sand-d)",textTransform:"uppercase",marginBottom:"8px",animation:"fu .6s .2s both"}}>
            <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> My Favorites
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
            <div>
              <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:"20px",letterSpacing:"-0.01em",animation:"fu .6s .3s both"}}>
                <span style={{display:"flex",alignItems:"center",gap:"16px"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  My Favorites
                </span>
              </h1>
              <p className="fs" style={{fontSize:"15px",color:"var(--stone-l)",lineHeight:1.7,maxWidth:"600px",fontWeight:300,animation:"fu .6s .45s both"}}>
                {favorites.length === 0
                  ? "You haven't saved any favorites yet. Browse our collections and tap the heart on pieces you love."
                  : `You have ${favorites.length} saved ${favorites.length === 1 ? "piece" : "pieces"}. Click any item to view its details.`}
              </p>
            </div>
            {favorites.length > 0 && (
              <button onClick={handleClear} className="fs" style={{
                padding:"10px 24px",border:"1px solid var(--sand)",background:"transparent",borderRadius:2,
                fontSize:11,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",
                color: confirmClear ? "#c0392b" : "var(--sand-d)",
                borderColor: confirmClear ? "#c0392b" : "var(--sand)",
                transition:"all .3s",whiteSpace:"nowrap",animation:"fu .6s .5s both",
              }}>
                {confirmClear ? "Confirm clear all?" : "Clear all"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FAVORITES GRID */}
      {favorites.length > 0 ? (
        <section id="favgrid" data-animate style={{padding:"48px",minHeight:"40vh",...S("favgrid")}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
            <p className="fs" style={{fontSize:"13px",color:"var(--sand-d)"}}>
              Showing <strong style={{color:"var(--stone)"}}>{favorites.length}</strong> {favorites.length === 1 ? "favorite" : "favorites"}
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"28px",maxWidth:"1300px"}}>
            {favorites.map((item, i) => (
              <div key={item.id} className="fav-card"
                onClick={() => navigate(item.route || `/product/${item.collection?.toLowerCase() || item.id}`)}
                style={{animation:`fu .5s ${0.06*i}s both`}}>
                <div style={{position:"relative"}}>
                  <img src={item.img} alt={item.name} />
                  <div className="fav-overlay" />
                  <FavoriteButton product={item} size={18} style={{position:"absolute",top:12,right:12}} />
                </div>
                <div style={{padding:"16px 4px 8px"}}>
                  <h3 className="ff" style={{fontSize:"20px",fontWeight:400,marginBottom:"4px"}}>{item.name}</h3>
                  <p className="fs" style={{fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",textTransform:"uppercase"}}>{item.collection} Collection</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section style={{padding:"100px 48px",textAlign:"center",minHeight:"40vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--sand-l)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:28,opacity:.6}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:16,color:"var(--stone-l)"}}>No Favorites Yet</h2>
          <p className="fs" style={{fontSize:14,color:"var(--sand-d)",maxWidth:400,lineHeight:1.7,marginBottom:36,fontWeight:300}}>
            Explore our collections and click the heart icon on any piece to save it here for easy access later.
          </p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap",justifyContent:"center"}}>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>Browse products</a>
            <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Explore collections</a>
          </div>
        </section>
      )}

      {/* CONTINUE BROWSING CTA */}
      {favorites.length > 0 && (
        <section style={{padding:"60px 48px clamp(60px,10vh,100px)",textAlign:"center",borderTop:"1px solid var(--sand-l)"}}>
          <span className="fs sl">Discover more</span>
          <h2 className="ff" style={{fontSize:28,fontWeight:300,marginTop:12,marginBottom:28,letterSpacing:"-0.01em"}}>Continue Browsing</h2>
          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>All products</a>
            <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Homepage</a>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:400,letterSpacing:8}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span><div className="fs" style={{fontSize:7,letterSpacing:3,color:"rgba(255,255,255,.4)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve. Serving Vale do Lobo, Quinta do Lago, Vilamoura, and beyond.</p>
            <div style={{display:"flex",gap:"2px",marginTop:20}}>
              {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{color:"rgba(255,255,255,.4)"}}>{svg}</a>))}
            </div>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor","Leisure"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery","Catalogue"]},{t:"Contact",ls:["Showroom Quinta do Lago","Showroom Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.8)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1,flexWrap:"wrap",gap:12}}>
          <span>© 2026 Statvs. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default FAVORITES_PAGE;
