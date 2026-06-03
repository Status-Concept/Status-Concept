import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";

const socialIcons = [
  {n:"Facebook",url:"https://facebook.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",url:"https://instagram.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",url:"https://pinterest.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",url:"https://linkedin.com/company/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const PRODUCT_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [activeImg, setActiveImg] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(true);
  const [dimsOpen, setDimsOpen] = useState(false);
  const [matOpen, setMatOpen] = useState(false);
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

  const { id } = useParams();

  const allProducts = {
    "sicily-modular-set": {
      name: "Sicily Modular Set", collection: "Sicily", category: "lounge", tag: "Popular",
      tagline: "Contemporary modular outdoor sofa with infinite configuration possibilities",
      images: ["/src/assets/images/sicily-corner.jpg","/src/assets/images/sicily-centre.jpg","/src/assets/images/sicily-ottoman.jpg"],
      specs: [
        { label: "Type", value: "Modular Sofa Set" },{ label: "Frame", value: "Premium Aluminium" },
        { label: "Coating", value: "Interpon Powder Coated" },{ label: "Upholstery", value: "Sunbrella® Acrylic Fabric" },
        { label: "Cushion Fill", value: "Quick-dry Foam Core" },{ label: "Stackable", value: "No" },
      ],
      dims: [
        { piece: "Corner Module", w: "85", d: "85", h: "68", sh: "42" },
        { piece: "Centre Module", w: "75", d: "85", h: "68", sh: "42" },
        { piece: "Armless Module", w: "65", d: "85", h: "68", sh: "42" },
      ],
      materials: ["Sunbrella® fabric: UV resistant, water-repellent, mold resistant, fade-proof","Interpon powder coating: corrosion protection, scratch resistant, UV stable","Premium aluminium frame: lightweight, durable, weather resistant","Quick-dry foam cushions: rapid drainage, mold resistant, comfortable"],
      colorLabel: "Fabric Colours",
      colors: [{name:"Sutty",hex:"#3a3a3a"},{name:"Savanne Whisper",hex:"#e8e7e4"},{name:"Lynn",hex:"#e0d5c3"}],
    },
    "nero-6-burner-bbq": {
      name: "Nero 6 Burner BBQ", collection: "Nero Range", category: "kitchen", tag: "Popular", price: "€2,333",
      tagline: "304-grade black stainless steel BBQ with 90,000 BTU output, LED backlit controls, and ceramic rear infrared burner",
      images: ["/src/assets/images/kitchen/blk-6burner-bbq.jpg","/src/assets/images/kitchen/blk-sear-station.jpg","/src/assets/images/kitchen/blk-corner.jpg"],
      specs: [
        { label: "Model", value: "DRAK806" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Total Output", value: "90,000 BTU (26.37kW)" },{ label: "Burners", value: "6 Power + Ceramic Rear" },
        { label: "Ignition", value: "Manual Piezo" },{ label: "Certification", value: "CE Certified" },
      ],
      dims: [
        { piece: "BBQ Unit", w: "110", d: "73.5", h: "119", sh: "—" },
        { piece: "Cooking Area", w: "95.5", d: "45.5", h: "—", sh: "—" },
      ],
      materials: ["304-grade black stainless steel construction","Heavy-duty stainless steel cooking grills","Cast stainless steel power burners","Black stainless steel flame tamers","Double-skinned hood with Cool to Touch technology","Premium granite worktops"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "nero-4-burner-bbq": {
      name: "Nero 4 Burner BBQ", collection: "Nero Range", category: "kitchen", price: "€2,110",
      tagline: "Compact 4-burner black stainless steel BBQ with 65,000 BTU output and ceramic infrared rear burner",
      images: ["/src/assets/images/kitchen/blk-4burner-bbq.jpg","/src/assets/images/kitchen/blk-6burner-bbq.jpg"],
      specs: [
        { label: "Model", value: "DRAK804" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Total Output", value: "65,000 BTU (19.04kW)" },{ label: "Burners", value: "4 Power + Ceramic Rear" },
        { label: "Ignition", value: "Manual Piezo" },{ label: "Certification", value: "CE Certified" },
      ],
      dims: [{ piece: "BBQ Unit", w: "81", d: "73.5", h: "119", sh: "—" },{ piece: "Cooking Area", w: "73", d: "45.5", h: "—", sh: "—" }],
      materials: ["304-grade black stainless steel construction","Heavy-duty stainless steel cooking grills","LED backlit control knobs","Internal grill lights","Premium granite worktops"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "nero-double-fridge-cabinet": {
      name: "Nero Double Fridge Cabinet", collection: "Nero Range", category: "kitchen", price: "€2,055",
      tagline: "Twin 60-litre fridges with triple-glazed doors, blue LED lighting, and digital touchpad controls",
      images: ["/src/assets/images/kitchen/blk-double-fridge.jpg","/src/assets/images/kitchen/blk-sink-fridge.jpg"],
      specs: [
        { label: "Model", value: "DRA8056" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Fridge Capacity", value: "2 × 60L" },{ label: "Temp Range", value: "2–10°C" },
        { label: "Rating", value: "IPX4" },{ label: "Glass", value: "Triple-glazed Low E" },
      ],
      dims: [{ piece: "Cabinet", w: "96", d: "70", h: "90", sh: "—" }],
      materials: ["304-grade black stainless steel exterior and interior","700mm deep granite worktop","Triple glazed Low E glass doors","Blue LED interior lighting","Digital touchpad controls"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "nero-sink-fridge-cabinet": {
      name: "Nero Sink & Fridge Cabinet", collection: "Nero Range", category: "kitchen", price: "€1,832",
      tagline: "Combined 60L fridge and matt black sink with 360° swivel tap, hot and cold water connection",
      images: ["/src/assets/images/kitchen/blk-sink-fridge.jpg","/src/assets/images/kitchen/blk-double-fridge.jpg"],
      specs: [
        { label: "Model", value: "DRA8064" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Fridge Capacity", value: "60L" },{ label: "Tap Height", value: "62cm" },
        { label: "Rating", value: "IPX4" },{ label: "Water", value: "Hot & Cold" },
      ],
      dims: [{ piece: "Cabinet", w: "96", d: "70", h: "90", sh: "—" }],
      materials: ["304-grade black stainless steel","Solid granite worktop","Matt black sink and tap","360° swivel tap with spray/jet modes","Triple-glazed Low E glass fridge door"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "nero-sear-station": {
      name: "Nero Sear Station", collection: "Nero Range", category: "kitchen", price: "€850",
      tagline: "Powerful ceramic infrared burner reaching extreme temperatures for quick, efficient searing",
      images: ["/src/assets/images/kitchen/blk-sear-station.jpg","/src/assets/images/kitchen/blk-corner.jpg"],
      specs: [
        { label: "Model", value: "DRA8053" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Output", value: "13,300 BTU" },{ label: "Burner", value: "Ceramic Infra-Red" },
        { label: "Ignition", value: "Manual Piezo" },{ label: "Certification", value: "CE Certified" },
      ],
      dims: [{ piece: "Cabinet", w: "49", d: "70", h: "90", sh: "—" },{ piece: "Cooking Area", w: "29", d: "28", h: "—", sh: "—" }],
      materials: ["304-grade black stainless steel","Premium granite worktops","Heavy-duty stainless steel cooking grill","Easy-clean fat collection tray","Soft-close cabinet doors"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "nero-90-corner-cabinet": {
      name: "Nero 90° Corner Cabinet", collection: "Nero Range", category: "kitchen", price: "€667",
      tagline: "L-shape or U-shape connector module with granite worktop for versatile kitchen configurations",
      images: ["/src/assets/images/kitchen/blk-corner.jpg","/src/assets/images/kitchen/blk-sear-station.jpg"],
      specs: [
        { label: "Model", value: "DRA8057" },{ label: "Material", value: "304-grade Black Stainless Steel" },
        { label: "Worktop", value: "Solid Granite" },{ label: "Configuration", value: "L or U shape" },
      ],
      dims: [{ piece: "Cabinet", w: "75", d: "75", h: "90", sh: "—" }],
      materials: ["304-grade black stainless steel","Solid granite worktop","Heavy-duty castor wheels","Integrated levelling feet"],
      colorLabel: "Finish", colors: [{name:"Nero Black",hex:"#1a1a1a"}],
    },
    "teak-6-burner-bbq-unit": {
      name: "Teak 6 Burner BBQ Unit", collection: "Teak Range", category: "kitchen", price: "€2,587",
      tagline: "Reclaimed teak housing with premium 304-grade stainless steel 6-burner BBQ and sintered stone flanges",
      images: ["/src/assets/images/kitchen/teak-6burner-bbq.jpg","/src/assets/images/kitchen/teak-setup-1.jpg","/src/assets/images/kitchen/teak-front.jpg"],
      specs: [
        { label: "Model", value: "DRA5027" },{ label: "BBQ Material", value: "304-grade Stainless Steel" },
        { label: "Housing", value: "Reclaimed Teak" },{ label: "Total Output", value: "90,000 BTU" },
        { label: "Burners", value: "6 + Ceramic Rear" },{ label: "Worktop", value: "Sintered Stone" },
      ],
      dims: [{ piece: "BBQ", w: "110", d: "57.5", h: "54", sh: "—" },{ piece: "Housing", w: "128.1", d: "63", h: "92", sh: "—" }],
      materials: ["304-grade stainless steel BBQ","Reclaimed teak with sintered stone flanges","Fire-resistant cement board lining","LED control knobs","Glass viewing window hood"],
      colorLabel: "Finish", colors: [{name:"Natural Teak",hex:"#a07848"}],
    },
    "teak-corner-cabinet": {
      name: "Teak Corner Cabinet", collection: "Teak Range", category: "kitchen", price: "€1,778",
      tagline: "Reclaimed teak corner unit with dark stone ceramic worktop, 3 drawers and shelf storage",
      images: ["/src/assets/images/kitchen/teak-corner.jpg","/src/assets/images/kitchen/teak-setup-1.jpg"],
      specs: [
        { label: "Model", value: "DRA5018" },{ label: "Material", value: "Reclaimed Teak" },
        { label: "Worktop", value: "Dark Stone Ceramic" },{ label: "Storage", value: "3 Drawers + Shelf" },
        { label: "Doors", value: "Soft-close Teak Panels" },{ label: "Warranty", value: "1 Year" },
      ],
      dims: [{ piece: "Cabinet", w: "119.8", d: "63", h: "97.7", sh: "—" }],
      materials: ["Reclaimed teak frame and cabinetry","Dark stone ceramic worktop","Soft-close hardware","Adjustable levelling feet"],
      colorLabel: "Finish", colors: [{name:"Natural Teak",hex:"#a07848"}],
    },
    "teak-single-door-cabinet": {
      name: "Teak Single Door Cabinet", collection: "Teak Range", category: "kitchen", price: "€794",
      tagline: "Compact reclaimed teak storage cabinet with dark stone ceramic worktop and soft-close door",
      images: ["/src/assets/images/kitchen/teak-front.jpg","/src/assets/images/kitchen/teak-corner.jpg"],
      specs: [
        { label: "Model", value: "DRA5013" },{ label: "Material", value: "Reclaimed Teak" },
        { label: "Worktop", value: "Dark Stone Ceramic" },{ label: "Storage", value: "1 Shelf" },
      ],
      dims: [{ piece: "Cabinet", w: "57.6", d: "63", h: "97.7", sh: "—" }],
      materials: ["Reclaimed teak construction","Dark stone ceramic worktop","Premium soft-close hinges","Water and rot-resistant"],
      colorLabel: "Finish", colors: [{name:"Natural Teak",hex:"#a07848"}],
    },
    "carbon-line-6-burner-bbq": {
      name: "Carbon Line 6 Burner BBQ", collection: "Carbon Line", category: "kitchen", tag: "New", price: "€3,277",
      tagline: "Premium black reclaimed teak cabinet with 304-grade black stainless steel 6-burner BBQ and Hafele German fittings",
      images: ["/src/assets/images/kitchen/carbon-setup-1.jpg","/src/assets/images/kitchen/carbon-setup-2.jpg","/src/assets/images/kitchen/carbon-line-1.jpg"],
      specs: [
        { label: "Model", value: "DRA5571" },{ label: "BBQ Material", value: "304-grade Black SS" },
        { label: "Cabinet", value: "Black Reclaimed Teak" },{ label: "Total Output", value: "90,000 BTU" },
        { label: "Fittings", value: "Hafele German" },{ label: "Worktop", value: "Ceramic" },
      ],
      dims: [{ piece: "BBQ", w: "110.2", d: "57.6", h: "54.3", sh: "—" },{ piece: "Cabinet", w: "163.4", d: "62.5", h: "94.7", sh: "—" }],
      materials: ["304-grade black stainless steel BBQ","Black reclaimed teak with eco-friendly water-based paint","Hafele German soft-close hinges","Brushed aluminium handles","Ceramic worktop","Fire-resistant cement board lining"],
      colorLabel: "Finish", colors: [{name:"Carbon Black",hex:"#2a2a2a"}],
    },
    "carbon-line-island-unit": {
      name: "Carbon Line Island Unit", collection: "Carbon Line", category: "kitchen", price: "€2,054",
      tagline: "Central hub for outdoor cooking, carbon black reclaimed teak with white ceramic worktop and Hafele fittings",
      images: ["/src/assets/images/kitchen/carbon-line-1.jpg","/src/assets/images/kitchen/carbon-lifestyle-1.jpg","/src/assets/images/kitchen/carbon-line-2.jpg"],
      specs: [
        { label: "Model", value: "DRA5563" },{ label: "Material", value: "Black Reclaimed Teak" },
        { label: "Worktop", value: "White Ceramic" },{ label: "Finish", value: "UV-stabilised" },
        { label: "Fittings", value: "Hafele German" },
      ],
      dims: [{ piece: "Island", w: "180", d: "80", h: "90.8", sh: "—" }],
      materials: ["Black reclaimed teak with carbon black coating","White ceramic worktop, heat-resistant","Hafele German-engineered fittings","UV-stabilised water-based finish"],
      colorLabel: "Finish", colors: [{name:"Carbon Black",hex:"#2a2a2a"}],
    },
  };

  const product = allProducts[id] || allProducts["sicily-modular-set"];

  const AccordionSection = ({ title, open, toggle, children }) => (
    <div style={{ borderBottom: "1px solid var(--sand-l)" }}>
      <button onClick={toggle} className="fs" style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 0", background: "none", border: "none", cursor: "pointer",
        fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--stone)",
        transition: "color .3s",
      }}
      onMouseEnter={e=>e.target.style.color="var(--gold)"}
      onMouseLeave={e=>e.target.style.color="var(--stone)"}>
        {title}
        <span style={{ fontSize: 18, fontWeight: 300, transition: "transform .3s", transform: open ? "rotate(45deg)" : "rotate(0)" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height .5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ paddingBottom: 20 }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
        .thumb{width:72px;height:72px;object-fit:cover;cursor:pointer;border:2px solid transparent;transition:all .3s;opacity:.6;border-radius:2px}
        .thumb:hover,.thumb.active{border-color:var(--gold);opacity:1}
        .color-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .3s}
        .color-dot:hover{border-color:var(--stone);transform:scale(1.12)}
        .related-card{cursor:pointer;transition:all .4s cubic-bezier(0.16, 1, 0.3, 1)}
        .related-card:hover{transform:translateY(-6px)}
        .related-card img{width:100%;aspect-ratio:1;object-fit:cover;transition:transform .7s cubic-bezier(0.16, 1, 0.3, 1)}
        .related-card:hover img{transform:scale(1.05)}
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

      {/* BREADCRUMB */}
      <div style={{paddingTop:115,padding:"115px 48px 0",background:"var(--cream)"}}>
        <div className="fs" style={{fontSize:11,letterSpacing:2,color:"var(--sand-d)",textTransform:"uppercase"}}>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Home</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Furniture</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Lounge</a>
          <span style={{margin:"0 8px",opacity:.4}}>/</span>
          <span style={{color:"var(--stone)"}}>{product.name}</span>
        </div>
      </div>

      {/* MAIN PRODUCT SECTION */}
      <section style={{display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:60,padding:"40px 48px clamp(60px,8vh,100px)",maxWidth:1300}}>
        <div>
          <div style={{overflow:"hidden",borderRadius:3,marginBottom:16,position:"relative",background:"var(--cream-w)"}}>
            <img src={product.images[activeImg]} alt={product.name} style={{width:"100%",aspectRatio:"4/3",objectFit:"contain",transition:"opacity .4s"}} />
            {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`} style={{position:"absolute",top:16,left:16}}>{product.tag}</span>}
            <FavoriteButton product={{id:"sicily-modular-set",name:product.name,collection:product.collection,img:product.images[0],route:"/product/sicily"}} size={20} style={{position:"absolute",top:16,right:16}} />
          </div>
          <div style={{display:"flex",gap:8}}>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`View ${i+1}`} className={`thumb ${activeImg === i ? "active" : ""}`} onClick={() => setActiveImg(i)} />
            ))}
          </div>
        </div>

        <div style={{paddingTop:8}}>
          <span className="fs sl" style={{marginBottom:8,display:"block"}}>{product.collection} Collection</span>
          <h1 className="ff" style={{fontSize:"clamp(32px,4vw,44px)",fontWeight:300,lineHeight:1.1,marginBottom:12,letterSpacing:"-0.01em"}}>{product.name}</h1>
          <div className="la" style={{marginBottom:16}} />
          <p className="fs" style={{fontSize:14,lineHeight:1.7,color:"var(--stone-l)",fontWeight:300,marginBottom:28}}>{product.tagline}</p>

          <div style={{marginBottom:28}}>
            <span className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--sand-d)",display:"block",marginBottom:12}}>{product.colorLabel || "Colours"}</span>
            <div style={{display:"flex",gap:10}}>
              {product.colors.map((c) => (
                <div key={c.name} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                  <div className="color-dot" style={{background:c.hex}} />
                  <span className="fs" style={{fontSize:10,color:"var(--sand-d)"}}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {product.price && (
            <div style={{marginBottom:28}}>
              <span className="ff" style={{fontSize:32,fontWeight:300,color:"var(--stone)"}}>{product.price}</span>
              <span className="fs" style={{fontSize:11,color:"var(--sand-d)",marginLeft:8}}>exc. VAT</span>
            </div>
          )}

          <div style={{display:"flex",gap:12,marginBottom:36,flexWrap:"wrap"}}>
            <button className="cb cg">Request a quote</button>
            <button className="fs" style={{padding:"15px 28px",background:"transparent",color:"var(--ocean)",border:"1px solid var(--sand)",fontSize:12,letterSpacing:2,textTransform:"uppercase",cursor:"pointer",transition:"all .35s",borderRadius:0}}
              onMouseEnter={e=>{e.target.style.borderColor="var(--ocean)";e.target.style.background="rgba(42,95,122,.05)"}}
              onMouseLeave={e=>{e.target.style.borderColor="var(--sand)";e.target.style.background="transparent"}}>
              Book showroom visit
            </button>
          </div>

          <AccordionSection title="Specifications" open={specsOpen} toggle={() => setSpecsOpen(!specsOpen)}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
              {product.specs.map((s) => (
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(163,180,200,.2)"}}>
                  <span className="fs" style={{fontSize:12,color:"var(--sand-d)"}}>{s.label}</span>
                  <span className="fs" style={{fontSize:12,color:"var(--stone)",fontWeight:400}}>{s.value}</span>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection title="Dimensions (cm)" open={dimsOpen} toggle={() => setDimsOpen(!dimsOpen)}>
            <table className="fs" style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid var(--sand)"}}>
                  {["Piece","W","D","H","Seat H"].map(h=><th key={h} style={{padding:"8px 4px",textAlign:"left",fontWeight:400,color:"var(--sand-d)",letterSpacing:1,textTransform:"uppercase",fontSize:10}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {product.dims.map((d)=>(
                  <tr key={d.piece} style={{borderBottom:"1px solid rgba(163,180,200,.2)"}}>
                    <td style={{padding:"8px 4px",color:"var(--stone)"}}>{d.piece}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.w}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.d}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.h}</td>
                    <td style={{padding:"8px 4px",color:"var(--stone-l)"}}>{d.sh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionSection>

          <AccordionSection title="Materials & Care" open={matOpen} toggle={() => setMatOpen(!matOpen)}>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {product.materials.map((m)=>(
                <div key={m} className="fs" style={{display:"flex",gap:8,fontSize:12,color:"var(--stone-l)",lineHeight:1.6}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:7}} />
                  {m}
                </div>
              ))}
            </div>
          </AccordionSection>

          <div style={{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}}>
            {["Sunbrella®","Interpon","Premium Alu"].map(b=>(
              <span key={b} className="mb">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {(product.related && product.related.length > 0) && (
      <section id="related" data-animate style={{padding:"60px 48px clamp(60px,10vh,100px)",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("related")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
          <div>
            <span className="fs sl">You may also like</span>
            <h2 className="ff" style={{fontSize:"clamp(28px,3vw,36px)",fontWeight:300,marginTop:8,letterSpacing:"-0.01em"}}>Related Products</h2>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} className="fs" style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"var(--gold)",textDecoration:"none",borderBottom:"1px solid var(--gold)",paddingBottom:2}}>View all →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
          {product.related.map((r, i)=>(
            <div key={r.name} className="related-card" onClick={()=>navigate(`/product/${r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`)} style={{animation:vis("related")?`fu 0.5s ${0.08*i}s both`:"none"}}>
              <div style={{overflow:"hidden",borderRadius:3,marginBottom:12,position:"relative"}}>
                <FavoriteButton product={{id:r.name.toLowerCase().replace(/\s+/g,'-'),name:r.name,collection:r.collection,img:r.img,route:`/product/${r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}} size={16} style={{position:"absolute",top:12,right:12,zIndex:3}} />
                <img src={r.img} alt={r.name} />
              </div>
              <h3 className="ff" style={{fontSize:20,fontWeight:400,marginBottom:4}}>{r.name}</h3>
              <p className="fs" style={{fontSize:11,letterSpacing:1.5,color:"var(--sand-d)",textTransform:"uppercase"}}>{r.collection}</p>
            </div>
          ))}
        </div>
      </section>
      )}

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

export default PRODUCT_DETAIL;
