import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import { kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { glatzProducts } from "../data/glatzProducts";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.jpg";
import shadeRealProductsHeroImg from "../assets/images/enhanced/shade-real-products-hero.png";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-hero.png";
import baliDivanoImg from "../assets/images/bali-divano.jpg";
import berlinImg from "../assets/images/berlin.jpg";
import bonaireLoungeImg from "../assets/images/bonaire-lounge.jpg";
import ibizaImg from "../assets/images/prod-ibiza4.jpg";
import mayaImg from "../assets/images/maya.jpg";
import boraBoraImg from "../assets/images/bora-bora.jpg";
import armonaImg from "../assets/images/armona.jpg";
import arubaImg from "../assets/images/aruba.jpg";
import antiguaImg from "../assets/images/antigua.jpg";
import imperiaImg from "../assets/images/imperia.jpg";
import dunbarImg from "../assets/images/dunbar.jpg";
import corsicaImg from "../assets/images/corsica.jpg";
import bonaireLoungerImg from "../assets/images/bonaire-lounger.jpg";
import creteLoungerImg from "../assets/images/crete-lounger.jpg";
import fijiImg from "../assets/images/fiji.jpg";
import doubleSunloungerImg from "../assets/images/prod-double-sunlounger.jpg";
import hawaiiImg from "../assets/images/hawaii.jpg";
import bermudaImg from "../assets/images/bermuda.jpg";
import bernImg from "../assets/images/bern.jpg";
import coffeeTableImg from "../assets/images/prod-coffee-table.jpg";
import lagosImg from "../assets/images/lagos.jpg";
import luandaImg from "../assets/images/luanda.jpg";
import barcelonaImg from "../assets/images/barcelona.jpg";
import armchairImg from "../assets/images/prod-armchair.jpg";
import glatzBioclimaticImg from "../assets/images/glatz-bioclimatic.jpg";
import glatzRetractableImg from "../assets/images/glatz-retractable.jpg";
import shadeBioclimaticImg from "../assets/images/shade-bioclimatic.jpg";
const placeholderImg = "/placeholder.svg";

function CardCarousel({ images, alt, imgStyle }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  return (
    <div style={{position:"relative",width:"100%",height:"100%"}}>
      {images.map((src, i) => (
        <img key={i} src={src} alt={`${alt} ${i+1}`}
          style={{...imgStyle, position:"absolute",inset:0,width:"100%",height:"100%",opacity:idx===i?1:0,transition:"opacity 0.5s ease"}} />
      ))}
      {total > 1 && (
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",display:"flex",gap:6,zIndex:4}}
          onClick={e => e.stopPropagation()}>
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{width:idx===i?18:6,height:6,borderRadius:3,border:"none",padding:0,cursor:"pointer",
                background:idx===i?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.4)",
                transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)"}} />
          ))}
        </div>
      )}
      {total > 1 && (
        <>
          <button onClick={e=>{e.stopPropagation();setIdx(prev=>(prev-1+total)%total)}}
            style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",zIndex:4,background:"rgba(255,255,255,0.7)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>‹</button>
          <button onClick={e=>{e.stopPropagation();setIdx(prev=>(prev+1)%total)}}
            style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",zIndex:4,background:"rgba(255,255,255,0.7)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>›</button>
        </>
      )}
    </div>
  );
}

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const PRODUCTS_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const currentLang = getLangFromPath(location.pathname);
  const [activeCategory, setActiveCategory] = useState(catParam || "all");
  const [activeKitchenCollection, setActiveKitchenCollection] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(catParam || "all");
    setActiveKitchenCollection(null);
  }, [catParam]);

  const categories = [
    { key: "all", label: "All", count: 157 },
    { key: "lounge", label: "Lounge", count: 18 },
    { key: "dining", label: "Dining", count: 14 },
    { key: "sunlounger", label: "Sun Loungers", count: 8 },
    { key: "daybed", label: "Day Beds", count: 4 },
    { key: "coffee", label: "Coffee Tables", count: 10 },
    { key: "side", label: "Side Tables", count: 6 },
    { key: "bar", label: "Bar & Patio", count: 8 },
    { key: "puffs", label: "Puffs", count: 8 },
    { key: "shade", label: "Shade", count: 24 },
    { key: "kitchen", label: "Modular Kitchen", count: 53 },
    { key: "decor", label: "Decor", count: 4 },
  ];

  const allProducts = useMemo(() => [
    { id: "sicily-modular-set", name: "Sicily Modular Set", collection: "Sicily", category: "lounge", img: sicilyCornerImg, images: [sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg], tag: "Popular", desc: "A contemporary modular lounge system for generous outdoor living areas." },
    { id: "bali-lounge-set", name: "Bali Lounge Set", collection: "Bali", category: "lounge", img: baliDivanoImg, tag: "", desc: "Relaxed outdoor seating with deep cushions and a resort-inspired profile." },
    { id: "berlin-sofa-set", name: "Berlin Sofa Set", collection: "Berlin", category: "lounge", img: berlinImg, tag: "", desc: "Classic outdoor sofa proportions with a clean aluminium frame." },
    { id: "bonaire-corner-set", name: "Bonaire Corner Set", collection: "Bonaire", category: "lounge", img: bonaireLoungeImg, tag: "New", desc: "A corner lounge set made for long terrace afternoons." },
    { id: "ibiza-lounge-set", name: "Ibiza Lounge Set", collection: "Ibiza", category: "lounge", img: ibizaImg, tag: "", desc: "Contemporary lounge seating with a light visual footprint." },
    { id: "maya-sofa-set", name: "Maya Sofa Set", collection: "Maya", category: "lounge", img: mayaImg, tag: "", desc: "Soft outdoor comfort with a tailored silhouette." },
    { id: "bora-bora-sofa-set", name: "Bora Bora Sofa Set", collection: "Bora Bora", category: "lounge", img: boraBoraImg, tag: "", desc: "Premium outdoor sofa styling for poolside spaces." },
    { id: "armona-sofa-set", name: "Armona Sofa Set", collection: "Armona", category: "lounge", img: armonaImg, tag: "", desc: "A refined lounge set for compact and open patios." },
    { id: "aruba-s-lounge", name: "Aruba S Lounge", collection: "Aruba S", category: "lounge", img: arubaImg, tag: "", desc: "A relaxed lounge form with coastal character." },
    { id: "antigua-corner-set", name: "Antigua Corner Set", collection: "Antigua", category: "dining", img: antiguaImg, tag: "", desc: "Outdoor dining and lounging with a generous footprint." },
    { id: "imperia-dining-set", name: "Imperia Dining Set", collection: "Imperia", category: "dining", img: imperiaImg, tag: "", desc: "Elegant dining proportions for long alfresco lunches." },
    { id: "dunbar-dining", name: "Dunbar Dining", collection: "Dunbar", category: "dining", img: dunbarImg, tag: "", desc: "A clean dining setting for contemporary terraces." },
    { id: "corsica-dining-set", name: "Corsica Dining Set", collection: "Corsica", category: "dining", img: corsicaImg, tag: "", desc: "A durable dining collection with relaxed Mediterranean lines." },
    { id: "bonaire-sun-lounger", name: "Bonaire Sun Lounger", collection: "Bonaire", category: "sunlounger", img: bonaireLoungerImg, tag: "", desc: "Low, comfortable lounging for poolside relaxation." },
    { id: "crete-sun-lounger", name: "Crete Sun Lounger", collection: "Crete", category: "sunlounger", img: creteLoungerImg, tag: "", desc: "A sculpted lounger with an easy recline posture." },
    { id: "fiji-sun-lounger", name: "Fiji Sun Lounger", collection: "Fiji", category: "sunlounger", img: fijiImg, tag: "New", desc: "Simple, elegant sun lounging for quiet outdoor corners." },
    { id: "bali-double-sunlounger", name: "Bali Double Sunlounger", collection: "Bali", category: "sunlounger", img: doubleSunloungerImg, tag: "", desc: "A double-width lounger for shared poolside comfort." },
    { id: "hawaii-daybed", name: "Hawaii Daybed", collection: "Hawaii", category: "daybed", img: hawaiiImg, tag: "", desc: "A generous daybed for shaded outdoor retreat spaces." },
    { id: "bermuda-daybed", name: "Bermuda Daybed", collection: "Bermuda", category: "daybed", img: bermudaImg, tag: "", desc: "A soft daybed format for resort-style relaxation." },
    { id: "bern-coffee-table", name: "Bern Coffee Table", collection: "Bern", category: "coffee", img: bernImg, tag: "", desc: "A practical table with understated outdoor presence." },
    { id: "bonaire-coffee-table", name: "Bonaire Coffee Table", collection: "Bonaire", category: "coffee", img: coffeeTableImg, tag: "", desc: "A low table designed to complete the Bonaire lounge setting." },
    { id: "lagos-side-table", name: "Lagos Side Table", collection: "Lagos", category: "side", img: lagosImg, tag: "", desc: "A compact side table for drinks, books and terrace essentials." },
    { id: "luanda-bar-set", name: "Luanda Bar Set", collection: "Luanda", category: "bar", img: luandaImg, tag: "", desc: "A raised outdoor set for informal entertaining." },
    { id: "barcelona-bar-set", name: "Barcelona Bar Set", collection: "Barcelona", category: "bar", img: barcelonaImg, tag: "", desc: "A clean bar-height arrangement for patio hosting." },
    { id: "ibiza-armchair", name: "Ibiza Armchair", collection: "Ibiza", category: "puffs", img: armchairImg, tag: "", desc: "An individual seat with relaxed outdoor proportions." },
    ...glatzProducts,
    { id: "bioclimatic-pergola", name: "Bioclimatic Pergola", collection: "Pergolas", category: "shade", img: glatzBioclimaticImg, tag: "", desc: "Architectural shade with adjustable climate control." },
    { id: "retractable-pergola", name: "Retractable Pergola", collection: "Pergolas", category: "shade", img: glatzRetractableImg, tag: "", desc: "Flexible roof coverage for changing Algarve weather." },
    { id: "free-standing-pergola", name: "Free-Standing Pergola", collection: "Pergolas", category: "shade", img: shadeBioclimaticImg, tag: "New", desc: "A self-supporting pergola for open garden layouts." },
    ...kitchenProducts,
    { id: "outdoor-carpet-algarve", name: "Outdoor Carpet Algarve", collection: "Decor", category: "decor", img: placeholderImg, tag: "", desc: "A soft finishing layer for outdoor living zones." },
    { id: "garden-vase-collection", name: "Garden Vase Collection", collection: "Decor", category: "decor", img: placeholderImg, tag: "", desc: "Decorative vessels for terraces and garden rooms." },
    { id: "led-garden-lighting", name: "LED Garden Lighting", collection: "Decor", category: "decor", img: placeholderImg, tag: "New", desc: "Low-profile lighting for evening outdoor atmosphere." },
    { id: "outdoor-sound-system", name: "Outdoor Sound System", collection: "Leisure", category: "decor", img: placeholderImg, tag: "", desc: "Integrated outdoor sound for leisure and entertaining." },
  ], []);

  const kitchenCollections = kitchenCollectionMeta.map((collection) => ({
    ...collection,
    count: kitchenProducts.filter((product) => product.collection === collection.key).length,
  }));

  const selectedCategory = categories.find((category) => category.key === activeCategory) || categories[0];
  const selectedKitchenCollection = kitchenCollections.find((collection) => collection.key === activeKitchenCollection);
  const isKitchenCategory = activeCategory === "kitchen";

  const filteredProducts = useMemo(() => {
    const base = isKitchenCategory
      ? activeKitchenCollection
        ? kitchenProducts.filter((product) => product.collection === activeKitchenCollection)
        : []
      : activeCategory === "all"
        ? allProducts
        : allProducts.filter((product) => product.category === activeCategory);

    return [...base].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "collection") return (a.collectionName || a.collection).localeCompare(b.collectionName || b.collection);
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
    });
  }, [activeCategory, activeKitchenCollection, allProducts, isKitchenCategory, sortBy]);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const goTo = (path, state) => navigate(withLang(path, currentLang), state ? { state } : undefined);

  const selectCategory = (key) => {
    setActiveCategory(key);
    setActiveKitchenCollection(null);
    setMobileFiltersOpen(false);
  };

  const heroImage = isKitchenCategory ? kitchenHeroImg : furnitureSeriesImg;
  const heroTitle = isKitchenCategory ? "Modular Kitchen" : activeCategory === "shade" ? "Shade Solutions" : "Furniture Series";
  const heroCopy = isKitchenCategory
    ? "Explore Draco Grills modular outdoor kitchens across Black Stainless Steel, Carbon Line Teak and Teak collections."
    : activeCategory === "shade"
      ? "Discover elegant shade solutions for green Algarve gardens, terraces and outdoor rooms."
      : "Browse luxury outdoor furniture, shade and decor pieces selected for the Algarve lifestyle.";

  const filterMarkup = (
    <div className="rd-filter-list">
      {categories.map((category) => (
        <button key={category.key} type="button" className={`rd-filter-btn ${activeCategory === category.key ? "active" : ""}`} onClick={() => selectCategory(category.key)}>
          <span>{category.label}</span>
          <span>{category.count}</span>
        </button>
      ))}
    </div>
  );

  return (
    <Layout>
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={heroImage} alt="" />
        <div className="rd-hero-inner">
          <span className="rd-kicker fs">Products / {selectedCategory.label}</span>
          <h1 className="rd-title ff">{heroTitle}</h1>
          <p className="rd-lede fs">{heroCopy}</p>
        </div>
      </section>

      <div className="rd-sheet-overlay open" hidden={!mobileFiltersOpen} onClick={() => setMobileFiltersOpen(false)} />
      <div className={`rd-mobile-sheet ${mobileFiltersOpen ? "open" : ""}`}>
        <div className="rd-filter-title">
          <span className="fs sl">Filters</span>
          <button type="button" className="rd-back-link" onClick={() => setMobileFiltersOpen(false)}>Close</button>
        </div>
        {filterMarkup}
      </div>

      <main className="rd-products-layout">
        <aside className="rd-filter-sidebar">
          <div className="rd-filter-title">
            <span className="fs sl">Filter</span>
            <span className="fs rd-count">{selectedCategory.count}</span>
          </div>
          {filterMarkup}
        </aside>

        <section>
          <div className="rd-products-toolbar">
            <div>
              <span className="rd-kicker fs">{selectedKitchenCollection ? selectedKitchenCollection.label : selectedCategory.label}</span>
              <p className="rd-count fs">
                {isKitchenCategory && !activeKitchenCollection ? "Choose a kitchen collection" : `${filteredProducts.length} products shown`}
              </p>
            </div>
            <div className="rd-toolbar-actions">
              <button type="button" className="cb cd rd-mobile-filter-trigger" onClick={() => setMobileFiltersOpen(true)}>Filters</button>
              {isKitchenCategory && activeKitchenCollection && (
                <button type="button" className="rd-back-link" onClick={() => setActiveKitchenCollection(null)}>Back to collections</button>
              )}
              <select className="rd-select fs" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="collection">Collection</option>
              </select>
              <div className="rd-view-toggle" aria-label="View mode">
                <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Grid view">▦</button>
                <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="List view">☰</button>
              </div>
            </div>
          </div>

          {isKitchenCategory && !activeKitchenCollection ? (
            <div className="rd-collection-choice">
              {kitchenCollections.map((collection) => (
                <button key={collection.key} type="button" className="rd-collection-choice-card" onClick={() => setActiveKitchenCollection(collection.key)}>
                  <img src={collection.image} alt={collection.label} />
                  <div>
                    <span className="rd-kicker fs" style={{ color: "var(--gold-l)" }}>{collection.count} products</span>
                    <h3 className="ff">{collection.label}</h3>
                    <p className="fs">{collection.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="rd-product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id || product.name} className="rd-product-card" onClick={() => goTo(productRoute(product), { product })}>
                  <div className="rd-product-media">
                    {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`}>{product.tag}</span>}
                    <FavoriteButton
                      product={{ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: product.img, category: product.category, route: productRoute(product) }}
                      size={16}
                      style={{ position: "absolute", top: 12, right: 12 }}
                    />
                    {product.images?.length > 1
                      ? <CardCarousel images={product.images} alt={product.name} imgStyle={product.id==="sicily-modular-set"?{objectFit:"contain",objectPosition:"center",background:"var(--cream-w)",transform:"scale(1.25)",transformOrigin:"center center"}:undefined} />
                      : <img src={product.img} alt={product.name} style={product.id?.startsWith("glatz-") ? {objectFit:"contain",padding:"16px",background:"var(--cream-w)"} : undefined} />
                    }
                    <div className="rd-product-overlay">
                      <span className="rd-overlay-pill fs">View details</span>
                      <span className="rd-overlay-pill fs">Add to favorites</span>
                    </div>
                  </div>
                  <div className="rd-product-info">
                    <h3 className="ff">{product.name}</h3>
                    {product.desc && <p className="fs">{product.desc}</p>}
                    <div className="rd-product-meta fs">
                      <span>{product.collectionName || product.collection}</span>
                      <span>View</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rd-product-list">
              {filteredProducts.map((product) => (
                <article key={product.id || product.name} className="rd-product-row" onClick={() => goTo(productRoute(product), { product })}>
                  <img src={product.img} alt={product.name} />
                  <div>
                    <span className="rd-kicker fs">{product.collectionName || product.collection}</span>
                    <h3 className="ff">{product.name}</h3>
                    {product.desc && <p className="rd-lede fs">{product.desc}</p>}
                  </div>
                  <FavoriteButton
                    product={{ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: product.img, category: product.category, route: productRoute(product) }}
                    size={16}
                  />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default PRODUCTS_PAGE;
