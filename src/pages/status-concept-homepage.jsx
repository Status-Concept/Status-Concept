import { useState, useEffect } from "react";
import useNavLinks from "../useNavLinks";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import hero1Img from "../assets/images/enhanced/hero-1.webp";
import hero3Img from "../assets/images/enhanced/hero-3.webp";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.webp";
import hero4Img from "../assets/images/enhanced/hero-4.webp";
import showroomAlmancilImg from "../assets/images/enhanced/showroom-almancil-ai.webp";

const STATUS_CONCEPT_HOMEPAGE = () => {
  useNavLinks();
  const [heroSlide, setHeroSlide] = useState(0);
  const { S } = useScrollAnimation();

  const heroImages = [hero1Img, hero3Img, hero4Img];

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const showrooms = [
    { name: "Quinta do Lago", img: showroomQuintaImg, pos: "center 65%", addr: "Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil", ph: "+351 289 030 179", maps: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Status Concept, Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil"), desc: "Our flagship showroom on the road between Quinta do Lago and Vale do Lobo: experience the full collection in person." },
    { name: "Almancil", img: showroomAlmancilImg, pos: "center 30%", addr: "Avenida 5 de Outubro 298, 8135-103 Almancil", ph: "+351 289 092 890", maps: "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent("Status Concept, Avenida 5 de Outubro 298, 8135-103 Almancil"), desc: "Our Almancil location on the main avenue: easily accessible, featuring outdoor furniture, shade solutions, and kitchen displays." },
  ];

  return (
    <Layout>
      {/* HERO CAROUSEL */}
      <section style={{position:"relative",height:"calc(78vh - var(--header-h))",minHeight:480,overflow:"hidden"}} aria-roledescription="carousel" aria-label="Featured outdoor settings">
        {heroImages.map((img, i) => (
          <div key={i} style={{position:"absolute",inset:0,backgroundImage:`url('${img}')`,backgroundSize:"cover",backgroundPosition:"center",opacity:heroSlide===i?1:0,transition:"opacity 1s ease-in-out",willChange:"opacity"}} />
        ))}
        {[["‹","Previous slide",-1,{left:20}],["›","Next slide",1,{right:20}]].map(([sym,label,dir,pos])=>(
          <button key={label} aria-label={label} onClick={()=>setHeroSlide((heroSlide+dir+heroImages.length)%heroImages.length)}
            style={{position:"absolute",top:"50%",transform:"translateY(-50%)",zIndex:3,width:48,height:48,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,.12)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,.35)",borderRadius:"50%",color:"#fff",fontSize:22,lineHeight:1,cursor:"pointer",transition:"background .3s",...pos}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.26)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,.12)"}>{sym}</button>
        ))}
        <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",gap:10,zIndex:3}}>
          {heroImages.map((_, i) => (
            <button key={i} aria-label={`Go to slide ${i+1}`} onClick={()=>setHeroSlide(i)} style={{width:heroSlide===i?24:8,height:8,borderRadius:4,border:"none",background:heroSlide===i?"#fff":"rgba(255,255,255,.5)",cursor:"pointer",transition:"all .3s ease"}} />
          ))}
        </div>
      </section>
      <section style={{background:"var(--white)",padding:"44px 48px 28px"}}>
        <div style={{maxWidth:"var(--max-width)",margin:"0 auto"}}>
          <div className="fs" style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",color:"var(--text-grey)",marginBottom:14}}>Outdoor furniture specialists · Algarve</div>
          <h1 className="ff" style={{fontSize:"clamp(36px,5vw,60px)",fontWeight:500,color:"var(--text-dark)",lineHeight:1.08,marginBottom:22,letterSpacing:"-0.01em"}}>The Algarve's outdoor rooms,<br/>furnished and cared for.</h1>
          <p className="fs" style={{fontSize:15,lineHeight:1.75,color:"var(--text-body)",fontWeight:300,maxWidth:620,marginBottom:26}}>Lounge, dining, shade and outdoor kitchens from Europe's finest makers — with seasonal After Care that keeps every piece as it arrived.</p>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <LocalizedLink className="cb cg" to="/contact">Book a showroom visit</LocalizedLink>
            <LocalizedLink className="cb" style={{border:"1px solid var(--mid-grey)",color:"var(--text-dark)",background:"transparent"}} to="/products">Explore products</LocalizedLink>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section id="intro" data-animate style={{padding:"var(--section-padding) 48px",textAlign:"center",background:"var(--white)",...S("intro")}}>
        <div className="la" style={{margin:"0 auto 28px"}}/>
        <p className="ff" style={{fontSize:"clamp(20px,2.6vw,28px)",fontWeight:300,lineHeight:1.65,maxWidth:780,margin:"0 auto",color:"var(--text-body)"}}>Every piece in our showrooms earns its place: fabrics that shrug off ten summers of sun, frames that ignore salt air, makers who obsess over the last millimetre.</p>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:36,flexWrap:"wrap"}}><span className="mb">Sunbrella® Fabrics</span><span className="mb">Interpon Coating</span><span className="mb">Premium Aluminium</span></div>
      </section>


      {/* WHY STATUS */}
      <section id="why" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:560,background:"var(--white)",...S("why")}}>
        <div style={{background:`url('${hero1Img}') center/cover`,minHeight:320}}/>
        <div style={{padding:"clamp(48px,8vh,100px) 64px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <span className="fs sl" style={{color:"var(--accent)",marginBottom:20}}>Why Statvs</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3vw,38px)",fontWeight:400,marginBottom:28,lineHeight:1.2,letterSpacing:"-0.01em"}}>Ten years of<br/>Algarve terraces.</h2>
          <div className="la" style={{marginBottom:28}}/>
          <p className="fs" style={{fontSize:14,lineHeight:1.85,color:"var(--text-body)",fontWeight:300,marginBottom:32}}>Vale do Lobo, Quinta do Lago, Vilamoura, Tavira — since 2013 we've furnished the coast's most demanding outdoor spaces, and we still maintain many of them each season.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:36}}>
            {[{n:"10+",l:"Years of excellence"},{n:"2",l:"Showrooms"}].map(s=>(
              <div key={s.l} style={{padding:"16px 0",borderBottom:"1px solid var(--light-grey)"}}>
                <div className="ff" style={{fontSize:32,fontWeight:300,color:"var(--text-dark)"}}>{s.n}</div>
                <div className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--text-grey)",textTransform:"uppercase",marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
          <LocalizedLink className="cb cd" to="/about" style={{alignSelf:"flex-start"}}>Our story</LocalizedLink>
        </div>
      </section>


      {/* AFTER CARE BANNER */}
      <section id="ac" data-animate style={{padding:"var(--section-padding) 48px",background:"var(--white)",borderTop:"1px solid var(--light-grey)",borderBottom:"1px solid var(--light-grey)",textAlign:"center",...S("ac")}}>
        <span className="fs sl">Exclusive service</span>
        <h2 className="ff" style={{fontSize:"clamp(30px,3.6vw,44px)",fontWeight:400,marginTop:16,marginBottom:20,letterSpacing:"-0.01em"}}>Delivered. Then looked after.</h2>
        <div className="la" style={{margin:"0 auto 24px"}}/>
        <p className="fs" style={{fontSize:14,lineHeight:1.85,color:"var(--text-body)",maxWidth:600,margin:"0 auto 36px",fontWeight:300}}>Seasonal cleaning, maintenance and winter care by our own team — so the terrace is ready the day you arrive, not a project when you do.</p>
        <LocalizedLink className="cb cg" to="/after-care">See the After Care plans</LocalizedLink>
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
              <a key={s.name} className="pc" href={s.maps} target="_blank" rel="noopener noreferrer" aria-label={`Get directions to ${s.name} showroom`} style={{borderRadius:2,overflow:"hidden",cursor:"pointer",display:"block",color:"inherit",textDecoration:"none"}}>
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
              </a>
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
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          {[...Array(2)].map((_,r)=>(
            ["Sunbrella® Fabrics","Premium Aluminium","Glatz Parasols","Bioclimatic Pergolas","Quinta do Lago","Vale do Lobo","Vilamoura","Custom Upholstery","10+ Years Experience","Outdoor Living"].map((t,i)=>(
              <span key={`${r}-${i}`} className="marquee-item">{t}<span className="marquee-dot">·</span></span>
            ))
          ))}
        </div>
      </div>

      {/* NEWSLETTER */}
      <section style={{padding:"var(--section-padding) 48px",background:"var(--white)",borderTop:"1px solid var(--light-grey)",textAlign:"center"}}>
        <span className="fs sl">Stay inspired</span>
        <h2 className="ff" style={{fontSize:"clamp(24px,2.8vw,34px)",fontWeight:400,marginTop:12,marginBottom:12,letterSpacing:"-0.01em"}}>Notes from the showroom</h2>
        <p className="fs" style={{fontSize:14,color:"var(--text-grey)",lineHeight:1.75,maxWidth:400,margin:"0 auto 32px",fontWeight:300}}>New collections, private project features and seasonal care notes, a few times a year.</p>
        <form onSubmit={(e)=>e.preventDefault()} style={{display:"flex",maxWidth:480,margin:"0 auto"}}>
          <input type="email" aria-label="Email address" placeholder="Your email address" className="fs" style={{flex:1,padding:"15px 20px",border:"1px solid var(--mid-grey)",borderRight:"none",background:"#fff",fontSize:13,letterSpacing:.5,outline:"none",color:"var(--text-dark)",borderRadius:"2px 0 0 2px"}}/>
          <button type="submit" className="fs" style={{padding:"15px 28px",background:"var(--black)",color:"#fff",border:"none",fontSize:10,letterSpacing:3,textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",borderRadius:"0 2px 2px 0",transition:"background .3s"}} onMouseEnter={e=>e.target.style.background="var(--accent)"} onMouseLeave={e=>e.target.style.background="var(--black)"}>Subscribe</button>
        </form>
      </section>
    </Layout>
  );
};

export default STATUS_CONCEPT_HOMEPAGE;
