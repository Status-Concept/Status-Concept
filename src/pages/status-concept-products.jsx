import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import NoImagePlaceholder from "../components/NoImagePlaceholder";
import FavoriteButton from "../FavoriteButton";
import { productSrcSet } from "../utils/imageVariants";
import { kitchenCollectionHeroes, kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { allProducts } from "../data/productCatalog";
import { noImageProducts } from "../data/productImageStatus";
import { searchProducts } from "../utils/productSearch";
import { productCollectionLabel } from "../utils/productLabels";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.webp";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.webp";
import shadeHeroLifestyleImg from "../assets/images/enhanced/shade-glatz-realistic-hero.webp";
import topicDecorImg from "../assets/images/enhanced/topic-decor-real.webp";
import topicDecorBgImg from "../assets/images/enhanced/topic-decor-bg-ai.webp";
import sicilyModularSetFullImg from "../assets/images/sicily-modular-set-full.webp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";

const shadeChipImg = "/product-images/glatz/sombrano-s-plus/05.webp";

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const VALID_CATEGORIES = ["lounge", "dining", "sunlounger", "shade", "kitchen", "carpets", "decor", "statues"];
const CATEGORY_ALIASES = { daybed: "sunlounger", coffee: "dining", side: "dining", bar: "lounge", puffs: "lounge" };
const SUBCATEGORIES = {
  lounge: [
    { key: "upholstered", label: "Upholstered" },
    { key: "rope", label: "Rope" },
    { key: "aluminium", label: "Aluminium" },
  ],
  shade: [
    { key: "pergolas", label: "Pergolas" },
    { key: "parasols", label: "Parasols" },
    { key: "awnings", label: "Awnings" },
  ],
  kitchen: [
    { key: "modular", label: "Modular kitchens" },
    { key: "accessories", label: "Attachments & accessories" },
    { key: "bbq", label: "BBQs" },
  ],
};

const productSearchText = (product) => JSON.stringify({
  name: product.name,
  collection: product.collectionName || product.collection,
  category: product.categoryLabel || product.category,
  materials: product.materials,
  specs: product.specs,
  desc: product.desc,
  tagline: product.tagline,
  supplier: product.supplier,
  sourcePath: product.sourcePath,
  subcategories: product.subcategories,
}).toLowerCase();

export const matchesSubcategory = (product, key) => {
  if (product.subcategories?.includes(key)) return true;
  const haystack = productSearchText(product);
  const terms = {
    upholstered: ["upholster", "cushion", "fabric", "textile"],
    rope: ["rope", "cord"],
    aluminium: ["aluminium", "aluminum"],
    pergolas: ["pergola", "bioclimatic"],
    parasols: ["parasol", "shade", "glatz"],
    awnings: ["awning", "retractable"],
    modular: ["modular", "draco", "kitchen"],
    "built-in": ["built-in", "built in", "integrated"],
    accessories: ["accessor", "attachment", "sink", "drawer", "shelf"],
    bbq: ["bbq", "grill", "barbecue"],
  }[key] || [key];
  return terms.some((term) => haystack.includes(term));
};

export const filterKitchenProducts = (products, collection, subcategory) => products.filter((product) => (
  (!collection || product.collection === collection)
  && (!subcategory || matchesSubcategory(product, subcategory))
));

// Kitchen and shade products keep their supplied catalogue imagery. Their main
// shots are intentionally contextual, so the white-background classifier should
// not replace them with a showroom placeholder.
export const productHasImage = (product) => product.hasApprovedImage === true || product.category === "kitchen" || product.category === "shade" || !noImageProducts.has(product.id);

const CATEGORY_LABELS = {
  lounge: "Lounge",
  dining: "Dining",
  sunlounger: "Sun Loungers",
  shade: "Shade",
  kitchen: "Outdoor Kitchens",
  carpets: "Carpets",
  decor: "Decor",
  statues: "Statues",
};

export const productBrandLabel = (product) => product.supplier?.trim()
  || (product.category === "kitchen" ? productCollectionLabel(product) || CATEGORY_LABELS[product.category] : product.categoryLabel || CATEGORY_LABELS[product.category] || "Outdoor living");

// Auto-advancing category carousel — slides right-to-left one tile every 5s, looping.
// Fully responsive via CSS container-query units: tile width is a fraction of the
// carousel (4/3/2/1 tiles by size), so nothing is ever cut off and the page never
// overflows. Each tile is exactly 1/items of the track, so one step = a fixed %.
function CategoryCarousel({ categories, onOpen }) {
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [paused, setPaused] = useState(Boolean(prefersReducedMotion)); // explicit pause (WCAG 2.2.2)
  const [hovered, setHovered] = useState(false); // pause while the pointer is over it
  const items = [...categories, ...categories]; // duplicated for a seamless loop
  const stepPct = 100 / items.length; // one tile as a percentage of the whole track

  useEffect(() => {
    if (prefersReducedMotion) return;
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
  }, [idx, animate, categories.length, paused, hovered, prefersReducedMotion]);

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
        {items.map((category, i) => {
          const isClone = i >= categories.length;
          return (
          <button
            key={`${category.key}-${i}`}
            type="button"
            className="cat-chip"
            aria-label={category.title}
            aria-hidden={isClone || undefined}
            tabIndex={isClone ? -1 : 0}
            onClick={() => onOpen(category.key)}
          >
            <span className="cat-chip-img">
              <img src={category.chip} alt="" loading="lazy" />
            </span>
            <span className="lbl">{category.label}</span>
          </button>
          );
        })}
      </div>
      <button
        type="button"
        className="cat-carousel-toggle fs"
        aria-label={prefersReducedMotion ? "Category slideshow disabled by reduced motion preference" : (paused ? "Play category slideshow" : "Pause category slideshow")}
        aria-pressed={paused}
        disabled={prefersReducedMotion}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? (
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m9 7 8 5-8 5Z" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M8 6v12M16 6v12" /></svg>
        )}
      </button>
    </div>
  );
}

const PRODUCTS_PAGE = ({ productCatalog = allProducts, localProducts = [], categoryHeroOverrides = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const queryParam = searchParams.get("q")?.trim() || "";
  const collectionParam = searchParams.get("collection")?.trim() || "";
  const typeParam = searchParams.get("type")?.trim().toLowerCase() || "";
  const subcategoryParam = searchParams.get("subcat")?.trim().toLowerCase() || "";
  const kitchenModeParam = searchParams.get("mode")?.trim().toLowerCase() || "";
  const currentLang = getLangFromPath(location.pathname);
  const resolvedCategory = CATEGORY_ALIASES[catParam] || catParam;
  const activeCategory = VALID_CATEGORIES.includes(resolvedCategory) ? resolvedCategory : null;
  const viewMode = searchParams.get("view") === "list" ? "list" : "grid";
  const sortBy = searchParams.get("sort") === "name" ? "name" : "featured";
  const [searchInput, setSearchInput] = useState(queryParam);

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const catalogImg = (category) => catalogProducts.find((product) => product.category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "lounge", label: "Lounge", chip: sicilyCornerImg, banner: categoryHeroOverrides.lounge || sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: catalogImg("dining"), banner: categoryHeroOverrides.dining || catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
    { key: "sunlounger", label: "Sun Loungers", chip: catalogImg("sunlounger"), banner: categoryHeroOverrides.sunlounger || catalogImg("sunlounger"), title: "Sun Loungers & Day Beds", copy: "Poolside loungers and day beds built for Algarve summers." },
    { key: "shade", label: "Shade Solutions", chip: shadeChipImg, banner: categoryHeroOverrides.shade || shadeHeroLifestyleImg, bannerPosition: "center 34%", title: "Shade Solutions", copy: "Pergolas, parasols and awnings for gardens, terraces and outdoor rooms." },
    { key: "kitchen", label: "Outdoor Kitchens", chip: kitchenHeroImg, banner: categoryHeroOverrides.kitchen || kitchenHeroImg, title: "Modular Outdoor Kitchen", copy: "Modular kitchens, built-in kitchens, BBQs and the accessories that make outdoor cooking work." },
    { key: "carpets", label: "Carpets", chip: topicDecorBgImg, banner: categoryHeroOverrides.carpets || topicDecorBgImg, title: "Carpets", copy: "Outdoor rugs that bring warmth, texture and definition to an open-air room." },
    { key: "decor", label: "Decor", chip: topicDecorImg, banner: categoryHeroOverrides.decor || topicDecorImg, title: "Decor", copy: "Finishing pieces selected to give an outdoor space its character." },
    { key: "statues", label: "Statues", chip: topicDecorImg, banner: categoryHeroOverrides.statues || topicDecorImg, title: "Statues", copy: "Sculptural accents for gardens, terraces and considered outdoor settings." },
  ];

  const kitchenCollections = kitchenCollectionMeta.map((collection) => ({
    ...collection,
    count: kitchenProducts.filter((product) => product.collection === collection.key).length,
  }));
  const activeSubcategories = activeCategory ? (SUBCATEGORIES[activeCategory] || []) : [];
  const activeSubcategory = activeSubcategories.some((item) => item.key === subcategoryParam)
    ? subcategoryParam
    : "";
  const isKitchenCategory = activeCategory === "kitchen";
  const isBuiltInKitchen = isKitchenCategory && kitchenModeParam === "built-in";
  const hasLocalKitchenProducts = localProducts.some((product) => product.category === 'kitchen');
  const activeKitchenCollection = isKitchenCategory && !isBuiltInKitchen
    ? (kitchenCollections.some((collection) => collection.key === collectionParam)
        ? collectionParam
        : (hasLocalKitchenProducts ? null : (kitchenCollections[0]?.key || null)))
    : null;

  const hasSearch = Boolean(queryParam);
  const isLanding = !activeCategory && !hasSearch;
  const selectedCategory = categories.find((category) => category.key === activeCategory);
  const kitchenPageLabel = isBuiltInKitchen ? "Built-in Kitchens" : "Modular Kitchens";
  const kitchenPageTitle = isBuiltInKitchen ? "Built-in Kitchens" : selectedCategory?.title;
  const kitchenPageCopy = isBuiltInKitchen
    ? "Built-in outdoor kitchen solutions for seamless, permanent installations."
    : selectedCategory?.copy;
  const searchMatches = useMemo(() => searchProducts(productCatalog, queryParam), [productCatalog, queryParam]);

  const filteredProducts = (() => {
    if (hasSearch) {
      const scoped = activeCategory
        ? searchMatches.filter((product) => product.category === activeCategory)
        : searchMatches;
      return sortBy === "name"
        ? [...scoped].sort((a, b) => a.name.localeCompare(b.name))
        : scoped;
    }

    if (!activeCategory) return [];
    const localKitchenProducts = localProducts
      .filter((product) => product.category === 'kitchen')
      .filter((product) => !activeKitchenCollection || slug(product.collectionName || product.collection) === activeKitchenCollection)
      .filter((product) => !activeSubcategory || matchesSubcategory(product, activeSubcategory));
    let base = activeCategory === "kitchen"
      ? (isBuiltInKitchen ? [] : [
          ...filterKitchenProducts(kitchenProducts, activeKitchenCollection, activeSubcategory),
          ...localKitchenProducts,
        ])
      : productCatalog.filter((product) => product.category === activeCategory);

    if (collectionParam && activeCategory !== "kitchen") {
      base = base.filter((product) => slug(product.collectionName || product.collection) === collectionParam);
    }

    if (activeSubcategory) {
      base = base.filter((product) => matchesSubcategory(product, activeSubcategory));
    }

    if (typeParam && activeCategory !== "kitchen") {
      const needle = typeParam.replace(/-/g, " ");
      base = base.filter((product) => `${product.name} ${product.collectionName || ""}`.toLowerCase().includes(needle));
    }

    return [...base].sort((a, b) => {
      // Products without a clean white-bg image always sink to the bottom.
      const ai = productHasImage(a) ? 0 : 1;
      const bi = productHasImage(b) ? 0 : 1;
      if (ai !== bi) return ai - bi;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
    });
  })();

  const activeRefinementLabel = (() => {
    if (!activeCategory) return null;
    if (activeSubcategory) {
      return activeSubcategories.find((item) => item.key === activeSubcategory)?.label || activeSubcategory;
    }
    if (activeCategory === "kitchen") return isBuiltInKitchen ? kitchenPageLabel : null;
    if (collectionParam) {
      const match = productCatalog.find(
        (product) => product.category === activeCategory && slug(product.collectionName || product.collection) === collectionParam,
      );
      return match ? (match.collectionName || match.collection) : null;
    }
    if (typeParam) {
      return typeParam.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return null;
  })();

  const searchCategoryCounts = categories.map((category) => ({
    ...category,
    count: searchMatches.filter((product) => product.category === category.key).length,
  })).filter((category) => category.count > 0);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const favPayload = (product) => ({ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: product.img, category: product.category, route: productRoute(product) });
  const goTo = (path, state) => navigate(withLang(path, currentLang), state ? { state } : undefined);
  const updateProductQuery = (changes) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    goTo(`/products${query ? `?${query}` : ""}`);
  };

  const scrollToProducts = () => {
    const layout = document.querySelector(".rd-products-layout");
    if (!layout) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 104;
    const target = layout.getBoundingClientRect().top + window.scrollY - headerH - 12;
    if (window.scrollY > target) window.scrollTo({ top: target, behavior: "smooth" });
  };

  const openCategory = (key) => goTo(`/products?cat=${key}`);
  const backToLanding = () => goTo(`/products`);
  const selectKitchenCollection = (key) => {
    updateProductQuery({ cat: "kitchen", mode: null, collection: key, subcat: null, type: null });
    requestAnimationFrame(scrollToProducts);
  };
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

  const hasImage = productHasImage;
  const activeRange = kitchenCollections.find((collection) => collection.key === activeKitchenCollection);
  const activeBanner = isKitchenCategory && activeKitchenCollection
    ? (kitchenCollectionHeroes[activeKitchenCollection] || selectedCategory.banner)
    : selectedCategory?.banner;

  return (
    <Layout>
      {isLanding ? (
        <>
          <section className="prod-banner">
            <img src={furnitureSeriesImg} alt="" decoding="async" fetchPriority="high" style={{ objectPosition: "center 40%" }} />
          </section>
          <div className="rd-page-head">
            <span className="rd-kicker fs">Products</span>
            <h1 className="rd-title ff">Products</h1>
            <p className="rd-lede fs">Explore furniture, shade and outdoor kitchens selected for the Algarve lifestyle.</p>
          </div>
          <main className="rd-products-layout">
            <CategoryCarousel categories={categories} onOpen={openCategory} />
          </main>
        </>
      ) : (
        <>
          {!hasSearch && (
            <section className="prod-banner">
              <img src={activeBanner} alt="" decoding="async" fetchPriority="high" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
            </section>
          )}
          <div className={`rd-page-head ${hasSearch ? "search-head" : ""} ${isKitchenCategory && !hasSearch ? "kitchen-page-head" : ""}`}>
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
                <span className="rd-kicker fs">Products / {isKitchenCategory ? kitchenPageLabel : selectedCategory.label}</span>
                <h1 className="rd-title ff">{isKitchenCategory ? kitchenPageTitle : selectedCategory.title}</h1>
                <p className="rd-lede fs">{isKitchenCategory ? kitchenPageCopy : selectedCategory.copy}</p>
              </>
            )}
          </div>

          <main className={`rd-products-layout ${isKitchenCategory && !hasSearch ? "kitchen-products-layout" : ""}`}>
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
                <div className="rd-kitchen-tabs" role="tablist" aria-label="Kitchen types">
                  <button
                    type="button"
                    role="tab"
                    className={!isBuiltInKitchen ? "active" : ""}
                    aria-selected={!isBuiltInKitchen}
                    onClick={() => updateProductQuery({ cat: "kitchen", mode: null, collection: null, subcat: null, type: null })}
                  >Modular Kitchens</button>
                  <button
                    type="button"
                    role="tab"
                    className={isBuiltInKitchen ? "active" : ""}
                    aria-selected={isBuiltInKitchen}
                    onClick={() => updateProductQuery({ cat: "kitchen", mode: "built-in", collection: null, subcat: null, type: null })}
                  >Built-in Kitchens</button>
                </div>
              )}

              {!hasSearch && isKitchenCategory && !isBuiltInKitchen && (
                <div className="rd-range-strip" role="group" aria-label="Kitchen ranges">
                  {kitchenCollections.map((collection) => (
                    <button key={collection.key} type="button" data-no-translate className={`rd-range-chip ${activeKitchenCollection === collection.key ? "active" : ""}`} aria-pressed={activeKitchenCollection === collection.key} onClick={() => selectKitchenCollection(collection.key)}>
                      {collection.label}
                    </button>
                  ))}
                </div>
              )}

              {!hasSearch && activeSubcategories.length > 0 && (
                <div className="rd-filter-strip" role="group" aria-label="Filter by product type or material">
                  <span className="rd-filter-label fs">Browse by</span>
                  {activeSubcategories.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`rd-filter-chip ${activeSubcategory === item.key ? "active" : ""}`}
                      aria-pressed={activeSubcategory === item.key}
                      onClick={() => updateProductQuery({
                        cat: activeCategory,
                        subcat: activeSubcategory === item.key ? null : item.key,
                        collection: activeCategory === "kitchen" ? activeKitchenCollection : null,
                        type: null,
                      })}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="rd-products-toolbar">
                <div>
                  {hasSearch ? (
                    <>
                      <span className="rd-kicker fs" data-no-translate>“{queryParam}”</span>
                      <p className="rd-count fs" aria-live="polite">{filteredProducts.length} results</p>
                    </>
                  ) : (
                    <>
                      <span className="rd-kicker fs">
                        {isKitchenCategory ? (activeRange?.label || selectedCategory.label) : selectedCategory.label}
                        {activeRefinementLabel && (
                          <span data-no-translate style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 10, padding: "2px 6px 2px 10px", background: "var(--light-grey)", borderRadius: 2, textTransform: "none", letterSpacing: 0 }}>
                            {activeRefinementLabel}
                            <button
                              type="button"
                              className="rd-clear-filter"
                              aria-label={currentLang === "pt" ? "Limpar filtro" : "Clear filter"}
                              onClick={() => updateProductQuery({ collection: null, type: null, subcat: null })}
                            >×</button>
                          </span>
                        )}
                      </span>
                      <p className="rd-count fs" aria-live="polite">{filteredProducts.length} products shown</p>
                    </>
                  )}
                </div>
                <div className="rd-toolbar-actions">
                  <label className="sr-only" htmlFor="product-sort">{currentLang === "pt" ? "Ordenar produtos" : "Sort products"}</label>
                  <select id="product-sort" className="rd-select fs" value={sortBy} onChange={(event) => updateProductQuery({ sort: event.target.value === "featured" ? null : event.target.value })}>
                    <option value="featured">{hasSearch ? "Relevance" : "Featured"}</option>
                    <option value="name">Name</option>
                  </select>
                  <div className="rd-view-toggle" role="group" aria-label={currentLang === "pt" ? "Modo de visualização" : "View mode"}>
                    <button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => updateProductQuery({ view: null })} aria-label={currentLang === "pt" ? "Vista em grelha" : "Grid view"} aria-pressed={viewMode === "grid"}>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" /></svg>
                    </button>
                    <button type="button" className={viewMode === "list" ? "active" : ""} onClick={() => updateProductQuery({ view: "list" })} aria-label={currentLang === "pt" ? "Vista em lista" : "List view"} aria-pressed={viewMode === "list"}>
                      <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
                    </button>
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
                  <div className="rd-empty-state fs" role="status" style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-grey)" }}>
                    {isBuiltInKitchen
                      ? "Built-in kitchen products are being curated. Contact the showroom for current options."
                      : "No pieces in this category yet. Contact the showroom."}
                  </div>
                )
              ) : viewMode === "grid" ? (
                <div className="rd-product-grid editorial">
                  {filteredProducts.map((product, index) => (
                    <article key={product.id || product.name} className={`rd-product-card ${product.category === "kitchen" && !product.fit ? "kitchen-product" : ""} ${product.category === "shade" && !product.fit ? "shade-product" : ""} ${product.fit === "contain" ? "studio-product" : ""} ${product.fit === "wide" ? "wide-product" : ""} ${product.id === "sicily-modular-set" ? "contain-media" : ""}`}>
                      <div className="rd-product-media">
                        <FavoriteButton
                          product={favPayload(product)}
                          size={16}
                          style={{ position: "absolute", top: 12, right: 12 }}
                        />
                        {hasImage(product)
                          ? (product.heroImage ? (
                            <>
                              <img className="rd-product-image rd-product-image-isolated" src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 50vw, 33vw" alt={product.name} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "auto"} decoding="async" />
                              <img className="rd-product-image rd-product-image-hero" src={product.heroImage} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 50vw, 33vw" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            </>
                          ) : <img src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 50vw, 33vw" alt={product.name} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "auto"} decoding="async" />)
                          : <NoImagePlaceholder />}
                        <span className="rd-product-view fs">View product <span aria-hidden="true">↗</span></span>
                      </div>
                      <div className="rd-product-info">
                        <span className="rd-product-cat fs">{productBrandLabel(product)}</span>
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
                        ? <img src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 760px) calc(100vw - 48px), 220px" alt={product.name} loading="lazy" decoding="async" />
                        : <NoImagePlaceholder list />}
                      <div>
                        <span className="rd-kicker fs">{productBrandLabel(product)}</span>
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
