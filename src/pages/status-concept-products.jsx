import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import NoImagePlaceholder from "../components/NoImagePlaceholder";
import FavoriteButton from "../FavoriteButton";
import { productSrcSet } from "../utils/imageVariants";
import { productThumbnail } from "../utils/productThumbnail";
import { kitchenCollectionHeroes, kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { publicSearchProducts as allProducts } from "../data/productCatalog";
import { baliCollectionCover, baliCollectionHero } from "../data/baliCollection";
import { floridaCollectionCover, floridaCollectionHero } from "../data/floridaCollection";
import { berlinCollectionCover, berlinCollectionHero } from "../data/berlinCollection";
import { noImageProducts } from "../data/productImageStatus";
import { findProductCollectionMatch, searchProducts } from "../utils/productSearch";
import { productCollectionLabel } from "../utils/productLabels";
import { CATEGORY_ALIASES, PRODUCT_CATEGORIES, getProductFacets } from "../data/productTaxonomy";
import { getLangFromPath, withLang } from "../utils/language";
import kitchenHeroImg from "../assets/images/kitchen/kitchen-hero.webp";
import furnitureSeriesImg from "../assets/images/enhanced/furniture-series-golf-hero.webp";
import productsOverviewImg from "../assets/images/enhanced/products-overview-algarve-v1.webp";
import shadeHeroLifestyleImg from "../assets/images/enhanced/shade-glatz-realistic-hero.webp";
import carpetsCategoryImg from "../assets/images/enhanced/category-carpets-studio.webp";
import decorCategoryImg from "../assets/images/enhanced/category-decor-studio.webp";
import statuesCategoryImg from "../assets/images/enhanced/category-statues-studio.webp";
import sicilyModularSetFullImg from "../assets/images/sicily-modular-set-full.webp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";

const shadeChipImg = "/product-images/glatz/sombrano-s-plus/05.webp";
const COLLECTION_VIDEOS = {
  sicily: "sicily-collection-hero",
  ibiza: "ibiza-collection-hero",
  luanda: "luanda-collection-hero",
  miami: "miami-collection-hero",
  florida: "florida-collection-hero",
  berlin: "berlin-editorial-full-v4",
  maya: "maya-collection-hero",
  antigua: "antigua-collection-hero",
};

// Reviewed families with distinct published pieces/configurations, not colour/photo counts.
const EDITORIAL_COLLECTION_KEYS = new Set(["sicily", "bermuda", "berlin", "bali", "luanda", "antigua", "oxford", "florida", "maya"]);
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const VALID_CATEGORIES = PRODUCT_CATEGORIES.map(category => category.key);
const LEGACY_CATEGORY_TYPES = { daybed: "daybed", coffee: "coffee", side: "side", bar: "bar", puffs: "pouf" };
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
  if (product.subcategories?.includes(key) || getProductFacets(product).materialFamilies.includes(key)) return true;
  // Kitchen descriptions mention the entire range, so a sink cabinet's
  // description mentioning a grill must not classify it as a BBQ.
  const haystack = product.category === "kitchen"
    ? product.name.toLowerCase()
    : productSearchText(product);
  const terms = {
    upholstered: ["upholster", "cushion", "fabric", "textile"],
    rope: ["rope", "cord"],
    aluminium: ["aluminium", "aluminum"],
    pergolas: ["pergola", "bioclimatic"],
    parasols: ["parasol", "umbrella"],
    awnings: ["awning", "retractable"],
    modular: ["modular", "draco", "kitchen"],
    "built-in": ["built-in", "built in", "integrated"],
    accessories: ["accessor", "attachment", "sink", "drawer", "shelf", "hook", "cover", "waste bin"],
    bbq: ["bbq", "grill", "barbecue"],
  }[key] || [key];
  return terms.some((term) => haystack.includes(term));
};

export const filterKitchenProducts = (products, collection, subcategory) => products.filter((product) => (
  (!collection || product.collection === collection)
  && (!subcategory || matchesSubcategory(product, subcategory))
));

export const refineProductResults = (products, { category, collection, subcategory, type, builtIn = false }) => {
  if (category === "kitchen" && builtIn) return [];
  const canonicalType = { bar: 'bar-stool', coffee: 'coffee-table', side: 'side-table', daybed: 'day-bed', lounger: 'sun-lounger', corner: 'modular' }[type] || type;
  const knownType = ['sofa', 'modular', 'armchair', 'pouf', 'chair', 'table', 'bar-stool', 'coffee-table', 'side-table', 'sun-lounger', 'day-bed'].includes(canonicalType);
  const candidates = category === "lounge" && type === "pouf" && !collection
    ? expandProductCollection(expandProductCollection(products, "sicily"), "bermuda")
    : products;
  return candidates.filter((product) => (
    (!category || getProductFacets(product).category === category || (collection === "bali" && product.collectionName === "Bali"))
    && (!collection || slug(product.collectionName || product.collection) === collection
      || slug(product.collectionName || product.collection).startsWith(`${collection}-`))
    && (!subcategory || matchesSubcategory(product, subcategory))
    && (!type || getProductFacets(product).productType.includes(canonicalType)
      || (type === "sofa" && getProductFacets(product).productType.includes("modular"))
      || (!knownType && `${product.name} ${product.collectionName || ""}`.toLowerCase().includes(type.replace(/-/g, " "))))
  ));
};

// Kitchen and shade products keep their supplied catalogue imagery. Their main
// shots are intentionally contextual, so the white-background classifier should
// not replace them with a showroom placeholder.
export const productHasImage = (product) => product.curatedImages || product.publishedCorrection || product.category === "kitchen" || product.category === "shade" || !noImageProducts.has(product.id);

const SICILY_MODULES = [
  { id: "sicily-corner-module", name: "Sicily Corner Module", part: "corner", img: sicilyCornerImg, productType: ["modular", "corner"] },
  { id: "sicily-centre-module", name: "Sicily Centre Module", part: "centre", img: sicilyCentreImg, productType: ["modular", "centre"] },
  { id: "sicily-ottoman", name: "Sicily Ottoman", part: "ottoman", img: sicilyOttomanImg, productType: ["ottoman", "pouf"] },
].map((piece) => ({
  ...piece,
  collection: "Sicily",
  collectionName: "Sicily",
  category: "lounge",
  categoryLabel: "Lounge",
  fit: "contain",
  route: `/product/sicily-modular-set?part=${piece.part}`,
}));

export const expandProductCollection = (products, collection) => {
  if (collection === "sicily") {
    return products.flatMap((product) => product.id === "sicily-modular-set"
      ? SICILY_MODULES.map((piece) => ({
          ...piece,
          subcategories: product.subcategories,
          materialFamilies: getProductFacets(product).materialFamilies,
        }))
      : [product]);
  }
  if (collection === "bermuda") {
    return products.flatMap((product) => product.id === "bermuda-divano"
      ? [
          { id: "bermuda-left-chair", name: "Bermuda Left Lounge Chair", imageCrop: "left" },
          { id: "bermuda-ottoman", name: "Bermuda Ottoman", imageCrop: "center" },
          { id: "bermuda-right-chair", name: "Bermuda Right Lounge Chair", imageCrop: "right" },
        ].map((piece) => ({
          ...product,
          ...piece,
          heroImage: null,
          route: `/product/bermuda-divano?part=${piece.imageCrop}`,
        }))
      : [product]);
  }
  return products;
};

const CATEGORY_LABELS = {
  lounge: "Lounge",
  dining: "Dining",
  tables: "Coffee & Side Tables",
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
    // Don't schedule the next advance while the pointer or keyboard focus is over it.
    if (hovered) return;
    // Normal cadence: advance one tile every 5s.
    const t = setTimeout(() => setIdx((i) => i + 1), 5000);
    return () => clearTimeout(t);
  }, [idx, animate, categories.length, hovered, prefersReducedMotion]);

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
            data-category-key={category.key}
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
    </div>
  );
}

const PRODUCTS_PAGE = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const queryParam = searchParams.get("q")?.trim() || "";
  const collectionParam = (searchParams.get("collection")?.trim() || "").replace(/^florida-dining$/, "florida").replace(/^berlin-modular$/, "berlin");
  const typeParam = searchParams.get("type")?.trim().toLowerCase() || LEGACY_CATEGORY_TYPES[catParam] || "";
  const subcategoryParam = searchParams.get("subcat")?.trim().toLowerCase() || "";
  const kitchenModeParam = searchParams.get("mode")?.trim().toLowerCase() || "";
  const currentLang = getLangFromPath(location.pathname);
  const resolvedCategory = collectionParam === "florida" ? "dining"
    : catParam === "dining" && ["side", "side-table", "coffee", "coffee-table"].includes(typeParam) ? "tables"
    : CATEGORY_ALIASES[catParam] || catParam;
  const activeCategory = VALID_CATEGORIES.includes(resolvedCategory) ? resolvedCategory : null;
  const viewMode = searchParams.get("view") === "list" ? "list" : "grid";
  const sortBy = searchParams.get("sort") === "name" ? "name" : "featured";
  const collectionView = searchParams.get("browse") === "collections";
  const [searchInput, setSearchInput] = useState(queryParam);
  const [shareStatus, setShareStatus] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const catalogImg = (category) => catalogProducts.find((product) => getProductFacets(product).category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "lounge", label: "Lounge", chip: sicilyCornerImg, banner: sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: catalogImg("dining"), banner: catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
    { key: "tables", label: "Coffee & Side Tables", chip: catalogImg("tables"), banner: catalogImg("tables"), title: "Coffee & Side Tables", copy: "Coffee and side tables for outdoor living." },
    { key: "sunlounger", label: "Sun Loungers", chip: catalogImg("sunlounger"), banner: catalogImg("sunlounger"), title: "Sun Loungers & Day Beds", copy: "Poolside loungers and day beds built for Algarve summers." },
    { key: "shade", label: "Shade Solutions", chip: shadeChipImg, banner: shadeHeroLifestyleImg, bannerPosition: "center 34%", title: "Shade Solutions", copy: "Pergolas, parasols and awnings for gardens, terraces and outdoor rooms." },
    { key: "kitchen", label: "Outdoor Kitchens", chip: kitchenHeroImg, banner: kitchenHeroImg, title: "Modular Outdoor Kitchen", copy: "Modular kitchens, built-in kitchens, BBQs and the accessories that make outdoor cooking work." },
    { key: "carpets", label: "Carpets", chip: carpetsCategoryImg, banner: carpetsCategoryImg, title: "Carpets", copy: "Outdoor rugs that bring warmth, texture and definition to an open-air room." },
    { key: "decor", label: "Decor", chip: decorCategoryImg, banner: decorCategoryImg, title: "Decor", copy: "Finishing pieces selected to give an outdoor space its character." },
    { key: "statues", label: "Statues", chip: statuesCategoryImg, banner: statuesCategoryImg, title: "Statues", copy: "Sculptural accents for gardens, terraces and considered outdoor settings." },
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
  const activeKitchenCollection = isKitchenCategory && !isBuiltInKitchen
    ? (kitchenCollections.some((collection) => collection.key === collectionParam)
        ? collectionParam
        : (queryParam ? null : (kitchenCollections[0]?.key || null)))
    : null;

  const hasSearch = Boolean(queryParam);
  const isSpecificCollectionPage = Boolean(collectionParam) && !hasSearch;
  const isLanding = !activeCategory && !hasSearch;
  const selectedCategory = categories.find((category) => category.key === activeCategory);
  const kitchenPageLabel = isBuiltInKitchen ? "Built-in Kitchens" : "Modular Kitchens";
  const kitchenPageTitle = isBuiltInKitchen ? "Built-in Kitchens" : selectedCategory?.title;
  const kitchenPageCopy = isBuiltInKitchen
    ? "Built-in outdoor kitchen solutions for seamless, permanent installations."
    : selectedCategory?.copy;
  const searchMatches = useMemo(() => searchProducts(allProducts, queryParam), [queryParam]);
  const unfilteredCollectionMatch = useMemo(() => findProductCollectionMatch(allProducts, queryParam), [queryParam]);
  const collectionSearchMatch = activeCategory || collectionParam || activeSubcategory || typeParam
    || !EDITORIAL_COLLECTION_KEYS.has(unfilteredCollectionMatch?.key)
    ? null
    : unfilteredCollectionMatch;
  const searchCountProducts = expandProductCollection(
    unfilteredCollectionMatch?.key === "bali" ? unfilteredCollectionMatch.products : searchMatches,
    unfilteredCollectionMatch?.key || "",
  );

  const filteredProducts = (() => {
    if (!activeCategory && !hasSearch) return [];
    const candidates = expandProductCollection(hasSearch ? searchCountProducts : allProducts, activeCategory === "lounge" ? collectionParam : "");
    const base = refineProductResults(candidates, {
      category: activeCategory, collection: isKitchenCategory ? activeKitchenCollection : collectionParam,
      subcategory: activeSubcategory, type: typeParam, builtIn: isBuiltInKitchen,
    });

    return [...base].sort((a, b) => {
      // Products without a clean white-bg image always sink to the bottom.
      const ai = productHasImage(a) ? 0 : 1;
      const bi = productHasImage(b) ? 0 : 1;
      if (ai !== bi) return ai - bi;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (hasSearch) return 0;
      return (b.tag ? 1 : 0) - (a.tag ? 1 : 0);
    });
  })();
  const displayedProducts = collectionSearchMatch && hasSearch
    ? []
    : filteredProducts;

  const activeRefinementLabel = (() => {
    if (!activeCategory) return null;
    if (activeSubcategory) {
      return activeSubcategories.find((item) => item.key === activeSubcategory)?.label || activeSubcategory;
    }
    if (activeCategory === "kitchen") return isBuiltInKitchen ? kitchenPageLabel : null;
    if (collectionParam) {
      const match = allProducts.find(
        (product) => getProductFacets(product).category === activeCategory
          && (slug(product.collectionName || product.collection) === collectionParam
            || slug(product.collectionName || product.collection).startsWith(`${collectionParam}-`)),
      );
      return match
        ? (slug(match.collectionName || match.collection) === collectionParam
            ? (match.collectionName || match.collection)
            : (match.collectionName || match.collection).trim().split(/\s+/)[0])
        : null;
    }
    if (typeParam) {
      return typeParam.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return null;
  })();

  const searchCategoryCounts = categories.map((category) => ({
    ...category,
    count: searchCountProducts.filter((product) => getProductFacets(product).category === category.key).length,
  })).filter((category) => category.count > 0);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const favPayload = (product) => ({ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: productThumbnail(product), category: product.category, route: productRoute(product) });
  const goTo = (path, state) => navigate(withLang(path, currentLang), state ? { state } : undefined);
  const updateProductQuery = (changes) => {
    setShareStatus("");
    setShareUrl("");
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
  const goBackFromProducts = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    goTo(collectionParam && activeCategory ? `/products?cat=${activeCategory}` : "/products");
  };
  const selectKitchenCollection = (key) => {
    updateProductQuery({ cat: "kitchen", mode: null, collection: key, type: null });
    requestAnimationFrame(scrollToProducts);
  };
  const setSearchScope = (key) => {
    const query = encodeURIComponent(queryParam);
    goTo(key ? `/products?q=${query}&cat=${key}` : `/products?q=${query}`);
  };
  const submitResultsSearch = (event) => {
    event.preventDefault();
    const cleanQuery = searchInput.trim();
    updateProductQuery({ q: cleanQuery || null });
  };

  const shareSelection = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus(currentLang === "pt" ? "Ligação copiada" : "Link copied");
    } catch {
      setShareUrl(url);
      setShareStatus(currentLang === "pt" ? "Selecione e copie a ligação abaixo." : "Select and copy the link below.");
    }
  };

  const categoryCollectionProducts = activeCategory && activeCategory !== "kitchen"
    ? allProducts.filter((product) => getProductFacets(product).category === activeCategory && (product.collectionName || product.collection))
    : [];
  const collectionNames = [...new Set(categoryCollectionProducts.map((product) => product.collectionName || product.collection))];
  const collectionPrefixes = collectionNames.reduce((counts, name) => {
    const prefix = name.trim().split(/\s+/)[0];
    counts[prefix] = (counts[prefix] || 0) + 1;
    return counts;
  }, {});
  const collectionGroups = [...new Map(categoryCollectionProducts.map((product) => {
    const originalName = product.collectionName || product.collection;
    const prefix = originalName.trim().split(/\s+/)[0];
    const grouped = collectionPrefixes[prefix] > 1;
    const name = grouped ? prefix : originalName;
    const key = slug(name);
    return [key, { key, name, productId: product.standalone ? product.id : null, image: product.standalone ? product.img : key === "bali" ? baliCollectionCover : key === "florida" ? floridaCollectionCover : key === "berlin" ? berlinCollectionCover : ["antigua", "oxford"].includes(key) ? `/product-images/${key}-collection-cover-studio.webp` : product.heroImage || product.img }];
  })).values()]
    .map((collection) => ({
      ...collection,
      count: (collection.key === "bali" ? allProducts : categoryCollectionProducts).filter((product) => slug(product.collectionName || product.collection) === collection.key
        || slug(product.collectionName || product.collection).startsWith(`${collection.key}-`)).length
        + (activeCategory === "lounge" && ["sicily", "bermuda"].includes(collection.key) ? 2 : 0),
    }));
  const collections = collectionGroups.map((collection) => collection.name);
  const hasBrowseViews = ["lounge", "dining", "sunlounger"].includes(activeCategory) && !hasSearch && !collectionParam;
  const editorialCollections = collectionGroups.filter(collection => !collection.productId
    && EDITORIAL_COLLECTION_KEYS.has(collection.key)
    && refineProductResults(categoryCollectionProducts, { category: activeCategory, collection: collection.key, subcategory: activeSubcategory, type: typeParam }).length > 0);
  const showCollectionChooser = hasBrowseViews && collectionView;

  const hasImage = productHasImage;
  const activeRange = kitchenCollections.find((collection) => collection.key === activeKitchenCollection);
  const activeBanner = isKitchenCategory && activeKitchenCollection
    ? (kitchenCollectionHeroes[activeKitchenCollection] || selectedCategory.banner)
    : collectionParam === "bali" ? baliCollectionHero : collectionParam === "florida" ? floridaCollectionHero : collectionParam === "berlin" ? berlinCollectionHero : selectedCategory?.banner;
  const collectionHeroVideo = (activeCategory === "lounge" || collectionParam === "florida") && !hasSearch
    ? COLLECTION_VIDEOS[collectionParam]
    : null;
  const collectionHeroPoster = collectionHeroVideo ? `/videos/${collectionHeroVideo}-poster.jpg` : activeBanner;
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const standaloneProduct = allProducts.find((product) => product.standalone && product.collection === collectionParam);
  if (standaloneProduct) return <Navigate to={withLang(`/product/${standaloneProduct.id}`, currentLang)} replace />;
  const singletonCollection = collectionParam && !hasSearch && !typeParam && !activeSubcategory && !EDITORIAL_COLLECTION_KEYS.has(collectionParam)
    ? refineProductResults(allProducts, { category: activeCategory, collection: collectionParam }) : [];
  if (singletonCollection.length === 1) return <Navigate to={withLang(`/product/${singletonCollection[0].id}`, currentLang)} replace />;

  return (
    <Layout>
      {isLanding ? (
        <>
          <section className="prod-banner">
            <img src={productsOverviewImg} alt="" decoding="async" fetchPriority="high" style={{ objectPosition: "center 40%" }} />
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
          {!hasSearch && activeBanner && (
            <section className={`prod-banner ${hasBrowseViews ? "catalogue-category-banner" : ""} ${isSpecificCollectionPage ? "collection-hero-banner" : ""} ${collectionParam === "bali" ? "bali-collection-hero" : ""} ${collectionParam === "florida" ? "florida-collection-hero" : ""} ${collectionParam === "berlin" ? "berlin-collection-hero" : ""}`} style={collectionParam === "maya" ? { height: "auto", aspectRatio: "720 / 481" } : collectionParam === "antigua" ? { height: "auto", aspectRatio: "2068 / 1000" } : undefined}>
              {collectionHeroVideo && !prefersReducedMotion ? (
                <video key={collectionHeroVideo} autoPlay loop muted playsInline preload="metadata" poster={collectionHeroPoster} aria-hidden="true">
                  <source src={`/videos/${collectionHeroVideo}.mp4`} type="video/mp4" />
                </video>
              ) : (
                <img src={collectionHeroPoster} alt="" decoding="async" fetchPriority="high" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
              )}
            </section>
          )}
          <div className={`rd-page-head ${hasBrowseViews ? "catalogue-category-head" : ""} ${hasSearch ? "search-head" : ""} ${isKitchenCategory && !hasSearch ? "kitchen-page-head" : ""} ${isSpecificCollectionPage ? "collection-page-head" : ""}`}>
            <button type="button" className="rd-back-to-cats" onClick={goBackFromProducts}>
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
                {!hasBrowseViews && <span className="rd-kicker fs">Products / {isKitchenCategory ? kitchenPageLabel : selectedCategory.label}</span>}
                <h1 className="rd-title ff">{isKitchenCategory ? kitchenPageTitle : selectedCategory.title}</h1>
                {!hasBrowseViews && <p className="rd-lede fs">{isKitchenCategory ? kitchenPageCopy : selectedCategory.copy}</p>}
              </>
            )}
          </div>

          <main className={`rd-products-layout ${isKitchenCategory && !hasSearch ? "kitchen-products-layout" : ""} ${isSpecificCollectionPage ? "collection-products-layout" : ""}`}>
            <section>
              {hasBrowseViews && <div className="rd-catalogue-browse">
                <nav aria-label={currentLang === "pt" ? "Explorar catálogo" : "Browse catalogue"}>
                  <button type="button" aria-pressed={!collectionView} onClick={() => updateProductQuery({ browse: null })}>{currentLang === "pt" ? "Produtos" : "Products"}</button>
                  <button type="button" aria-pressed={collectionView} onClick={() => updateProductQuery({ browse: "collections" })}>{currentLang === "pt" ? "Coleções" : "Collections"}</button>
                </nav>
              </div>}
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
                      <span>All</span><small data-no-translate>{searchCountProducts.length}</small>
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

              {isKitchenCategory && !isBuiltInKitchen && (
                <div className="rd-range-strip" role="group" aria-label="Kitchen ranges">
                  {kitchenCollections.map((collection) => (
                    <button key={collection.key} type="button" data-no-translate className={`rd-range-chip ${activeKitchenCollection === collection.key ? "active" : ""}`} aria-pressed={activeKitchenCollection === collection.key} onClick={() => selectKitchenCollection(collection.key)}>
                      {collection.label}
                    </button>
                  ))}
                </div>
              )}

              {activeSubcategories.length > 0 && !isBuiltInKitchen && !isSpecificCollectionPage && (
                <div className="rd-filter-strip" role="group" aria-label="Filter by product type or material">
                  {!hasBrowseViews && <span className="rd-filter-label fs">Browse by</span>}
                  {activeSubcategories.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className={`rd-filter-chip ${activeSubcategory === item.key ? "active" : ""}`}
                      aria-pressed={activeSubcategory === item.key}
                      onClick={() => updateProductQuery({
                        cat: activeCategory,
                        subcat: activeSubcategory === item.key ? null : item.key,
                        collection: activeCategory === "kitchen" ? activeKitchenCollection : collectionParam,
                        type: activeCategory === "lounge" ? typeParam : null,
                      })}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {!isSpecificCollectionPage && <div className="rd-discovery-tools fs">
                {!showCollectionChooser && !isKitchenCategory && collections.length > 1 && (
                  <label> {currentLang === "pt" ? "Coleção" : "Collection"}
                    <select className="rd-select fs" value={collectionParam} onChange={(event) => updateProductQuery({ collection: event.target.value })}>
                      <option value="">{currentLang === "pt" ? "Todas as coleções" : "All collections"}</option>
                      {collections.map((name) => <option key={name} value={slug(name)}>{name}</option>)}
                    </select>
                  </label>
                )}
                {(collectionParam || activeSubcategory || typeParam) && <button type="button" className="rd-filter-chip" onClick={() => updateProductQuery({ collection: null, subcat: null, type: null })}>{currentLang === "pt" ? "Limpar filtros" : "Clear filters"}</button>}
                <button type="button" className="rd-filter-chip" onClick={shareSelection} title={currentLang === "pt" ? "Partilhar seleção" : "Share selection"}>
                  {hasBrowseViews && <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 16V3m-4 4 4-4 4 4M5 13v7h14v-7" /></svg>}
                  <span className={hasBrowseViews ? "sr-only" : undefined}>{currentLang === "pt" ? "Partilhar seleção" : "Share selection"}</span>
                </button>
                <span role="status">{shareStatus}</span>
                {shareUrl && <input aria-label={currentLang === "pt" ? "Ligação para partilhar" : "Link to share"} readOnly value={shareUrl} onFocus={(event) => event.target.select()} />}
              </div>}

              <div className="rd-products-toolbar">
                <div>
                  {hasSearch ? (
                    <>
                      <span className="rd-kicker fs" data-no-translate>“{queryParam}”</span>
                      <p className="rd-count fs" aria-live="polite">{collectionSearchMatch ? "1 collection" : `${displayedProducts.length} results`}</p>
                    </>
                  ) : (
                    <>
                      {(!hasBrowseViews || activeRefinementLabel) && <span className="rd-kicker fs">
                        {!hasBrowseViews && (collectionParam === "bali" ? "Bali" : collectionParam === "florida" ? "Florida" : isKitchenCategory ? (activeRange?.label || selectedCategory.label) : selectedCategory.label)}
                        {activeRefinementLabel && !isSpecificCollectionPage && (
                          <span data-no-translate style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 10, padding: "2px 6px 2px 10px", background: "var(--light-grey)", borderRadius: 2, textTransform: "none", letterSpacing: 0 }}>
                            {activeRefinementLabel}
                            <button
                              type="button"
                              className="rd-clear-filter"
                              aria-label={currentLang === "pt" ? "Limpar filtro" : "Clear filter"}
                              onClick={() => updateProductQuery(activeSubcategory || typeParam ? { type: null, subcat: null } : { collection: null })}
                            >×</button>
                          </span>
                        )}
                      </span>}
                      <p className="rd-count fs" aria-live="polite">{showCollectionChooser
                        ? `${editorialCollections.length} ${currentLang === "pt" ? "coleções" : "collections"}`
                        : `${displayedProducts.length} products shown`}</p>
                    </>
                  )}
                </div>
                {!showCollectionChooser && <div className="rd-toolbar-actions">
                  {isSpecificCollectionPage && (activeSubcategory || typeParam) && (
                    <button type="button" className="rd-filter-chip" onClick={() => updateProductQuery({ subcat: null, type: null })}>
                      {currentLang === "pt" ? "Limpar filtros" : "Clear filters"}
                    </button>
                  )}
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
                </div>}
              </div>

              {showCollectionChooser ? (
                <section className="rd-collection-choice rd-editorial-collections" aria-label={currentLang === "pt" ? "Coleções" : "Collections"}>
                  {editorialCollections.map(collection => <LocalizedLink key={collection.key}
                    className="rd-collection-choice-card"
                    to={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams), collection: collection.key, browse: "products" })}`}>
                    {collection.image && <img src={collection.image} alt="" loading="lazy" decoding="async" />}
                    <div>
                      <h3 className="ff">{collection.name}</h3>
                      <span className="rd-collection-arrow" aria-hidden="true">↗</span>
                    </div>
                  </LocalizedLink>)}
                  {!editorialCollections.length && <p className="rd-empty-state">{currentLang === "pt" ? "Nenhuma coleção corresponde aos filtros. Experimente a vista Produtos ou limpe os filtros." : "No collections match these filters. Try Products or clear the filters."}</p>}
                </section>
              ) : hasSearch && collectionSearchMatch ? (
                <section className="rd-collection-choice search-collection-choice" aria-label="Matching collection">
                  <button
                    type="button"
                    className="rd-collection-choice-card"
                    onClick={() => goTo(collectionSearchMatch.path)}
                  >
                    {collectionSearchMatch.image && <img src={collectionSearchMatch.image} alt="" loading="lazy" decoding="async" />}
                    <div>
                      <span className="rd-kicker fs">Collection</span>
                      <h3 className="ff">{collectionSearchMatch.name}</h3>
                      <p className="fs">{collectionSearchMatch.count} products · Open collection</p>
                    </div>
                  </button>
                </section>
              ) : displayedProducts.length === 0 ? (
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
                    {activeCategory === "tables"
                      ? (currentLang === "pt" ? "Ainda não há mesas de centro ou apoio publicadas individualmente. Os conjuntos continuam na secção Lounge." : "No individual coffee or side tables are listed yet. Furniture sets remain in Lounge.")
                      : isBuiltInKitchen
                      ? "Built-in kitchen products are being curated. Contact the showroom for current options."
                      : "No pieces in this category yet. Contact the showroom."}
                  </div>
                )
              ) : viewMode === "grid" ? (
                <div className="rd-product-grid editorial">
                  {displayedProducts.map((product, index) => (
                    <article key={product.id || product.name} className="rd-product-card studio-product product-white-card">
                      <div className="rd-product-media">
                        <FavoriteButton
                          product={favPayload(product)}
                          size={16}
                          style={{ position: "absolute", top: 12, right: 12 }}
                        />
                        {hasImage(product)
                          ? <img src={productThumbnail(product)} srcSet={productSrcSet(productThumbnail(product))} sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 50vw, 33vw" alt={product.name} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "auto"} decoding="async" />
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
                  {displayedProducts.map((product) => (
                    <article key={product.id || product.name} className="rd-product-row studio-product product-white-card">
                      {hasImage(product)
                        ? <img src={productThumbnail(product)} srcSet={productSrcSet(productThumbnail(product))} sizes="(max-width: 760px) calc(100vw - 48px), 220px" alt={product.name} loading="lazy" decoding="async" />
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
