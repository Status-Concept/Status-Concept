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

const PRODUCT_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [dimsOpen, setDimsOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
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

  const product = {
    name: "Sicily Modular Set", collection: "Sicily",
    tagline: "Contemporary modular outdoor sofa with infinite configuration possibilities",
    images: ["/src/assets/images/sicily-corner.jpg","/src/assets/images/sicily-centre.jpg","/src/assets/images/sicily-ottoman.jpg"],
    specs: [
      { label: "Type", value: "Modular Sofa Set" },{ label: "Frame", value: "Premium Aluminium" },
      { label: "Coating", value: "Interpon Powder Coated" },{ label: "Upholstery", value: "Sunbrella® Acrylic Fabric" },
      { label: "Cushion Fill", value: "Quick-dry Foam Core" },{ label: "Stackable", value: "No" },
    ],
    dims: [
      { piece: "Corner Module", w: "85", d: "85", h: "68", sh: "42" },
      { piece: "Centre Module", w: "75", d: "85", h: "68", sh: "42" },
      { piece: "Armless Module", w: "65", d: "85", h: "68", sh: "42" },
      { piece: "Coffee Table", w: "120", d: "60", h: "35", sh: "—" },
    ],
    materials: [
      "Sunbrella® fabric: UV resistant, water-repellent, mold resistant, fade-proof",
      "Interpon powder coating: corrosion protection, scratch resistant, UV stable",
      "Premium aluminium frame: lightweight, durable, weather resistant",
      "Quick-dry foam cushions: rapid drainage, mold resistant, comfortable",
    ],
    colors: ["Sutty", "Savanne Whisper", "Lynn"],
    related: [
      { name: "Miami Sofa Set", collection: "Miami", img: "/placeholder.svg" },
      { name: "Oxford Modular Sofa", collection: "Oxford", img: "/placeholder.svg" },
      { name: "Berlin Modular Sofa", collection: "Berlin", img: "/placeholder.svg" },
      { name: "Cairo Sofa Set", collection: "Cairo", img: "/placeholder.svg" },
    ],
  };

  const AccordionSection = ({ title, open, toggle, children }) => (
    <div style={{ borderBottom: "1px solid var(--sand-l)" }}>
      <button onClick={toggle} className="fs" style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 0", background: "none", border: "none", cursor: "pointer",
        fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--stone)",
        transition: "color .3s",
      }}
      onMouseEnter={e=>e.target.style.color="var(--gold)"}
      onMouseLeave={e=>e.target.style.color="var(--stone)"}>
        {title}
        <span style={{ fontSize: 18, fontWeight: 300, transition: "transform .3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ paddingBottom: 20 }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .thumb{width:72px;height:72px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:all .3s;opacity:.6;border-radius:2px}
        .thumb:hover,.thumb.active{border-color:var(--gold);opacity:1}
        .color-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .3s}
        .color-dot:hover{border-color:var(--stone);transform:scale(1.12)}
        .related-card{cursor:pointer;transition:all .4s cubic-bezier(0.16, 1, 0.3, 1)}
        .related-card:hover{transform:translateY(-6px)}
        .related-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1)}
        .related-card:hover img{transform:scale(1.05)}
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
          <div style={{display:"flex",alignItems:"baseline",cursor:"pointer"}}>
            <span className="ff" style={{fontSize:28,fontWeight:500,letterSpacing:3,color:"var(--stone)"}}>STATUS</span>
            <span className="fs" style={{fontSize:10,letterSpacing:4,color:"var(--sand-d)",marginLeft:4}}>CONCEPT</span>
          </div>
          <nav className="fs nav-desktop" style={{display:"flex",gap:32,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{paddingTop:115,padding:"115px 48px 0",background:"var(--cream)"}}>
        <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",textTransform:"uppercase"}}>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Home</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Furniture</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Lounge</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <span style={{color:"var(--stone)"}}>{product.name}</span>
        </div>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <section style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:60,padding:"40px 48px clamp(60px,8vh,100px)",maxWidth:1300}}>
        <div>
          <div style={{overflow:"hidden",borderRadius:3,marginBottom:16,position:"relative",background:"var(--cream-w)"}}>
            <img src={product.images[activeImg]} alt={product.name} style={{width:"100%",aspectRatio:"4/3",objectFit:"contain",transition:"opacity .4s"}} />
            <span className="tag tag-popular" style={{position:"absolute",top:16,left:16}}>Popular</span>
            <FavoriteButton product={{id:"sicily-modular-set",name:product.name,collection:product.collection,img:product.images[0],route:"/product/sicily"}} size={20} style={{position:"absolute",top:16,right:16}} />
          </div>
          <div style={{display:"flex",gap:8}}>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`View ${i+1}`} className={`thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        </div>

        <div style={{paddingTop:8}}>
          <span className="fs sl" style={{marginBottom:8,display:"block"}}>{product.collection} Collection</span>
          <h1 className="ff" style={{fontSize:"clamp(32px,4vw,44px)",fontWeight:300,lineHeight:1.1,marginBottom:12,letterSpacing:"-0.01em"}}>{product.name}</h1>
          <div className="la" style={{marginBottom:16}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.7,color:"var(--stone-l)",fontWeight:300,marginBottom:28}}>{product.tagline}</p>

          <div style={{marginBottom:28}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Fabric Colours</span>
            <div style={{display:"flex",gap:10}}>
              {product.colors.map((c, i) => (
                <div key={c} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div className="color-dot" style={{background: i===0?"#3a3a3a":i===1?"#e8e7e4":"#e0d5c3"}} />
                  <span className="fs" style={{fontSize:10,color:"var(--sand-d)"}}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"}}>
            <button className="cb cg">Request a quote</button>
            <button className="fs" style={{padding:"15px 28px",background:"transparent",color:"var(--ocean)",border:"1px solid var(--sand)",fontSize:12,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",transition:"all .35s",borderRadius:0}}
              onMouseEnter={e=>{e.target.style.borderColor="var(--ocean)";e.target.style.background="rgba(42,95,122,.05)"}}
              onMouseLeave={e=>{e.target.style.borderColor="var(--sand)";e.target.style.background="transparent"}}>
              Book showroom visit
            </button>
          </div>

          <AccordionSection title="Specifications" open={specsOpen} toggle={() => setSpecsOpen(!specsOpen)}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
              {product.specs.map((s) => (
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(163,180,200,.2)"}}>
                  <span className="fs" style={{fontSize:12,color:"var(--sand-d)"}}>{s.label}</span>
                  <span className="fs" style={{fontSize:12,color:"var(--stone)",fontWeight:400}}>{s.value}</span>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title="Dimensions (cm)" open={dimsOpen} toggle={() => setDimsOpen(!dimsOpen)}>
            <table className="fs" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid var(--sand)"}}>
                  {["Piece","W","D","H","Seat H"].map(h=><th key={h} style={{padding:"8px 4px",textAlign:"left",fontWeight:400,color:"var(--sand-d)",letterSpacing:1,textTransform:"uppercase",fontSize:10}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {product.dims.map((d)=>(
                  <tr key={d.piece} style={{borderBottom:"1px solid rgba(163,180,200,.2)"}}>
                    <td style={{padding:"8px 4px",color:"var(--stone)"}}>{d.piece}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.w}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.d}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.h}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.sh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionSection>

          <AccordionSection title="Materials & Care" open={matOpen} toggle={() => setMatOpen(!matOpen)}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {product.materials.map((m)=>(
                <div key={m} className="fs" style={{display:"flex",gap:8,fontSize:12,color:"var(--stone-l)",lineHeight:1.6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:7}} />
                  {m}
                </div>
              ))}
            </div>
          </AccordionSection>

          <div style={{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}}>
            {["Sunbrella®","Interpon","Premium Alu"].map(b=>(
              <span key={b} className="mb">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section id="related" data-animate style={{padding:"60px 48px clamp(60px,10vh,100px)",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("related")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">You may also like</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3vw,36px)",fontWeight:300,marginTop:8,letterSpacing:"-0.01em"}}>Related Products</h2>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",textDecoration:"none",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>View all lounge →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {product.related.map((r, i)=>(
            <div key={r.name} className="related-card" onClick={()=>navigate(`/product/${r.collection.toLowerCase()}`)} style={{animation:vis("related")?`fu 0.5s ${0.08*i}s both`:"none"}}>
              <div style={{overflow:"hidden",borderRadius:3,marginBottom:12,position:"relative"}}>
                <FavoriteButton product={{id:r.name.toLowerCase().replace(/\s+/g,'-'),name:r.name,collection:r.collection,img:r.img,route:`/product/${r.collection.toLowerCase()}`}} size={16} style={{position:"absolute",top:12,right:12,zIndex:3}} />
                <img src={r.img} alt={r.name} />
              </div>
              <h3 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:4}}>{r.name}</h3>
              <p className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",textTransform:"uppercase"}}>{r.collection} Collection</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:500,letterSpacing:3}}>STATUS</span><span className="fs" style={{fontSize:9,letterSpacing:3,marginLeft:4,color:"rgba(255,255,255,.4)"}}>CONCEPT</span></div>
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
          <span>© 2026 Status Concept. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default PRODUCT_DETAIL;
