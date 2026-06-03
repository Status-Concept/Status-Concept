import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";

const socialIcons = [
  {n:"Facebook",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const COLLECTION_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" });

  const collection = {
    name: "Bella", tagline: "Reclining Elegance",
    desc: "The Bella collection brings together sophisticated design and effortless comfort. Featuring adjustable reclining mechanisms and plush Sunbrella® cushions, each piece invites you to settle in and enjoy the Algarve breeze. The premium aluminium frames are finished with Interpon powder coating for lasting beauty, while the modular design lets you configure your perfect outdoor setting.",
    gallery: ["/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg","/placeholder.svg"],
    materials: ["Sunbrella® Fabrics", "Interpon Coating", "Premium Aluminium", "Quick-dry Foam"],
    products: [
      { name: "Bella 3-Seat Reclining Sofa", type: "Sofa", img: "/placeholder.svg" },
      { name: "Bella 2-Seat Reclining Sofa", type: "Sofa", img: "/placeholder.svg" },
      { name: "Bella Reclining Dining Set", type: "Dining Set", img: "/placeholder.svg" },
      { name: "Bella Dining Table", type: "Table", img: "/placeholder.svg" },
      { name: "Bella Dining Chair", type: "Chair", img: "/placeholder.svg" },
      { name: "Bella Coffee Table", type: "Coffee Table", img: "/placeholder.svg" },
    ],
    otherCollections: [
      { name: "Oxford", img: "/placeholder.svg" },
      { name: "Sicily", img: "/placeholder.svg" },
      { name: "Miami", img: "/placeholder.svg" },
    ],
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .gallery-dot{width:8px;height:8px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:transparent;cursor:pointer;transition:all .3s}
        .gallery-dot.active{background:#fff;border-color:#fff}
        .gallery-thumb{width:80px;height:56px;object-fit:cover;cursor:pointer;opacity:.5;transition:all .3s;border:2px solid transparent;border-radius:2px}
        .gallery-thumb:hover,.gallery-thumb.active{opacity:1;border-color:var(--gold)}
        .prod-card{cursor:pointer;transition:all .4s cubic-bezier(0.16, 1, 0.3, 1)}
        .prod-card:hover{transform:translateY(-6px)}
        .prod-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1)}
        .prod-card:hover img{transform:scale(1.05)}
        .coll-card{position:relative;overflow:hidden;cursor:pointer;height:240px;border-radius:3px}
        .coll-card img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1)}
        .coll-card:hover img{transform:scale(1.06)}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(232,240,248,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(163,180,200,.3)"}}>
        <div className="fs header-top" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",borderBottom:"1px solid rgba(163,180,200,.15)"}}>
          <div style={{display:"flex",gap:24}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
            {socialIcons.map(({n,svg})=>(<a key={n} href="#" aria-label={n} className="si" style={{opacity:.65,color:"var(--sand-d)"}}>{svg}</a>))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{cursor:"pointer",lineHeight:1}}>
            <span className="ff" style={{fontSize:28,fontWeight:400,letterSpacing:8,color:"var(--stone)"}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span>
            <div className="fs" style={{fontSize:7,letterSpacing:3,color:"var(--sand-d)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div>
          </div>
          <nav className="fs nav-desktop" style={{display:"flex",gap:32,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* GALLERY HERO */}
      <section style={{paddingTop:96,position:"relative"}}>
        <div style={{position:"relative",height:"65vh",minHeight:450,overflow:"hidden"}}>
          <img src={collection.gallery[activeImg]} alt={collection.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity .4s"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,.4))"}} />
          <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
            {collection.gallery.map((_,i) => (<div key={i} className={`gallery-dot ${activeImg===i?"active":""}`} onClick={()=>setActiveImg(i)} />))}
          </div>
          <button onClick={()=>setActiveImg(activeImg>0?activeImg-1:collection.gallery.length-1)} style={{position:"absolute",left:24,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.3)",border:"none",color:"#fff",width:44,height:44,fontSize:20,cursor:"pointer",borderRadius:"50%",transition:"background .3s",backdropFilter:"blur(4px)"}} onMouseEnter={e=>e.target.style.background="rgba(0,0,0,.6)"} onMouseLeave={e=>e.target.style.background="rgba(0,0,0,.3)"}>←</button>
          <button onClick={()=>setActiveImg(activeImg<collection.gallery.length-1?activeImg+1:0)} style={{position:"absolute",right:24,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.3)",border:"none",color:"#fff",width:44,height:44,fontSize:20,cursor:"pointer",borderRadius:"50%",transition:"background .3s",backdropFilter:"blur(4px)"}} onMouseEnter={e=>e.target.style.background="rgba(0,0,0,.6)"} onMouseLeave={e=>e.target.style.background="rgba(0,0,0,.3)"}>→</button>
          <div style={{position:"absolute",bottom:60,left:48}}>
            <span className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.6)",display:"block",marginBottom:8}}>Collection</span>
            <h1 className="ff" style={{fontSize:"clamp(40px,5vw,64px)",fontWeight:300,color:"#fff",lineHeight:1.05,letterSpacing:"-0.01em"}}>{collection.name}</h1>
            <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.7)",marginTop:4,fontWeight:300,letterSpacing:1}}>{collection.tagline}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:4,padding:"12px 48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
          {collection.gallery.map((img,i) => (<img key={i} src={img} alt={`Slide ${i+1}`} className={`gallery-thumb ${activeImg===i?"active":""}`} onClick={()=>setActiveImg(i)} />))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
            <span className="fs" style={{fontSize:11,color:"var(--sand-d)"}}>{activeImg+1} / {collection.gallery.length}</span>
          </div>
        </div>
      </section>

      {/* COLLECTION DESCRIPTION */}
      <section id="desc" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,padding:"clamp(48px,8vh,100px) 48px",maxWidth:1200,...S("desc")}}>
        <div>
          <span className="fs sl" style={{marginBottom:16,display:"block"}}>About the collection</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,lineHeight:1.2,marginBottom:16,letterSpacing:"-0.01em"}}>The {collection.name}<br/>Collection</h2>
          <div className="la" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300}}>{collection.desc}</p>
          <div style={{display:"flex",gap:12,marginTop:28}}>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Request a quote</a>
          </div>
        </div>
        <div>
          <div style={{marginBottom:28}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Materials</span>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              {collection.materials.map(m=><span key={m} className="mb">{m}</span>)}
            </div>
          </div>
          <div style={{marginBottom:28}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Key features</span>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {["Reclining mechanism for adjustable comfort","Modular configuration: build any layout","Aluminium frame with Interpon® finish","Quick-dry foam cushions for all weather","Available in 4 frame colours"].map((f)=>(
                <div key={f} className="fs" style={{display:"flex",gap:10,fontSize:13,color:"var(--stone-l)",lineHeight:1.5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:6}} />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:24,background:"var(--cream-w)",border:"1px solid var(--sand-l)",borderRadius:3}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",display:"block",marginBottom:8}}>Showroom availability</span>
            <p className="fs" style={{fontSize:13,color:"var(--stone-l)",fontWeight:300,lineHeight:1.6}}>The {collection.name} collection is currently on display at both our Quinta do Lago and Almancil showrooms. Visit to experience the quality firsthand.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS IN THIS COLLECTION */}
      <section id="products" data-animate style={{padding:"60px 48px clamp(60px,10vh,100px)",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("products")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">Shop the range</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:8,letterSpacing:"-0.01em"}}>{collection.name} Products</h2>
          </div>
          <span className="fs" style={{fontSize:12,color:"var(--sand-d)"}}>{collection.products.length} pieces</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:1100}}>
          {collection.products.map((p, i)=>(
            <div key={p.name} className="prod-card" onClick={()=>navigate(`/product/${p.name.toLowerCase().replace(/\s+/g,'-')}`)} style={{animation:vis("products")?`fu 0.5s ${0.08*i}s both`:"none"}}>
              <div style={{overflow:"hidden",borderRadius:3,marginBottom:12,position:"relative"}}>
                <FavoriteButton product={{id:p.name.toLowerCase().replace(/\s+/g,'-'),name:p.name,collection:"Bella",img:p.img,route:`/product/${p.name.toLowerCase().replace(/\s+/g,'-')}`}} size={16} style={{position:"absolute",top:12,right:12,zIndex:3}} />
                <img src={p.img} alt={p.name} />
              </div>
              <h3 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:4}}>{p.name}</h3>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",textTransform:"uppercase"}}>{p.type}</p>
                <span className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--gold)",textTransform:"uppercase"}}>View →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER COLLECTIONS */}
      <section id="other" data-animate style={{padding:"60px 48px clamp(60px,10vh,100px)",...S("other")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">Discover more</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,36px)",fontWeight:300,marginTop:8,letterSpacing:"-0.01em"}}>Other Collections</h2>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",textDecoration:"none",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>View all →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {collection.otherCollections.map((c)=>(
            <div key={c.name} className="coll-card" onClick={()=>navigate('/collection')}>
              <img src={c.img} alt={c.name} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 40%,rgba(0,0,0,.55))",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:28}}>
                <h3 className="ff" style={{fontSize:28,fontWeight:400,color:"#fff"}}>{c.name}</h3>
                <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold-l)",marginTop:4}}>Explore collection →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:400,letterSpacing:8}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span><div className="fs" style={{fontSize:7,letterSpacing:3,color:"rgba(255,255,255,.4)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve.</p>
            <div style={{display:"flex",gap:"2px",marginTop:20}}>
              {socialIcons.map(({n,svg})=>(<a key={n} href="#" aria-label={n} className="si" style={{color:"rgba(255,255,255,.4)"}}>{svg}</a>))}
            </div>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery"]},{t:"Contact",ls:["Quinta do Lago","Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.8)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1,flexWrap:"wrap",gap:12}}>
          <span>© 2026 Statvs. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default COLLECTION_DETAIL;
