import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import { glatzProducts } from "../data/glatzProducts";
import { kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { noImageProducts } from "../data/productImageStatus";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.webp";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.webp";
import sicilyModularSetFullImg from "../assets/images/sicily-modular-set-full.webp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";

const shadeHeroImg = "/product-images/glatz/ambiente-nova/01.webp";
const shadeChipImg = "/product-images/glatz/sombrano-s-plus/05.webp";

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Kitchen products always keep their image (exception); everything else falls
// back to a "No image" placeholder when it has no clean white-background shot.
const productHasImage = (product) => product.category === "kitchen" || !noImageProducts.has(product.id);

// Auto-advancing category carousel — slides right-to-left one tile every 5s, looping.
// Fully responsive via CSS container-query units: tile width is a fraction of the
// carousel (4/3/2/1 tiles by size), so nothing is ever cut off and the page never
// overflows. Each tile is exactly 1/items of the track, so one step = a fixed %.
function CategoryCarousel({ categories, onOpen }) {
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false); // explicit pause (WCAG 2.2.2)
  const [hovered, setHovered] = useState(false); // pause while the pointer is over it
  const items = [...categories, ...categories]; // duplicated for a seamless loop
  const stepPct = 100 / items.length; // one tile as a percentage of the whole track

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // At the duplicate seam: let the slide finish, then jump back to the start instantly.
    if (idx === categories.length) {
      const t = setTimeout(() => { setAnimate(false); setIdx(0); }, 700);
      return () => clearTimeout(t);
    }
    // Just after the instant jump: re-enable the sliding transition.
    if (!animate) {
      const t = setTimeout(() => setAnimate(true), 20);
      return () => clearTimeout(t);
    }
    // Don't schedule the next advance while paused or hovered.
    if (paused || hovered) return;
    // Normal cadence: advance one tile every 5s.
    const t = setTimeout(() => setIdx((i) => i + 1), 5000);
    return () => clearTimeout(t);
  }, [idx, animate, categories.length, paused, hovered]);

  return (
    <div
      className="cat-carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false); }}
    >
      <div
        className="cat-carousel-track"
        style={{
          transform: `translateX(-${idx * stepPct}%)`,
          transition: animate ? "transform .7s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        {items.map((category, i) => (
          <button key={`${category.key}-${i}`} type="button" className="cat-chip" aria-label={category.title} onClick={() => onOpen(category.key)}>
            <span className="cat-chip-img">
              <img src={category.chip} alt="" loading="lazy" />
            </span>
            <span className="lbl">{category.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="cat-carousel-toggle fs"
        aria-label={paused ? "Play category slideshow" : "Pause category slideshow"}
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? "▶" : "❚❚"}
      </button>
    </div>
  );
}

// "No image" placeholder — a quiet brand panel (serif monogram) rather than an apology.
function NoImagePlaceholder({ list }) {
  return (
    <div className={`rd-no-image${list ? " list" : ""}`}>
      <span className="rd-no-image-mark" aria-hidden="true">S</span>
      <span className="rd-no-image-label">See it in the showroom</span>
    </div>
  );
}

const PRODUCTS_PAGE = () => {
  useNavLinks();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const currentLang = getLangFromPath(location.pathname);
  const [activeCategory, setActiveCategory] = useState(null); // null = category landing
  const [activeKitchenCollection, setActiveKitchenCollection] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");

  const validCategories = ["lounge", "dining", "sunlounger", "shade", "kitchen"];
  const categoryAliases = { daybed: "sunlounger", coffee: "dining", side: "dining", bar: "lounge", puffs: "lounge" };

  useEffect(() => {
    const resolved = categoryAliases[catParam] || catParam;
    const isValid = validCategories.includes(resolved);
    setActiveCategory(isValid ? resolved : null);
    setActiveKitchenCollection(resolved === "kitchen" ? (kitchenCollectionMeta[0]?.key || null) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  const catalogImg = (category) => catalogProducts.find((product) => product.category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "lounge", label: "Lounge", chip: sicilyCornerImg, banner: sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: catalogImg("dining"), banner: catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
    { key: "sunlounger", label: "Sun Loungers", chip: catalogImg("sunlounger"), banner: catalogImg("sunlounger"), title: "Sun Loungers & Day Beds", copy: "Poolside loungers and day beds built for Algarve summers." },
    { key: "shade", label: "Shade", chip: shadeChipImg, banner: shadeHeroImg, bannerPosition: "center 28%", title: "Shade Solutions", copy: "Glatz parasols, bioclimatic pergolas and retractable systems for gardens, terraces and outdoor rooms." },
    { key: "kitchen", label: "Modular Kitchen", chip: kitchenHeroImg, banner: kitchenHeroImg, title: "Modular Kitchen", copy: "Draco Grills modular outdoor kitchens in Black Stainless Steel, Carbon Line Teak and natural Teak." },
  ];

  const allProducts = useMemo(() => [
    { id: "sicily-modular-set", name: "Sicily Modular Set", collection: "Sicily", category: "lounge", categoryLabel: "Lounge", img: sicilyModularSetFullImg, images: [sicilyModularSetFullImg, sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg], tag: "Popular", desc: "A contemporary modular lounge system for generous outdoor living areas." },
    ...glatzProducts,
    ...kitchenProducts,
    ...catalogProducts.filter((product) => product.category !== "kitchen"),
  ], []);

  const kitchenCollections = kitchenCollectionMeta.map((collection) => ({
    ...collection,
    count: kitchenProducts.filter((product) => product.collection === collection.key).length,
  }));

  const isLanding = !activeCategory;
  const selectedCategory = categories.find((category) => category.key === activeCategory);
  const isKitchenCategory = activeCategory === "kitchen";

  const filteredProducts = useMemo(() => {
    if (!activeCategory) return [];
    const base = activeCategory === "kitchen"
      ? kitchenProducts.filter((product) => product.collection === activeKitchenCollection)
      : allProducts.filter((product) => product.category === activeCategory);

    return [...base].sort((a, b) => {
      // Products without a clean white-bg image always sink to the bottom.
      const ai = productHasImage(a) ? 0 : 1;
      const bi = productHasImage(b) ? 0 : 1;
      if (ai !== bi) return ai - bi;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
    });
  }, [activeCategory, activeKitchenCollection, allProducts, sortBy]);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const favPayload = (product) => ({ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: product.img, category: product.category, route: productRoute(product) });
  const goTo = (path, state) => navigate(withLang(path, currentLang), state ? { state } : undefined);

  const scrollToProducts = () => {
    const layout = document.querySelector(".rd-products-layout");
    if (!layout) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 104;
    const target = layout.getBoundingClientRect().top + window.scrollY - headerH - 12;
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: "smooth" });
  };

  const openCategory = (key) => goTo(`/products?cat=${key}`);
  const backToLanding = () => goTo(`/products`);
  const selectKitchenCollection = (key) => { setActiveKitchenCollection(key); scrollToProducts(); };

  const categoryLabelOf = (product) => product.categoryLabel || categories.find((category) => category.key === product.category)?.label || "Outdoor living";
  const hasImage = productHasImage;
  const activeRange = kitchenCollections.find((collection) => collection.key === activeKitchenCollection);

  return (
    <Layout>
      {isLanding ? (
        <>
          <section className="prod-banner">
            <img src={furnitureSeriesImg} alt="" style={{ objectPosition: "center 40%" }} />
          </section>
          <div className="rd-page-head">
            <span className="rd-kicker fs">Products</span>
            <h1 className="rd-title ff">Products</h1>
            <p className="rd-lede fs">Explore each outdoor category — furniture, shade and kitchens — selected for the Algarve lifestyle.</p>
          </div>
          <main className="rd-products-layout">
            <CategoryCarousel categories={categories} onOpen={openCategory} />
          </main>
        </>
      ) : (
        <>
          <section className="prod-banner">
            <img src={selectedCategory.banner} alt="" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
          </section>
          <div className="rd-page-head">
            <button type="button" className="rd-back-to-cats" onClick={backToLanding}>
              <span aria-hidden="true">←</span> Products
            </button>
            <span className="rd-kicker fs">Products / {selectedCategory.label}</span>
            <h1 className="rd-title ff">{selectedCategory.title}</h1>
            <p className="rd-lede fs">{selectedCategory.copy}</p>
          </div>

          <main className="rd-products-layout">
            <section>
              {isKitchenCategory && (
                <div className="rd-range-strip" role="group" aria-label="Kitchen ranges">
                  {kitchenCollections.map((collection) => (
                    <button key={collection.key} type="button" className={`rd-range-chip ${activeKitchenCollection === collection.key ? "active" : ""}`} aria-pressed={activeKitchenCollection === collection.key} onClick={() => selectKitchenCollection(collection.key)}>
                      {collection.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="rd-products-toolbar">
                <div>
                  <span className="rd-kicker fs">{isKitchenCategory ? activeRange?.label : selectedCategory.label}</span>
                  <p className="rd-count fs">{filteredProducts.length} products shown</p>
                </div>
                <div className="rd-toolbar-actions">
                  <select className="rd-select fs" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="name">Name</option>
                  </select>
                  <div className="rd-view-toggle" role="group" aria-label="View mode">
                    <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Grid view" aria-pressed={viewMode === "grid"}>▦</button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label="List view" aria-pressed={viewMode === "list"}>☰</button>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="rd-empty-state fs" style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-grey)" }}>
                  No pieces in this category yet. Contact the showroom.
                </div>
              ) : viewMode === "grid" ? (
                <div className="rd-product-grid editorial">
                  {filteredProducts.map((product) => (
                    <article key={product.id || product.name} className={`rd-product-card ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.category === "shade" && !product.fit ? "shade-product" : ""} ${product.fit === "contain" ? "studio-product" : ""} ${product.fit === "wide" ? "wide-product" : ""} ${product.id === "sicily-modular-set" ? "contain-media" : ""}`} role="link" tabIndex={0} aria-label={`View ${product.name}`} onClick={() => goTo(productRoute(product), { product })} onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); goTo(productRoute(product), { product }); } }}>
                      <div className="rd-product-media">
                        <FavoriteButton
                          product={favPayload(product)}
                          size={16}
                          style={{ position: "absolute", top: 12, right: 12 }}
                        />
                        {hasImage(product)
                          ? <img src={product.img} alt={product.name} loading="lazy" decoding="async" />
                          : <NoImagePlaceholder />}
                      </div>
                      <div className="rd-product-info">
                        <span className="rd-product-cat fs">{categoryLabelOf(product)}</span>
                        <h3 className="ff">{product.name}</h3>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rd-product-list">
                  {filteredProducts.map((product) => (
                    <article key={product.id || product.name} className={`rd-product-row ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.fit === "contain" ? "studio-product" : ""}`} role="link" tabIndex={0} aria-label={`View ${product.name}`} onClick={() => goTo(productRoute(product), { product })} onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "Enter" || e.key === " ") { if (e.key === " ") e.preventDefault(); goTo(productRoute(product), { product }); } }}>
                      {hasImage(product)
                        ? <img src={product.img} alt={product.name} loading="lazy" decoding="async" />
                        : <NoImagePlaceholder list />}
                      <div>
                        <span className="rd-kicker fs">{categoryLabelOf(product)}</span>
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
        </>
      )}
    </Layout>
  );
};

export default PRODUCTS_PAGE;
