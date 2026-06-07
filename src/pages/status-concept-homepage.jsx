import { useState, useEffect, useRef } from "react";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";
import Layout from "../components/Layout";
import heroImg from "../assets/images/enhanced/hero-ai.png";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.png";
import showroomAlmancilImg from "../assets/images/enhanced/showroom-almancil-ai.png";
import whyStatusImg from "../assets/images/enhanced/why-status-ai.png";
const placeholderImg = "/placeholder.svg";
import neroKitchenImg from "../assets/images/kitchen/blk-6burner-bbq.jpg";
import teakKitchenImg from "../assets/images/kitchen/teak-setup-1.jpg";
import carbonKitchenImg from "../assets/images/kitchen/carbon-line-1.jpg";

const STATUS_CONCEPT_HOMEPAGE = () => {
  useNavLinks();
  const navigate = useLocalizedNavigate();
  const [activeTab, setActiveTab] = useState("furniture");
  const [activeProject, setActiveProject] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const heroRef = useRef(null);
  const { vis, S } = useScrollAnimation();

  const heroImages = [heroImg, showroomQuintaImg, whyStatusImg];

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.backgroundPositionY = `${window.scrollY * 0.35}px`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const collections = {
    furniture: [
      { name: "Bali", desc: "Relaxed outdoor seating with deep cushions and a resort-inspired profile.", img: placeholderImg, route: "/products?cat=lounge" },
      { name: "Berlin", desc: "Classic outdoor sofa proportions with a clean aluminium frame.", img: placeholderImg, route: "/products?cat=lounge" },
      { name: "Bonaire", desc: "Corner lounge comfort made for long terrace afternoons.", img: placeholderImg, route: "/products?cat=lounge" },
      { name: "Ibiza", desc: "Contemporary lounge seating with a light visual footprint.", img: placeholderImg, route: "/products?cat=lounge" },
      { name: "Maya", desc: "Soft outdoor comfort with a tailored silhouette.", img: placeholderImg, route: "/products?cat=lounge" },
      { name: "Bora Bora", desc: "Premium outdoor sofa styling for poolside spaces.", img: placeholderImg, route: "/products?cat=lounge" },
    ],
    shade: [
      { name: "Glatz Parasols", desc: "Swiss engineered parasol shade for flexible terrace coverage.", img: placeholderImg, route: "/products?cat=shade" },
      { name: "Bioclimatic Pergolas", desc: "Architectural shade with adjustable climate control.", img: placeholderImg, route: "/products?cat=shade" },
      { name: "Retractable Pergolas", desc: "Flexible roof coverage for changing Algarve weather.", img: placeholderImg, route: "/products?cat=shade" },
    ],
    kitchen: [
      { name: "Nero Range", desc: "Black stainless steel modules with granite tops, BBQs, fridges and sinks.", img: neroKitchenImg, route: "/products?cat=kitchen" },
      { name: "Teak Range", desc: "Natural reclaimed teak kitchen modules with ceramic tops and practical storage.", img: teakKitchenImg, route: "/products?cat=kitchen" },
      { name: "Carbon Line", desc: "Black reclaimed teak modules with ceramic tops and premium BBQ cabinets.", img: carbonKitchenImg, route: "/products?cat=kitchen" },
    ],
  };

  const projects = [
    { name: "Villa Quinta do Lago", location: "Quinta do Lago", img: "/placeholder.svg" },
    { name: "Residence Vale do Lobo", location: "Vale do Lobo", img: "/placeholder.svg" },
    { name: "Private Estate Vilamoura", location: "Vilamoura", img: "/placeholder.svg" },
    { name: "Luxury Home Almancil", location: "Almancil", img: "/placeholder.svg" },
  ];

  const cats = [
    { name: "Lounge", sub: "Sofas & Sets" }, { name: "Dining", sub: "Tables & Chairs" },
    { name: "Sun Loungers", sub: "Relax & Recline" }, { name: "Day Beds", sub: "Ultimate Comfort" },
    { name: "Shade", sub: "Parasols & Pergolas" }, { name: "Kitchens", sub: "Outdoor Cooking" },
    { name: "Decor", sub: "Carpets & Vases" }, { name: "Leisure", sub: "Sound & Games" },
  ];

  return (
    <Layout transparent>
      {/* HERO CAROUSEL */}
      <section ref={heroRef} style={{position:"relative",height:"100vh",minHeight:700,display:"flex",alignItems:"flex-end",padding:"0 0 100px 0",overflow:"hidden"}}>
        {heroImages.map((img, i) => (
          <div key={i} style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(165deg,rgba(44,42,37,.35) 0%,rgba(44,42,37,.15) 40%,rgba(42,95,122,.2) 100%),url('${img}')`,backgroundSize:"cover",backgroundPosition:"center",opacity:heroSlide===i?1:0,transition:"opacity 1.2s ease-in-out",willChange:"opacity"}} />
        ))}
        <div style={{position:"absolute",top:140,left:48,width:60,height:60,borderLeft:"1px solid rgba(255,255,255,.2)",borderTop:"1px solid rgba(255,255,255,.2)",zIndex:2}}/>
        <div style={{position:"absolute",bottom:40,right:48,width:60,height:60,borderRight:"1px solid rgba(255,255,255,.2)",borderBottom:"1px solid rgba(255,255,255,.2)",zIndex:2}}/>
        <div style={{position:"absolute",bottom:80,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,zIndex:3}}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={()=>setHeroSlide(i)} style={{width:heroSlide===i?24:8,height:8,borderRadius:4,border:"none",background:heroSlide===i?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .4s cubic-bezier(0.16, 1, 0.3, 1)"}} />
          ))}
        </div>
        <div style={{padding:"0 48px",maxWidth:800,position:"relative",zIndex:2}}>
          <div className="fs sl" style={{color:"rgba(255,255,255,.6)",marginBottom:20,animation:"hu 0.8s .2s both"}}>Luxury outdoor living · Algarve, Portugal</div>
          <h1 className="ff" style={{fontSize:"clamp(42px,6vw,72px)",fontWeight:300,color:"#fff",lineHeight:1.05,marginBottom:24,letterSpacing:"-0.01em",animation:"hu 0.8s .4s both"}}>Where Design<br/>Meets the Sun</h1>
          <p className="fs" style={{fontSize:15,color:"rgba(255,255,255,.7)",lineHeight:1.7,maxWidth:500,marginBottom:36,fontWeight:300,animation:"hu 0.8s .6s both"}}>Curated outdoor furniture of excellence for the most distinguished residences across the Algarve. From Quinta do Lago to Vilamoura: elegance, crafted for your space.</p>
          <div style={{display:"flex",gap:16,animation:"hu 0.8s .8s both",flexWrap:"wrap"}}><a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/products')}}>Explore collections</a><a href="#" className="cb cg" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Visit showroom</a></div>
        </div>
        <div style={{position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:8,animation:"scrollHint 2.5s ease infinite"}}>
          <span className="fs" style={{fontSize:10,letterSpacing:3,color:"rgba(255,255,255,.4)",textTransform:"uppercase"}}>Scroll</span>
          <div style={{width:1,height:40,background:"linear-gradient(transparent,rgba(255,255,255,.4))"}}/>
        </div>
      </section>

      {/* INTRO */}
      <section id="intro" data-animate style={{padding:"clamp(60px,10vh,120px) 48px",textAlign:"center",...S("intro")}}>
        <div className="la" style={{margin:"0 auto 28px"}}/>
        <p className="ff" style={{fontSize:"clamp(22px,3vw,32px)",fontWeight:300,lineHeight:1.6,maxWidth:780,margin:"0 auto",color:"var(--stone-l)"}}>Proud of what we represent, understanding our customers' needs, we are committed to providing furniture of the highest quality, partnering with manufacturers where attention to detail is essential.</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:36,flexWrap:"wrap"}}><span className="mb">Sunbrella® Fabrics</span><span className="mb">Interpon Coating</span><span className="mb">Premium Aluminium</span></div>
      </section>

      {/* COLLECTIONS */}
      <section id="colls" data-animate style={{padding:"60px 48px clamp(60px,10vh,120px)",...S("colls")}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span className="fs sl">Our world</span>
          <h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:12,letterSpacing:"-0.01em"}}>Collections</h2>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:48,borderBottom:"1px solid var(--sand-l)"}}>
          {[{k:"furniture",l:"Furniture"},{k:"shade",l:"Shade Solutions"},{k:"kitchen",l:"Outdoor Kitchens"}].map(t=><button key={t.k} className={`tb ${activeTab===t.k?"ac":""}`} onClick={()=>setActiveTab(t.k)}>{t.l}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,maxWidth:1200,margin:"0 auto"}}>
          {collections[activeTab].map((c,i)=>(
            <div key={c.name} className="cc" onClick={()=>navigate(c.route)} style={{height:i===0||i===3?440:360,animation:vis("colls")?`fu 0.6s ${0.1*i}s both`:"none"}}>
              <FavoriteButton
                product={{id:`collection-${c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`,name:c.name,collection:c.name,img:c.img,route:c.route}}
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
      <section id="cats" data-animate style={{padding:"clamp(60px,10vh,100px) 48px",background:"var(--cream-w)",...S("cats")}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <span className="fs sl">Browse by type</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:12,letterSpacing:"-0.01em"}}>Product Categories</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:1100,margin:"0 auto",borderTop:"1px solid var(--sand-l)",borderLeft:"1px solid var(--sand-l)"}}>
          {cats.map((c,i)=>(
            <div key={c.name} className="cat-item" onClick={()=>navigate('/products')} style={{animation:vis("cats")?`fu 0.5s ${0.06*i}s both`:"none"}}>
              <span className="cat-bg">{String(i+1).padStart(2,'0')}</span>
              <span className="cat-n">{c.name}</span>
              <span className="cat-s">{c.sub}</span>
              <span className="cat-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY STATUS */}
      <section id="why" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:600,...S("why")}}>
        <div style={{background:`url('${whyStatusImg}') center/cover`}}/>
        <div style={{background:"var(--stone)",color:"#fff",padding:"clamp(48px,8vh,100px) 60px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{color:"var(--gold-l)",marginBottom:20}}>Why Statvs</span>
          <h2 className="ff" style={{fontSize:36,fontWeight:300,marginBottom:28,lineHeight:1.2,letterSpacing:"-0.01em"}}>Over a Decade of<br/>Outdoor Excellence</h2>
          <div className="law" style={{marginBottom:28}}/>
          <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",fontWeight:300,marginBottom:32}}>We provide outdoor furniture to the most prestigious addresses in the Algarve: Vale do Lobo, Quinta do Lago, Vilamoura, Almancil, Tavira, and beyond. Our success is built on a passion and vast experience acquired over more than a decade of furnishing elegant residences across Europe.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:36}}>
            {[{n:"10+",l:"Years of excellence"},{n:"2",l:"Showrooms"},{n:"76+",l:"Furniture pieces"},{n:"5★",l:"Service rating"}].map(s=>(
              <div key={s.l} style={{padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
                <div className="ff" style={{fontSize:32,fontWeight:300,color:"var(--gold)"}}>{s.n}</div>
                <div className="fs" style={{fontSize:11,letterSpacing:1.5,color:"rgba(255,255,255,.5)",textTransform:"uppercase",marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/about')}} style={{alignSelf:"flex-start"}}>Learn more</a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="proj" data-animate style={{padding:"clamp(60px,10vh,120px) 48px",...S("proj")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:16}}>
          <div><span className="fs sl">Inspiration</span><h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:12,letterSpacing:"-0.01em"}}>Featured Projects</h2></div>
          <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/projects')}} style={{marginBottom:4}}>View all</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:20,maxWidth:1200}}>
          <div className="pc" onClick={()=>navigate('/projects')} style={{position:"relative",overflow:"hidden",borderRadius:3,height:480}}>
            <img src={projects[activeProject].img} alt={projects[activeProject].name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:36,background:"linear-gradient(transparent,rgba(0,0,0,.7))"}}>
              <h3 className="ff" style={{fontSize:28,color:"#fff",fontWeight:400}}>{projects[activeProject].name}</h3>
              <p className="fs" style={{fontSize:12,letterSpacing:1.5,color:"rgba(255,255,255,.6)"}}>{projects[activeProject].location}</p>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateRows:"1fr 1fr",gap:20}}>
            {projects.filter((_,i)=>i!==activeProject).slice(0,2).map(p=>(
              <div key={p.name} className="pc" onClick={()=>setActiveProject(projects.indexOf(p))} style={{position:"relative",overflow:"hidden",borderRadius:3}}>
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
      <section id="ac" data-animate style={{position:"relative",padding:"clamp(60px,10vh,120px) 48px",background:"linear-gradient(135deg,var(--ocean-d) 0%,var(--ocean) 100%)",textAlign:"center",color:"#fff",...S("ac")}}>
        <div style={{position:"absolute",top:40,left:48,width:40,height:40,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}}/>
        <div style={{position:"absolute",bottom:40,right:48,width:40,height:40,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}}/>
        <span className="fs sl" style={{color:"var(--ocean-l)"}}>Exclusive service</span>
        <h2 className="ff" style={{fontSize:"clamp(32px,4vw,48px)",fontWeight:300,marginTop:16,marginBottom:20,letterSpacing:"-0.01em"}}>After Care & Valet Service</h2>
        <div className="law" style={{margin:"0 auto 24px"}}/>
        <p className="fs" style={{fontSize:14,lineHeight:1.8,color:"rgba(255,255,255,.7)",maxWidth:600,margin:"0 auto 36px",fontWeight:300}}>Our skilled team handles all cleaning and maintenance to the highest standard. We care for your outdoor furniture seasonally, ensuring it stays as beautiful as the day it arrived.</p>
        <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/about')}}>Discover after care</a>
      </section>

      {/* SHOWROOMS */}
      <section id="shows" data-animate style={{...S("shows")}}>
        <div style={{position:"relative",height:500,overflow:"hidden",background:"linear-gradient(135deg,var(--stone) 0%,var(--stone-l) 100%)"}}>
          <div style={{position:"absolute",inset:0,display:"grid",gridTemplateColumns:"1fr 1fr"}}>
            {[{name:"Quinta do Lago",img:showroomQuintaImg},{name:"Almancil",img:showroomAlmancilImg}].map((s,i)=>(
              <div key={s.name} style={{position:"relative",overflow:"hidden",cursor:"pointer"}} onClick={()=>navigate('/contact')}>
                <img src={s.img} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 1s cubic-bezier(0.16, 1, 0.3, 1),filter .5s",filter:"brightness(.55)"}}
                  onMouseEnter={e=>{e.target.style.transform="scale(1.08)";e.target.style.filter="brightness(.4)"}}
                  onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.filter="brightness(.55)"}} />
                {i===0 && <div style={{position:"absolute",top:0,right:0,bottom:0,width:1,background:"rgba(255,255,255,.15)"}} />}
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 48px",background:"linear-gradient(transparent,rgba(0,0,0,.5))"}}>
                  <span className="fs" style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"var(--gold-l)",display:"block",marginBottom:8}}>Showroom {String(i+1).padStart(2,'0')}</span>
                  <h3 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,color:"#fff",marginBottom:4}}>{s.name}</h3>
                  <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,.5)",display:"flex",alignItems:"center",gap:6}}>Visit showroom <span style={{display:"inline-block",width:20,height:1,background:"var(--gold)"}}/></span>
                </div>
              </div>
            ))}
          </div>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",zIndex:2,pointerEvents:"none"}}>
            <span className="fs" style={{fontSize:11,letterSpacing:5,textTransform:"uppercase",color:"var(--gold-l)",display:"block",marginBottom:12}}>Visit us</span>
            <h2 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,color:"#fff",lineHeight:1.1,textShadow:"0 2px 40px rgba(0,0,0,.5)"}}>Our Showrooms</h2>
            <div style={{width:60,height:1.5,background:"var(--gold)",margin:"20px auto 0"}} />
          </div>
          <div style={{position:"absolute",top:32,left:48,width:50,height:50,borderLeft:"1px solid rgba(255,255,255,.15)",borderTop:"1px solid rgba(255,255,255,.15)"}} />
          <div style={{position:"absolute",bottom:32,right:48,width:50,height:50,borderRight:"1px solid rgba(255,255,255,.15)",borderBottom:"1px solid rgba(255,255,255,.15)"}} />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:"var(--stone)",borderTop:"1px solid rgba(255,255,255,.06)"}}>
          {[
            {name:"Quinta do Lago",addr:"Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil",ph:"+351 289 030 179",mob:"+351 937 573 600",desc:"Our flagship showroom on the road between Quinta do Lago and Vale do Lobo: experience the full collection in person."},
            {name:"Almancil",addr:"Avenida 5 de Outubro 298, 8135-103 Almancil",ph:"+351 289 092 890",mob:"+351 937 573 600",desc:"Our Almancil location on the main avenue: easily accessible, featuring outdoor furniture, shade solutions, and kitchen displays."},
          ].map((s,i)=>(
            <div key={s.name} style={{padding:"40px 48px",borderRight:i===0?"1px solid rgba(255,255,255,.06)":"none",cursor:"pointer",transition:"background .35s"}}
              onClick={()=>navigate('/contact')}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.03)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:36,height:36,borderRadius:"50%",border:"1px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <h3 className="ff" style={{fontSize:22,fontWeight:400,color:"#fff"}}>{s.name}</h3>
              </div>
              <p className="fs" style={{fontSize:13,color:"rgba(255,255,255,.5)",lineHeight:1.7,fontWeight:300,marginBottom:20}}>{s.desc}</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,text:s.addr,color:"rgba(255,255,255,.6)"},
                  {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,text:s.ph,color:"var(--ocean-l)"},
                  {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--sand-d)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,text:s.mob,color:"var(--ocean-l)"},
                ].map(({icon,text,color},j)=>(
                  <div key={j} className="fs" style={{display:"flex",alignItems:"center",gap:10,fontSize:12}}>
                    {icon}
                    <span style={{color}}>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:20,display:"flex",gap:16,alignItems:"center"}}>
                <span className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"var(--gold)",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>Get directions →</span>
                <span className="fs" style={{fontSize:11,letterSpacing:2.5,textTransform:"uppercase",color:"rgba(255,255,255,.4)"}}>Book a visit →</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--cream-w)",padding:"28px 48px",display:"flex",justifyContent:"center",gap:48,alignItems:"center",borderBottom:"1px solid var(--sand-l)",flexWrap:"wrap"}}>
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
      <section style={{padding:"clamp(60px,10vh,100px) 48px",background:"var(--cream-w)",textAlign:"center",borderTop:"1px solid var(--sand-l)",backgroundImage:"radial-gradient(circle,rgba(163,180,200,.15) 1px,transparent 1px)",backgroundSize:"24px 24px"}}>
        <div className="la" style={{margin:"0 auto 24px"}}/>
        <span className="fs sl">Stay inspired</span>
        <h2 className="ff" style={{fontSize:"clamp(24px,3vw,38px)",fontWeight:300,marginTop:12,marginBottom:12,letterSpacing:"-0.01em"}}>Join Our World</h2>
        <p className="fs" style={{fontSize:14,color:"var(--stone-l)",lineHeight:1.75,maxWidth:400,margin:"0 auto 32px",fontWeight:300}}>Receive our latest collections, project features, and seasonal care guides.</p>
        <div style={{display:"flex",maxWidth:480,margin:"0 auto",boxShadow:"0 4px 32px rgba(0,0,0,.07)"}}>
          <input type="email" placeholder="Your email address" className="fs" style={{flex:1,padding:"16px 20px",border:"1px solid var(--sand)",borderRight:"none",background:"#fff",fontSize:13,letterSpacing:.5,outline:"none",color:"var(--stone)",borderRadius:"3px 0 0 3px"}}/>
          <button className="fs" style={{padding:"16px 28px",background:"var(--gold)",color:"#fff",border:"none",fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",borderRadius:"0 3px 3px 0",transition:"background .3s"}} onMouseEnter={e=>e.target.style.background="var(--gold-l)"} onMouseLeave={e=>e.target.style.background="var(--gold)"}>Subscribe</button>
        </div>
      </section>
    </Layout>
  );
};

export default STATUS_CONCEPT_HOMEPAGE;
