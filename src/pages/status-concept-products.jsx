import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import CompareButton from "../CompareButton";
import { glatzProducts } from "../data/glatzProducts";
import { kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.webp";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.webp";
import sicilyModularSetFullImg from "../assets/images/sicily-modular-set-full.webp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";

const shadeHeroImg = "/product-images/glatz/ambiente-nova/01.webp";
const shadeChipImg = "/product-images/glatz/sombrano-s-plus/05.webp";

function CardCarousel({ images, alt }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;
  return (
    <div style={{position:"relative",width:"100%",height:"100%"}}>
      {images.map((src, i) => (
        <img key={i} src={src} alt={i === 0 ? alt : ""} loading="lazy" decoding="async"
          style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:idx===i?1:0,transition:"opacity 0.5s ease"}} />
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

  const validCategories = ["all", "lounge", "dining", "sunlounger", "shade", "kitchen"];
  const categoryAliases = { daybed: "sunlounger", coffee: "dining", side: "dining", bar: "lounge", puffs: "lounge" };

  useEffect(() => {
    const resolved = categoryAliases[catParam] || catParam;
    setActiveCategory(validCategories.includes(resolved) ? resolved : "all");
    setActiveKitchenCollection(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  const catalogImg = (category) => catalogProducts.find((product) => product.category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "all", label: "All", chip: furnitureSeriesImg, banner: furnitureSeriesImg, bannerPosition: "center 40%", title: "All Products", copy: "Browse luxury outdoor furniture, shade and kitchen pieces selected for the Algarve lifestyle." },
    { key: "lounge", label: "Lounge", chip: sicilyCornerImg, banner: sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: catalogImg("dining"), banner: catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
    { key: "sunlounger", label: "Sun Loungers", chip: catalogImg("sunlounger"), banner: catalogImg("sunlounger"), title: "Sun Loungers & Day Beds", copy: "Poolside loungers and day beds built for Algarve summers." },
    { key: "shade", label: "Shade", chip: shadeChipImg, banner: shadeHeroImg, bannerPosition: "center 28%", title: "Shade Solutions", copy: "Glatz parasols, bioclimatic pergolas and retractable systems for gardens, terraces and outdoor rooms." },
    { key: "kitchen", label: "Modular Kitchen", chip: kitchenHeroImg, banner: kitchenHeroImg, title: "Modular Kitchen", copy: "Explore Draco Grills and Bull modular outdoor kitchens, from full islands to single components." },
  ];

  const allProducts = useMemo(() => [
    { id: "sicily-modular-set", name: "Sicily Modular Set", collection: "Sicily", category: "lounge", img: sicilyModularSetFullImg, images: [sicilyModularSetFullImg, sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg], tag: "Popular", desc: "A contemporary modular lounge system for generous outdoor living areas." },
    ...glatzProducts,
    ...kitchenProducts,
    ...catalogProducts.filter((product) => product.category !== "kitchen"),
  ], []);

  const bullKitchenProducts = useMemo(() => catalogProducts.filter((product) => product.category === "kitchen"), []);

  const kitchenCollections = [
    ...kitchenCollectionMeta.map((collection) => ({
      ...collection,
      count: kitchenProducts.filter((product) => product.collection === collection.key).length,
    })),
    {
      key: "bull",
      label: "Bull",
      sourceCollection: "Bull",
      image: bullKitchenProducts.find((product) => product.images.length >= 4)?.img || bullKitchenProducts[0]?.img,
      description: "American-built Bull outdoor kitchen islands, BBQ carts, components and pizza ovens.",
      count: bullKitchenProducts.length,
    },
  ];

  const selectedCategory = categories.find((category) => category.key === activeCategory) || categories[0];
  const selectedKitchenCollection = kitchenCollections.find((collection) => collection.key === activeKitchenCollection);
  const isKitchenCategory = activeCategory === "kitchen";

  const filteredProducts = useMemo(() => {
    const base = isKitchenCategory
      ? activeKitchenCollection
        ? activeKitchenCollection === "bull"
          ? bullKitchenProducts
          : kitchenProducts.filter((product) => product.collection === activeKitchenCollection)
        : []
      : activeCategory === "all"
        ? allProducts
        : allProducts.filter((product) => product.category === activeCategory);

    return [...base].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "collection") return (a.collectionName || a.collection).localeCompare(b.collectionName || b.collection);
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
    });
  }, [activeCategory, activeKitchenCollection, allProducts, bullKitchenProducts, isKitchenCategory, sortBy]);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const favPayload = (product) => ({ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: product.img, category: product.category, route: productRoute(product) });
  const comparePayload = (product) => ({ id: product.id || slug(product.name), name: product.name, img: product.img, category: product.category, categoryLabel: product.categoryLabel, collection: product.collection, collectionName: product.collectionName || product.collection, supplier: product.supplier, sku: product.sku || product.specs?.sku, desc: product.desc || product.tagline, route: productRoute(product) });
  const goTo = (path, state) => navigate(withLang(path, currentLang), state ? { state } : undefined);

  const scrollToProducts = () => {
    const layout = document.querySelector(".rd-products-layout");
    if (!layout) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 104;
    const target = layout.getBoundingClientRect().top + window.scrollY - headerH - 12;
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: "smooth" });
  };

  const selectCategory = (key) => {
    setActiveCategory(key);
    setActiveKitchenCollection(null);
    scrollToProducts();
  };

  const selectKitchenCollection = (key) => {
    setActiveKitchenCollection(key);
    scrollToProducts();
  };

  const filterMarkup = (
    <div className="cat-strip">
      {categories.map((category) => (
        <button key={category.key} type="button" className={`cat-chip ${activeCategory === category.key ? "active" : ""}`} aria-pressed={activeCategory === category.key} onClick={() => selectCategory(category.key)}>
          <span className="cat-chip-img">
            <img src={category.chip} alt="" loading="lazy" />
          </span>
          <span className="lbl">{category.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <Layout>
      <section className="prod-banner">
        <img src={selectedCategory.banner} alt="" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
        <div className="prod-banner-inner">
          <span className="rd-kicker fs">Products / {selectedCategory.label}</span>
          <h1 className="ff">{selectedCategory.title}</h1>
          <p className="fs">{selectedCategory.copy}</p>
        </div>
      </section>

      <main className="rd-products-layout">
        {activeCategory === "all" && filterMarkup}

        <section>
          {activeCategory !== "all" && (
            <button type="button" className="rd-back-to-cats" onClick={() => selectCategory("all")}>
              ← All Categories
            </button>
          )}
          <div className="rd-products-toolbar">
            <div>
              <span className="rd-kicker fs">{selectedKitchenCollection ? selectedKitchenCollection.label : selectedCategory.label}</span>
              <p className="rd-count fs">
                {isKitchenCategory && !activeKitchenCollection ? "Choose a kitchen collection" : `${filteredProducts.length} products shown`}
              </p>
            </div>
            <div className="rd-toolbar-actions">
              {isKitchenCategory && activeKitchenCollection && (
                <button type="button" className="rd-back-link" onClick={() => setActiveKitchenCollection(null)}>Back to collections</button>
              )}
              <select className="rd-select fs" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="collection">Collection</option>
              </select>
              <div className="rd-view-toggle" role="group" aria-label="View mode">
                <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Grid view" aria-pressed={viewMode === "grid"}>▦</button>
                <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="List view" aria-pressed={viewMode === "list"}>☰</button>
              </div>
            </div>
          </div>

          {isKitchenCategory && !activeKitchenCollection ? (
            <div className="rd-collection-choice rows">
              {kitchenCollections.map((collection) => (
                <button key={collection.key} type="button" className="rd-collection-choice-card" onClick={() => selectKitchenCollection(collection.key)}>
                  <img src={collection.image} alt={collection.label} />
                  <div>
                    <span className="rd-kicker fs">Collection</span>
                    <h3 className="ff">{collection.label}</h3>
                    <p className="fs">{collection.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rd-empty-state fs" style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-grey)" }}>
              No pieces in this collection yet. Browse all products or contact the showroom.
            </div>
          ) : viewMode === "grid" ? (
            <div className="rd-product-grid editorial">
              {filteredProducts.map((product, index) => (
                <article key={product.id || product.name} className={`rd-product-card ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.category === "shade" && !product.fit ? "shade-product" : ""} ${product.fit === "contain" ? "studio-product" : ""} ${product.fit === "wide" ? "wide-product" : ""} ${product.id === "sicily-modular-set" ? "contain-media" : ""} ${product.category !== "kitchen" && product.category !== "shade" && product.fit !== "contain" && index === 0 && filteredProducts.length >= 5 ? "featured" : ""}`} role="link" tabIndex={0} aria-label={`View ${product.name}`} onClick={() => goTo(productRoute(product), { product })} onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); goTo(productRoute(product), { product }); } }}>
                  <div className="rd-product-media">
                    {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`}>{product.tag}</span>}
                    <FavoriteButton
                      product={favPayload(product)}
                      size={16}
                      style={{ position: "absolute", top: 12, right: 12 }}
                    />
                    <CompareButton
                      product={comparePayload(product)}
                      size={16}
                      style={{ position: "absolute", top: 52, right: 12 }}
                    />
                    {product.images?.length > 1
                      ? <CardCarousel images={product.images} alt={product.name} />
                      : <img src={product.img} alt={product.name} loading="lazy" decoding="async" />
                    }
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
                <article key={product.id || product.name} className={`rd-product-row ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.fit === "contain" ? "studio-product" : ""}`} role="link" tabIndex={0} aria-label={`View ${product.name}`} onClick={() => goTo(productRoute(product), { product })} onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); goTo(productRoute(product), { product }); } }}>
                  <img src={product.img} alt={product.name} loading="lazy" decoding="async" />
                  <div>
                    <span className="rd-kicker fs">{product.collectionName || product.collection}</span>
                    <h3 className="ff">{product.name}</h3>
                    {product.desc && <p className="rd-lede fs">{product.desc}</p>}
                  </div>
                  <FavoriteButton
                    product={favPayload(product)}
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
