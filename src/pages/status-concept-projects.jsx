import { useState, useEffect } from "react";
import useNavLinks from "../useNavLinks";

const PROJECTS_PAGE = () => {
  useNavLinks();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeProject, setActiveProject] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)" });

  const projects = [
    {
      name: "Villa Serena", location: "Quinta do Lago", type: "villa",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
      ],
      desc: "A stunning contemporary villa overlooking the Ria Formosa natural park. We furnished the entire outdoor living area with the Oxford modular collection, complemented by Glatz parasols and a custom outdoor kitchen installation.",
      products: ["Oxford Modular Sofa", "Glatz Sunwing Parasol", "Custom Outdoor Kitchen", "Laguna Dining Set"],
      year: "2024",
    },
    {
      name: "Residence Vale Royal", location: "Vale do Lobo", type: "villa",
      img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=600&h=400&fit=crop",
      ],
      desc: "This beachfront property required furniture that could withstand the Atlantic coastal elements while maintaining elegance. The Bella reclining collection proved the perfect match, with the Antalya daybed as the pool centrepiece.",
      products: ["Bella Reclining Sofa Set", "Antalya Daybed", "MAUI Sun Loungers", "Naples Coffee Table"],
      year: "2024",
    },
    {
      name: "Villa Mimosa", location: "Vilamoura", type: "villa",
      img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop",
      ],
      desc: "An expansive marina-facing terrace transformed into a seamless indoor-outdoor entertainment space. We installed the Sicily modular system across three distinct zones — lounge, dining, and a sunbathing area with Crete loungers.",
      products: ["Sicily Modular Set", "Crete Sun Loungers", "Munich Dining Table", "Bioclimatic Pergola"],
      year: "2023",
    },
    {
      name: "Casa Algarvia", location: "Almancil", type: "villa",
      img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c0?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      ],
      desc: "A traditional Algarve quinta reimagined for modern living. The courtyard features the Cairo sofa set under a retractable pergola, with the Laguna dining collection positioned for alfresco meals under the stars.",
      products: ["Cairo Sofa Set", "Laguna Dining Set", "Retractable Pergola", "Zanzibar Coffee Table"],
      year: "2023",
    },
    {
      name: "Penthouse Azure", location: "Tavira", type: "apartment",
      img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&h=400&fit=crop",
      ],
      desc: "A rooftop terrace with panoramic views over the Gilão River. Space-efficient Reno balcony furniture paired with a compact BBQ cart created the ultimate urban outdoor retreat.",
      products: ["Reno Balcony Set", "BBQ Cart", "Glatz Parasol", "Dijon Poufs"],
      year: "2024",
    },
    {
      name: "Villa Oceânica", location: "Carvoeiro", type: "villa",
      img: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=700&h=500&fit=crop",
      detail: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&h=700&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      ],
      desc: "Perched on the clifftops with dramatic ocean views, this property demanded furniture as bold as its setting. The Miami collection with its clean contemporary lines complemented the architectural vision perfectly.",
      products: ["Miami Sofa Set", "Florida Dining Table", "Bonaire Sun Loungers", "Sophia Gazebo"],
      year: "2023",
    },
  ];

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  const selected = activeProject !== null ? projects[activeProject] : null;

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
        .pj-card{position:relative;overflow:hidden;cursor:pointer}
        .pj-card img{width:100%;height:100%;object-fit:cover;transition:transform .8s cubic-bezier(.22,1,.36,1),filter .5s}
        .pj-card:hover img{transform:scale(1.05);filter:brightness(.85)}
        .pj-card .pj-ov{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.6));transition:opacity .4s}
        .pj-card .pj-info{position:absolute;bottom:0;left:0;right:0;padding:28px;transition:padding-bottom .4s}
        .pj-card:hover .pj-info{padding-bottom:36px}
        .pj-card .pj-cta{opacity:0;transform:translateY(8px);transition:all .4s .1s}
        .pj-card:hover .pj-cta{opacity:1;transform:translateY(0)}
        .ft{padding:8px 20px;border:1px solid var(--sand-l);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:1.5px;color:var(--sand-d);transition:all .35s}
        .ft:hover,.ft.active{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .detail-modal{background:var(--cream);max-width:900px;width:90%;max-height:90vh;overflow-y:auto;position:relative}
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

      {/* PAGE HERO */}
      <section style={{position:"relative",height:"45vh",minHeight:360,paddingTop:100,background:"linear-gradient(165deg,rgba(26,26,24,.4),rgba(42,95,122,.2)),url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=600&fit=crop') center/cover",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div>
          <span className="fs sl" style={{color:"rgba(255,255,255,.6)",display:"block",marginBottom:16,animation:"fu .8s .2s both"}}>Our portfolio</span>
          <h1 className="ff" style={{fontSize:"clamp(38px,5vw,60px)",fontWeight:300,color:"#fff",lineHeight:1.1,animation:"fu .8s .4s both"}}>Featured Projects</h1>
          <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.6)",marginTop:12,fontWeight:300,animation:"fu .8s .6s both"}}>Luxury outdoor spaces we've brought to life across the Algarve</p>
        </div>
      </section>

      {/* FILTER */}
      <section style={{padding:"28px 48px",borderBottom:"1px solid var(--sand-l)",display:"flex",gap:8,alignItems:"center"}}>
        <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",marginRight:8}}>Filter:</span>
        {[{k:"all",l:"All Projects"},{k:"villa",l:"Villas"},{k:"apartment",l:"Apartments"}].map(f=>(
          <button key={f.k} className={`ft ${filter===f.k?"active":""}`} onClick={()=>setFilter(f.k)}>{f.l}</button>
        ))}
        <span className="fs" style={{marginLeft:"auto",fontSize:12,color:"var(--sand-d)"}}>{filtered.length} projects</span>
      </section>

      {/* PROJECT GRID — masonry-style */}
      <section id="grid" data-animate style={{padding:"48px",...S("grid")}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:1300}}>
          {filtered.map((p, i) => (
            <div key={p.name} className="pj-card"
              style={{height:i%3===0?420:i%3===1?340:380,borderRadius:2,animation:`fu .6s ${0.08*i}s both`}}
              onClick={() => setActiveProject(projects.indexOf(p))}>
              <img src={p.img} alt={p.name} />
              <div className="pj-ov" />
              <div className="pj-info">
                <span className="fs" style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)"}}>{p.location} · {p.year}</span>
                <h3 className="ff" style={{fontSize:26,fontWeight:400,color:"#fff",marginTop:4}}>{p.name}</h3>
                <span className="pj-cta fs" style={{display:"inline-block",marginTop:8,fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold-l)"}}>View project →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT DETAIL MODAL */}
      {selected && (
        <div className="detail-overlay" onClick={() => setActiveProject(null)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setActiveProject(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300,zIndex:10}}>×</button>
            
            {/* Hero image */}
            <div style={{height:360,overflow:"hidden"}}>
              <img src={selected.detail} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>

            {/* Content */}
            <div style={{padding:"40px 48px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                <div>
                  <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)"}}>{selected.location} · {selected.year}</span>
                  <h2 className="ff" style={{fontSize:36,fontWeight:300,marginTop:4}}>{selected.name}</h2>
                </div>
                <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",padding:"6px 16px",border:"1px solid var(--gold)"}}>{selected.type}</span>
              </div>
              <div className="la" style={{marginBottom:20}} />
              <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:28}}>{selected.desc}</p>

              {/* Products used */}
              <div style={{marginBottom:28}}>
                <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Products featured</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {selected.products.map(p=>(
                    <span key={p} className="fs" style={{padding:"6px 14px",border:"1px solid var(--sand)",fontSize:11,letterSpacing:1,color:"var(--stone-l)"}}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              <div style={{display:"grid",gridTemplateColumns:`repeat(${selected.gallery.length},1fr)`,gap:12}}>
                {selected.gallery.map((img,i)=>(
                  <div key={i} style={{overflow:"hidden",borderRadius:2,height:180}}>
                    <img src={img} alt={`${selected.name} detail ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{marginTop:28,display:"flex",gap:12}}>
                <a href="#" className="cb cd">Request similar project</a>
                <a href="#" className="fs" style={{padding:"14px 28px",border:"1px solid var(--sand)",color:"var(--ocean)",textDecoration:"none",fontSize:12,letterSpacing:2,textTransform:"uppercase",display:"inline-flex",alignItems:"center",transition:"all .4s"}}>Contact us</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA SECTION */}
      <section style={{padding:"80px 48px",background:"var(--stone)",color:"#fff",textAlign:"center"}}>
        <span className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--gold)",display:"block",marginBottom:16}}>Your project next?</span>
        <h2 className="ff" style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:300,marginBottom:16}}>Let Us Furnish Your Vision</h2>
        <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.6)",maxWidth:500,margin:"0 auto 28px",fontWeight:300,lineHeight:1.7}}>Whether it's a new build, renovation, or complete outdoor transformation — our team will create a bespoke proposal tailored to your space.</p>
        <a href="#" className="cb" style={{color:"#fff",borderColor:"var(--gold)",background:"var(--gold)"}}>Start your project</a>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"0 48px 36px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingTop:48,paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
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

export default PROJECTS_PAGE;
