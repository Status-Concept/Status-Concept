import { useState, useEffect } from "react";
import useNavLinks from "../useNavLinks";

const COLLECTION_DETAIL = () => {
  useNavLinks();
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
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)" });

  const collection = {
    name: "Bella",
    tagline: "Reclining Elegance",
    desc: "The Bella collection brings together sophisticated design and effortless comfort. Featuring adjustable reclining mechanisms and plush Sunbrella® cushions, each piece invites you to settle in and enjoy the Algarve breeze. The premium aluminium frames are finished with Interpon powder coating for lasting beauty, while the modular design lets you configure your perfect outdoor setting.",
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&h=700&fit=crop",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=700&fit=crop",
    ],
    materials: ["Sunbrella® Fabrics", "Interpon Coating", "Premium Aluminium", "Quick-dry Foam"],
    products: [
      { name: "Bella 3-Seat Reclining Sofa", type: "Sofa", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop" },
      { name: "Bella 2-Seat Reclining Sofa", type: "Sofa", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&h=500&fit=crop" },
      { name: "Bella Reclining Dining Set", type: "Dining Set", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=500&fit=crop" },
      { name: "Bella Dining Table", type: "Table", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&h=500&fit=crop" },
      { name: "Bella Dining Chair", type: "Chair", img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=500&h=500&fit=crop" },
      { name: "Bella Coffee Table", type: "Coffee Table", img: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=500&h=500&fit=crop" },
    ],
    otherCollections: [
      { name: "Oxford", img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&h=300&fit=crop" },
      { name: "Sicily", img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop" },
      { name: "Miami", img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop" },
    ],
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
        .gallery-dot{width:8px;height:8px;border-radius:50%;border:1px solid rgba(255,255,255,.5);background:transparent;cursor:pointer;transition:all .3s}
        .gallery-dot.active{background:#fff;border-color:#fff}
        .gallery-thumb{width:80px;height:56px;object-fit:cover;cursor:pointer;opacity:.5;transition:all .3s;border:2px solid transparent}
        .gallery-thumb:hover,.gallery-thumb.active{opacity:1;border-color:var(--gold)}
        .prod-card{cursor:pointer;transition:all .5s}
        .prod-card:hover{transform:translateY(-4px)}
        .prod-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1)}
        .prod-card:hover img{transform:scale(1.04)}
        .coll-card{position:relative;overflow:hidden;cursor:pointer;height:240px}
        .coll-card img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1)}
        .coll-card:hover img{transform:scale(1.06)}
        .mb{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1px solid var(--sand);font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--sand-d)}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(250,249,246,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(196,181,160,.3)"}}>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",borderBottom:"1px solid rgba(196,181,160,.15)"}}>
          <div style={{display:"flex",gap:24}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:16}}>{["Fb","Ig","Pi","Li"].map(s=><span key={s} style={{cursor:"pointer",opacity:.7}}>{s}</span>)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",cursor:"pointer"}}>
            <span className="ff" style={{fontSize:28,fontWeight:500,letterSpacing:3,color:"var(--stone)"}}>STATUS</span>
            <span className="fs" style={{fontSize:10,letterSpacing:4,color:"var(--sand-d)",marginLeft:4}}>CONCEPT</span>
          </div>
          <nav className="fs" style={{display:"flex",gap:32,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* GALLERY HERO */}
      <section style={{paddingTop:96,position:"relative"}}>
        <div style={{position:"relative",height:"65vh",minHeight:450,overflow:"hidden"}}>
          <img src={collection.gallery[activeImg]} alt={collection.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"opacity .5s"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,.4))"}} />
          
          {/* Gallery nav dots */}
          <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",gap:8}}>
            {collection.gallery.map((_,i) => (
              <div key={i} className={`gallery-dot ${activeImg===i?"active":""}`} onClick={()=>setActiveImg(i)} />
            ))}
          </div>

          {/* Prev/Next arrows */}
          <button onClick={()=>setActiveImg(activeImg>0?activeImg-1:collection.gallery.length-1)} style={{position:"absolute",left:24,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.3)",border:"none",color:"#fff",width:44,height:44,fontSize:20,cursor:"pointer",borderRadius:"50%",transition:"background .3s",backdropFilter:"blur(4px)"}}
            onMouseEnter={e=>e.target.style.background="rgba(0,0,0,.6)"}
            onMouseLeave={e=>e.target.style.background="rgba(0,0,0,.3)"}>←</button>
          <button onClick={()=>setActiveImg(activeImg<collection.gallery.length-1?activeImg+1:0)} style={{position:"absolute",right:24,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,.3)",border:"none",color:"#fff",width:44,height:44,fontSize:20,cursor:"pointer",borderRadius:"50%",transition:"background .3s",backdropFilter:"blur(4px)"}}
            onMouseEnter={e=>e.target.style.background="rgba(0,0,0,.6)"}
            onMouseLeave={e=>e.target.style.background="rgba(0,0,0,.3)"}>→</button>
          
          {/* Collection name overlay */}
          <div style={{position:"absolute",bottom:60,left:48}}>
            <span className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.6)",display:"block",marginBottom:8}}>Collection</span>
            <h1 className="ff" style={{fontSize:"clamp(40px,5vw,64px)",fontWeight:300,color:"#fff",lineHeight:1.05}}>{collection.name}</h1>
            <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.7)",marginTop:4,fontWeight:300,letterSpacing:1}}>{collection.tagline}</p>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div style={{display:"flex",gap:4,padding:"12px 48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
          {collection.gallery.map((img,i) => (
            <img key={i} src={img} alt={`Slide ${i+1}`} className={`gallery-thumb ${activeImg===i?"active":""}`} onClick={()=>setActiveImg(i)} />
          ))}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:4}}>
            <span className="fs" style={{fontSize:11,color:"var(--sand-d)"}}>{activeImg+1} / {collection.gallery.length}</span>
          </div>
        </div>
      </section>

      {/* COLLECTION DESCRIPTION */}
      <section id="desc" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,padding:"80px 48px",maxWidth:1200,...S("desc")}}>
        <div>
          <span className="fs sl" style={{marginBottom:16,display:"block"}}>About the collection</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,lineHeight:1.2,marginBottom:16}}>The {collection.name}<br/>Collection</h2>
          <div className="la" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300}}>{collection.desc}</p>
          <div style={{display:"flex",gap:12,marginTop:28}}>
            <a href="#" className="cb cd">Request a quote</a>
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
              {["Reclining mechanism for adjustable comfort","Modular configuration — build any layout","Aluminium frame with Interpon® finish","Quick-dry foam cushions for all weather","Available in 4 frame colours"].map((f)=>(
                <div key={f} className="fs" style={{display:"flex",gap:10,fontSize:13,color:"var(--stone-l)",lineHeight:1.5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:6}} />
                  {f}
                </div>
              ))}
            </div>
          </div>
          <div style={{padding:24,background:"var(--cream-w)",border:"1px solid var(--sand-l)"}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",display:"block",marginBottom:8}}>Showroom availability</span>
            <p className="fs" style={{fontSize:13,color:"var(--stone-l)",fontWeight:300,lineHeight:1.6}}>The {collection.name} collection is currently on display at both our Quinta do Lago and Almancil showrooms. Visit to experience the quality firsthand.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS IN THIS COLLECTION */}
      <section id="products" data-animate style={{padding:"60px 48px 80px",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("products")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">Shop the range</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:8}}>{collection.name} Products</h2>
          </div>
          <span className="fs" style={{fontSize:12,color:"var(--sand-d)"}}>{collection.products.length} pieces</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:1100}}>
          {collection.products.map((p)=>(
            <div key={p.name} className="prod-card">
              <div style={{overflow:"hidden",borderRadius:2,marginBottom:12}}>
                <img src={p.img} alt={p.name} />
              </div>
              <h3 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:4}}>{p.name}</h3>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",textTransform:"uppercase"}}>{p.type}</p>
                <a href="#" className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--gold)",textDecoration:"none",textTransform:"uppercase"}}>View →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER COLLECTIONS */}
      <section id="other" data-animate style={{padding:"60px 48px 80px",...S("other")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">Discover more</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,36px)",fontWeight:300,marginTop:8}}>Other Collections</h2>
          </div>
          <a href="#" className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",textDecoration:"none",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>View all →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {collection.otherCollections.map((c)=>(
            <div key={c.name} className="coll-card" style={{borderRadius:2}}>
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
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:500,letterSpacing:3}}>STATUS</span><span className="fs" style={{fontSize:9,letterSpacing:3,marginLeft:4,color:"rgba(255,255,255,.4)"}}>CONCEPT</span></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve.</p>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery"]},{t:"Contact",ls:["Quinta do Lago","Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300}}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1}}>
          <span>© 2026 Status Concept. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default COLLECTION_DETAIL;
