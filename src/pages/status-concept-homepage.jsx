import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";

const STATUS_CONCEPT_HOMEPAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("furniture");
  const [headerSolid, setHeaderSolid] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeProject, setActiveProject] = useState(0);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);

  const collections = {
    furniture: [
      { name: "Bali", desc: "Modular lounge collection", img: "/src/assets/images/bali-able.jpg" },
      { name: "Berlin", desc: "Classic sofa & armchairs", img: "/src/assets/images/berlin.jpg" },
      { name: "Bonaire", desc: "Luxury corner lounge set", img: "/src/assets/images/bonaire-lounge.jpg" },
      { name: "Ibiza", desc: "Contemporary lounge set", img: "/src/assets/images/ibiza-able.jpg" },
      { name: "Maya", desc: "Elegant sofa collection", img: "/src/assets/images/maya.jpg" },
      { name: "Bora Bora", desc: "Premium outdoor sofa", img: "/src/assets/images/bora-bora.jpg" },
    ],
    shade: [
      { name: "Glatz Parasols", desc: "Swiss precision shading", img: "/src/assets/images/glatz-parasol.jpg" },
      { name: "Bioclimatic Pergolas", desc: "Intelligent climate control", img: "/src/assets/images/glatz-bioclimatic.jpg" },
      { name: "Retractable Pergolas", desc: "Flexible outdoor roofing", img: "/src/assets/images/glatz-retractable.jpg" },
    ],
    kitchen: [
      { name: "Outdoor Kitchens", desc: "Complete cooking stations", img: "/src/assets/images/kitchen-sink.jpg" },
      { name: "BBQ Systems", desc: "Premium grilling solutions", img: "/src/assets/images/kitchen-bbq.jpg" },
      { name: "Pizza Ovens", desc: "Artisan wood-fired ovens", img: "/src/assets/images/kitchen-fridge.jpg" },
    ],
  };

  const projects = [
    { name: "Villa Quinta do Lago", location: "Quinta do Lago", img: "/src/assets/images/project-quinta.jpg" },
    { name: "Residence Vale do Lobo", location: "Vale do Lobo", img: "/src/assets/images/project-valedolobo.jpg" },
    { name: "Private Estate Vilamoura", location: "Vilamoura", img: "/src/assets/images/project-vilamoura.jpg" },
    { name: "Luxury Home Almancil", location: "Almancil", img: "/src/assets/images/project-almancil.jpg" },
  ];

  const cats = [
    { name: "Lounge", sub: "Sofas & Sets" }, { name: "Dining", sub: "Tables & Chairs" },
    { name: "Sun Loungers", sub: "Relax & Recline" }, { name: "Day Beds", sub: "Ultimate Comfort" },
    { name: "Shade", sub: "Parasols & Pergolas" }, { name: "Kitchens", sub: "Outdoor Cooking" },
    { name: "Decor", sub: "Carpets & Vases" }, { name: "Leisure", sub: "Sound & Games" },
  ];

  const S = {
    section: (id) => ({
      opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)",
      transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
    }),
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#1a1a18", background: "#faf9f6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--sand:#c4b5a0;--sand-l:#e8e0d4;--sand-d:#8a7d6b;--ocean:#2a5f7a;--ocean-d:#1a3d52;--ocean-l:#a8c5d4;--stone:#1a1a18;--stone-l:#3d3d3a;--cream:#faf9f6;--cream-w:#f5f0e8;--gold:#b8965a;--gold-l:#d4bc8a}
        .fs{font-family:'Outfit',sans-serif}.ff{font-family:'Cormorant Garamond',Georgia,serif}
        @keyframes hu{from{opacity:0;transform:translateY(30px) skewY(2deg)}to{opacity:1;transform:translateY(0) skewY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .cc{position:relative;overflow:hidden;cursor:pointer;border-radius:2px}
        .cc img{transition:transform .8s cubic-bezier(.22,1,.36,1),filter .6s ease;width:100%;height:100%;object-fit:cover}
        .cc:hover img{transform:scale(1.06);filter:brightness(.85)}
        .cc .ov{position:absolute;bottom:0;left:0;right:0;padding:28px;background:linear-gradient(transparent,rgba(0,0,0,.65));transition:padding-bottom .5s}
        .cc:hover .ov{padding-bottom:36px}
        .cc .disc{opacity:0;transform:translateY(10px);transition:all .4s}
        .cc:hover .disc{opacity:1;transform:translateY(0)}
        .pc{cursor:pointer;transition:all .6s}.pc:hover{transform:translateY(-4px)}
        .pc img{transition:transform .8s cubic-bezier(.22,1,.36,1)}.pc:hover img{transform:scale(1.04)}
        .cp{padding:16px 28px;border:1px solid var(--sand);background:transparent;cursor:pointer;transition:all .4s;display:flex;flex-direction:column;align-items:center;gap:4px}
        .cp:hover{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .cp:hover .cs{color:var(--sand-l)}
        .nl{position:relative;text-decoration:none;color:inherit;transition:color .3s;padding-bottom:2px}
        .nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--gold);transition:width .4s cubic-bezier(.22,1,.36,1)}
        .nl:hover::after{width:100%}.nl:hover{color:var(--gold)}
        .tb{padding:10px 24px;border:none;cursor:pointer;font-family:'Outfit',sans-serif;font-size:13px;letter-spacing:2.5px;text-transform:uppercase;transition:all .4s;background:transparent}
        .tb.ac{color:var(--stone);border-bottom:2px solid var(--gold)}.tb:not(.ac){color:var(--sand-d);border-bottom:2px solid transparent}
        .cb{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border:1px solid;transition:all .5s cubic-bezier(.22,1,.36,1);cursor:pointer}
        .cl{color:#fff;border-color:rgba(255,255,255,.4);background:transparent}.cl:hover{background:#fff;color:var(--stone);border-color:#fff}
        .cd{color:var(--stone);border-color:var(--stone);background:transparent}.cd:hover{background:var(--stone);color:var(--cream)}
        .cg{color:var(--cream);border-color:var(--gold);background:var(--gold)}.cg:hover{background:var(--gold-l);border-color:var(--gold-l)}
        .la{width:60px;height:1px;background:var(--gold)}.law{width:60px;height:1px;background:rgba(255,255,255,.5)}
        .sl{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--sand-d)}
        .mb{display:inline-flex;align-items:center;gap:8px;padding:8px 20px;border:1px solid var(--sand);font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--sand-d)}
        .mo{position:fixed;top:0;right:0;width:100%;max-width:420px;height:100vh;background:var(--cream);z-index:1000;padding:80px 40px 40px;transform:translateX(100%);transition:transform .5s cubic-bezier(.22,1,.36,1);overflow-y:auto}
        .mo.op{transform:translateX(0)}
        .moo{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.4);z-index:999;opacity:0;pointer-events:none;transition:opacity .4s}
        .moo.op{opacity:1;pointer-events:all}
        .cat-item{padding:40px 32px;cursor:pointer;transition:background .5s;position:relative;overflow:hidden;border-right:1px solid var(--sand-l);border-bottom:1px solid var(--sand-l)}
        .cat-item:hover{background:var(--stone)}
        .cat-n{font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:400;color:var(--stone);display:block;margin-bottom:8px;position:relative;transition:color .5s}
        .cat-item:hover .cat-n{color:#fff}
        .cat-s{font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:2px;color:var(--sand-d);text-transform:uppercase;position:relative;transition:color .5s}
        .cat-item:hover .cat-s{color:rgba(255,255,255,.4)}
        .cat-bg{font-family:'Cormorant Garamond',Georgia,serif;font-size:88px;font-weight:300;color:var(--sand-l);position:absolute;bottom:-8px;right:12px;line-height:1;transition:color .5s;pointer-events:none;user-select:none}
        .cat-item:hover .cat-bg{color:rgba(255,255,255,.06)}
        .cat-arrow{position:absolute;bottom:20px;right:24px;opacity:0;font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:2px;color:var(--gold);transition:all .4s;transform:translateX(-6px)}
        .cat-item:hover .cat-arrow{opacity:1;transform:translateX(0)}
        .si{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;transition:background .3s;text-decoration:none;color:inherit;flex-shrink:0}
        .si:hover{background:rgba(255,255,255,.12)}
        @keyframes mk{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .marquee-wrap{overflow:hidden;border-top:1px solid var(--sand-l);border-bottom:1px solid var(--sand-l);padding:14px 0;background:var(--cream)}
        .marquee-track{display:flex;width:max-content;animation:mk 28s linear infinite}
        .marquee-item{font-family:'Outfit',sans-serif;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--sand-d);padding:0 40px;white-space:nowrap}
        .marquee-dot{color:var(--gold);padding:0 4px}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:headerSolid?"rgba(250,249,246,.97)":"transparent",backdropFilter:headerSolid?"blur(12px)":"none",borderBottom:headerSolid?"1px solid rgba(196,181,160,.3)":"1px solid transparent",transition:"all .5s"}}>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:headerSolid?"var(--sand-d)":"rgba(255,255,255,.7)",borderBottom:headerSolid?"1px solid rgba(196,181,160,.15)":"1px solid rgba(255,255,255,.1)",transition:"all .5s"}}>
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
            {[
              {n:"Facebook",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
              {n:"Instagram",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
              {n:"Pinterest",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
              {n:"LinkedIn",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
            ].map(({n,svg})=>(
              <a key={n} href="#" aria-label={n} className="si" style={{opacity:.65}}>{svg}</a>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:"4px",cursor:"pointer"}}>
            <span className="ff" style={{fontSize:"28px",fontWeight:500,letterSpacing:"3px",color:headerSolid?"var(--stone)":"#fff",transition:"color .5s"}}>STATUS</span>
            <span className="fs" style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:headerSolid?"var(--sand-d)":"rgba(255,255,255,.6)",transition:"color .5s",marginLeft:"4px"}}>CONCEPT</span>
          </div>
          <nav className="fs" style={{display:"flex",gap:"32px",alignItems:"center",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:headerSolid?"var(--stone-l)":"rgba(255,255,255,.9)",transition:"color .5s"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
            <div style={{position:"relative"}}>
              <button className="fs" onClick={()=>setLangOpen(!langOpen)} style={{background:"none",border:"none",cursor:"pointer",fontSize:"11px",letterSpacing:"2px",color:headerSolid?"var(--sand-d)":"rgba(255,255,255,.7)",transition:"color .5s"}}>EN ▾</button>
              {langOpen&&<div style={{position:"absolute",top:"100%",right:0,marginTop:8,background:"var(--cream)",border:"1px solid var(--sand-l)",padding:"8px 0",minWidth:80}}>{["EN","PT"].map(l=><div key={l} className="fs" style={{padding:"6px 16px",fontSize:"11px",letterSpacing:"2px",cursor:"pointer",color:"var(--stone-l)"}} onClick={()=>setLangOpen(false)}>{l}</div>)}</div>}
            </div>
            <button onClick={()=>setMenuOpen(true)} style={{background:"none",border:"none",cursor:"pointer",padding:4,color:headerSolid?"var(--stone)":"#fff",transition:"color .5s",display:"flex",flexDirection:"column",gap:"5px"}}>
              <div style={{width:24,height:1.5,background:"currentColor"}}/><div style={{width:18,height:1.5,background:"currentColor",marginLeft:"auto"}}/>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`moo ${menuOpen?"op":""}`} onClick={()=>setMenuOpen(false)}/>
      <div className={`mo ${menuOpen?"op":""}`}>
        <button onClick={()=>setMenuOpen(false)} style={{position:"absolute",top:28,right:28,background:"none",border:"none",fontSize:28,cursor:"pointer",color:"var(--stone)",fontWeight:300}}>×</button>
        <nav style={{display:"flex",flexDirection:"column"}}>
          {[{l:"Furniture",s:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},{l:"Shade Solutions",s:["Parasols","Bioclimatic Pergolas","Retractable Pergolas"]},{l:"Outdoor Kitchens",s:["BBQ Systems","Pizza Ovens","Full Kitchens"]},{l:"Decor",s:["Carpets","Vases & Statues"]},{l:"Leisure",s:["Sound Systems"]},{l:"Projects",s:[]},{l:"Why Us",s:[]},{l:"After Care",s:[]},{l:"Contact",s:[]}].map(item=>(
            <div key={item.l} style={{borderBottom:"1px solid var(--sand-l)",padding:"16px 0"}}>
              <span className="ff" style={{fontSize:22,fontWeight:400,color:"var(--stone)",cursor:"pointer"}}>{item.l}</span>
              {item.s.length>0&&<div className="fs" style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>{item.s.map(s=><span key={s} style={{fontSize:12,letterSpacing:1,color:"var(--sand-d)",cursor:"pointer",paddingLeft:12}}>{s}</span>)}</div>}
            </div>
          ))}
        </nav>
        <div style={{marginTop:32,display:"flex",gap:12}}><span className="mb">Sunbrella®</span><span className="mb">Glatz</span></div>
      </div>

      {/* HERO */}
      <section style={{position:"relative",height:"100vh",minHeight:700,background:"linear-gradient(165deg,rgba(26,26,24,.3) 0%,rgba(26,26,24,.15) 40%,rgba(42,95,122,.2) 100%),url('/src/assets/images/hero.jpg') center/cover",display:"flex",alignItems:"flex-end",padding:"0 0 100px 0"}}>
        <div style={{position:"absolute",top:140,left:48,width:60,height:60,borderLeft:"1px solid rgba(255,255,255,.2)",borderTop:"1px solid rgba(255,255,255,.2)"}}/>
        <div style={{position:"absolute",bottom:40,right:48,width:60,height:60,borderRight:"1px solid rgba(255,255,255,.2)",borderBottom:"1px solid rgba(255,255,255,.2)"}}/>
        <div style={{padding:"0 48px",maxWidth:800}}>
          <div className="fs sl" style={{color:"rgba(255,255,255,.6)",marginBottom:20,animation:"hu 1s .2s both"}}>Luxury outdoor living · Algarve, Portugal</div>
          <h1 className="ff" style={{fontSize:"clamp(42px,6vw,72px)",fontWeight:300,color:"#fff",lineHeight:1.05,marginBottom:24,animation:"hu 1s .4s both"}}>Where Design<br/>Meets the Sun</h1>
          <p className="fs" style={{fontSize:15,color:"rgba(255,255,255,.7)",lineHeight:1.7,maxWidth:500,marginBottom:36,fontWeight:300,animation:"hu 1s .6s both"}}>Curated outdoor furniture of excellence for the most distinguished residences across the Algarve. From Quinta do Lago to Vilamoura — elegance, crafted for your space.</p>
          <div style={{display:"flex",gap:16,animation:"hu 1s .8s both"}}><a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/products')}}>Explore collections</a><a href="#" className="cb cg" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Visit showroom</a></div>
        </div>
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"fi 1s 1.2s both"}}>
          <span className="fs" style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>Scroll</span>
          <div style={{width:1,height:40,background:"linear-gradient(transparent,rgba(255,255,255,.4))"}}/>
        </div>
      </section>

      {/* INTRO */}
      <section id="intro" data-animate style={{padding:"100px 48px",textAlign:"center",...S.section("intro")}}>
        <div className="la" style={{margin:"0 auto 28px"}}/>
        <p className="ff" style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:300,lineHeight:1.6,maxWidth:780,margin:"0 auto",color:"var(--stone-l)"}}>Proud of what we represent, understanding our customers' needs, we are committed to providing furniture of the highest quality, partnering with manufacturers where attention to detail is essential.</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:36}}><span className="mb">Sunbrella® Fabrics</span><span className="mb">Interpon Coating</span><span className="mb">Premium Aluminium</span></div>
      </section>

      {/* COLLECTIONS */}
      <section id="colls" data-animate style={{padding:"60px 48px 100px",...S.section("colls")}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span className="fs sl">Our world</span>
          <h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:12}}>Collections</h2>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:48,borderBottom:"1px solid var(--sand-l)"}}>
          {[{k:"furniture",l:"Furniture"},{k:"shade",l:"Shade Solutions"},{k:"kitchen",l:"Outdoor Kitchens"}].map(t=><button key={t.k} className={`tb ${activeTab===t.k?"ac":""}`} onClick={()=>setActiveTab(t.k)}>{t.l}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:1200,margin:"0 auto"}}>
          {collections[activeTab].map((c,i)=>(
            <div key={c.name} className="cc" onClick={()=>navigate('/collection')} style={{height:i===0||i===3?440:360}}>
              <FavoriteButton
                product={{id:`collection-${c.name.toLowerCase()}`,name:c.name,collection:c.name,img:c.img,route:'/collection'}}
                size={16}
                style={{position:"absolute",top:12,right:12,zIndex:3}}
              />
              <img src={c.img} alt={c.name}/>
              <div className="ov">
                <h3 className="ff" style={{fontSize:26,fontWeight:400,color:"#fff",marginBottom:4}}>{c.name}</h3>
                <p className="fs" style={{fontSize:12,color:"rgba(255,255,255,.7)",letterSpacing:1}}>{c.desc}</p>
                <span className="disc fs" style={{display:"inline-block",marginTop:12,fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold-l)"}}>Discover →</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:48}}><a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>View all products</a></div>
      </section>

      {/* CATEGORIES */}
      <section id="cats" data-animate style={{padding:"80px 48px",background:"var(--cream-w)",...S.section("cats")}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <span className="fs sl">Browse by type</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12}}>Product Categories</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:1100,margin:"0 auto",borderTop:"1px solid var(--sand-l)",borderLeft:"1px solid var(--sand-l)"}}>
          {cats.map((c,i)=>(
            <div key={c.name} className="cat-item" onClick={()=>navigate('/products')}>
              <span className="cat-bg">{String(i+1).padStart(2,'0')}</span>
              <span className="cat-n">{c.name}</span>
              <span className="cat-s">{c.sub}</span>
              <span className="cat-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY STATUS */}
      <section id="why" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:600,...S.section("why")}}>
        <div style={{background:"url('/src/assets/images/why-status.jpg') center/cover"}}/>
        <div style={{background:"var(--stone)",color:"#fff",padding:"80px 60px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{color:"var(--gold-l)",marginBottom:20}}>Why Status Concept</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,marginBottom:28,lineHeight:1.2}}>Over a Decade of<br/>Outdoor Excellence</h2>
          <div className="law" style={{marginBottom:28}}/>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:32}}>We provide outdoor furniture to the most prestigious addresses in the Algarve — Vale do Lobo, Quinta do Lago, Vilamoura, Almancil, Tavira, and beyond. Our success is built on a passion and vast experience acquired over more than a decade of furnishing elegant residences across Europe.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:36}}>
            {[{n:"10+",l:"Years of excellence"},{n:"2",l:"Showrooms"},{n:"76+",l:"Furniture pieces"},{n:"5★",l:"Service rating"}].map(s=>(
              <div key={s.l}><div className="ff" style={{fontSize:32,fontWeight:300,color:"var(--gold)"}}>{s.n}</div><div className="fs" style={{fontSize:11,letterSpacing:1.5,color:"rgba(255,255,255,.5)",textTransform:"uppercase"}}>{s.l}</div></div>
            ))}
          </div>
          <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/about')}} style={{alignSelf:"flex-start"}}>Learn more</a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="proj" data-animate style={{padding:"100px 48px",...S.section("proj")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48}}>
          <div><span className="fs sl">Inspiration</span><h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:12}}>Featured Projects</h2></div>
          <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/projects')}} style={{marginBottom:4}}>View all</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,maxWidth:1200}}>
          <div className="pc" onClick={()=>navigate('/projects')} style={{position:"relative",overflow:"hidden",borderRadius:2,height:480}}>
            <img src={projects[activeProject].img} alt={projects[activeProject].name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:36,background:"linear-gradient(transparent,rgba(0,0,0,.7))"}}>
              <h3 className="ff" style={{fontSize:28,color:"#fff",fontWeight:400}}>{projects[activeProject].name}</h3>
              <p className="fs" style={{fontSize:12,letterSpacing:1.5,color:"rgba(255,255,255,.6)"}}>{projects[activeProject].location}</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateRows:"1fr 1fr",gap:20}}>
            {projects.filter((_,i)=>i!==activeProject).slice(0,2).map(p=>(
              <div key={p.name} className="pc" onClick={()=>setActiveProject(projects.indexOf(p))} style={{position:"relative",overflow:"hidden",borderRadius:2}}>
                <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:24,background:"linear-gradient(transparent,rgba(0,0,0,.65))"}}>
                  <h4 className="ff" style={{fontSize:20,color:"#fff",fontWeight:400}}>{p.name}</h4>
                  <p className="fs" style={{fontSize:11,letterSpacing:1,color:"rgba(255,255,255,.6)"}}>{p.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AFTER CARE BANNER */}
      <section id="ac" data-animate style={{position:"relative",padding:"100px 48px",background:"linear-gradient(135deg,var(--ocean-d) 0%,var(--ocean) 100%)",textAlign:"center",color:"#fff",...S.section("ac")}}>
        <div style={{position:"absolute",top:40,left:48,width:40,height:40,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}}/>
        <div style={{position:"absolute",bottom:40,right:48,width:40,height:40,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}}/>
        <span className="fs sl" style={{color:"var(--ocean-l)"}}>Exclusive service</span>
        <h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:16,marginBottom:20}}>After Care & Valet Service</h2>
        <div className="law" style={{margin:"0 auto 24px"}}/>
        <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",maxWidth:600,margin:"0 auto 36px",fontWeight:300}}>Our skilled team handles all cleaning and maintenance to the highest standard. We care for your outdoor furniture seasonally — ensuring it stays as beautiful as the day it arrived.</p>
        <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/about')}}>Discover after care</a>
      </section>

      {/* SHOWROOMS */}
      <section id="shows" data-animate style={{...S.section("shows")}}>
        {/* Full-width hero banner */}
        <div style={{position:"relative",height:500,overflow:"hidden",background:"linear-gradient(135deg,var(--stone) 0%,var(--stone-l) 100%)"}}>
          <div style={{position:"absolute",inset:0,display:"grid",gridTemplateColumns:"1fr 1fr"}}>
            {[{name:"Quinta do Lago",img:"/src/assets/images/showroom-quinta.jpg"},{name:"Almancil",img:"/src/assets/images/showroom-almancil.jpg"}].map((s,i)=>(
              <div key={s.name} style={{position:"relative",overflow:"hidden",cursor:"pointer"}} onClick={()=>navigate('/contact')}>
                <img src={s.img} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1.2s cubic-bezier(.22,1,.36,1),filter .6s",filter:"brightness(.55)"}}
                  onMouseEnter={e=>{e.target.style.transform="scale(1.08)";e.target.style.filter="brightness(.4)"}}
                  onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.filter="brightness(.55)"}} />
                {i===0 && <div style={{position:"absolute",top:0,right:0,bottom:0,width:1,background:"rgba(255,255,255,.15)"}} />}
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 48px",background:"linear-gradient(transparent,rgba(0,0,0,.5))"}}>
                  <span className="fs" style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"var(--gold-l)",display:"block",marginBottom:8}}>Showroom {String(i+1).padStart(2,'0')}</span>
                  <h3 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,color:"#fff",marginBottom:4}}>{s.name}</h3>
                  <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:6}}>
                    Visit showroom <span style={{display:"inline-block",width:20,height:1,background:"var(--gold)"}}/>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Centered title overlay */}
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
            <span className="fs" style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:"var(--gold-l)",display:"block",marginBottom:12}}>Visit us</span>
            <h2 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,color:"#fff",lineHeight:1.1,textShadow:"0 2px 40px rgba(0,0,0,.5)"}}>Our Showrooms</h2>
            <div style={{width:60,height:1,background:"var(--gold)",margin:"20px auto 0"}} />
          </div>
          {/* Corner accents */}
          <div style={{position:"absolute",top:32,left:48,width:50,height:50,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}} />
          <div style={{position:"absolute",bottom:32,right:48,width:50,height:50,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}} />
        </div>

        {/* Showroom details strip */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"var(--stone)",borderTop:"1px solid rgba(255,255,255,.06)"}}>
          {[
            {name:"Quinta do Lago",addr:"Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil",ph:"+351 289 030 179",mob:"+351 937 573 600",desc:"Our flagship showroom on the road between Quinta do Lago and Vale do Lobo — experience the full collection in person."},
            {name:"Almancil",addr:"Avenida 5 de Outubro 298, 8135-103 Almancil",ph:"+351 289 092 890",mob:"+351 937 573 600",desc:"Our Almancil location on the main avenue — easily accessible, featuring outdoor furniture, shade solutions, and kitchen displays."},
          ].map((s,i)=>(
            <div key={s.name} style={{padding:"40px 48px",borderRight:i===0?"1px solid rgba(255,255,255,.06)":"none",cursor:"pointer",transition:"background .4s"}}
              onClick={()=>navigate('/contact')}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 className="ff" style={{fontSize:22,fontWeight:400,color:"#fff"}}>{s.name}</h3>
                </div>
              </div>
              <p className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.7,fontWeight:300,marginBottom:20}}>{s.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="fs" style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{color:"rgba(255,255,255,.6)"}}>{s.addr}</span>
                </div>
                <div className="fs" style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span style={{color:"var(--ocean-l)"}}>{s.ph}</span>
                </div>
                <div className="fs" style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                  <span style={{color:"var(--ocean-l)"}}>{s.mob}</span>
                </div>
              </div>
              <div style={{marginTop:20,display:"flex",gap:16,alignItems:"center"}}>
                <span className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>Get directions →</span>
                <span className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>Book a visit →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Hours bar */}
        <div style={{background:"var(--cream-w)",padding:"28px 48px",display:"flex",justifyContent:"center",gap:48,alignItems:"center",borderBottom:"1px solid var(--sand-l)"}}>
          {[
            {label:"Mon – Fri",value:"10:00 – 18:30"},
            {label:"Saturday",value:"10:00 – 13:00"},
            {label:"Sunday",value:"Closed"},
          ].map((h,i)=>(
            <div key={h.label} style={{display:"flex",alignItems:"center",gap:i<2?48:0}}>
              <div style={{textAlign:"center"}}>
                <span className="fs" style={{fontSize:10,letterSpacing:2.5,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:4}}>{h.label}</span>
                <span className="fs" style={{fontSize:14,fontWeight:400,color:h.value==="Closed"?"var(--sand-d)":"var(--stone)",letterSpacing:.5}}>{h.value}</span>
              </div>
              {i<2 && <div style={{width:1,height:28,background:"var(--sand-l)"}} />}
            </div>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...Array(2)].map((_,r)=>(
            ["Sunbrella® Fabrics","Premium Aluminium","Glatz Parasols","Bioclimatic Pergolas","Quinta do Lago","Vale do Lobo","Vilamoura","Custom Upholstery","10+ Years Experience","Outdoor Living"].map((t,i)=>(
              <span key={`${r}-${i}`} className="marquee-item">{t}<span className="marquee-dot">·</span></span>
            ))
          ))}
        </div>
      </div>

      {/* NEWSLETTER */}
      <section style={{padding:"88px 48px",background:"var(--cream-w)",textAlign:"center",borderTop:"1px solid var(--sand-l)",backgroundImage:"radial-gradient(circle,rgba(196,181,160,.18) 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
        <div className="la" style={{margin:"0 auto 24px"}}/>
        <span className="fs sl">Stay inspired</span>
        <h2 className="ff" style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:300,marginTop:12,marginBottom:12}}>Join Our World</h2>
        <p className="fs" style={{fontSize:14,color:"var(--stone-l)",lineHeight:1.75,maxWidth:400,margin:"0 auto 32px",fontWeight:300}}>Receive our latest collections, project features, and seasonal care guides.</p>
        <div style={{display:"flex",maxWidth:480,margin:"0 auto",boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
          <input type="email" placeholder="Your email address" className="fs" style={{flex:1,padding:"16px 20px",border:"1px solid var(--sand)",borderRight:"none",background:"#fff",fontSize:13,letterSpacing:.5,outline:"none",color:"var(--stone)"}}/>
          <button className="fs" style={{padding:"16px 28px",background:"var(--stone)",color:"#fff",border:"none",fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap"}}>Subscribe</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:500,letterSpacing:3}}>STATUS</span><span className="fs" style={{fontSize:9,letterSpacing:3,marginLeft:4,color:"rgba(255,255,255,.4)"}}>CONCEPT</span></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve. Serving Vale do Lobo, Quinta do Lago, Vilamoura, and beyond.</p>
            <div style={{display:"flex",gap:"2px",marginTop:20}}>
              {[
                {n:"Facebook",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
                {n:"Instagram",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
                {n:"Pinterest",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
                {n:"LinkedIn",svg:<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
              ].map(({n,svg})=>(
                <a key={n} href="#" aria-label={n} className="si" style={{color:"rgba(255,255,255,.4)"}}>{svg}</a>
              ))}
            </div>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor","Leisure"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery","Catalogue"]},{t:"Contact",ls:["Showroom Quinta do Lago","Showroom Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300}}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1}}>
          <span>© 2026 Status Concept. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Cookie Policy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default STATUS_CONCEPT_HOMEPAGE;
