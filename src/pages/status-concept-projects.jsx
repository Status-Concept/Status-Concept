import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";

const socialIcons = [
  {n:"Facebook",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const PROJECTS_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
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
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" });

  const projects = [
    { name: "Villa Serena", location: "Quinta do Lago", type: "villa", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg","/placeholder.svg"], desc: "A stunning contemporary villa overlooking the Ria Formosa natural park. We furnished the entire outdoor living area with the Oxford modular collection, complemented by Glatz parasols and a custom outdoor kitchen installation.", products: ["Oxford Modular Sofa", "Glatz Sunwing Parasol", "Custom Outdoor Kitchen", "Laguna Dining Set"], year: "2024" },
    { name: "Residence Vale Royal", location: "Vale do Lobo", type: "villa", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg","/placeholder.svg"], desc: "This beachfront property required furniture that could withstand the Atlantic coastal elements while maintaining elegance. The Bella reclining collection proved the perfect match, with the Antalya daybed as the pool centrepiece.", products: ["Bella Reclining Sofa Set", "Antalya Daybed", "MAUI Sun Loungers", "Naples Coffee Table"], year: "2024" },
    { name: "Villa Mimosa", location: "Vilamoura", type: "villa", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg","/placeholder.svg"], desc: "An expansive marina-facing terrace transformed into a seamless indoor-outdoor entertainment space. We installed the Sicily modular system across three distinct zones: lounge, dining, and a sunbathing area with Crete loungers.", products: ["Sicily Modular Set", "Crete Sun Loungers", "Munich Dining Table", "Bioclimatic Pergola"], year: "2023" },
    { name: "Casa Algarvia", location: "Almancil", type: "villa", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg","/placeholder.svg"], desc: "A traditional Algarve quinta reimagined for modern living. The courtyard features the Cairo sofa set under a retractable pergola, with the Laguna dining collection positioned for alfresco meals under the stars.", products: ["Cairo Sofa Set", "Laguna Dining Set", "Retractable Pergola", "Zanzibar Coffee Table"], year: "2023" },
    { name: "Penthouse Azure", location: "Tavira", type: "apartment", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg"], desc: "A rooftop terrace with panoramic views over the Gilao River. Space-efficient Reno balcony furniture paired with a compact BBQ cart created the ultimate urban outdoor retreat.", products: ["Reno Balcony Set", "BBQ Cart", "Glatz Parasol", "Dijon Poufs"], year: "2024" },
    { name: "Villa Oceanica", location: "Carvoeiro", type: "villa", img: "/placeholder.svg", detail: "/placeholder.svg", gallery: ["/placeholder.svg","/placeholder.svg"], desc: "Perched on the clifftops with dramatic ocean views, this property demanded furniture as bold as its setting. The Miami collection with its clean contemporary lines complemented the architectural vision perfectly.", products: ["Miami Sofa Set", "Florida Dining Table", "Bonaire Sun Loungers", "Sophia Gazebo"], year: "2023" },
  ];

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  const selected = activeProject !== null ? projects[activeProject] : null;

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .pj-card{position:relative;overflow:hidden;cursor:pointer;border-radius:3px}
        .pj-card img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1),filter .5s}
        .pj-card:hover img{transform:scale(1.06);filter:brightness(.82)}
        .pj-card .pj-ov{position:absolute;inset:0;background:linear-gradient(transparent 40%,rgba(0,0,0,.6));transition:opacity .4s}
        .pj-card .pj-info{position:absolute;bottom:0;left:0;right:0;padding:28px;transition:padding-bottom .4s cubic-bezier(0.16, 1, 0.3, 1)}
        .pj-card:hover .pj-info{padding-bottom:36px}
        .pj-card .pj-cta{opacity:0;transform:translateY(8px);transition:all .35s .08s}
        .pj-card:hover .pj-cta{opacity:1;transform:translateY(0)}
        .ft{padding:8px 20px;border:1px solid var(--sand-l);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:1.5px;color:var(--sand-d);transition:all .3s;border-radius:2px}
        .ft:hover,.ft.active{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .ft:active{transform:scale(0.96)}
        .detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .3s;backdrop-filter:blur(4px)}
        .detail-modal{background:var(--cream);max-width:900px;width:90%;max-height:90vh;overflow-y:auto;position:relative;border-radius:3px}
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

      {/* PAGE HERO */}
      <section style={{position:"relative",height:"45vh",minHeight:360,paddingTop:100,background:"linear-gradient(165deg,rgba(44,42,37,.45),rgba(42,95,122,.2)),url('/placeholder.svg') center/cover",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div>
          <span className="fs sl" style={{color:"rgba(255,255,255,.6)",display:"block",marginBottom:16,animation:"fu .6s .2s both"}}>Our portfolio</span>
          <h1 className="ff" style={{fontSize:"clamp(38px,5vw,60px)",fontWeight:300,color:"#fff",lineHeight:1.1,letterSpacing:"-0.01em",animation:"fu .6s .4s both"}}>Featured Projects</h1>
          <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.6)",marginTop:12,fontWeight:300,animation:"fu .6s .6s both"}}>Luxury outdoor spaces we've brought to life across the Algarve</p>
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

      {/* PROJECT GRID */}
      <section id="grid" data-animate style={{padding:"48px",...S("grid")}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:1300}}>
          {filtered.map((p, i) => (
            <div key={p.name} className="pj-card"
              style={{height:i%3===0?420:i%3===1?340:380,animation:vis("grid")?`fu .5s ${0.08*i}s both`:"none"}}
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
            <button onClick={() => setActiveProject(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300,zIndex:10,transition:"color .3s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="var(--stone)"}>×</button>
            <div style={{height:360,overflow:"hidden"}}>
              <img src={selected.detail} alt={selected.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
            </div>
            <div style={{padding:"40px 48px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:12}}>
                <div>
                  <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)"}}>{selected.location} · {selected.year}</span>
                  <h2 className="ff" style={{fontSize:36,fontWeight:300,marginTop:4,letterSpacing:"-0.01em"}}>{selected.name}</h2>
                </div>
                <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",padding:"6px 16px",border:"1px solid var(--gold)",borderRadius:2}}>{selected.type}</span>
              </div>
              <div className="la" style={{marginBottom:20}} />
              <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:28}}>{selected.desc}</p>
              <div style={{marginBottom:28}}>
                <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>Products featured</span>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {selected.products.map(p=>(<span key={p} className="mb">{p}</span>))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${selected.gallery.length},1fr)`,gap:12}}>
                {selected.gallery.map((img,i)=>(
                  <div key={i} style={{overflow:"hidden",borderRadius:3,height:180}}>
                    <img src={img} alt={`${selected.name} detail ${i+1}`} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                  </div>
                ))}
              </div>
              <div style={{marginTop:28,display:"flex",gap:12,flexWrap:"wrap"}}>
                <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Request similar project</a>
                <a href="#" className="fs" style={{padding:"15px 28px",border:"1px solid var(--sand)",color:"var(--ocean)",textDecoration:"none",fontSize:12,letterSpacing:2,textTransform:"uppercase",display:"inline-flex",alignItems:"center",transition:"all .35s"}} onClick={(e)=>{e.preventDefault();navigate('/contact')}} onMouseEnter={e=>{e.target.style.borderColor="var(--ocean)";e.target.style.color="var(--ocean)"}} onMouseLeave={e=>{e.target.style.borderColor="var(--sand)";e.target.style.color="var(--ocean)"}}>Contact us</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA SECTION */}
      <section style={{padding:"clamp(60px,10vh,100px) 48px",background:"var(--stone)",color:"#fff",textAlign:"center"}}>
        <span className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--gold)",display:"block",marginBottom:16}}>Your project next?</span>
        <h2 className="ff" style={{fontSize:"clamp(28px,4vw,44px)",fontWeight:300,marginBottom:16,letterSpacing:"-0.01em"}}>Let Us Furnish Your Vision</h2>
        <p className="fs" style={{fontSize:14,color:"rgba(255,255,255,.6)",maxWidth:500,margin:"0 auto 28px",fontWeight:300,lineHeight:1.7}}>Whether it's a new build, renovation, or complete outdoor transformation: our team will create a bespoke proposal tailored to your space.</p>
        <a href="#" className="cb cg" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Start your project</a>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
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

export default PROJECTS_PAGE;
