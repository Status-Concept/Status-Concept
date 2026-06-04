import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import FavoriteButton from "../FavoriteButton";

const socialIcons = [
  {n:"Facebook",url:"https://facebook.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>},
  {n:"Instagram",url:"https://instagram.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>},
  {n:"Pinterest",url:"https://pinterest.com/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.18-.77 1.19-5.03 1.19-5.03s-.3-.61-.3-1.51c0-1.41.82-2.46 1.84-2.46.87 0 1.29.65 1.29 1.44 0 .88-.56 2.19-.85 3.4-.24 1.01.5 1.84 1.5 1.84 1.8 0 3.18-1.9 3.18-4.64 0-2.43-1.74-4.13-4.24-4.13-2.88 0-4.58 2.16-4.58 4.4 0 .87.33 1.8.75 2.31.07.09.1.2.07.29l-.28 1.15c-.04.18-.15.22-.34.13C5.61 14.94 5 13.2 5 11.45c0-3.19 2.32-6.13 6.7-6.13 3.52 0 6.25 2.51 6.25 5.86 0 3.49-2.2 6.3-5.26 6.3-1.03 0-1.99-.53-2.32-1.16l-.63 2.41c-.23.88-.85 1.98-1.26 2.66.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>},
  {n:"LinkedIn",url:"https://linkedin.com/company/statusconcept",svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>},
];

const PRODUCTS_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const [headerSolid, setHeaderSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(catParam || "all");
  const [visibleSections, setVisibleSections] = useState(new Set(["filters", "grid"]));
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    if (catParam) setActiveCategory(catParam);
    else setActiveCategory("all");
  }, [catParam]);

  useEffect(() => {
    const handleScroll = () => setHeaderSolid(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisibleSections((p) => new Set([...p, e.target.id])); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const vis = (id) => visibleSections.has(id);

  const categories = [
    { key: "all", label: "All", count: 78 },
    { key: "lounge", label: "Lounge", count: 9 },
    { key: "dining", label: "Dining", count: 4 },
    { key: "sunlounger", label: "Sun Loungers", count: 4 },
    { key: "daybed", label: "Day Beds", count: 2 },
    { key: "coffee", label: "Coffee Tables", count: 2 },
    { key: "side", label: "Side Tables", count: 1 },
    { key: "bar", label: "Bar & Patio", count: 2 },
    { key: "puffs", label: "Puffs", count: 1 },
    { key: "shade", label: "Shade", count: 6 },
    { key: "nero", label: "Nero Black SS", count: 13 },
    { key: "teak", label: "Teak Range", count: 12 },
    { key: "carbon", label: "Carbon Line", count: 18 },
    { key: "decor", label: "Decor", count: 4 },
  ];

  const allProducts = [
    { name: "Sicily Modular Set", collection: "Sicily", category: "lounge", img: "/src/assets/images/sicily-corner.jpg", tag: "Popular" },
    { name: "Bali Lounge Set", collection: "Bali", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Berlin Sofa Set", collection: "Berlin", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Bonaire Corner Set", collection: "Bonaire", category: "lounge", img: "/placeholder.svg", tag: "New" },
    { name: "Ibiza Lounge Set", collection: "Ibiza", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Maya Sofa Set", collection: "Maya", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Bora Bora Sofa Set", collection: "Bora Bora", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Armona Sofa Set", collection: "Armona", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Aruba S Lounge", collection: "Aruba S", category: "lounge", img: "/placeholder.svg", tag: "" },
    { name: "Antigua Corner Set", collection: "Antigua", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Imperia Dining Set", collection: "Imperia", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Dunbar Dining", collection: "Dunbar", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Corsica Dining Set", collection: "Corsica", category: "dining", img: "/placeholder.svg", tag: "" },
    { name: "Bonaire Sun Lounger", collection: "Bonaire", category: "sunlounger", img: "/placeholder.svg", tag: "" },
    { name: "Crete Sun Lounger", collection: "Crete", category: "sunlounger", img: "/placeholder.svg", tag: "" },
    { name: "Fiji Sun Lounger", collection: "Fiji", category: "sunlounger", img: "/placeholder.svg", tag: "New" },
    { name: "Bali Double Sunlounger", collection: "Bali", category: "sunlounger", img: "/placeholder.svg", tag: "" },
    { name: "Hawaii Daybed", collection: "Hawaii", category: "daybed", img: "/placeholder.svg", tag: "" },
    { name: "Bermuda Daybed", collection: "Bermuda", category: "daybed", img: "/placeholder.svg", tag: "" },
    { name: "Bern Coffee Table", collection: "Bern", category: "coffee", img: "/placeholder.svg", tag: "" },
    { name: "Bonaire Coffee Table", collection: "Bonaire", category: "coffee", img: "/placeholder.svg", tag: "" },
    { name: "Lagos Side Table", collection: "Lagos", category: "side", img: "/placeholder.svg", tag: "" },
    { name: "Luanda Bar Set", collection: "Luanda", category: "bar", img: "/placeholder.svg", tag: "" },
    { name: "Barcelona Bar Set", collection: "Barcelona", category: "bar", img: "/placeholder.svg", tag: "" },
    { name: "Ibiza Armchair", collection: "Ibiza", category: "puffs", img: "/placeholder.svg", tag: "" },
    { name: "Glatz Sombrano Parasol", collection: "Glatz", category: "shade", img: "/placeholder.svg", tag: "" },
    { name: "Glatz Sunwing Parasol", collection: "Glatz", category: "shade", img: "/placeholder.svg", tag: "Popular" },
    { name: "Bioclimatic Pergola", collection: "Pergolas", category: "shade", img: "/placeholder.svg", tag: "" },
    { name: "Retractable Pergola", collection: "Pergolas", category: "shade", img: "/placeholder.svg", tag: "" },
    { name: "Wall-Mounted Parasol", collection: "Glatz", category: "shade", img: "/placeholder.svg", tag: "" },
    { name: "Free-Standing Pergola", collection: "Pergolas", category: "shade", img: "/placeholder.svg", tag: "New" },
    // NERO RANGE (13 products)
    { name: "Nero 6 Burner BBQ", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-6burner-bbq.jpg", tag: "Popular", desc: "304-grade black SS, 90,000 BTU, 6 power burners + ceramic rear, LED knobs, granite top" },
    { name: "Nero 4 Burner BBQ", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-4burner-bbq.jpg", tag: "", desc: "304-grade black SS, 65,000 BTU, 4 power burners + ceramic rear, granite top" },
    { name: "Nero Double Fridge Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-double-fridge.jpg", tag: "", desc: "Twin 60L fridges, triple-glazed Low E doors, blue LED, digital controls, granite top" },
    { name: "Nero Sink & Fridge Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-sink-fridge.jpg", tag: "", desc: "60L fridge + matt black sink, 360° swivel tap, hot/cold water, granite top" },
    { name: "Nero Single Fridge Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-single-fridge.jpg", tag: "", desc: "60L fridge, triple-glazed door, blue LED lighting, digital controls, granite top" },
    { name: "Nero Sink Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-sink-cabinet.jpg", tag: "", desc: "Matt black sink with 360° swivel tap, hot/cold water connection, granite top" },
    { name: "Nero Large 3 Drawer Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-4drawer.jpg", tag: "", desc: "Spacious 3-drawer storage, soft-close mechanisms, granite worktop" },
    { name: "Nero Waste Bin Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-waste-bin.webp", tag: "", desc: "Integrated slide-out waste bin, soft-close door, granite worktop" },
    { name: "Nero Double Door Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-double-door.jpg", tag: "", desc: "Double door storage with shelf, soft-close doors, granite worktop" },
    { name: "Nero Triple Drawer Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-triple-drawer.jpg", tag: "", desc: "Three-drawer storage unit, soft-close mechanisms, granite worktop" },
    { name: "Nero Sear Station", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-sear-station.jpg", tag: "", desc: "Ceramic infrared burner, 13,300 BTU, piezo ignition, granite top" },
    { name: "Nero Single Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-single-cabinet.jpg", tag: "", desc: "Single door bottle cabinet with shelf, soft-close door, granite top" },
    { name: "Nero 90° Corner Cabinet", collection: "Nero Range", category: "nero", img: "/src/assets/images/kitchen/blk-corner.jpg", tag: "", desc: "L-shape or U-shape connector, 304-grade black SS, granite top" },
    // TEAK RANGE (12 products)
    { name: "Teak 6 Burner BBQ Unit", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-6burner-bbq.jpg", tag: "Popular", desc: "Reclaimed teak housing, 304-grade SS 6-burner BBQ, 90,000 BTU, ceramic top" },
    { name: "Teak Double Fridge Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-double-fridge.png", tag: "", desc: "Twin fridges in reclaimed teak frame, dark stone ceramic worktop" },
    { name: "Teak 4 Burner BBQ Unit", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-4burner.jpg", tag: "", desc: "Reclaimed teak housing, 304-grade SS 4-burner BBQ, ceramic top" },
    { name: "Teak Corner Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-corner.jpg", tag: "", desc: "Reclaimed teak, 3 drawers + shelf, soft-close doors, ceramic top" },
    { name: "Teak Single Fridge Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-single-fridge.png", tag: "", desc: "Single fridge in reclaimed teak frame, dark stone ceramic worktop" },
    { name: "Teak Coffee Bar", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-coffee-bar.png", tag: "New", desc: "Coffee station with storage shelves, reclaimed teak, ceramic top" },
    { name: "Teak Double Door Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-double-door.png", tag: "", desc: "Double door storage, reclaimed teak, soft-close doors, ceramic top" },
    { name: "Teak Sink Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-sink.png", tag: "", desc: "Integrated sink with tap, reclaimed teak, dark stone ceramic top" },
    { name: "Teak Wine Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-wine.png", tag: "", desc: "Wine rack storage, reclaimed teak, dark stone ceramic worktop" },
    { name: "Teak 90° Corner Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-90corner.jpg", tag: "", desc: "Corner connector unit, reclaimed teak, ceramic worktop" },
    { name: "Teak 3 Drawer Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-3drawer.png", tag: "", desc: "Triple drawer storage, reclaimed teak, soft-close, ceramic top" },
    { name: "Teak Single Door Cabinet", collection: "Teak Range", category: "teak", img: "/src/assets/images/kitchen/teak-front.jpg", tag: "", desc: "Single door with shelf, reclaimed teak, soft-close, ceramic top" },
    // CARBON LINE (18 key products)
    { name: "Carbon Line 6 Burner Black SS BBQ", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-setup-1.jpg", tag: "New", desc: "Black reclaimed teak + 304-grade black SS BBQ, 90,000 BTU, Hafele fittings" },
    { name: "Carbon Line 4 Burner Black SS BBQ", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-4burner-blk.jpg", tag: "", desc: "Black reclaimed teak + 304-grade black SS 4-burner BBQ, Hafele fittings" },
    { name: "Carbon Line Double Fridge Black SS", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-dbl-fridge-blk.jpg", tag: "", desc: "Twin fridges, black SS doors, black reclaimed teak cabinet, ceramic top" },
    { name: "Carbon Line Island Unit", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-1.jpg", tag: "", desc: "Central kitchen island, carbon black teak, white ceramic top, 180×80cm" },
    { name: "Carbon Line Kamado Egg Table 27\"", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-kamado.jpg", tag: "", desc: "Kamado egg BBQ table (70cm), black reclaimed teak, ceramic top" },
    { name: "Carbon Line Single Fridge Black SS", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-lifestyle-2.jpg", tag: "", desc: "Single fridge, black SS door, black reclaimed teak cabinet, ceramic top" },
    { name: "Carbon Line Sink Cabinet", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-sink.jpg", tag: "", desc: "Integrated sink, black reclaimed teak, Hafele fittings, ceramic top" },
    { name: "Carbon Line Side Burner", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-side-burner.png", tag: "", desc: "Side burner station, black reclaimed teak cabinet, ceramic top" },
    { name: "Carbon Line 3 Drawer Unit", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-2.jpg", tag: "", desc: "Triple drawer storage, black reclaimed teak, Hafele fittings, ceramic top" },
    { name: "Carbon Line 90° Corner", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-3.jpg", tag: "", desc: "Corner connector, black reclaimed teak, ceramic worktop" },
    { name: "Carbon Line 3 Drawer Cabinet", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-lifestyle-3.jpg", tag: "", desc: "Compact 3-drawer cabinet, black reclaimed teak, ceramic top" },
    { name: "Carbon Line Single Door Cabinet", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-single-door.jpg", tag: "", desc: "Single door storage, black reclaimed teak, Hafele fittings, ceramic top" },
    { name: "Carbon Line Double Door & Drawer", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-setup-2.jpg", tag: "", desc: "Double door + drawer cabinet, black reclaimed teak, ceramic top" },
    { name: "Carbon Line 2 Door Add On", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-4.jpg", tag: "", desc: "Add-on 2 door cabinet, black reclaimed teak, ceramic top" },
    { name: "Carbon Line 60cm Kamado Table", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-lifestyle-1.jpg", tag: "", desc: "Compact kamado table (60cm), black reclaimed teak, ceramic top" },
    { name: "Carbon Line 70cm Kamado Table", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-kamado.jpg", tag: "", desc: "Standard kamado table (70cm), black reclaimed teak, ceramic top" },
    { name: "Carbon Line Slatted Shelf", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-3.jpg", tag: "", desc: "Add-on slatted shelf with hook-on storage boxes" },
    { name: "Carbon Line Double Shelf", collection: "Carbon Line", category: "carbon", img: "/src/assets/images/kitchen/carbon-line-2.jpg", tag: "", desc: "Add-on double shelf unit for extra storage" },
    { name: "Outdoor Carpet Algarve", collection: "Decor", category: "decor", img: "/placeholder.svg", tag: "" },
    { name: "Garden Vase Collection", collection: "Decor", category: "decor", img: "/placeholder.svg", tag: "" },
    { name: "LED Garden Lighting", collection: "Decor", category: "decor", img: "/placeholder.svg", tag: "New" },
    { name: "Outdoor Sound System", collection: "Leisure", category: "decor", img: "/placeholder.svg", tag: "" },
  ];

  const filteredProducts = activeCategory === "all" ? allProducts : allProducts.filter((p) => p.category === activeCategory);

  const S = (id) => ({
    opacity: vis(id) ? 1 : 0, transform: vis(id) ? "translateY(0) scale(1)" : "translateY(32px) scale(0.98)",
    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  });

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: "var(--stone)", background: "var(--cream)", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500&display=swap');
      `}</style>

      {/* HEADER */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(232,240,248,.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(163,180,200,.3)",transition:"all .4s"}}>
        <div className="fs header-top" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 48px",fontSize:"11px",letterSpacing:"1.5px",color:"var(--sand-d)",borderBottom:"1px solid rgba(163,180,200,.15)"}}>
          <div style={{display:"flex",gap:"24px",alignItems:"center"}}><span>+351 289 030 179</span><span style={{opacity:.4}}>|</span><span>info@statusconcept.com</span></div>
          <div style={{display:"flex",gap:"2px",alignItems:"center"}}>
            {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{opacity:.65,color:"var(--sand-d)"}}>{svg}</a>
            ))}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 48px"}}>
          <div style={{cursor:"pointer",lineHeight:1}}>
            <span className="ff" style={{fontSize:28,fontWeight:400,letterSpacing:8,color:"var(--stone)"}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span>
            <div className="fs" style={{fontSize:7,letterSpacing:3,color:"var(--sand-d)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div>
          </div>
          <nav className="fs nav-desktop" style={{display:"flex",gap:"32px",fontSize:"12px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--stone-l)"}}>
            {["Furniture","Shade","Kitchens","Decor","Projects","Showrooms","Contact"].map(i=><a key={i} className="nl" href="#" style={{color:"inherit"}}>{i}</a>)}
          </nav>
          <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
            <div className="fs" style={{fontSize:"11px",letterSpacing:"2px",color:"var(--sand-d)",cursor:"pointer"}}>EN ▾</div>
            <button onClick={()=>setMenuOpen(true)} className="nav-burger" style={{background:"none",border:"none",cursor:"pointer",padding:4,color:"var(--stone)",display:"none",flexDirection:"column",gap:"5px"}}>
              <div style={{width:24,height:1.5,background:"currentColor"}}/><div style={{width:18,height:1.5,background:"currentColor",marginLeft:"auto"}}/>
            </button>
          </div>
        </div>
      </header>

      {/* PAGE HERO */}
      {(catParam === "nero" || catParam === "teak" || catParam === "carbon") ? (
        <section style={{position:"relative",height:"50vh",minHeight:380,paddingTop:100,background:"linear-gradient(165deg,rgba(26,26,46,.5),rgba(26,26,46,.25)),url('/src/assets/images/kitchen/kitchen-hero.jpg') center/cover",display:"flex",alignItems:"flex-end",padding:"0 0 60px 0"}}>
          <div style={{padding:"0 48px",position:"relative",zIndex:2,maxWidth:700}}>
            <div className="fs" style={{fontSize:"11px",letterSpacing:"3px",color:"rgba(255,255,255,.6)",textTransform:"uppercase",marginBottom:"12px",animation:"fu .6s .2s both"}}>
              <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none"}}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> <a href="#" onClick={(e)=>{e.preventDefault();navigate('/products')}} style={{color:"inherit",textDecoration:"none"}}>Products</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> {catParam === "nero" ? "Nero Black SS" : catParam === "teak" ? "Teak Range" : "Carbon Line"}
            </div>
            <h1 className="ff" style={{fontSize:"clamp(38px,5vw,60px)",fontWeight:300,color:"#fff",lineHeight:1.1,marginBottom:"16px",letterSpacing:"-0.01em",animation:"fu .6s .3s both"}}>{catParam === "nero" ? "Nero Black Stainless Steel" : catParam === "teak" ? "Teak Outdoor Kitchen" : "Carbon Line Teak"}</h1>
            <p className="fs" style={{fontSize:"15px",color:"rgba(255,255,255,.75)",lineHeight:1.7,fontWeight:300,animation:"fu .6s .45s both"}}>{catParam === "nero" ? "Premium 304-grade black stainless steel modular outdoor kitchen. BBQ stations, fridge cabinets, sink units, sear stations, and corner modules with granite worktops." : catParam === "teak" ? "Reclaimed teak modular outdoor kitchen with dark stone ceramic worktops. BBQ units, fridges, coffee bars, wine cabinets, and storage modules." : "Premium carbon black reclaimed teak with Hafele German fittings. BBQ stations, fridges, kamado tables, island units, and storage with ceramic worktops."}</p>
          </div>
        </section>
      ) : (
        <section style={{paddingTop:"140px",paddingBottom:"60px",paddingLeft:"48px",paddingRight:"48px",background:"var(--cream-w)",borderBottom:"1px solid var(--sand-l)"}}>
          <div style={{maxWidth:"800px"}}>
            <div className="fs" style={{fontSize:"11px",letterSpacing:"3px",color:"var(--sand-d)",textTransform:"uppercase",marginBottom:"8px",animation:"fu .6s .2s both"}}>
              <a href="#" onClick={(e)=>{e.preventDefault();navigate('/')}} style={{color:"inherit",textDecoration:"none",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="var(--gold)"} onMouseLeave={e=>e.target.style.color="inherit"}>Home</a> <span style={{margin:"0 8px",opacity:.4}}>/</span> {catParam === "shade" ? "Shade Solutions" : catParam === "decor" ? "Decor & Leisure" : "Furniture Series"}
            </div>
            <h1 className="ff" style={{fontSize:"clamp(36px,5vw,56px)",fontWeight:300,lineHeight:1.1,marginBottom:"20px",letterSpacing:"-0.01em",animation:"fu .6s .3s both"}}>{catParam === "shade" ? "Shade Solutions" : catParam === "decor" ? "Decor & Leisure" : "Furniture Series"}</h1>
            <p className="fs" style={{fontSize:"15px",color:"var(--stone-l)",lineHeight:1.7,maxWidth:"600px",fontWeight:300,animation:"fu .6s .45s both"}}>
              {catParam === "shade" ? "Premium parasols, bioclimatic and retractable pergolas for the perfect outdoor shade solution." : catParam === "decor" ? "Outdoor carpets, garden vases, lighting, sound systems and leisure accessories." : "Explore our complete range of luxury outdoor furniture: from reclining sofa sets to elegant dining collections. Each piece crafted with Sunbrella® fabrics and premium aluminium for the Algarve lifestyle."}
            </p>
          </div>
        </section>
      )}

      {/* FILTER BAR */}
      <section id="filters" data-animate style={{padding:"32px 48px",borderBottom:"1px solid var(--sand-l)",position:"sticky",top:"95px",zIndex:50,background:"rgba(232,240,248,.97)",backdropFilter:"blur(12px)",...S("filters")}}>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center"}}>
          <span className="fs" style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--sand-d)",marginRight:"8px"}}>Filter:</span>
          {categories.map((c) => (
            <button key={c.key} className={`cat-filter ${activeCategory === c.key ? "active" : ""}`} onClick={() => setActiveCategory(c.key)}>
              {c.label}<span className="count">({c.count})</span>
            </button>
          ))}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section id="grid" data-animate style={{padding:"48px",minHeight:"60vh",...S("grid")}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
          <p className="fs" style={{fontSize:"13px",color:"var(--sand-d)"}}>
            Showing <strong style={{color:"var(--stone)"}}>{filteredProducts.length}</strong> products
          </p>
          <div className="fs" style={{display:"flex",gap:"16px",fontSize:"12px",color:"var(--sand-d)"}}>
            <span style={{cursor:"pointer",borderBottom:"1px solid var(--stone)",color:"var(--stone)",paddingBottom:"2px"}}>Grid</span>
            <span style={{cursor:"pointer"}}>List</span>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"28px",maxWidth:"1300px"}}>
          {filteredProducts.map((p, i) => (
            <div key={p.name + i} className="product-card"
              onClick={() => navigate(`/product/${p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'')}`)}
              onMouseEnter={() => setHoveredProduct(i)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{animation: `fu .5s ${0.06 * i}s both`, borderRadius: 3}}>
              {p.tag && <span className={`tag ${p.tag === "New" ? "tag-new" : "tag-popular"}`}>{p.tag}</span>}
              <FavoriteButton
                product={{id:p.name.toLowerCase().replace(/\s+/g,'-'),name:p.name,collection:p.collection,img:p.img,category:p.category,route:`/product/${p.collection.toLowerCase()}`}}
                size={16}
                style={{position:"absolute",top:12,right:12,zIndex:3}}
              />
              <img src={p.img} alt={p.name} style={{borderRadius:"3px 3px 0 0"}} />
              <div className="card-overlay" />
              <span className="card-cta fs" style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"#fff",borderBottom:"1px solid rgba(255,255,255,.5)",paddingBottom:"2px"}}>View details</span>
              <div style={{padding:"18px 4px 10px",borderTop:"1px solid var(--sand-l)"}}>
                <h3 className="ff" style={{fontSize:"21px",fontWeight:400,marginBottom:"6px",letterSpacing:".3px"}}>{p.name}</h3>
                {p.desc && <p className="fs" style={{fontSize:"11px",color:"var(--sand-d)",lineHeight:1.5,marginBottom:6,fontWeight:300,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.desc}</p>}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <p className="fs" style={{fontSize:"10px",letterSpacing:"1.5px",color:"var(--sand-d)",textTransform:"uppercase"}}>{p.collection}</p>
                  {p.price ? <span className="fs" style={{fontSize:"12px",fontWeight:500,color:"var(--stone)"}}>{p.price}</span> : <span className="fs" style={{fontSize:"10px",letterSpacing:"1px",color:"var(--gold)",opacity:.85,transition:"opacity .3s"}}>View →</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeCategory === "all" && (
          <div style={{textAlign:"center",marginTop:"56px"}}>
            <a href="#" className="cb cd" onClick={(e)=>e.preventDefault()}>Load more products</a>
          </div>
        )}
      </section>

      {/* COLLECTIONS STRIP */}
      <section id="colstrip" data-animate style={{padding:"clamp(60px,10vh,100px) 48px",background:"var(--cream-w)",borderTop:"1px solid var(--sand-l)",...S("colstrip")}}>
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <span className="fs sl">Browse by collection</span>
          <h2 className="ff" style={{fontSize:"clamp(28px,3.5vw,40px)",fontWeight:300,marginTop:"12px",letterSpacing:"-0.01em"}}>Named Collections</h2>
        </div>
        <div style={{display:"flex",gap:"12px",flexWrap:"wrap",justifyContent:"center",maxWidth:"1000px",margin:"0 auto"}}>
          {["Bali","Berlin","Bonaire","Bora Bora","Ibiza","Maya","Armona","Aruba S","Antigua","Imperia","Dunbar","Corsica","Crete","Fiji","Hawaii","Bermuda","Bern","Lagos","Luanda","Barcelona","Athens","Lyon","Lisbon"].map((c) => (
            <span key={c} className="fs" style={{
              padding:"10px 24px",border:"1px solid var(--sand)",cursor:"pointer",
              fontSize:"12px",letterSpacing:"1.5px",color:"var(--stone-l)",
              transition:"all .3s cubic-bezier(0.16, 1, 0.3, 1)",background:"transparent",borderRadius:2,
            }}
            onClick={()=>navigate('/collection')}
            onMouseEnter={(e)=>{e.target.style.background="var(--stone)";e.target.style.color="var(--cream)";e.target.style.borderColor="var(--stone)"}}
            onMouseLeave={(e)=>{e.target.style.background="transparent";e.target.style.color="var(--stone-l)";e.target.style.borderColor="var(--sand)"}}
            >{c}</span>
          ))}
        </div>
      </section>

      {/* SHADE & KITCHEN CTA */}
      <section id="othercats" data-animate style={{display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"400px",...S("othercats")}}>
        {[
          { title: "Shade Solutions", desc: "Parasols, bioclimatic & retractable pergolas", img: "/placeholder.svg" },
          { title: "Outdoor Kitchens", desc: "BBQ systems, pizza ovens & full outdoor kitchens", img: "/placeholder.svg" },
        ].map((item) => (
          <div key={item.title} onClick={()=>navigate('/products')} style={{position:"relative",overflow:"hidden",cursor:"pointer"}}>
            <img src={item.img} alt={item.title} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .7s cubic-bezier(0.16, 1, 0.3, 1)"}}
              onMouseEnter={(e)=>e.target.style.transform="scale(1.05)"}
              onMouseLeave={(e)=>e.target.style.transform="scale(1)"} />
            <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,.6))",display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:"40px"}}>
              <h3 className="ff" style={{fontSize:"32px",fontWeight:300,color:"#fff",marginBottom:"8px"}}>{item.title}</h3>
              <p className="fs" style={{fontSize:"13px",color:"rgba(255,255,255,.7)",marginBottom:"16px"}}>{item.desc}</p>
              <span className="fs" style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"var(--gold-l)",alignSelf:"flex-start",borderBottom:"1px solid var(--gold-l)",paddingBottom:"2px"}}>Explore →</span>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer style={{background:"var(--stone)",color:"#fff",padding:"72px 48px 36px"}}>
        <div className="footer-grid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr 1fr",gap:40,maxWidth:1200,margin:"0 auto",paddingBottom:48,borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div>
            <div style={{marginBottom:20}}><span className="ff" style={{fontSize:24,fontWeight:400,letterSpacing:8}}>ST<span style={{color:"var(--gold)"}}>A</span>TVS</span><div className="fs" style={{fontSize:7,letterSpacing:3,color:"rgba(255,255,255,.4)",marginTop:2}}>OUTDOOR FURNITURE SPECIALISTS</div></div>
            <p className="fs" style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,.5)",fontWeight:300}}>High quality lifestyle furniture in the Algarve. Serving Vale do Lobo, Quinta do Lago, Vilamoura, and beyond.</p>
            <div style={{display:"flex",gap:"2px",marginTop:20}}>
              {socialIcons.map(({n,url,svg})=>(<a key={n} href={url} target="_blank" rel="noopener noreferrer" aria-label={n} className="si" style={{color:"rgba(255,255,255,.4)"}}>{svg}</a>
              ))}
            </div>
          </div>
          {[{t:"Furniture",ls:["Lounge","Dining","Sun Loungers","Day Beds","Coffee Tables","Bar & Patio"]},{t:"Solutions",ls:["Parasols","Bioclimatic Pergolas","Outdoor Kitchens","Decor","Leisure"]},{t:"Company",ls:["Why Us","After Care","Projects","Gallery","Catalogue"]},{t:"Contact",ls:["Showroom Quinta do Lago","Showroom Almancil","+351 289 030 179","info@statusconcept.com"]}].map(c=>(
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

export default PRODUCTS_PAGE;
