import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";

const socialIcons = [
  {n:"Facebook",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const CONTACT_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", interest: "" });
  const [activeShowroom, setActiveShowroom] = useState(0);

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

  const showrooms = [
    { name: "Quinta do Lago", address: "Estr. Quinta do Lago-Vale do Lobo\n8135-106 Almancil", phone: "+351 289 030 179", mobile: "+351 937 573 600", gps: "37.062229, -8.038336", img: "/src/assets/images/showroom-quinta.jpg", desc: "Our flagship showroom located on the road between Quinta do Lago and Vale do Lobo. Experience our full collection in a luxurious setting that mirrors the Algarve lifestyle." },
    { name: "Almancil", address: "Avenida 5 de Outubro 298\n8135-103 Almancil", phone: "+351 289 092 890", mobile: "+351 937 573 600", gps: "37.0927, -8.0400", img: "/src/assets/images/showroom-almancil.jpg", desc: "Our Almancil showroom on the main avenue, easily accessible and featuring an extensive range of outdoor furniture, shade solutions, and outdoor kitchen displays." },
  ];

  const interests = ["Outdoor Furniture", "Shade Solutions", "Outdoor Kitchens", "Decor & Leisure", "After Care Service", "General Enquiry"];

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .form-input{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;transition:border-color .3s}
        .form-input:focus{border-color:var(--gold)}
        .form-input::placeholder{color:var(--sand-d);font-weight:300}
        .form-textarea{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;resize:none;min-height:100px;transition:border-color .3s}
        .form-textarea:focus{border-color:var(--gold)}
        .form-select{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;transition:border-color .3s}
        .form-select:focus{border-color:var(--gold)}
        .submit-btn{padding:16px 48px;background:var(--gold);color:#fff;border:1px solid var(--gold);font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .35s;border-radius:2px}
        .submit-btn:hover{background:var(--gold-l);border-color:var(--gold-l)}
        .submit-btn:active{transform:scale(0.97)}
        .showroom-tab{padding:12px 28px;border:1px solid var(--sand-l);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--sand-d);transition:all .3s;border-radius:2px}
        .showroom-tab.active{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .contact-card{padding:32px;border:1px solid var(--sand-l);transition:all .35s cubic-bezier(0.16, 1, 0.3, 1);border-radius:3px}
        .contact-card:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.06)}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(232,240,248,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(163,180,200,.3)"}}>
        <div className="fs header-top" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",borderBottom:"1px solid rgba(163,180,200,.15)"}}>
          <div style={{display:"flex",gap:"24px"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
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
      <section style={{paddingTop:140,paddingBottom:60,paddingLeft:48,paddingRight:48,background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
        <div style={{maxWidth:800}}>
          <div className="fs" style={{fontSize:11,letterSpacing:3,color:"var(--sand-d)",textTransform:"uppercase",marginBottom:8,animation:"fu .6s .2s both"}}>
            <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> Contact Us
          </div>
          <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:20,letterSpacing:"-0.01em",animation:"fu .6s .3s both"}}>Get in Touch</h1>
          <p className="fs" style={{fontSize:15,color:"var(--stone-l)",lineHeight:1.7,maxWidth:600,fontWeight:300,animation:"fu .6s .45s both"}}>
            Visit our showrooms, request a quote, or schedule a video consultation. Our team is at your complete disposal to help create your perfect outdoor space.
          </p>
        </div>
      </section>

      {/* QUICK CONTACT CARDS */}
      <section id="quick" data-animate style={{padding:"60px 48px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,maxWidth:1200,...S("quick")}}>
        {[
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: "Call us", value: "+351 289 030 179", sub: "Quinta do Lago Showroom" },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>, label: "WhatsApp", value: "+351 937 573 600", sub: "Direct message" },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: "Email", value: "info@statusconcept.com", sub: "We reply within 24h" },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Visit", value: "2 Showrooms", sub: "Almancil & Quinta do Lago" },
        ].map((c, i) => (
          <div key={c.label} className="contact-card" style={{textAlign:"center",cursor:"pointer",animation:vis("quick")?`fu 0.5s ${0.08*i}s both`:"none"}}>
            <div style={{marginBottom:16,display:"flex",justifyContent:"center"}}>{c.icon}</div>
            <div className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",marginBottom:8}}>{c.label}</div>
            <div className="ff" style={{fontSize:18,fontWeight:500,marginBottom:4}}>{c.value}</div>
            <div className="fs" style={{fontSize:12,color:"var(--sand-d)",fontWeight:300}}>{c.sub}</div>
          </div>
        ))}
      </section>

      {/* MAIN: FORM + SHOWROOMS */}
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,minHeight:600}}>
        <div id="form" data-animate style={{padding:"60px 48px 60px 48px",background:"var(--cream-w)",...S("form")}}>
          <span className="fs sl" style={{marginBottom:12,display:"block"}}>Enquiry</span>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:8,letterSpacing:"-0.01em"}}>Send Us a Message</h2>
          <div className="la" style={{marginBottom:32}} />
          <div style={{display:"flex",flexDirection:"column",gap:24,maxWidth:500}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              <input className="form-input" placeholder="Your name" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} />
              <input className="form-input" placeholder="Email address" type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} />
            </div>
            <input className="form-input" placeholder="Phone number" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} />
            <div style={{position:"relative"}}>
              <select className="form-select" value={formData.interest} onChange={(e)=>setFormData({...formData,interest:e.target.value})}>
                <option value="" disabled>I'm interested in...</option>
                {interests.map((i)=><option key={i} value={i}>{i}</option>)}
              </select>
              <span style={{position:"absolute",right:0,top:"50%",transform:"translateY(-50%)",color:"var(--sand-d)",pointerEvents:"none"}}>▾</span>
            </div>
            <textarea className="form-textarea" placeholder="Tell us about your project or enquiry..." value={formData.message} onChange={(e)=>setFormData({...formData,message:e.target.value})} />
            <button className="submit-btn" style={{alignSelf:"flex-start"}}>Send enquiry</button>
          </div>
        </div>
        <div id="showrooms" data-animate style={{padding:"60px 48px",...S("showrooms")}}>
          <span className="fs sl" style={{marginBottom:12,display:"block"}}>Visit us</span>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:8,letterSpacing:"-0.01em"}}>Our Showrooms</h2>
          <div className="la" style={{marginBottom:24}} />
          <div style={{display:"flex",gap:8,marginBottom:28}}>
            {showrooms.map((s,i)=>(<button key={s.name} className={`showroom-tab ${activeShowroom===i?"active":""}`} onClick={()=>setActiveShowroom(i)}>{s.name}</button>))}
          </div>
          <div>
            <div style={{overflow:"hidden",borderRadius:3,marginBottom:20,height:240}}>
              <img src={showrooms[activeShowroom].img} alt={showrooms[activeShowroom].name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s"}} />
            </div>
            <h3 className="ff" style={{fontSize:24,fontWeight:400,marginBottom:8}}>Showroom {showrooms[activeShowroom].name}</h3>
            <p className="fs" style={{fontSize:13,color:"var(--stone-l)",lineHeight:1.7,marginBottom:16,fontWeight:300}}>{showrooms[activeShowroom].desc}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"Address",value:showrooms[activeShowroom].address,color:"var(--stone)"},
                {label:"Phone",value:showrooms[activeShowroom].phone,color:"var(--ocean)"},
                {label:"Mobile",value:showrooms[activeShowroom].mobile,color:"var(--ocean)"},
                {label:"GPS",value:showrooms[activeShowroom].gps,color:"var(--stone-l)"},
              ].map(r=>(
                <div key={r.label} className="fs" style={{display:"flex",gap:12,fontSize:13}}>
                  <span style={{color:"var(--sand-d)",minWidth:70}}>{r.label}</span>
                  <span style={{whiteSpace:"pre-line",color:r.color,fontFamily:r.label==="GPS"?"monospace":"inherit",fontSize:r.label==="GPS"?12:13}}>{r.value}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12,marginTop:20}}>
              <a href="#" className="fs" style={{padding:"10px 24px",background:"var(--stone)",color:"#fff",textDecoration:"none",fontSize:11,letterSpacing:2,textTransform:"uppercase",transition:"all .35s",borderRadius:2}} onMouseEnter={e=>{e.target.style.background="var(--gold)"}} onMouseLeave={e=>{e.target.style.background="var(--stone)"}}>Get directions</a>
              <a href="#" className="fs" style={{padding:"10px 24px",border:"1px solid var(--sand)",color:"var(--stone)",textDecoration:"none",fontSize:11,letterSpacing:2,textTransform:"uppercase",transition:"all .35s",borderRadius:2}} onMouseEnter={e=>{e.target.style.borderColor="var(--gold)";e.target.style.color="var(--gold)"}} onMouseLeave={e=>{e.target.style.borderColor="var(--sand)";e.target.style.color="var(--stone)"}}>Video tour</a>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING HOURS / INFO BAR */}
      <section style={{padding:"48px",background:"var(--stone)",color:"#fff",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40,textAlign:"center"}}>
        {[
          { label: "Opening Hours", value: "Mon – Sat: 10:00 – 18:00", sub: "Sunday by appointment" },
          { label: "Service Areas", value: "All of the Algarve", sub: "Vale do Lobo · Quinta do Lago · Vilamoura · Almancil · Tavira · Carvoeiro · Portimao · Lagos" },
          { label: "Languages", value: "English & Portuguese", sub: "Multilingual team available" },
        ].map((item)=>(
          <div key={item.label}>
            <div className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"var(--gold)",marginBottom:12}}>{item.label}</div>
            <div className="ff" style={{fontSize:22,fontWeight:300,marginBottom:8}}>{item.value}</div>
            <div className="fs" style={{fontSize:12,color:"rgba(255,255,255,.5)",fontWeight:300,lineHeight:1.6}}>{item.sub}</div>
          </div>
        ))}
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
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery"]},{t:"Contact",ls:["Quinta do Lago","Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
            <div key={c.t}>
              <h4 className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",marginBottom:16}}>{c.t}</h4>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>{c.ls.map(l=><a key={l} href="#" className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",textDecoration:"none",fontWeight:300,transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,.8)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,.5)"}>{l}</a>)}</div>
            </div>
          ))}
        </div>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",paddingTop:24,fontSize:11,color:"rgba(255,255,255,.25)",letterSpacing:1,flexWrap:"wrap",gap:12}}>
          <span>© 2026 Status Concept. All rights reserved.</span>
          <div style={{display:"flex",gap:24}}><a href="#" style={{color:"inherit",textDecoration:"none"}}>Privacy Policy</a><a href="#" style={{color:"inherit",textDecoration:"none"}}>Terms</a></div>
        </div>
      </footer>
    </div>
  );
};

export default CONTACT_PAGE;
