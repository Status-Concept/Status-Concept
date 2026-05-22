import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";

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
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)" });

  const product = {
    name: "Sicily Modular Set",
    collection: "Sicily",
    tagline: "Contemporary modular outdoor sofa with infinite configuration possibilities",
    images: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    specs: [
      { label: "Type", value: "Modular Sofa Set" },
      { label: "Frame", value: "Premium Aluminium" },
      { label: "Coating", value: "Interpon Powder Coated" },
      { label: "Upholstery", value: "Sunbrella® Acrylic Fabric" },
      { label: "Cushion Fill", value: "Quick-dry Foam Core" },
      { label: "Stackable", value: "No" },
    ],
    dims: [
      { piece: "Corner Module", w: "85", d: "85", h: "68", sh: "42" },
      { piece: "Centre Module", w: "75", d: "85", h: "68", sh: "42" },
      { piece: "Armless Module", w: "65", d: "85", h: "68", sh: "42" },
      { piece: "Coffee Table", w: "120", d: "60", h: "35", sh: "—" },
    ],
    materials: [
      "Sunbrella® fabric — UV resistant, water-repellent, mold resistant, fade-proof",
      "Interpon powder coating — corrosion protection, scratch resistant, UV stable",
      "Premium aluminium frame — lightweight, durable, weather resistant",
      "Quick-dry foam cushions — rapid drainage, mold resistant, comfortable",
    ],
    colors: ["Anthracite", "White", "Taupe", "Sand"],
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
      }}>
        {title}
        <span style={{ fontSize: 18, fontWeight: 300, transition: "transform .3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(.22,1,.36,1)" }}>
        <div style={{ paddingBottom: 20 }}>{children}</div>
      </div>
    </div>
  );

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
        .thumb{width:72px;height:72px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:all .3s;opacity:.6}
        .thumb:hover,.thumb.active{border-color:var(--gold);opacity:1}
        .color-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .3s}
        .color-dot:hover{border-color:var(--stone);transform:scale(1.1)}
        .related-card{cursor:pointer;transition:all .5s}
        .related-card:hover{transform:translateY(-4px)}
        .related-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1)}
        .related-card:hover img{transform:scale(1.04)}
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

      {/* BREADCRUMB */}
      <div style={{paddingTop:115,padding:"115px 48px 0",background:"var(--cream)"}}>
        <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",textTransform:"uppercase"}}>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none"}}>Home</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none"}}>Furniture</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none"}}>Lounge</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <span style={{color:"var(--stone)"}}>{product.name}</span>
        </div>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <section style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:60,padding:"40px 48px 80px",maxWidth:1300}}>
        {/* LEFT: Images */}
        <div>
          <div style={{overflow:"hidden",borderRadius:2,marginBottom:16,position:"relative",background:"var(--cream-w)"}}>
            <img src={product.images[activeImg]} alt={product.name} style={{width:"100%",aspectRatio:"1",objectFit:"cover",transition:"opacity .4s"}} />
            <span className="fs" style={{position:"absolute",top:16,left:16,padding:"4px 12px",background:"var(--gold)",color:"#fff",fontSize:10,letterSpacing:2,textTransform:"uppercase"}}>New</span>
            <FavoriteButton
              product={{id:"sicily-modular-set",name:product.name,collection:product.collection,img:product.images[0],route:"/product/sicily"}}
              size={20}
              style={{position:"absolute",top:16,right:16}}
            />
          </div>
          <div style={{display:"flex",gap:8}}>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`View ${i+1}`} className={`thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div style={{paddingTop:8}}>
          <span className="fs sl" style={{marginBottom:8,display:"block"}}>{product.collection} Collection</span>
          <h1 className="ff" style={{fontSize:"clamp(32px,4vw,44px)",fontWeight:300,lineHeight:1.1,marginBottom:12}}>{product.name}</h1>
          <div className="la" style={{marginBottom:16}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.7,color:"var(--stone-l)",fontWeight:300,marginBottom:28}}>{product.tagline}</p>

          {/* Colors */}
          <div style={{marginBottom:28}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Frame Colours</span>
            <div style={{display:"flex",gap:10}}>
              {product.colors.map((c, i) => (
                <div key={c} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div className="color-dot" style={{background: i===0?"#3d3d3a":i===1?"#f0ede8":i===2?"#b5a99a":"#d4cbbe"}} />
                  <span className="fs" style={{fontSize:10,color:"var(--sand-d)"}}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{display:"flex",gap:12,marginBottom:36}}>
            <button className="fs" style={{padding:"16px 40px",background:"var(--stone)",color:"#fff",border:"1px solid var(--stone)",fontSize:12,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",transition:"all .4s"}}
              onMouseEnter={e=>{e.target.style.background="transparent";e.target.style.color="var(--stone)"}}
              onMouseLeave={e=>{e.target.style.background="var(--stone)";e.target.style.color="#fff"}}>
              Request a quote
            </button>
            <button className="fs" style={{padding:"16px 28px",background:"transparent",color:"var(--ocean)",border:"1px solid var(--sand)",fontSize:12,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",transition:"all .4s"}}
              onMouseEnter={e=>e.target.style.borderColor="var(--ocean)"}
              onMouseLeave={e=>e.target.style.borderColor="var(--sand)"}>
              Book showroom visit
            </button>
          </div>

          {/* Accordion specs */}
          <AccordionSection title="Specifications" open={specsOpen} toggle={() => setSpecsOpen(!specsOpen)}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
              {product.specs.map((s) => (
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(196,181,160,.2)"}}>
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
                  <tr key={d.piece} style={{borderBottom:"1px solid rgba(196,181,160,.2)"}}>
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
                  <div style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:7}} />
                  {m}
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* Badges */}
          <div style={{display:"flex",gap:12,marginTop:24}}>
            {["Sunbrella®","Interpon","Premium Alu"].map(b=>(
              <span key={b} className="fs" style={{padding:"6px 14px",border:"1px solid var(--sand)",fontSize:10,letterSpacing:1.5,textTransform:"uppercase",color:"var(--sand-d)"}}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section id="related" data-animate style={{padding:"60px 48px 80px",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("related")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">You may also like</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3vw,36px)",fontWeight:300,marginTop:8}}>Related Products</h2>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",textDecoration:"none",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>View all lounge →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {product.related.map((r)=>(
            <div key={r.name} className="related-card" onClick={()=>navigate(`/product/${r.collection.toLowerCase()}`)}>
              <div style={{overflow:"hidden",borderRadius:2,marginBottom:12,position:"relative"}}>
                <FavoriteButton
                  product={{id:r.name.toLowerCase().replace(/\s+/g,'-'),name:r.name,collection:r.collection,img:r.img,route:`/product/${r.collection.toLowerCase()}`}}
                  size={16}
                  style={{position:"absolute",top:12,right:12,zIndex:3}}
                />
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

export default PRODUCT_DETAIL;
