import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import CatalogueToolbar from "../components/CatalogueToolbar";
import LocalizedLink from "../components/LocalizedLink";
import NoImagePlaceholder from "../components/NoImagePlaceholder";
import FavoriteButton from "../FavoriteButton";
import { productSrcSet } from "../utils/imageVariants";
import { productThumbnail } from "../utils/productThumbnail";
import { kitchenCollectionHeroes, kitchenCollectionMeta, kitchenProducts } from "../data/kitchenProducts";
import { catalogProducts } from "../data/catalogProducts";
import { publicSearchProducts as allProducts, routableProducts } from "../data/productCatalog";
import { discontinuedCatalogueProductIds } from "../data/discontinuedCatalogueProducts";
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
  berlin: "berlin-collection-hero-20261105",
  maya: "maya-collection-hero",
  antigua: "antigua-collection-hero-20261105",
  oxford: "oxford-collection-hero-20261105",
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

const FILTER_LABELS = {
  sofa: "Sofás", modular: "Modular", armchair: "Poltronas", pouf: "Pufes",
  table: "Mesas", chair: "Cadeiras", "bar-stool": "Bancos de bar",
  "coffee-table": "Mesas de centro", "side-table": "Mesas de apoio",
  "sun-lounger": "Espreguiçadeiras", "day-bed": "Camas de exterior",
  upholstered: "Estofado", rope: "Corda", aluminium: "Alumínio",
  pergolas: "Pérgolas", parasols: "Chapéus de sol", awnings: "Toldos",
  accessories: "Acessórios", bbq: "Barbecues",
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

function CategoryGrid({ categories, label }) {
  return (
    <nav className="cat-strip landing" aria-label={label}>
      {categories.map(category => (
        <LocalizedLink key={category.key} className="cat-chip" to={`/products?cat=${category.key}`} aria-label={category.title}>
          <span className="cat-chip-img"><img src={category.chip} alt="" loading="lazy" /></span>
          <span className="lbl">{category.label}<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
        </LocalizedLink>
      ))}
    </nav>
  );
}

const PRODUCTS_PAGE = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat");
  const queryParam = searchParams.get("q")?.trim() || "";
  const collectionParam = (searchParams.get("collection")?.trim() || "").replace(/^florida-dining$/, "florida").replace(/^berlin-modular$/, "berlin");
  const familyParam = searchParams.get("family")?.trim() || "";
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


  useEffect(() => {
    setSearchInput(queryParam);
  }, [queryParam]);

  const catalogImg = (category) => catalogProducts.find((product) => !discontinuedCatalogueProductIds.has(product.id) && getProductFacets(product).category === category)?.img || furnitureSeriesImg;

  const categories = [
    { key: "lounge", label: "Lounge", chip: "/photography/berlin-800.webp", banner: sicilyModularSetFullImg, title: "Lounge", copy: "Sofas, lounge sets and armchairs made for long Algarve afternoons." },
    { key: "dining", label: "Dining", chip: floridaCollectionCover, banner: catalogImg("dining"), title: "Dining", copy: "Outdoor dining sets, tables and chairs for terrace meals from breakfast to late dinner." },
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
  const isSpecificCollectionPage = Boolean(collectionParam) && !hasSearch && !isKitchenCategory;
  const isLanding = !activeCategory && !hasSearch;
  const selectedCategory = categories.find((category) => category.key === activeCategory);
  const kitchenPageLabel = isBuiltInKitchen ? "Built-in Kitchens" : "Modular Kitchens";
  const kitchenPageTitle = isBuiltInKitchen ? "Built-in Kitchens" : selectedCategory?.title;
  const kitchenPageCopy = isBuiltInKitchen
    ? "Built-in outdoor kitchen solutions for seamless, permanent installations."
    : selectedCategory?.copy;
  const searchMatches = useMemo(() => searchProducts(allProducts, queryParam), [queryParam]);
  const unfilteredCollectionMatch = useMemo(() => findProductCollectionMatch(allProducts, queryParam), [queryParam]);
  const collectionSearchMatch = activeCategory || collectionParam || familyParam || activeSubcategory || typeParam
    || !EDITORIAL_COLLECTION_KEYS.has(unfilteredCollectionMatch?.key)
    ? null
    : unfilteredCollectionMatch;
  const searchCountProducts = expandProductCollection(
    unfilteredCollectionMatch?.key === "bali" ? unfilteredCollectionMatch.products : searchMatches,
    unfilteredCollectionMatch?.key || "",
  );

  const filteredProducts = (() => {
    if (!activeCategory && !hasSearch) return [];
    const candidates = expandProductCollection(hasSearch ? searchCountProducts : allProducts, activeCategory === "lounge" ? (collectionParam || familyParam) : "");
    const base = refineProductResults(candidates, {
      category: activeCategory, collection: isKitchenCategory ? activeKitchenCollection : (collectionParam || familyParam),
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
  const displayedProducts = filteredProducts;

  const searchCategoryCounts = categories.map((category) => ({
    ...category,
    count: searchCountProducts.filter((product) => getProductFacets(product).category === category.key).length,
  })).filter((category) => category.count > 0);

  const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
  const favPayload = (product) => ({ id: product.id || slug(product.name), name: product.name, collection: product.collectionName || product.collection, img: productThumbnail(product), category: product.category, route: productRoute(product) });
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

  const goBackFromProducts = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    goTo(collectionParam && activeCategory ? `/products?cat=${activeCategory}` : "/products");
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
  const hasBrowseViews = ["lounge", "dining", "sunlounger"].includes(activeCategory) && !hasSearch && !collectionParam;
  const editorialCollections = collectionGroups.filter(collection => !collection.productId
    && EDITORIAL_COLLECTION_KEYS.has(collection.key));

  const pt = currentLang === "pt";
  const categoryTypes = PRODUCT_CATEGORIES.find(category => category.key === activeCategory)?.types || [];
  const typeOptions = !isKitchenCategory && activeCategory !== "shade" ? categoryTypes : [];
  const familyOptions = collectionGroups
    .filter(group => !group.productId && (activeCategory === "lounge" ? EDITORIAL_COLLECTION_KEYS.has(group.key) : group.count > 1))
    .map(({ key, name }) => ({ value: key, label: name }));
  const fields = [
    ...(typeOptions.length || typeParam ? [{ key: "type", label: pt ? "Tipo de produto" : "Product type", value: typeParam, options: typeOptions.map(({ value, label }) => ({ value, label: pt ? (FILTER_LABELS[value] || label) : label })) }] : []),
    ...(!isBuiltInKitchen && activeSubcategories.length ? [{ key: "subcat", label: activeCategory === "lounge" ? "Material" : (pt ? "Tipo de produto" : "Product type"), value: activeSubcategory, options: activeSubcategories.map(({ key, label }) => ({ value: key, label: pt ? (FILTER_LABELS[key] || label) : label })) }] : []),
    ...(!isKitchenCategory && !isSpecificCollectionPage && (familyOptions.length > 1 || familyParam || collectionParam) ? [{ key: collectionParam ? "collection" : "family", label: pt ? "Conjunto" : "Collection", value: collectionParam || familyParam, options: familyOptions }] : []),
    ...(isKitchenCategory && !isBuiltInKitchen ? [{ key: "collection", label: pt ? "Gama" : "Range", value: collectionParam, emptyLabel: !hasSearch ? kitchenCollections[0]?.label : undefined, options: kitchenCollections.filter(({ key }, index) => hasSearch || index > 0 || key === collectionParam).map(({ key, label }) => ({ value: key, label })) }] : []),
  ];
  const hasImage = productHasImage;
  const activeBanner = isKitchenCategory && activeKitchenCollection
    ? (kitchenCollectionHeroes[activeKitchenCollection] || selectedCategory.banner)
    : collectionParam === "bali" ? baliCollectionHero : collectionParam === "florida" ? floridaCollectionHero : collectionParam === "berlin" ? berlinCollectionHero : selectedCategory?.banner;
  const collectionHeroVideo = (activeCategory === "lounge" || collectionParam === "florida") && !hasSearch
    ? COLLECTION_VIDEOS[collectionParam]
    : null;
  const collectionHeroPoster = collectionHeroVideo ? `/videos/${collectionHeroVideo}-poster.jpg` : activeBanner;
  const compactCollection = isSpecificCollectionPage && displayedProducts.length <= 4 && !typeParam && !activeSubcategory && !familyParam;
  const prefersReducedMotion = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (isSpecificCollectionPage && activeCategory && !isKitchenCategory) {
    const scope = { category: activeCategory, collection: collectionParam };
    if (!refineProductResults(allProducts, scope).length && refineProductResults(routableProducts, scope).length) {
      return <Navigate to={withLang(`/products?cat=${activeCategory}`, currentLang)} replace />;
    }
  }

  const standaloneProduct = allProducts.find((product) => product.standalone && product.collection === collectionParam);
  if (standaloneProduct) return <Navigate to={withLang(`/product/${standaloneProduct.id}`, currentLang)} replace />;
  const singletonCollection = collectionParam && !hasSearch && !typeParam && !activeSubcategory && !EDITORIAL_COLLECTION_KEYS.has(collectionParam)
    ? refineProductResults(allProducts, { category: activeCategory, collection: collectionParam }) : [];
  if (singletonCollection.length === 1) return <Navigate to={withLang(`/product/${singletonCollection[0].id}`, currentLang)} replace />;

  if (hasBrowseViews && collectionView) {
    const productsQuery = new URLSearchParams(searchParams);
    productsQuery.delete("browse");
    return (
      <Layout>
        <main className="collection-index">
          <header className="collection-index-intro statvs-frame">
            <h1>{pt ? "Conjuntos" : "Collections"}</h1>
            <LocalizedLink className="collection-index-link statvs-text-link" to={`/products?${productsQuery}`}>{pt ? "Ver produtos" : "View products"}</LocalizedLink>
          </header>
          <section className="collection-index-grid statvs-frame" aria-label={pt ? "Conjuntos" : "Collections"}>
            {editorialCollections.map(({ key, name, image }, index) => (
              <LocalizedLink key={key} className="collection-index-card" to={`/products?${new URLSearchParams({ cat: activeCategory, collection: key })}`}>
                {image && <img src={image} alt="" loading={index ? "lazy" : "eager"} decoding="async" />}
                <div className="collection-index-caption">
                  <h2>{key === "luanda" ? "Luanda" : name}</h2>
                  <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.25">
                    <path d="M2.5 8h10.75M9 3.75 13.25 8 9 12.25" />
                  </svg>
                </div>
              </LocalizedLink>
            ))}
            {!editorialCollections.length && <p>{pt ? "Não há conjuntos nesta categoria." : "There are no collections in this category."}</p>}
          </section>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      {isLanding ? (
        <main className="statvs-catalogue">
          <section className="statvs-catalogue-hero statvs-frame" aria-labelledby="catalogue-title">
            <div className="rd-page-head">
              <h1 id="catalogue-title" className="rd-title ff">Products</h1>
              <p className="rd-lede fs">Explore furniture, shade and outdoor kitchens selected for the Algarve lifestyle.</p>
            </div>
            <img src={productsOverviewImg} alt="" decoding="async" fetchPriority="high" />
          </section>
          <div className="rd-products-layout">
            <CategoryGrid categories={categories} label={currentLang === "pt" ? "Categorias de produtos" : "Product categories"} />
          </div>
        </main>
      ) : (
        <>
          <div className={compactCollection ? "collection-compact-intro statvs-frame" : undefined}>
          {!hasSearch && activeBanner && (isSpecificCollectionPage || isKitchenCategory || activeCategory === "statues") && (
            <section className={`prod-banner ${isSpecificCollectionPage ? "collection-hero-banner" : "catalogue-category-banner"} ${compactCollection ? "collection-hero-compact" : ""} ${collectionParam === "bali" ? "bali-collection-hero" : ""} ${collectionParam === "florida" ? "florida-collection-hero" : ""} ${collectionParam === "berlin" ? "berlin-collection-hero" : ""}`} style={collectionParam === "maya" ? { height: "auto", aspectRatio: "720 / 481" } : ["antigua", "oxford"].includes(collectionParam) ? { height: "auto", aspectRatio: "16 / 9" } : undefined}>
              {collectionHeroVideo && !prefersReducedMotion ? (
                <video key={collectionHeroVideo} autoPlay loop muted playsInline preload="metadata" poster={collectionHeroPoster} aria-hidden="true">
                  <source src={`/videos/${collectionHeroVideo}.mp4`} type="video/mp4" />
                </video>
              ) : (
                <img src={collectionHeroPoster} alt="" decoding="async" fetchPriority="high" style={{ objectPosition: selectedCategory.bannerPosition || "center" }} />
              )}
            </section>
          )}
          <div className={`rd-page-head catalogue-results-heading ${hasBrowseViews ? "catalogue-category-head" : ""} ${hasSearch ? "search-head" : ""} ${isKitchenCategory && !hasSearch ? "kitchen-page-head" : ""} ${isSpecificCollectionPage ? "collection-page-head" : ""}`}>
            {isSpecificCollectionPage && EDITORIAL_COLLECTION_KEYS.has(collectionParam) ? (
              <LocalizedLink className="statvs-text-link" to={`/products?cat=${activeCategory}&browse=collections`}>{pt ? "Voltar aos conjuntos" : "Back to collections"}</LocalizedLink>
            ) : <button type="button" className="rd-back-to-cats" onClick={goBackFromProducts}>
              <span aria-hidden="true">←</span> Products
            </button>}
            {hasBrowseViews && editorialCollections.length > 0 && <LocalizedLink className="statvs-text-link catalogue-collections-link" to={`/products?cat=${activeCategory}&browse=collections`}>{pt ? "Explorar conjuntos" : "Explore collections"}</LocalizedLink>}
            {hasSearch ? (
              <>
                <span className="rd-kicker fs">Search</span>
                <h1 className="rd-title ff">Search results</h1>
                <p className="rd-lede fs">Explore matches across furniture, shade, kitchens, collections and materials.</p>
              </>
            ) : (
              <>
                {!hasBrowseViews && !isSpecificCollectionPage && <span className="rd-kicker fs">Products / {isKitchenCategory ? kitchenPageLabel : selectedCategory.label}</span>}
                <h1 className="rd-title ff">{isKitchenCategory ? kitchenPageTitle : isSpecificCollectionPage ? collectionGroups.find(item => item.key === collectionParam)?.name || selectedCategory.title : selectedCategory.title}</h1>
                {!hasBrowseViews && !isSpecificCollectionPage && <p className="rd-lede fs">{isKitchenCategory ? kitchenPageCopy : selectedCategory.copy}</p>}
              </>
            )}
          </div>
          </div>

          <main className={`rd-products-layout ${isKitchenCategory && !hasSearch ? "kitchen-products-layout" : ""} ${isSpecificCollectionPage ? "collection-products-layout" : ""} catalogue-results-layout`}>
            <section>
              {hasSearch && (
                <>
                  <form className="rd-results-search" role="search" onSubmit={submitResultsSearch}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="21" height="21" fill="none">
                      <circle cx="10.8" cy="10.8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="m15.7 15.7 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <label className="sr-only" htmlFor="results-search-input">{currentLang === "pt" ? "Pesquisar produtos, conjuntos ou materiais" : "Search products, collections or materials"}</label>
                    <input
                      id="results-search-input"
                      className="ff"
                      type="search"
                      value={searchInput}
                      autoComplete="off"
                      placeholder={currentLang === "pt" ? "Pesquisar produtos, conjuntos ou materiais" : "Search products, collections or materials"}
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

              {!compactCollection && <CatalogueToolbar
                fields={fields}
                count={displayedProducts.length}
                hasSearch={hasSearch}
                pt={pt}
                sort={sortBy}
                view={viewMode}
                onChange={(changes) => updateProductQuery({ ...(activeCategory && Object.hasOwn(changes, "type") ? { cat: activeCategory } : {}), ...changes })}
              />}

              {hasSearch && collectionSearchMatch && (
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
              )}
              {displayedProducts.length === 0 ? (
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
                    {fields.some(field => field.value && field.key !== "collection")
                      ? (pt ? "Não há produtos com estes filtros. Experimente retirar um deles." : "No products match these filters. Try removing one.")
                      : activeCategory === "tables"
                      ? (currentLang === "pt" ? "Ainda não há mesas de centro ou apoio publicadas individualmente. Os conjuntos continuam na secção Lounge." : "No individual coffee or side tables are listed yet. Furniture sets remain in Lounge.")
                      : isBuiltInKitchen
                      ? "Built-in kitchen products are being curated. Contact the showroom for current options."
                      : "No pieces in this category yet. Contact the showroom."}
                  </div>
                )
              ) : viewMode === "grid" ? (
                <div className={`rd-product-grid editorial${compactCollection && displayedProducts.length === 2 ? " collection-pair" : ""}`}>
                  {displayedProducts.map((product, index) => {
                    const thumbnail = compactCollection && product.curatedImages ? product.img : productThumbnail(product);
                    return (
                    <article key={product.id || product.name} className="rd-product-card studio-product product-white-card">
                      <div className="rd-product-media">
                        <FavoriteButton
                          product={favPayload(product)}
                          size={16}
                          style={{ position: "absolute", top: 12, right: 12 }}
                        />
                        {hasImage(product)
                          ? <img src={thumbnail} srcSet={productSrcSet(thumbnail)} sizes={compactCollection ? "(max-width: 760px) 90vw, 50vw" : "(max-width: 760px) calc(100vw - 48px), (max-width: 1100px) 50vw, 33vw"} alt={product.name} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index < 3 ? "high" : "auto"} decoding="async" />
                          : <NoImagePlaceholder />}
                        <span className="rd-product-view fs">View product <span aria-hidden="true">↗</span></span>
                      </div>
                      <div className="rd-product-info">
                        <span className="rd-product-cat fs">{productBrandLabel(product)}</span>
                        <h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={productRoute(product)} state={{ product }}>{product.name}</LocalizedLink></h3>
                      </div>
                    </article>
                    );
                  })}
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
