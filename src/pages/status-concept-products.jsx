import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";

const PRODUCTS_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [headerSolid, setHeaderSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);

  const categories = [
    { key: "all", label: "All", count: 76 },
    { key: "lounge", label: "Lounge", count: 18 },
    { key: "dining", label: "Dining", count: 14 },
    { key: "sunlounger", label: "Sun Loungers", count: 8 },
    { key: "daybed", label: "Day Beds", count: 4 },
    { key: "coffee", label: "Coffee Tables", count: 10 },
    { key: "side", label: "Side Tables", count: 6 },
    { key: "bar", label: "Bar & Patio", count: 8 },
    { key: "puffs", label: "Puffs", count: 8 },
  ];

  const allProducts = [
    { name: "Bella Reclining Sofa Set", collection: "Bella", category: "lounge", img: "/placeholder.svg", tag: "Popular" },
    { name: "Oxford Modular Sofa", collection: "Oxford", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Sicily Modular Set", collection: "Sicily", category: "lounge", img: "/placeholder.svg", tag: "New" },
    { name: "Miami Sofa Set", collection: "Miami", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Cairo Sofa Set", collection: "Cairo", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Berlin Modular Sofa", collection: "Berlin", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Laguna Dining Set", collection: "Laguna", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Florida Dining Table", collection: "Florida", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Munich Dining Table", collection: "Munich", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Orlando Dining Armchairs", collection: "Orlando", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Bella Reclining Dining Set", collection: "Bella", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "MAUI Sun Lounger", collection: "MAUI", category: "sunlounger", img: "/placeholder.svg", tag: "New" },
    { name: "Bonaire Sun Lounger", collection: "Bonaire", category: "sunlounger", img: "/placeholder.svg", tag: "" },
    { name: "Crete Sun Lounger", collection: "Crete", category: "sunlounger", img: "/placeholder.svg", tag: "" },
    { name: "Antalya Daybed", collection: "Antalya", category: "daybed", img: "/placeholder.svg", tag: "" },
    { name: "Sophia Gazebo", collection: "Sophia", category: "daybed", img: "/placeholder.svg", tag: "" },
    { name: "Reno Balcony Set", collection: "Reno", category: "bar", img: "/placeholder.svg", tag: "" },
    { name: "Zanzibar Coffee Table", collection: "Zanzibar", category: "coffee", img: "/placeholder.svg", tag: "" },
    { name: "Tahiti Side Table", collection: "Tahiti", category: "side", img: "/placeholder.svg", tag: "" },
    { name: "Naples Coffee Table", collection: "Naples", category: "coffee", img: "/placeholder.svg", tag: "" },
    { name: "Bern Side Table", collection: "Bern", category: "side", img: "/placeholder.svg", tag: "" },
    { name: "Dakkar Coffee Table", collection: "Dakkar", category: "coffee", img: "/placeholder.svg", tag: "" },
    { name: "Manila Bar Set", collection: "Manila", category: "bar", img: "/placeholder.svg", tag: "" },
    { name: "Dijon Pouf", collection: "Dijon", category: "puffs", img: "/placeholder.svg", tag: "" },
  ];

  const filteredProducts = activeCategory === "all" ? allProducts : allProducts.filter((p) => p.category === activeCategory);

  const S = (id) => ({
    opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)",
    transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
  });

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
        .product-card{position:relative;cursor:pointer;overflow:hidden}
        .product-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1),filter .5s}
        .product-card:hover img{transform:scale(1.05);filter:brightness(.92)}
        .product-card .card-overlay{position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(0,0,0,.45));opacity:0;transition:opacity .5s}
        .product-card:hover .card-overlay{opacity:1}
        .product-card .card-cta{position:absolute;bottom:20px;left:50%;transform:translateX(-50%) translateY(12px);opacity:0;transition:all .4s .1s;white-space:nowrap}
        .product-card:hover .card-cta{opacity:1;transform:translateX(-50%) translateY(0)}
        .cat-filter{padding:8px 20px;border:1px solid var(--sand-l);background:transparent;cursor:pointer;transition:all .35s;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:1.5px;color:var(--sand-d)}
        .cat-filter:hover,.cat-filter.active{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .cat-filter .count{font-size:10px;opacity:.6;margin-left:4px}
        .tag{position:absolute;top:16px;left:16px;padding:4px 12px;font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;z-index:2}
        .tag-new{background:var(--gold);color:#fff}
        .tag-popular{background:var(--ocean-d);color:#fff}
      `}</style>

      {/* HEADER — same as homepage */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:headerSolid?"rgba(250,249,246,.97)":"rgba(250,249,246,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(196,181,160,.3)",transition:"all .5s"}}>
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
          <div className="fs" style={{fontSize:"11px",letterSpacing:"2px",color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* PAGE HERO */}
      <section style={{paddingTop:"140px",paddingBottom:"60px",paddingLeft:"48px",paddingRight:"48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
        <div style={{maxWidth:"800px"}}>
          <div className="fs" style={{fontSize:"11px",letterSpacing:"3px",color:"var(--sand-d)",textTransform:"uppercase",marginBottom:"8px",animation:"fu .8s .2s both"}}>
            <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none"}}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> Furniture Series
          </div>
          <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:"20px",animation:"fu .8s .3s both"}}>Furniture Series</h1>
          <p className="fs" style={{fontSize:"15px",color:"var(--stone-l)",lineHeight:1.7,maxWidth:"600px",fontWeight:300,animation:"fu .8s .45s both"}}>
            Explore our complete range of luxury outdoor furniture — from reclining sofa sets to elegant dining collections. Each piece crafted with Sunbrella® fabrics and premium aluminium for the Algarve lifestyle.
          </p>
        </div>
      </section>

      {/* FILTER BAR */}
      <section id="filters" data-animate style={{padding:"32px 48px",borderBottom:"1px solid var(--sand-l)",position:"sticky",top:"95px",zIndex:50,background:"rgba(250,249,246,.97)",backdropFilter:"blur(8px)",...S("filters")}}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
          <span className="fs" style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--sand-d)",marginRight:"8px"}}>Filter:</span>
          {categories.map((c) => (
            <button key={c.key} className={`cat-filter ${activeCategory === c.key ? "active" : ""}`} onClick={() => setActiveCategory(c.key)}>
              {c.label}<span className="count">({c.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="grid" data-animate style={{padding:"48px",minHeight:"60vh",...S("grid")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
          <p className="fs" style={{fontSize:"13px",color:"var(--sand-d)"}}>
            Showing <strong style={{color:"var(--stone)"}}>{filteredProducts.length}</strong> products
          </p>
          <div className="fs" style={{display:"flex",gap:"16px",fontSize:"12px",color:"var(--sand-d)"}}>
            <span style={{cursor:"pointer",borderBottom:  "1px solid var(--stone)",color:"var(--stone)",paddingBottom:"2px"}}>Grid</span>
            <span style={{cursor:"pointer"}}>List</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"24px",maxWidth:"1300px"}}>
          {filteredProducts.map((p, i) => (
            <div key={p.name + i} className="product-card"
              onClick={() => navigate(`/product/${p.collection.toLowerCase()}`)}
              onMouseEnter={() => setHoveredProduct(i)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{animation: `fu .6s ${0.05 * i}s both`}}>
              {p.tag && <span className={`tag ${p.tag === "New" ? "tag-new" : "tag-popular"}`}>{p.tag}</span>}
              <img src={p.img} alt={p.name} />
              <div className="card-overlay" />
              <span className="card-cta fs" style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"#fff",borderBottom:"1px solid rgba(255,255,255,.5)",paddingBottom:"2px"}}>View details</span>
              <div style={{padding:"16px 0 8px"}}>
                <h3 className="ff" style={{fontSize:"20px",fontWeight:400,marginBottom:"4px"}}>{p.name}</h3>
                <p className="fs" style={{fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",textTransform:"uppercase"}}>{p.collection} Collection</p>
              </div>
            </div>
          ))}
        </div>

        {activeCategory === "all" && (
          <div style={{textAlign:"center",marginTop:"56px"}}>
            <a href="#" className="cb cd" onClick={(e)=>e.preventDefault()}>Load more products</a>
          </div>
        )}
      </section>

      {/* COLLECTIONS STRIP */}
      <section id="colstrip" data-animate style={{padding:"80px 48px",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("colstrip")}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <span className="fs sl">Browse by collection</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:"12px"}}>Named Collections</h2>
        </div>
        <div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center",maxWidth:"1000px",margin:"0 auto"}}>
          {["Bella","Oxford","Sicily","Miami","Laguna","Cairo","Berlin","Florida","Reno","Munich","Dakkar","Naples","Bern","Manila","Tahiti","Zanzibar","Luanda","Dijon","Orlando","Antalya","Sophia","MAUI","Bonaire","Crete"].map((c) => (
            <span key={c} className="fs" style={{
              padding:"10px 24px",border:"1px solid var(--sand)",cursor:"pointer",
              fontSize:"12px",letterSpacing:"1.5px",color:"var(--stone-l)",
              transition:"all .35s",background:"transparent",
            }}
            onClick={()=>navigate('/collection')}
            onMouseEnter={(e)=>{e.target.style.background="var(--stone)";e.target.style.color="var(--cream)";e.target.style.borderColor="var(--stone)"}}
            onMouseLeave={(e)=>{e.target.style.background="transparent";e.target.style.color="var(--stone-l)";e.target.style.borderColor="var(--sand)"}}
            >{c}</span>
          ))}
        </div>
      </section>

      {/* SHADE & KITCHEN CTA */}
      <section id="othercats" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"400px",...S("othercats")}}>
        {[
          { title: "Shade Solutions", desc: "Parasols, bioclimatic & retractable pergolas", img: "/placeholder.svg" },
          { title: "Outdoor Kitchens", desc: "BBQ systems, pizza ovens & full outdoor kitchens", img: "/placeholder.svg" },
        ].map((item) => (
          <div key={item.title} onClick={()=>navigate('/products')} style={{position:"relative",overflow:"hidden",cursor:"pointer"}}>
            <img src={item.img} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .8s cubic-bezier(.22,1,.36,1)"}}
              onMouseEnter={(e)=>e.target.style.transform="scale(1.04)"}
              onMouseLeave={(e)=>e.target.style.transform="scale(1)"} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,.6))",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"40px"}}>
              <h3 className="ff" style={{fontSize:"32px",fontWeight:300,color:"#fff",marginBottom:"8px"}}>{item.title}</h3>
              <p className="fs" style={{fontSize:"13px",color:"rgba(255,255,255,.7)",marginBottom:"16px"}}>{item.desc}</p>
              <span className="fs" style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"var(--gold-l)",alignSelf:"flex-start",borderBottom:"1px solid var(--gold-l)",paddingBottom:"2px"}}>Explore →</span>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER — same as homepage */}
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

export default PRODUCTS_PAGE;
