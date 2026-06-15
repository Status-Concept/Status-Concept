import { useState, useEffect } from "react";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";
import Layout from "../components/Layout";
import hero1Img from "../assets/images/enhanced/hero-1.webp";
import hero3Img from "../assets/images/enhanced/hero-3.webp";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.png";
import hero4Img from "../assets/images/enhanced/hero-4.webp";
import showroomAlmancilImg from "../assets/images/enhanced/showroom-almancil-ai.png";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.jpg";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import glatzParasolImg from "../assets/images/glatz-parasol.jpg";
import shadeParasolsImg from "../assets/images/shade-parasols.jpg";
import projectQuintaImg from "../assets/images/project-quinta.jpg";
import projectValedoloboImg from "../assets/images/project-valedolobo.jpg";
import projectVilamouraImg from "../assets/images/project-vilamoura.jpg";
import projectAlmancilImg from "../assets/images/project-almancil.jpg";
import neroKitchenImg from "../assets/images/kitchen/blk-6burner-bbq.jpg";
import teakKitchenImg from "../assets/images/kitchen/teak-setup-1.jpg";
import carbonKitchenImg from "../assets/images/kitchen/carbon-line-1.jpg";

const STATUS_CONCEPT_HOMEPAGE = () => {
  useNavLinks();
  const navigate = useLocalizedNavigate();
  const [activeTab, setActiveTab] = useState("furniture");
  const [activeProject, setActiveProject] = useState(0);
  const [heroSlide, setHeroSlide] = useState(0);
  const { vis, S } = useScrollAnimation();

  const heroImages = [hero1Img, hero3Img, hero4Img];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const collections = {
    furniture: [
      { name: "Sicily", desc: "A contemporary modular lounge system for generous outdoor living areas.", img: sicilyCornerImg, route: "/products?cat=lounge" },
    ],
    shade: [
      { name: "Glatz Sombrano", desc: "Swiss engineered parasol shade for flexible terrace coverage.", img: glatzParasolImg, route: "/products?cat=shade" },
      { name: "Glatz Sunwing", desc: "A precise, elegant parasol for controlled outdoor shade.", img: shadeParasolsImg, route: "/products?cat=shade" },
      { name: "Wall-Mounted Parasols", desc: "A space-saving shade solution for compact terraces.", img: shadeParasolsImg, route: "/products?cat=shade" },
    ],
    kitchen: [
      { name: "Nero Range", desc: "Black stainless steel modules with granite tops, BBQs, fridges and sinks.", img: neroKitchenImg, route: "/products?cat=kitchen" },
      { name: "Teak Range", desc: "Natural reclaimed teak kitchen modules with ceramic tops and practical storage.", img: teakKitchenImg, route: "/products?cat=kitchen" },
      { name: "Carbon Line", desc: "Black reclaimed teak modules with ceramic tops and premium BBQ cabinets.", img: carbonKitchenImg, route: "/products?cat=kitchen" },
    ],
  };

  const projects = [
    { name: "Villa Quinta do Lago", location: "Quinta do Lago", img: projectQuintaImg },
    { name: "Residence Vale do Lobo", location: "Vale do Lobo", img: projectValedoloboImg },
    { name: "Private Estate Vilamoura", location: "Vilamoura", img: projectVilamouraImg },
    { name: "Luxury Home Almancil", location: "Almancil", img: projectAlmancilImg },
  ];

  const cats = [
    { name: "Lounge", sub: "Modular Sets", cat: "lounge" },
    { name: "Shade", sub: "Glatz Parasols", cat: "shade" },
    { name: "Kitchens", sub: "Outdoor Cooking", cat: "kitchen" },
  ];

  const showrooms = [
    { name: "Quinta do Lago", img: showroomQuintaImg, pos: "center 65%", addr: "Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil", ph: "+351 289 030 179", desc: "Our flagship showroom on the road between Quinta do Lago and Vale do Lobo: experience the full collection in person." },
    { name: "Almancil", img: showroomAlmancilImg, pos: "center 30%", addr: "Avenida 5 de Outubro 298, 8135-103 Almancil", ph: "+351 289 092 890", desc: "Our Almancil location on the main avenue: easily accessible, featuring outdoor furniture, shade solutions, and kitchen displays." },
  ];

  return (
    <Layout>
      {/* HERO CAROUSEL */}
      <section style={{position:"relative",height:"calc(100vh - var(--header-h))",minHeight:560,display:"flex",alignItems:"flex-end",overflow:"hidden"}}>
        {heroImages.map((img, i) => (
          <div key={i} style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(180deg,rgba(17,17,17,.1) 0%,rgba(17,17,17,.05) 50%,rgba(17,17,17,.5) 100%),url('${img}')`,backgroundSize:"cover",backgroundPosition:"center",opacity:heroSlide===i?1:0,transition:"opacity 1s ease-in-out",willChange:"opacity"}} />
        ))}
        <div style={{position:"absolute",bottom:36,right:48,display:"flex",gap:10,zIndex:3}}>
          {heroImages.map((_, i) => (
            <button key={i} onClick={()=>setHeroSlide(i)} style={{width:heroSlide===i?24:8,height:8,borderRadius:4,border:"none",background:heroSlide===i?"#fff":"rgba(255,255,255,.4)",cursor:"pointer",transition:"all .3s ease"}} />
          ))}
        </div>
        <div style={{padding:"0 48px 90px",maxWidth:"var(--max-width)",margin:"0 auto",width:"100%",position:"relative",zIndex:2}}>
          <div className="fs" style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"rgba(255,255,255,.75)",marginBottom:16}}>Luxury outdoor living · Algarve, Portugal</div>
          <h1 className="ff" style={{fontSize:"clamp(36px,5vw,60px)",fontWeight:500,color:"#fff",lineHeight:1.08,marginBottom:28,letterSpacing:"-0.01em"}}>Where Design<br/>Meets the Sun</h1>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <a href="#" className="cb cg" onClick={(e)=>{e.preventDefault();navigate('/products')}}>Explore collections</a>
            <a href="#" className="cb cl" onClick={(e)=>{e.preventDefault();navigate('/contact')}}>Visit showroom</a>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section id="intro" data-animate style={{padding:"var(--section-padding) 48px",textAlign:"center",background:"var(--white)",...S("intro")}}>
        <div className="la" style={{margin:"0 auto 28px"}}/>
        <p className="ff" style={{fontSize:"clamp(20px,2.6vw,28px)",fontWeight:300,lineHeight:1.65,maxWidth:780,margin:"0 auto",color:"var(--text-body)"}}>Proud of what we represent, understanding our customers' needs, we are committed to providing furniture of the highest quality, partnering with manufacturers where attention to detail is essential.</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:36,flexWrap:"wrap"}}><span className="mb">Sunbrella® Fabrics</span><span className="mb">Interpon Coating</span><span className="mb">Premium Aluminium</span></div>
      </section>

      {/* COLLECTIONS */}
      <section id="colls" data-animate style={{padding:"0 48px var(--section-padding)",background:"var(--white)",...S("colls")}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <span className="fs sl">Our world</span>
          <h2 className="ff" style={{fontSize:"clamp(30px,3.6vw,44px)",fontWeight:400,marginTop:12,letterSpacing:"-0.01em"}}>Collections</h2>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:48,borderBottom:"1px solid var(--mid-grey)",maxWidth:"var(--max-width)",margin:"0 auto 48px"}}>
          {[{k:"furniture",l:"Furniture"},{k:"shade",l:"Shade Solutions"},{k:"kitchen",l:"Outdoor Kitchens"}].map(t=><button key={t.k} className={`tb ${activeTab===t.k?"ac":""}`} onClick={()=>setActiveTab(t.k)}>{t.l}</button>)}
        </div>
        <div style={{maxWidth:"var(--max-width)",margin:"0 auto 32px",borderRadius:2,overflow:"hidden",position:"relative",height:340}}>
            <img src={furnitureSeriesImg} alt="Furniture Series" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 40%",display:"block"}} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(17,17,17,.5) 0%,rgba(17,17,17,.1) 60%,transparent 100%)"}} />
            <div style={{position:"absolute",top:"50%",left:48,transform:"translateY(-50%)"}}>
              <span className="fs" style={{fontSize:11,letterSpacing:3,textTransform:"uppercase",color:"rgba(255,255,255,.7)"}}>Curated for the Algarve</span>
              <h3 className="ff" style={{fontSize:"clamp(26px,2.8vw,38px)",fontWeight:400,color:"#fff",marginTop:10,marginBottom:0,lineHeight:1.1}}>
                {activeTab === "furniture" ? "Furniture Series" : activeTab === "shade" ? "Shade Solutions" : "Outdoor Kitchens"}
              </h3>
            </div>
          </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:24,maxWidth:"var(--max-width)",margin:"0 auto"}}>
          {collections[activeTab].map((c,i)=>(
            <div key={c.name} className="rd-product-card" onClick={()=>navigate(c.route)} style={{animation:vis("colls")?`fi 0.5s ${0.08*i}s both`:"none"}}>
              <div className="rd-product-media" style={{aspectRatio:"4 / 3"}}>
                <FavoriteButton
                  product={{id:`collection-${c.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`,name:c.name,collection:c.name,img:c.img,route:c.route}}
                  size={16}
                  style={{position:"absolute",top:12,right:12,zIndex:3}}
                />
                <img src={c.img} alt={c.name}/>
              </div>
              <div className="rd-product-info">
                <h3 className="ff" style={{fontSize:18,fontWeight:400,marginBottom:6}}>{c.name}</h3>
                <p className="fs" style={{fontSize:12,color:"var(--text-grey)",lineHeight:1.6}}>{c.desc}</p>
                <span className="fs" style={{display:"inline-block",marginTop:10,fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"var(--accent)"}}>Discover →</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:56}}><a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/products')}}>View all products</a></div>
      </section>

      {/* CATEGORIES */}
      <section id="cats" data-animate style={{padding:"var(--section-padding) 48px",background:"var(--light-grey)",...S("cats")}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <span className="fs sl">Browse by type</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.2vw,38px)",fontWeight:400,marginTop:12,letterSpacing:"-0.01em"}}>Product Categories</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",maxWidth:1100,margin:"0 auto",borderTop:"1px solid var(--mid-grey)",borderLeft:"1px solid var(--mid-grey)"}}>
          {cats.map((c,i)=>(
            <div key={c.name} className="cat-item" onClick={()=>navigate(`/products?cat=${c.cat}`)} style={{animation:vis("cats")?`fi 0.4s ${0.05*i}s both`:"none"}}>
              <span className="cat-bg">{String(i+1).padStart(2,'0')}</span>
              <span className="cat-n">{c.name}</span>
              <span className="cat-s">{c.sub}</span>
              <span className="cat-arrow">→</span>
            </div>
          ))}
        </div>
      </section>

      {/* WHY STATUS */}
      <section id="why" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:560,background:"var(--white)",...S("why")}}>
        <div style={{background:`url('${hero1Img}') center/cover`,minHeight:320}}/>
        <div style={{padding:"clamp(48px,8vh,100px) 64px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{color:"var(--accent)",marginBottom:20}}>Why Statvs</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3vw,38px)",fontWeight:400,marginBottom:28,lineHeight:1.2,letterSpacing:"-0.01em"}}>Over a Decade of<br/>Outdoor Excellence</h2>
          <div className="la" style={{marginBottom:28}}/>
          <p className="fs" style={{fontSize:14,lineHeight:1.85,color:"var(--text-body)",fontWeight:300,marginBottom:32}}>We provide outdoor furniture to the most prestigious addresses in the Algarve: Vale do Lobo, Quinta do Lago, Vilamoura, Almancil, Tavira, and beyond. Our success is built on a passion and vast experience acquired over more than a decade of furnishing elegant residences across Europe.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:36}}>
            {[{n:"10+",l:"Years of excellence"},{n:"2",l:"Showrooms"},{n:"76+",l:"Furniture pieces"},{n:"5★",l:"Service rating"}].map(s=>(
              <div key={s.l} style={{padding:"16px 0",borderBottom:"1px solid var(--light-grey)"}}>
                <div className="ff" style={{fontSize:32,fontWeight:300,color:"var(--accent)"}}>{s.n}</div>
                <div className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--text-grey)",textTransform:"uppercase",marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/about')}} style={{alignSelf:"flex-start"}}>Learn more</a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="proj" data-animate style={{padding:"var(--section-padding) 48px",background:"var(--white)",...S("proj")}}>
        <div style={{maxWidth:"var(--max-width)",margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:48,flexWrap:"wrap",gap:16}}>
            <div><span className="fs sl">Inspiration</span><h2 className="ff" style={{fontSize:"clamp(30px,3.6vw,44px)",fontWeight:400,marginTop:12,letterSpacing:"-0.01em"}}>Featured Projects</h2></div>
            <a href="#" className="cb cd" onClick={(e)=>{e.preventDefault();navigate('/projects')}} style={{marginBottom:4}}>View all</a>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:24}}>
            <div className="pc" onClick={()=>navigate('/projects')} style={{borderRadius:2,overflow:"hidden"}}>
              <div style={{position:"relative",overflow:"hidden",height:440,background:"var(--light-grey)"}}>
                <img src={projects[activeProject].img} alt={projects[activeProject].name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{padding:"18px 2px 0"}}>
                <h3 className="ff" style={{fontSize:20,fontWeight:400}}>{projects[activeProject].name}</h3>
                <p className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--text-grey)",textTransform:"uppercase",marginTop:4}}>{projects[activeProject].location}</p>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateRows:"1fr 1fr",gap:24}}>
              {projects.filter((_,i)=>i!==activeProject).slice(0,2).map(p=>(
                <div key={p.name} className="pc" onClick={()=>setActiveProject(projects.indexOf(p))} style={{borderRadius:2,overflow:"hidden"}}>
                  <div style={{position:"relative",overflow:"hidden",height:160,background:"var(--light-grey)"}}>
                    <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  </div>
                  <div style={{padding:"14px 2px 0"}}>
                    <h4 className="ff" style={{fontSize:16,fontWeight:400}}>{p.name}</h4>
                    <p className="fs" style={{fontSize:10,letterSpacing:1.5,color:"var(--text-grey)",textTransform:"uppercase",marginTop:2}}>{p.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AFTER CARE BANNER */}
      <section id="ac" data-animate style={{padding:"var(--section-padding) 48px",background:"var(--light-grey)",textAlign:"center",...S("ac")}}>
        <span className="fs sl">Exclusive service</span>
        <h2 className="ff" style={{fontSize:"clamp(30px,3.6vw,44px)",fontWeight:400,marginTop:16,marginBottom:20,letterSpacing:"-0.01em"}}>After Care & Valet Service</h2>
        <div className="la" style={{margin:"0 auto 24px"}}/>
        <p className="fs" style={{fontSize:14,lineHeight:1.85,color:"var(--text-body)",maxWidth:600,margin:"0 auto 36px",fontWeight:300}}>Our skilled team handles all cleaning and maintenance to the highest standard. We care for your outdoor furniture seasonally, ensuring it stays as beautiful as the day it arrived.</p>
        <a href="#" className="cb cg" onClick={(e)=>{e.preventDefault();navigate('/after-care')}}>Discover after care</a>
      </section>

      {/* SHOWROOMS */}
      <section id="shows" data-animate style={{padding:"var(--section-padding) 48px",background:"var(--white)",...S("shows")}}>
        <div style={{maxWidth:"var(--max-width)",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <span className="fs sl">Visit us</span>
            <h2 className="ff" style={{fontSize:"clamp(30px,3.6vw,44px)",fontWeight:400,marginTop:12,letterSpacing:"-0.01em"}}>Our Showrooms</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
            {showrooms.map((s,i)=>(
              <div key={s.name} className="pc" onClick={()=>navigate('/contact')} style={{borderRadius:2,overflow:"hidden",cursor:"pointer"}}>
                <div style={{position:"relative",overflow:"hidden",height:300,background:"var(--light-grey)"}}>
                  <img src={s.img} alt={s.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:s.pos}}/>
                </div>
                <div style={{padding:"22px 2px 0"}}>
                  <span className="fs" style={{fontSize:10,letterSpacing:2.5,textTransform:"uppercase",color:"var(--accent)",display:"block",marginBottom:6}}>Showroom {String(i+1).padStart(2,'0')}</span>
                  <h3 className="ff" style={{fontSize:22,fontWeight:400,marginBottom:8}}>{s.name}</h3>
                  <p className="fs" style={{fontSize:13,color:"var(--text-grey)",lineHeight:1.7,fontWeight:300,marginBottom:14}}>{s.desc}</p>
                  <div className="fs" style={{fontSize:12,color:"var(--text-body)",marginBottom:4}}>{s.addr}</div>
                  <div className="fs" style={{fontSize:12,color:"var(--text-body)",marginBottom:14}}>{s.ph}</div>
                  <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--accent)",borderBottom:"1px solid var(--accent)",paddingBottom:2}}>Get directions →</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:48,padding:"24px 0",borderTop:"1px solid var(--light-grey)",display:"flex",justifyContent:"center",gap:48,alignItems:"center",flexWrap:"wrap"}}>
            {[
              {label:"Mon – Sat",value:"09:30 – 18:00"},
              {label:"Sunday",value:"Closed"},
            ].map((h,i)=>(
              <div key={h.label} style={{display:"flex",alignItems:"center",gap:i<1?48:0}}>
                <div style={{textAlign:"center"}}>
                  <span className="fs" style={{fontSize:10,letterSpacing:2.5,textTransform:"uppercase",color:"var(--text-grey)",display:"block",marginBottom:4}}>{h.label}</span>
                  <span className="fs" style={{fontSize:14,fontWeight:400,color:h.value==="Closed"?"var(--text-grey)":"var(--text-dark)",letterSpacing:.5}}>{h.value}</span>
                </div>
                {i<1 && <div style={{width:1,height:28,background:"var(--mid-grey)"}} />}
              </div>
            ))}
          </div>
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
      <section style={{padding:"var(--section-padding) 48px",background:"var(--off-white)",textAlign:"center"}}>
        <span className="fs sl">Stay inspired</span>
        <h2 className="ff" style={{fontSize:"clamp(24px,2.8vw,34px)",fontWeight:400,marginTop:12,marginBottom:12,letterSpacing:"-0.01em"}}>Join Our World</h2>
        <p className="fs" style={{fontSize:14,color:"var(--text-grey)",lineHeight:1.75,maxWidth:400,margin:"0 auto 32px",fontWeight:300}}>Receive our latest collections, project features, and seasonal care guides.</p>
        <div style={{display:"flex",maxWidth:480,margin:"0 auto"}}>
          <input type="email" placeholder="Your email address" className="fs" style={{flex:1,padding:"15px 20px",border:"1px solid var(--mid-grey)",borderRight:"none",background:"#fff",fontSize:13,letterSpacing:.5,outline:"none",color:"var(--text-dark)",borderRadius:"2px 0 0 2px"}}/>
          <button className="fs" style={{padding:"15px 28px",background:"var(--black)",color:"#fff",border:"none",fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",borderRadius:"0 2px 2px 0",transition:"background .3s"}} onMouseEnter={e=>e.target.style.background="var(--accent)"} onMouseLeave={e=>e.target.style.background="var(--black)"}>Subscribe</button>
        </div>
      </section>
    </Layout>
  );
};

export default STATUS_CONCEPT_HOMEPAGE;
