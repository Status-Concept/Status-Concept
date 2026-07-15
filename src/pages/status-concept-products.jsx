import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import NoImagePlaceholder from "../components/NoImagePlaceholder";
import FavoriteButton from "../FavoriteButton";
import { productSrcSet } from "../utils/imageVariants";
import { kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { allProducts } from "../data/productCatalog";
import { noImageProducts } from "../data/productImageStatus";
import { searchProducts } from "../utils/productSearch";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.webp";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.webp";
import sicilyModularSetFullImg from "../assets/images/sicily-modular-set-full.webp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";

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

const PRODUCTS_PAGE = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const queryParam = searchParams.get("q")?.trim() || "";
  const currentLang = getLangFromPath(location.pathname);
  const [activeCategory, setActiveCategory] = useState(null); // null = category landing
  const [activeKitchenCollection, setActiveKitchenCollection] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchInput, setSearchInput] = useState(queryParam);

  const validCategories = ["lounge", "dining", "sunlounger", "shade", "kitchen"];
  const categoryAliases = { daybed: "sunlounger", coffee: "dining", side: "dining", bar: "lounge", puffs: "lounge" };

  useEffect(() => {
    const resolved = categoryAliases[catParam] || catParam;
    const isValid = validCategories.includes(resolved);
    setActiveCategory(isValid ? resolved : null);
    setActiveKitchenCollection(resolved === "kitchen" ? (kitchenCollectionMeta[0]?.key || null) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const catalogImg = (category) => catalogProducts.find((product) => product.category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "lounge", label: "Lounge", chip: sicilyCornerImg, banner: sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: catalogImg("dining"), banner: catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
    { key: "sunlounger", label: "Sun Loungers", chip: catalogImg("sunlounger"), banner: catalogImg("sunlounger"), title: "Sun Loungers & Day Beds", copy: "Poolside loungers and day beds built for Algarve summers." },
    { key: "shade", label: "Shade", chip: shadeChipImg, banner: shadeHeroImg, bannerPosition: "center 28%", title: "Shade Solutions", copy: "Glatz parasols, bioclimatic pergolas and retractable systems for gardens, terraces and outdoor rooms." },
    { key: "kitchen", label: "Modular Kitchen", chip: kitchenHeroImg, banner: kitchenHeroImg, title: "Modular Kitchen", copy: "Draco Grills modular outdoor kitchens in Black Stainless Steel, Carbon Line Teak and natural Teak." },
  ];

  const kitchenCollections = kitchenCollectionMeta.map((collection) => ({
    ...collection,
    count: kitchenProducts.filter((product) => product.collection === collection.key).length,
  }));

  const hasSearch = Boolean(queryParam);
  const isLanding = !activeCategory && !hasSearch;
  const selectedCategory = categories.find((category) => category.key === activeCategory);
  const isKitchenCategory = activeCategory === "kitchen";
  const searchMatches = useMemo(() => searchProducts(allProducts, queryParam), [queryParam]);

  const filteredProducts = useMemo(() => {
    if (hasSearch) {
      const scoped = activeCategory
        ? searchMatches.filter((product) => product.category === activeCategory)
        : searchMatches;
      return sortBy === "name"
        ? [...scoped].sort((a, b) => a.name.localeCompare(b.name))
        : scoped;
    }

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
  }, [activeCategory, activeKitchenCollection, hasSearch, searchMatches, sortBy]);

  const searchCategoryCounts = categories.map((category) => ({
    ...category,
    count: searchMatches.filter((product) => product.category === category.key).length,
  })).filter((category) => category.count > 0);

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
  const setSearchScope = (key) => {
    const query = encodeURIComponent(queryParam);
    goTo(key ? `/products?q=${query}&cat=${key}` : `/products?q=${query}`);
  };
  const submitResultsSearch = (event) => {
    event.preventDefault();
    const cleanQuery = searchInput.trim();
    if (!cleanQuery) return;
    goTo(`/products?q=${encodeURIComponent(cleanQuery)}`);
  };

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
          {!hasSearch && (
            <section className="prod-banner">
              <img src={selectedCategory.banner} alt="" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
            </section>
          )}
          <div className={`rd-page-head ${hasSearch ? "search-head" : ""}`}>
            <button type="button" className="rd-back-to-cats" onClick={backToLanding}>
              <span aria-hidden="true">←</span> Products
            </button>
            {hasSearch ? (
              <>
                <span className="rd-kicker fs">Search</span>
                <h1 className="rd-title ff">Search results</h1>
                <p className="rd-lede fs">Explore matches across furniture, shade, kitchens, collections and materials.</p>
              </>
            ) : (
              <>
                <span className="rd-kicker fs">Products / {selectedCategory.label}</span>
                <h1 className="rd-title ff">{selectedCategory.title}</h1>
                <p className="rd-lede fs">{selectedCategory.copy}</p>
              </>
            )}
          </div>

          <main className="rd-products-layout">
            <section>
              {hasSearch && (
                <>
                  <form className="rd-results-search" role="search" onSubmit={submitResultsSearch}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none">
                      <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <label className="sr-only" htmlFor="results-search-input">{currentLang === "pt" ? "Pesquisar produtos, coleções ou materiais" : "Search products, collections or materials"}</label>
                    <input
                      id="results-search-input"
                      className="ff"
                      type="search"
                      value={searchInput}
                      autoComplete="off"
                      placeholder={currentLang === "pt" ? "Pesquisar produtos, coleções ou materiais" : "Search products, collections or materials"}
                      onChange={(event) => setSearchInput(event.target.value)}
                    />
                    <button type="submit" className="fs">Search <span aria-hidden="true">→</span></button>
                  </form>
                  <div className="rd-search-scopes" role="group" aria-label={currentLang === "pt" ? "Filtrar resultados por categoria" : "Filter search results by category"}>
                    <button type="button" className={!activeCategory ? "active" : ""} aria-pressed={!activeCategory} onClick={() => setSearchScope(null)}>
                      <span>All</span><small data-no-translate>{searchMatches.length}</small>
                    </button>
                    {searchCategoryCounts.map((category) => (
                      <button key={category.key} type="button" className={activeCategory === category.key ? "active" : ""} aria-pressed={activeCategory === category.key} onClick={() => setSearchScope(category.key)}>
                        <span>{category.label}</span><small data-no-translate>{category.count}</small>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {!hasSearch && isKitchenCategory && (
                <div className="rd-range-strip" role="group" aria-label="Kitchen ranges">
                  {kitchenCollections.map((collection) => (
                    <button key={collection.key} type="button" data-no-translate className={`rd-range-chip ${activeKitchenCollection === collection.key ? "active" : ""}`} aria-pressed={activeKitchenCollection === collection.key} onClick={() => selectKitchenCollection(collection.key)}>
                      {collection.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="rd-products-toolbar">
                <div>
                  {hasSearch ? (
                    <>
                      <span className="rd-kicker fs" data-no-translate>“{queryParam}”</span>
                      <p className="rd-count fs">{filteredProducts.length} results</p>
                    </>
                  ) : (
                    <>
                      <span className="rd-kicker fs">{isKitchenCategory ? activeRange?.label : selectedCategory.label}</span>
                      <p className="rd-count fs">{filteredProducts.length} products shown</p>
                    </>
                  )}
                </div>
                <div className="rd-toolbar-actions">
                  <select className="rd-select fs" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                    <option value="featured">{hasSearch ? "Relevance" : "Featured"}</option>
                    <option value="name">Name</option>
                  </select>
                  <div className="rd-view-toggle" role="group" aria-label={currentLang === "pt" ? "Modo de visualização" : "View mode"}>
                    <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label={currentLang === "pt" ? "Vista em grelha" : "Grid view"} aria-pressed={viewMode === "grid"}>▦</button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => setViewMode("list")} aria-label={currentLang === "pt" ? "Vista em lista" : "List view"} aria-pressed={viewMode === "list"}>☰</button>
                  </div>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                hasSearch ? (
                  <div className="rd-search-empty" role="status">
                    <span className="rd-kicker fs">No results for</span>
                    <h2 className="ff" data-no-translate>“{queryParam}”</h2>
                    <p className="fs">Try a product type, collection or material, or ask our showroom team for help.</p>
                    <div className="rd-search-empty-actions">
                      {["Modular sofas", "Parasols", "Outdoor kitchens", "Sun loungers"].map((suggestion) => (
                        <button key={suggestion} type="button" onClick={() => goTo(`/products?q=${encodeURIComponent(suggestion)}`)}>{suggestion}</button>
                      ))}
                    </div>
                    <LocalizedLink className="rd-search-empty-contact fs" to="/contact">Ask the showroom team <span aria-hidden="true">→</span></LocalizedLink>
                  </div>
                ) : (
                  <div className="rd-empty-state fs" style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-grey)" }}>
                    No pieces in this category yet. Contact the showroom.
                  </div>
                )
              ) : viewMode === "grid" ? (
                <div className="rd-product-grid editorial">
                  {filteredProducts.map((product) => (
                    <article key={product.id || product.name} className={`rd-product-card ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.category === "shade" && !product.fit ? "shade-product" : ""} ${product.fit === "contain" ? "studio-product" : ""} ${product.fit === "wide" ? "wide-product" : ""} ${product.id === "sicily-modular-set" ? "contain-media" : ""}`}>
                      <div className="rd-product-media">
                        <FavoriteButton
                          product={favPayload(product)}
                          size={16}
                          style={{ position: "absolute", top: 12, right: 12 }}
                        />
                        {hasImage(product)
                          ? <img src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 300px" alt={product.name} loading="lazy" decoding="async" />
                          : <NoImagePlaceholder />}
                      </div>
                      <div className="rd-product-info">
                        <span className="rd-product-cat fs">{categoryLabelOf(product)}</span>
                        <h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={productRoute(product)} state={{ product }}>{product.name}</LocalizedLink></h3>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rd-product-list">
                  {filteredProducts.map((product) => (
                    <article key={product.id || product.name} className={`rd-product-row ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.fit === "contain" ? "studio-product" : ""}`}>
                      {hasImage(product)
                        ? <img src={product.img} srcSet={productSrcSet(product.img)} sizes="220px" alt={product.name} loading="lazy" decoding="async" />
                        : <NoImagePlaceholder list />}
                      <div>
                        <span className="rd-kicker fs">{categoryLabelOf(product)}</span>
                        <h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={productRoute(product)} state={{ product }}>{product.name}</LocalizedLink></h3>
                        {product.desc && <p className="rd-lede fs">{product.desc}</p>}
                      </div>
                      <FavoriteButton
                        product={favPayload(product)}
                        size={16}
                        style={{ position: "relative" }}
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
