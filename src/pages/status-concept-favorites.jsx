import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import { useFavorites } from "../FavoritesContext";
import FavoriteButton from "../FavoriteButton";

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
    opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)",
    transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  const handleClear = () => {
    if (confirmClear) {
      clearFavorites();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#1a1a18", background: "#faf9f6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--sand:#c4b5a0;--sand-l:#e8e0d4;--sand-d:#8a7d6b;--ocean:#2a5f7a;--ocean-d:#1a3d52;--stone:#1a1a18;--stone-l:#3d3d3a;--cream:#faf9f6;--cream-w:#f5f0e8;--gold:#b8965a;--gold-l:#d4bc8a}
        .fs{font-family:'Outfit',sans-serif}.ff{font-family:'Cormorant Garamond',Georgia,serif}
        @keyframes fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .nl{position:relative;text-decoration:none;color:inherit;transition:color .3s;padding-bottom:2px}
        .nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--gold);transition:width .4s cubic-bezier(.22,1,.36,1)}
        .nl:hover::after{width:100%}.nl:hover{color:var(--gold)}
        .la{width:60px;height:1px;background:var(--gold)}
        .sl{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--sand-d)}
        .cb{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border:1px solid;transition:all .5s cubic-bezier(.22,1,.36,1);cursor:pointer}
        .cd{color:var(--stone);border-color:var(--stone);background:transparent}.cd:hover{background:var(--stone);color:var(--cream)}
        .fav-card{position:relative;cursor:pointer;overflow:hidden;transition:all .5s}
        .fav-card:hover{transform:translateY(-4px)}
        .fav-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1),filter .5s}
        .fav-card:hover img{transform:scale(1.05);filter:brightness(.92)}
        .fav-card .fav-overlay{position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(0,0,0,.45));opacity:0;transition:opacity .5s}
        .fav-card:hover .fav-overlay{opacity:1}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(250,249,246,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(196,181,160,.3)",transition:"all .5s"}}>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",borderBottom:"1px solid rgba(196,181,160,.15)"}}>
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"16px"}}>{["Fb","Ig","Pi","Li"].map(s=><span key={s} style={{cursor:"pointer",opacity:.7}}>{s}</span>)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:"4px",cursor:"pointer"}}>
            <span className="ff" style={{fontSize:"28px",fontWeight:500,letterSpacing:"3px",color:"var(--stone)"}}>STATUS</span>
            <span className="fs" style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"var(--sand-d)",marginLeft:"4px"}}>CONCEPT</span>
          </div>
          <nav className="fs" style={{display:"flex",gap:"32px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <div className="fs" style={{fontSize:"11px",letterSpacing:"2px",color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
          </div>
        </div>
      </header>

      {/* PAGE HERO */}
      <section style={{paddingTop:"140px",paddingBottom:"60px",paddingLeft:"48px",paddingRight:"48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
        <div style={{maxWidth:"800px"}}>
          <div className="fs" style={{fontSize:"11px",letterSpacing:"3px",color:"var(--sand-d)",textTransform:"uppercase",marginBottom:"8px",animation:"fu .8s .2s both"}}>
            <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none"}}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> My Favorites
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:"20px",animation:"fu .8s .3s both"}}>
                <span style={{display:"flex",alignItems:"center",gap:"16px"}}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--gold)" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  My Favorites
                </span>
              </h1>
              <p className="fs" style={{fontSize:"15px",color:"var(--stone-l)",lineHeight:1.7,maxWidth:"600px",fontWeight:300,animation:"fu .8s .45s both"}}>
                {favorites.length === 0
                  ? "You haven't saved any favorites yet. Browse our collections and tap the heart on pieces you love."
                  : `You have ${favorites.length} saved ${favorites.length === 1 ? "piece" : "pieces"}. Click any item to view its details.`}
              </p>
            </div>
            {favorites.length > 0 && (
              <button
                onClick={handleClear}
                className="fs"
                style={{
                  padding:"10px 24px",border:"1px solid var(--sand)",background:"transparent",
                  fontSize:11,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",
                  color: confirmClear ? "#c0392b" : "var(--sand-d)",
                  borderColor: confirmClear ? "#c0392b" : "var(--sand)",
                  transition:"all .3s",whiteSpace:"nowrap",animation:"fu .8s .5s both",
                }}
              >
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

          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"24px",maxWidth:"1300px"}}>
            {favorites.map((item, i) => (
              <div key={item.id} className="fav-card"
                onClick={() => navigate(item.route || `/product/${item.collection?.toLowerCase() || item.id}`)}
                style={{animation:`fu .6s ${0.05*i}s both`}}>
                <div style={{position:"relative"}}>
                  <img src={item.img} alt={item.name} />
                  <div className="fav-overlay" />
                  <FavoriteButton
                    product={item}
                    size={18}
                    style={{position:"absolute",top:12,right:12}}
                  />
                </div>
                <div style={{padding:"16px 0 8px"}}>
                  <h3 className="ff" style={{fontSize:"20px",fontWeight:400,marginBottom:"4px"}}>{item.name}</h3>
                  <p className="fs" style={{fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",textTransform:"uppercase"}}>{item.collection} Collection</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* EMPTY STATE */
        <section style={{padding:"100px 48px",textAlign:"center",minHeight:"40vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--sand-l)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:28,opacity:.6}}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:16,color:"var(--stone-l)"}}>No Favorites Yet</h2>
          <p className="fs" style={{fontSize:14,color:"var(--sand-d)",maxWidth:400,lineHeight:1.7,marginBottom:36,fontWeight:300}}>
            Explore our collections and click the heart icon on any piece to save it here for easy access later.
          </p>
          <div style={{display:"flex",gap:16}}>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>Browse products</a>
            <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Explore collections</a>
          </div>
        </section>
      )}

      {/* CONTINUE BROWSING CTA */}
      {favorites.length > 0 && (
        <section style={{padding:"60px 48px 80px",textAlign:"center",borderTop:"1px solid var(--sand-l)"}}>
          <span className="fs sl">Discover more</span>
          <h2 className="ff" style={{fontSize:28,fontWeight:300,marginTop:12,marginBottom:28}}>Continue Browsing</h2>
          <div style={{display:"flex",gap:16,justifyContent:"center"}}>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>All products</a>
            <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Homepage</a>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:500,letterSpacing:3}}>STATUS</span><span className="fs" style={{fontSize:9,letterSpacing:3,marginLeft:4,color:"rgba(255,255,255,.4)"}}>CONCEPT</span></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve. Serving Vale do Lobo, Quinta do Lago, Vilamoura, and beyond.</p>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor","Leisure"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery","Catalogue"]},{t:"Contact",ls:["Showroom Quinta do Lago","Showroom Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300}}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1}}>
          <span>© 2026 Status Concept. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default FAVORITES_PAGE;
