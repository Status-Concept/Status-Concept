import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";

const ABOUT_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [headerSolid] = useState(true);
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

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "#1a1a18", background: "#faf9f6", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        :root{--sand:#c4b5a0;--sand-l:#e8e0d4;--sand-d:#8a7d6b;--ocean:#2a5f7a;--ocean-d:#1a3d52;--ocean-l:#a8c5d4;--stone:#1a1a18;--stone-l:#3d3d3a;--cream:#faf9f6;--cream-w:#f5f0e8;--gold:#b8965a;--gold-l:#d4bc8a}
        .fs{font-family:'Outfit',sans-serif}.ff{font-family:'Cormorant Garamond',Georgia,serif}
        @keyframes fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        .nl{position:relative;text-decoration:none;color:inherit;transition:color .3s;padding-bottom:2px}
        .nl::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--gold);transition:width .4s cubic-bezier(.22,1,.36,1)}
        .nl:hover::after{width:100%}.nl:hover{color:var(--gold)}
        .la{width:60px;height:1px;background:var(--gold)}
        .law{width:60px;height:1px;background:rgba(255,255,255,.5)}
        .sl{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--sand-d)}
        .cb{display:inline-flex;align-items:center;gap:10px;padding:14px 36px;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;border:1px solid;transition:all .5s cubic-bezier(.22,1,.36,1);cursor:pointer}
        .cl{color:#fff;border-color:rgba(255,255,255,.4);background:transparent}.cl:hover{background:#fff;color:var(--stone);border-color:#fff}
        .cd{color:var(--stone);border-color:var(--stone);background:transparent}.cd:hover{background:var(--stone);color:var(--cream)}
        .mat-card{padding:40px;border:1px solid var(--sand-l);transition:all .5s;background:var(--cream)}
        .mat-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.06)}
        .value-item{display:flex;gap:20px;align-items:flex-start;padding:28px 0;border-bottom:1px solid var(--sand-l)}
        .value-item:last-child{border-bottom:none}
        .value-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;color:var(--gold);min-width:48px}
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

      {/* HERO BANNER */}
      <section style={{position:"relative",height:"50vh",minHeight:400,paddingTop:100,background:"linear-gradient(165deg,rgba(26,26,24,.4),rgba(42,95,122,.25)),url('/placeholder.svg') center/cover",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div>
          <span className="fs sl" style={{color:"rgba(255,255,255,.6)",display:"block",marginBottom:16,animation:"fu .8s .2s both"}}>About Status Concept</span>
          <h1 className="ff" style={{fontSize:"clamp(38px,5vw,60px)",fontWeight:300,color:"#fff",lineHeight:1.1,animation:"fu .8s .4s both"}}>Crafting Outdoor<br/>Excellence Since 2013</h1>
        </div>
      </section>

      {/* BRAND STORY */}
      <section id="story" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,...S("story")}}>
        <div style={{padding:"80px 60px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{marginBottom:16}}>Our story</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,marginBottom:16,lineHeight:1.2}}>A Passion for<br/>Outdoor Living</h2>
          <div className="la" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:16}}>
            Proud of what we represent, understanding our customers' needs and demands, we made a commitment to provide furniture of the highest quality in partnership with chosen manufacturers who acknowledge that attention to detail is essential.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300,marginBottom:16}}>
            This has brought us to where we are today, offering outdoor furniture of excellence. We provide outdoor furniture to the most known places in the Algarve — Vale do Lobo, Quinta do Lago, Vilamoura, Almancil, Tavira, Carvoeiro, Portimão, Lagos, and beyond.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"var(--stone-l)",fontWeight:300}}>
            Our success is linked to a passion and vast experience acquired over more than a decade of providing elegant furniture to residences across Europe.
          </p>
        </div>
        <div style={{background:"url('/placeholder.svg') center/cover",minHeight:500}} />
      </section>

      {/* VALUES / STATS */}
      <section id="values" data-animate style={{padding:"80px 48px",background:"var(--cream-w)",...S("values")}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span className="fs sl">What sets us apart</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12}}>Why Status Concept</h2>
          </div>

          {[
            { num: "01", title: "Curated Partnerships", desc: "We work exclusively with manufacturers who share our commitment to quality, selecting each partner for their attention to detail, material innovation, and design excellence." },
            { num: "02", title: "Premium Materials Only", desc: "From Sunbrella® fabrics to Interpon powder coating and premium aluminium frames — every component is chosen for durability under the Algarve sun and resistance to the coastal climate." },
            { num: "03", title: "Complete Customisation", desc: "Choose from our pre-made sets or work with our team to create fully customised modules. Our Customer Service Department helps you build exactly what you envision." },
            { num: "04", title: "After Care & Valet Service", desc: "We don't just sell furniture — we maintain it. Our skilled cleaning team provides seasonal care to keep your investment looking pristine year after year." },
            { num: "05", title: "Two Showrooms, One Vision", desc: "Visit our spaces in Quinta do Lago and Almancil to experience our collections firsthand. Or connect via video tour from the comfort of your home." },
          ].map((v) => (
            <div key={v.num} className="value-item">
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
      <section id="materials" data-animate style={{padding:"80px 48px",...S("materials")}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span className="fs sl">Quality guaranteed</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12}}>Our Materials</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:1100,margin:"0 auto"}}>
          {[
            {
              title: "Sunbrella® Fabrics",
              img: "/placeholder.svg",
              points: ["UV resistant", "Water & stain resistant", "Breathable & mold resistant", "Easy care with soapy water", "Color-fast through the core"],
              desc: "Sunbrella® fibres are steeped in top quality dyes during manufacturing when the acrylic is still liquid, coloring yarn all the way to the core for lasting vibrancy.",
            },
            {
              title: "Interpon Powder Coating",
              img: "/placeholder.svg",
              points: ["Corrosion protection", "UV stability", "Scratch resistant", "Environmentally friendly", "Premium finish"],
              desc: "Our aluminium frames are treated with Interpon powder coating, providing a durable protective layer that withstands the coastal elements while maintaining a flawless appearance.",
            },
            {
              title: "Microfiber Leather",
              img: "/placeholder.svg",
              points: ["Highest grade synthetic", "Natural leather simulation", "Sea-island fibre base", "Superior durability", "Low maintenance"],
              desc: "The highest grade synthetic leather, simulating the structure of natural leather using sea-island microfiber technology for unmatched outdoor performance.",
            },
          ].map((mat) => (
            <div key={mat.title} className="mat-card">
              <div style={{overflow:"hidden",borderRadius:2,marginBottom:20,height:180}}>
                <img src={mat.img} alt={mat.title} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
              <h3 className="ff" style={{fontSize:24,fontWeight:400,marginBottom:8}}>{mat.title}</h3>
              <p className="fs" style={{fontSize:13,color:"var(--stone-l)",lineHeight:1.7,fontWeight:300,marginBottom:16}}>{mat.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {mat.points.map((p) => (
                  <div key={p} className="fs" style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"var(--stone-l)"}}>
                    <div style={{width:4,height:4,borderRadius:"50%",background:"var(--gold)",flexShrink:0}} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AFTER CARE BANNER */}
      <section id="aftercare" data-animate style={{position:"relative",padding:"100px 48px",background:"linear-gradient(135deg,var(--ocean-d) 0%,var(--ocean) 100%)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center",color:"#fff",...S("aftercare")}}>
        <div style={{position:"absolute",top:40,left:48,width:40,height:40,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}} />
        <div style={{position:"absolute",bottom:40,right:48,width:40,height:40,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}} />
        <div>
          <span className="fs sl" style={{color:"var(--ocean-l)",marginBottom:16,display:"block"}}>Exclusive service</span>
          <h2 className="ff" style={{fontSize:"clamp(32px,4vw,44px)",fontWeight:300,marginBottom:16,lineHeight:1.2}}>After Care &<br/>Valet Service</h2>
          <div className="law" style={{marginBottom:24}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:16}}>
            We have a skilled team who are able to take on all cleaning requirements to a high standard, using the best suitable cleaning products that ensures we achieve the best results.
          </p>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:24}}>
            Our team will clean and care for your outdoor furniture for the upcoming winter or at your request — ensuring every piece stays as immaculate as the day it was delivered.
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
            <div key={s.label} style={{padding:24,border:"1px solid rgba(255,255,255,.15)",borderRadius:2}}>
              <h4 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:6}}>{s.label}</h4>
              <p className="fs" style={{fontSize:12,color:"rgba(255,255,255,.5)",fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:"80px 48px",textAlign:"center",background:"var(--cream-w)"}}>
        <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginBottom:16}}>Ready to Transform Your Outdoor Space?</h2>
        <p className="fs" style={{fontSize:14,color:"var(--stone-l)",maxWidth:500,margin:"0 auto 28px",fontWeight:300,lineHeight:1.7}}>Visit our showrooms or get in touch. We'll help you create the outdoor living experience your home deserves.</p>
        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
          <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Visit showroom</a>
          <a href="#" className="cb" onClick={(e)=>{e.preventDefault();navigate('/contact')}} style={{color:"var(--gold)",borderColor:"var(--gold)",background:"transparent"}}>Request a quote</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:500,letterSpacing:3}}>STATUS</span><span className="fs" style={{fontSize:9,letterSpacing:3,marginLeft:4,color:"rgba(255,255,255,.4)"}}>CONCEPT</span></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve.</p>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery"]},{t:"Contact",ls:["Quinta do Lago","Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
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

export default ABOUT_PAGE;
