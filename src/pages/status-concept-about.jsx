import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";

const socialIcons = [
  {n:"Facebook",url:"https://facebook.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",url:"https://instagram.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",url:"https://pinterest.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",url:"https://linkedin.com/company/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const ABOUT_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
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

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .mat-card{padding:40px;border:1px solid var(--sand-l);transition:all .4s cubic-bezier(0.16, 1, 0.3, 1);background:var(--cream)}
        .mat-card:hover{border-color:var(--gold);transform:translateY(-6px);box-shadow:0 16px 40px rgba(0,0,0,.08)}
        .value-item{display:flex;gap:20px;align-items:flex-start;padding:28px 0;border-bottom:1px solid var(--sand-l);transition:background .3s}
        .value-item:last-child{border-bottom:none}
        .value-item:hover{background:rgba(163,180,200,.08);padding-left:12px}
        .value-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--gold);min-width:48px}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(232,240,248,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(163,180,200,.3)"}}>
        <div className="fs header-top" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",borderBottom:"1px solid rgba(163,180,200,.15)"}}>
          <div style={{display:"flex",gap:24}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
            {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{opacity:.65,color:"var(--sand-d)"}}>{svg}</a>))}
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

      {/* HERO BANNER */}
      <section style={{position:"relative",height:"50vh",minHeight:400,paddingTop:100,background:"linear-gradient(165deg,rgba(44,42,37,.45),rgba(42,95,122,.25)),url('/src/assets/images/showroom-quinta.jpg') center/cover",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div>
          <span className="fs sl" style={{color:"rgba(255,255,255,.6)",display:"block",marginBottom:16,animation:"fu .6s .2s both"}}>About Statvs</span>
          <h1 className="ff" style={{fontSize:"clamp(38px,5vw,60px)",fontWeight:300,color:"#fff",lineHeight:1.1,letterSpacing:"-0.01em",animation:"fu .6s .4s both"}}>Crafting Outdoor<br/>Excellence Since 2013</h1>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="story" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,...S("story")}}>
        <div style={{padding:"clamp(48px,8vh,100px) 60px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{marginBottom:16}}>Our story</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,marginBottom:16,lineHeight:1.2,letterSpacing:"-0.01em"}}>A Passion for<br/>Outdoor Living</h2>
          <div className="la" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:16}}>
            Proud of what we represent, understanding our customers' needs and demands, we made a commitment to provide furniture of the highest quality in partnership with chosen manufacturers who acknowledge that attention to detail is essential.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:16}}>
            This has brought us to where we are today, offering outdoor furniture of excellence. We provide outdoor furniture to the most known places in the Algarve: Vale do Lobo, Quinta do Lago, Vilamoura, Almancil, Tavira, Carvoeiro, Portimao, Lagos, and beyond.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300}}>
            Our success is linked to a passion and vast experience acquired over more than a decade of providing elegant furniture to residences across Europe.
          </p>
        </div>
        <div style={{background:"url('/src/assets/images/why-status.jpg') center/cover",minHeight:500}} />
      </section>

      {/* VALUES / STATS */}
      <section id="values" data-animate style={{padding:"clamp(60px,10vh,100px) 48px",background:"var(--cream-w)",...S("values")}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span className="fs sl">What sets us apart</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12,letterSpacing:"-0.01em"}}>Why Statvs</h2>
          </div>
          {[
            { num: "01", title: "Curated Partnerships", desc: "We work exclusively with manufacturers who share our commitment to quality, selecting each partner for their attention to detail, material innovation, and design excellence." },
            { num: "02", title: "Premium Materials Only", desc: "From Sunbrella® fabrics to Interpon powder coating and premium aluminium frames: every component is chosen for durability under the Algarve sun and resistance to the coastal climate." },
            { num: "03", title: "Complete Customisation", desc: "Choose from our pre-made sets or work with our team to create fully customised modules. Our Customer Service Department helps you build exactly what you envision." },
            { num: "04", title: "After Care & Valet Service", desc: "We don't just sell furniture, we maintain it. Our skilled cleaning team provides seasonal care to keep your investment looking pristine year after year." },
            { num: "05", title: "Two Showrooms, One Vision", desc: "Visit our spaces in Quinta do Lago and Almancil to experience our collections firsthand. Or connect via video tour from the comfort of your home." },
          ].map((v, i) => (
            <div key={v.num} className="value-item" style={{animation:vis("values")?`fu 0.5s ${0.08*i}s both`:"none"}}>
              <span className="value-num">{v.num}</span>
              <div>
                <h3 className="ff" style={{fontSize:22,fontWeight:400,marginBottom:6}}>{v.title}</h3>
                <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"var(--stone-l)",fontWeight:300}}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MATERIALS SECTION */}
      <section id="materials" data-animate style={{padding:"clamp(60px,10vh,100px) 48px",...S("materials")}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span className="fs sl">Quality guaranteed</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12,letterSpacing:"-0.01em"}}>Our Materials</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {[
            { title: "Sunbrella® Fabrics", img: "/placeholder.svg", points: ["UV resistant","Water & stain resistant","Breathable & mold resistant","Easy care with soapy water","Color-fast through the core"], desc: "Sunbrella® fibres are steeped in top quality dyes during manufacturing when the acrylic is still liquid, coloring yarn all the way to the core for lasting vibrancy." },
            { title: "Interpon Powder Coating", img: "/placeholder.svg", points: ["Corrosion protection","UV stability","Scratch resistant","Environmentally friendly","Premium finish"], desc: "Our aluminium frames are treated with Interpon powder coating, providing a durable protective layer that withstands the coastal elements while maintaining a flawless appearance." },
            { title: "Microfiber Leather", img: "/placeholder.svg", points: ["Highest grade synthetic","Natural leather simulation","Sea-island fibre base","Superior durability","Low maintenance"], desc: "The highest grade synthetic leather, simulating the structure of natural leather using sea-island microfiber technology for unmatched outdoor performance." },
          ].map((mat, i) => (
            <div key={mat.title} className="mat-card" style={{animation:vis("materials")?`fu 0.5s ${0.1*i}s both`:"none"}}>
              <div style={{overflow:"hidden",borderRadius:3,marginBottom:20,height:180}}>
                <img src={mat.img} alt={mat.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
              <h3 className="ff" style={{fontSize:24,fontWeight:400,marginBottom:8}}>{mat.title}</h3>
              <p className="fs" style={{fontSize:13,color:"var(--stone-l)",lineHeight:1.7,fontWeight:300,marginBottom:16}}>{mat.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {mat.points.map((p) => (
                  <div key={p} className="fs" style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--stone-l)"}}>
                    <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0}} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AFTER CARE BANNER */}
      <section id="aftercare" data-animate style={{position:"relative",padding:"clamp(60px,10vh,120px) 48px",background:"linear-gradient(135deg,var(--ocean-d) 0%,var(--ocean) 100%)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",color:"#fff",...S("aftercare")}}>
        <div style={{position:"absolute",top:40,left:48,width:40,height:40,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}} />
        <div style={{position:"absolute",bottom:40,right:48,width:40,height:40,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}} />
        <div>
          <span className="fs sl" style={{color:"var(--ocean-l)",marginBottom:16,display:"block"}}>Exclusive service</span>
          <h2 className="ff" style={{fontSize:"clamp(32px,4vw,44px)",fontWeight:300,marginBottom:16,lineHeight:1.2,letterSpacing:"-0.01em"}}>After Care &<br/>Valet Service</h2>
          <div className="law" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:16}}>
            We have a skilled team who are able to take on all cleaning requirements to a high standard, using the best suitable cleaning products that ensures we achieve the best results.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:24}}>
            Our team will clean and care for your outdoor furniture for the upcoming winter or at your request, ensuring every piece stays as immaculate as the day it was delivered.
          </p>
          <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Book a service</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          {[
            { label: "Seasonal Care", desc: "Pre-winter and spring preparation" },
            { label: "Deep Cleaning", desc: "Fabric, frame & surface restoration" },
            { label: "On Demand", desc: "Scheduled at your convenience" },
            { label: "All Algarve", desc: "Service across the full region" },
          ].map((s) => (
            <div key={s.label} style={{padding:24,border:"1px solid rgba(255,255,255,.15)",borderRadius:3,transition:"all .35s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.35)";e.currentTarget.style.background="rgba(255,255,255,.05)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,.15)";e.currentTarget.style.background="transparent"}}>
              <h4 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:6}}>{s.label}</h4>
              <p className="fs" style={{fontSize:12,color:"rgba(255,255,255,.5)",fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"clamp(60px,10vh,100px) 48px",textAlign:"center",background:"var(--cream-w)"}}>
        <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginBottom:16,letterSpacing:"-0.01em"}}>Ready to Transform Your Outdoor Space?</h2>
        <p className="fs" style={{fontSize:14,color:"var(--stone-l)",maxWidth:500,margin:"0 auto 28px",fontWeight:300,lineHeight:1.7}}>Visit our showrooms or get in touch. We'll help you create the outdoor living experience your home deserves.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Visit showroom</a>
          <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/contact')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Request a quote</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:400,letterSpacing:8}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span><div className="fs" style={{fontSize:7,letterSpacing:3,color:"rgba(255,255,255,.4)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve.</p>
            <div style={{display:"flex",gap:"2px",marginTop:20}}>
              {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{color:"rgba(255,255,255,.4)"}}>{svg}</a>))}
            </div>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery"]},{t:"Contact",ls:["Quinta do Lago","Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
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

export default ABOUT_PAGE;
