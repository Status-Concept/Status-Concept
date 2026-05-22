import { useState, useEffect } from "react";
import useNavLinks from "../useNavLinks";

const CONTACT_PAGE = () => {
  useNavLinks();
  const [headerSolid, setHeaderSolid] = useState(true);
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
  const S = (id) => ({ opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0)" : "translateY(30px)", transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)" });

  const showrooms = [
    {
      name: "Quinta do Lago", address: "Estr. Quinta do Lago-Vale do Lobo\n8135-106 Almancil",
      phone: "+351 289 030 179", mobile: "+351 937 573 600",
      gps: "37.062229, -8.038336",
      img: "/placeholder.svg",
      desc: "Our flagship showroom located on the road between Quinta do Lago and Vale do Lobo. Experience our full collection in a luxurious setting that mirrors the Algarve lifestyle.",
    },
    {
      name: "Almancil", address: "Avenida 5 de Outubro 298\n8135-103 Almancil",
      phone: "+351 289 092 890", mobile: "+351 937 573 600",
      gps: "37.0927, -8.0400",
      img: "/placeholder.svg",
      desc: "Our Almancil showroom on the main avenue, easily accessible and featuring an extensive range of outdoor furniture, shade solutions, and outdoor kitchen displays.",
    },
  ];

  const interests = ["Outdoor Furniture", "Shade Solutions", "Outdoor Kitchens", "Decor & Leisure", "After Care Service", "General Enquiry"];

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
        .sl{font-family:'Outfit',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:var(--sand-d)}
        .form-input{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;transition:border-color .3s}
        .form-input:focus{border-color:var(--gold)}
        .form-input::placeholder{color:var(--sand-d);font-weight:300}
        .form-textarea{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;resize:none;min-height:100px;transition:border-color .3s}
        .form-textarea:focus{border-color:var(--gold)}
        .form-select{width:100%;padding:14px 0;border:none;border-bottom:1px solid var(--sand);background:transparent;font-family:'Outfit',sans-serif;font-size:14px;color:var(--stone);outline:none;cursor:pointer;appearance:none;-webkit-appearance:none;transition:border-color .3s}
        .form-select:focus{border-color:var(--gold)}
        .submit-btn{padding:16px 48px;background:var(--stone);color:#fff;border:1px solid var(--stone);font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .4s}
        .submit-btn:hover{background:transparent;color:var(--stone)}
        .showroom-tab{padding:12px 28px;border:1px solid var(--sand-l);background:transparent;cursor:pointer;font-family:'Outfit',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--sand-d);transition:all .35s}
        .showroom-tab.active{background:var(--stone);color:var(--cream);border-color:var(--stone)}
        .contact-card{padding:32px;border:1px solid var(--sand-l);transition:all .4s}
        .contact-card:hover{border-color:var(--gold);transform:translateY(-2px)}
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(250,249,246,.97)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(196,181,160,.3)"}}>
        <div className="fs" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",borderBottom:"1px solid rgba(196,181,160,.15)"}}>
          <div style={{display:"flex",gap:"24px"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"16px"}}>{["Fb","Ig","Pi","Li"].map(s=><span key={s} style={{cursor:"pointer",opacity:.7}}>{s}</span>)}</div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{display:"flex",alignItems:"baseline",cursor:"pointer"}}>
            <span className="ff" style={{fontSize:28,fontWeight:500,letterSpacing:3,color:"var(--stone)"}}>STATUS</span>
            <span className="fs" style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"var(--sand-d)",marginLeft:4}}>CONCEPT</span>
          </div>
          <nav className="fs" style={{display:"flex",gap:32,fontSize:12,letterSpacing:2,textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
        </div>
      </header>

      {/* PAGE HERO */}
      <section style={{paddingTop:140,paddingBottom:60,paddingLeft:48,paddingRight:48,background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
        <div style={{maxWidth:800}}>
          <div className="fs" style={{fontSize:11,letterSpacing:3,color:"var(--sand-d)",textTransform:"uppercase",marginBottom:8,animation:"fu .8s .2s both"}}>
            <a href="#" style={{color:"inherit",textDecoration:"none"}}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> Contact Us
          </div>
          <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:20,animation:"fu .8s .3s both"}}>Get in Touch</h1>
          <p className="fs" style={{fontSize:15,color:"var(--stone-l)",lineHeight:1.7,maxWidth:600,fontWeight:300,animation:"fu .8s .45s both"}}>
            Visit our showrooms, request a quote, or schedule a video consultation. Our team is at your complete disposal to help create your perfect outdoor space.
          </p>
        </div>
      </section>

      {/* QUICK CONTACT CARDS */}
      <section id="quick" data-animate style={{padding:"60px 48px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20,maxWidth:1200,...S("quick")}}>
        {[
          { icon: "📞", label: "Call us", value: "+351 289 030 179", sub: "Quinta do Lago Showroom" },
          { icon: "📱", label: "WhatsApp", value: "+351 937 573 600", sub: "Direct message" },
          { icon: "✉", label: "Email", value: "info@statusconcept.com", sub: "We reply within 24h" },
          { icon: "📍", label: "Visit", value: "2 Showrooms", sub: "Almancil & Quinta do Lago" },
        ].map((c) => (
          <div key={c.label} className="contact-card" style={{textAlign:"center",cursor:"pointer"}}>
            <div style={{fontSize:28,marginBottom:12}}>{c.icon}</div>
            <div className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",marginBottom:8}}>{c.label}</div>
            <div className="ff" style={{fontSize:18,fontWeight:500,marginBottom:4}}>{c.value}</div>
            <div className="fs" style={{fontSize:12,color:"var(--sand-d)",fontWeight:300}}>{c.sub}</div>
          </div>
        ))}
      </section>

      {/* MAIN: FORM + SHOWROOMS */}
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,minHeight:600}}>
        {/* CONTACT FORM */}
        <div id="form" data-animate style={{padding:"60px 48px 60px 48px",background:"var(--cream-w)",...S("form")}}>
          <span className="fs sl" style={{marginBottom:12,display:"block"}}>Enquiry</span>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:8}}>Send Us a Message</h2>
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

        {/* SHOWROOMS */}
        <div id="showrooms" data-animate style={{padding:"60px 48px",...S("showrooms")}}>
          <span className="fs sl" style={{marginBottom:12,display:"block"}}>Visit us</span>
          <h2 className="ff" style={{fontSize:32,fontWeight:300,marginBottom:8}}>Our Showrooms</h2>
          <div className="la" style={{marginBottom:24}} />

          {/* Showroom tabs */}
          <div style={{display:"flex",gap:8,marginBottom:28}}>
            {showrooms.map((s,i)=>(
              <button key={s.name} className={`showroom-tab ${activeShowroom===i?"active":""}`} onClick={()=>setActiveShowroom(i)}>
                {s.name}
              </button>
            ))}
          </div>

          {/* Active showroom */}
          <div>
            <div style={{overflow:"hidden",borderRadius:2,marginBottom:20,height:240}}>
              <img src={showrooms[activeShowroom].img} alt={showrooms[activeShowroom].name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .6s"}} />
            </div>
            <h3 className="ff" style={{fontSize:24,fontWeight:400,marginBottom:8}}>Showroom {showrooms[activeShowroom].name}</h3>
            <p className="fs" style={{fontSize:13,color:"var(--stone-l)",lineHeight:1.7,marginBottom:16,fontWeight:300}}>{showrooms[activeShowroom].desc}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div className="fs" style={{display:"flex",gap:12,fontSize:13}}>
                <span style={{color:"var(--sand-d)",minWidth:70}}>Address</span>
                <span style={{whiteSpace:"pre-line",color:"var(--stone)"}}>{showrooms[activeShowroom].address}</span>
              </div>
              <div className="fs" style={{display:"flex",gap:12,fontSize:13}}>
                <span style={{color:"var(--sand-d)",minWidth:70}}>Phone</span>
                <span style={{color:"var(--ocean)"}}>{showrooms[activeShowroom].phone}</span>
              </div>
              <div className="fs" style={{display:"flex",gap:12,fontSize:13}}>
                <span style={{color:"var(--sand-d)",minWidth:70}}>Mobile</span>
                <span style={{color:"var(--ocean)"}}>{showrooms[activeShowroom].mobile}</span>
              </div>
              <div className="fs" style={{display:"flex",gap:12,fontSize:13}}>
                <span style={{color:"var(--sand-d)",minWidth:70}}>GPS</span>
                <span style={{color:"var(--stone-l)",fontFamily:"monospace",fontSize:12}}>{showrooms[activeShowroom].gps}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:12,marginTop:20}}>
              <a href="#" className="fs" style={{padding:"10px 24px",background:"var(--stone)",color:"#fff",textDecoration:"none",fontSize:11,letterSpacing:2,textTransform:"uppercase",transition:"all .4s"}}>Get directions</a>
              <a href="#" className="fs" style={{padding:"10px 24px",border:"1px solid var(--sand)",color:"var(--stone)",textDecoration:"none",fontSize:11,letterSpacing:2,textTransform:"uppercase",transition:"all .4s"}}>Video tour</a>
            </div>
          </div>
        </div>
      </section>

      {/* OPENING HOURS / INFO BAR */}
      <section style={{padding:"48px",background:"var(--stone)",color:"#fff",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:40,textAlign:"center"}}>
        {[
          { label: "Opening Hours", value: "Mon – Sat: 10:00 – 18:00", sub: "Sunday by appointment" },
          { label: "Service Areas", value: "All of the Algarve", sub: "Vale do Lobo · Quinta do Lago · Vilamoura · Almancil · Tavira · Carvoeiro · Portimão · Lagos" },
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
      <footer style={{background:"var(--stone)",color:"#fff",padding:"0 48px 36px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingTop:48,paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
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

export default CONTACT_PAGE;
