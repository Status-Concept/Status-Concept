import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import NotFound from "./NotFound";
import { whatsappUrl } from "../utils/whatsapp";
import { productSrcSet } from "../utils/imageVariants";
import { productCollectionLabel } from "../utils/productLabels";
import { glatzProductDetails } from "../data/glatzProducts";
import { kitchenProductDetails, kitchenCollectionHeroes } from "../data/kitchenProducts";
import { demoProducts, demoProductIds } from "../data/demoProducts";
import { limitPageImages } from "../config/contentLimits";
import { getProductFacets, normalizeProduct } from "../data/productTaxonomy";
import { getLangFromPath, withLang } from "../utils/language";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";

const displayDimension = (value) => /^(todo:|see source sheet)/i.test(String(value || '').trim())
  ? 'Available on request'
  : value;

const PRODUCT_DETAIL = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const currentLang = getLangFromPath(location.pathname);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const demoCatalogProducts = demoProducts.filter((rawProduct) => rawProduct.category !== "kitchen" && rawProduct.category !== "shade");
  const demoKitchenProducts = demoProducts.filter((rawProduct) => rawProduct.category === "kitchen");
  const demoGlatzProducts = demoProducts.filter((rawProduct) => rawProduct.category === "shade");
  const catalogProductDetails = Object.fromEntries(demoCatalogProducts.map((rawProduct) => {
    const product = normalizeProduct(rawProduct);
    const specs = [
      ...product.specs,
      { label: "Category", value: product.categoryLabel },
      { label: "Collection", value: product.collectionName },
      product.supplier ? { label: "Supplier", value: product.supplier } : null,
      rawProduct.sku ? { label: "SKU", value: rawProduct.sku } : null,
      { label: "Availability", value: "Through the showroom team" },
    ].filter(Boolean);
    return [product.id, {
      ...product,
      id: product.id,
      name: product.name,
      collection: product.collectionName,
      collectionSlug: product.collection,
      tag: product.tag,
      tagline: product.tagline || product.desc,
      images: product.images,
      specs,
      dims: product.dimensions,
      materials: product.materials,
    }];
  }));

  const demoKitchenProductDetails = Object.fromEntries(demoKitchenProducts.map((product) => [product.id, kitchenProductDetails[product.id]]).filter(([, product]) => product));
  const demoGlatzProductDetails = Object.fromEntries(demoGlatzProducts.map((product) => [product.id, glatzProductDetails[product.id]]).filter(([, product]) => product));

  const allProducts = {
    ...catalogProductDetails,
    ...demoKitchenProductDetails,
    ...demoGlatzProductDetails,
    "sicily-modular-set": {
      id: "sicily-modular-set",
      name: "Sicily Modular Set",
      collection: "Sicily",
      collectionSlug: "sicily",
      category: "lounge",
      tag: "Popular",
      tagline: "A contemporary modular outdoor sofa with generous proportions and flexible configurations.",
      images: [sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg],
      specs: [
        { label: "Type", value: "Modular Sofa Set" },
        { label: "Frame", value: "Premium Aluminium" },
        { label: "Coating", value: "Interpon Powder Coated" },
        { label: "Upholstery", value: "Sunbrella Acrylic Fabric" },
        { label: "Cushion Fill", value: "Quick-dry Foam Core" },
        { label: "Use", value: "Outdoor Lounge" },
      ],
      dims: [
        { piece: "Corner Module", w: "85", d: "85", h: "68", sh: "42" },
        { piece: "Centre Module", w: "75", d: "85", h: "68", sh: "42" },
        { piece: "Ottoman", w: "75", d: "75", h: "42", sh: "-" },
      ],
      materials: ["Sunbrella fabric", "Interpon powder coated aluminium", "Quick-dry foam cushions", "Weather resistant outdoor construction"],
      colorLabel: "Fabric colours",
      colors: [{ name: "Charcoal", hex: "#3a3a3a" }, { name: "Mist", hex: "#dce1e5" }, { name: "Sand", hex: "#c8b99d" }],
    },
  };

  const passedProduct = location.state?.product;
  if (!demoProductIds.has(id)) return <NotFound />;
  const product = allProducts[id];
  if (!product) return <NotFound />;
  const images = limitPageImages(product.images?.length ? product.images : [product.image || sicilyCornerImg], product);
  const safeActiveImg = activeImg < images.length ? activeImg : 0;
  const goTo = (path) => navigate(withLang(path, currentLang));
  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    goTo("/products");
  };

  // Carry the product (and a sensible interest) into the enquiry form.
  const INTEREST_BY_CATEGORY = { shade: "Shade Solutions", kitchen: "Outdoor Kitchens", lounge: "Outdoor Furniture", dining: "Outdoor Furniture", sunlounger: "Outdoor Furniture", decor: "Decor & Leisure", leisure: "Decor & Leisure" };
  const enquireState = { product: product.name, interest: INTEREST_BY_CATEGORY[product.category] || "" };

  const kitchenHero = product.category === "kitchen"
    ? kitchenCollectionHeroes[product.collectionSlug || passedProduct?.collection]
    : null;

  const availableTabs = [
    { key: "specs", label: "Specs", available: (product.specs || []).length > 0 },
    { key: "dimensions", label: "Dimensions", available: (product.dims || product.dimensions || []).length > 0 },
    { key: "materials", label: "Materials", available: (product.materials || []).length > 0 },
  ].filter((tab) => tab.available);
  const effectiveActiveTab = availableTabs.some((tab) => tab.key === activeTab)
    ? activeTab
    : availableTabs[0]?.key || "specs";
  const isSameCollection = product.category === "kitchen" || product.category === "shade" || product.id === "sicily-modular-set";
  const relatedProducts = (() => {
    if (catalogProductDetails[product.id]) {
      const currentFacets = getProductFacets(product);
      return [...demoCatalogProducts, ...demoKitchenProducts, ...demoGlatzProducts]
        .map((item) => ({ raw: item, facets: getProductFacets(item) }))
        .filter(({ raw, facets }) => raw.id !== product.id && facets.category === currentFacets.category)
        .sort((a, b) => {
          const score = (item) => (item.facets.collection === currentFacets.collection ? 3 : 0)
            + item.facets.materialFamilies.filter((material) => currentFacets.materialFamilies.includes(material)).length;
          return score(b) - score(a);
        })
        .map(({ raw }) => raw)
        .slice(0, 6);
    }
    if (product.category === "kitchen") {
      return demoKitchenProducts
        .filter((item) => item.id !== product.id && (item.collection === product.collectionSlug || item.collectionName === product.collection))
        .slice(0, 6);
    }
    if (product.category === "shade") {
      return demoGlatzProducts
        .filter((item) => item.id !== product.id)
        .slice(0, 6);
    }
    if (product.id === "sicily-modular-set") {
      return [
        { id: "sicily-modular-set", name: "Sicily Modular Set", collectionName: "Sicily", img: sicilyCornerImg, route: "/product/sicily-modular-set" },
        { id: "sicily-centre-module", name: "Sicily Centre Module", collectionName: "Sicily", img: sicilyCentreImg, route: "/product/sicily-modular-set" },
        { id: "sicily-ottoman", name: "Sicily Ottoman", collectionName: "Sicily", img: sicilyOttomanImg, route: "/product/sicily-modular-set" },
      ];
    }
    return [
      { id: "sicily-modular-set", name: "Sicily Modular Set", collectionName: "Sicily", img: sicilyCornerImg, route: "/product/sicily-modular-set" },
      ...demoGlatzProducts.slice(0, 3),
    ].filter((item) => item.id !== product.id).slice(0, 4);
  })();
  const renderTab = () => {
    if (effectiveActiveTab === "dimensions") {
      return (
        <table className="rd-dim-table fs">
          <thead>
            <tr>
              {["Piece", "W", "D", "H", "Seat H"].map((heading) => <th key={heading}>{heading}</th>)}
            </tr>
          </thead>
          <tbody data-no-translate>
            {(product.dims || product.dimensions || []).map((row) => (
              <tr key={row.piece}>
                <td>{row.piece}</td>
                <td>{displayDimension(row.w)}</td>
                <td>{displayDimension(row.d)}</td>
                <td>{displayDimension(row.h)}</td>
                <td>{displayDimension(row.sh)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (effectiveActiveTab === "materials") {
      return (
        <div className="rd-spec-list fs">
          {(product.materials || []).map((material) => (
            <div key={material}>
              <span data-no-translate>{material}</span>
              <strong>Included</strong>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rd-spec-list fs">
        {(product.specs || []).map((spec) => (
          <div key={spec.label}>
            <span>{spec.label}</span>
            <strong data-no-translate>{spec.value}</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      {kitchenHero && (
        <section className="rd-kitchen-hero" aria-label={`${product.collection} complete outdoor kitchen`}>
          <img src={kitchenHero} alt={`${product.collection} modular outdoor kitchen, fully assembled`} />
          <div className="rd-kitchen-hero-content">
            <span className="rd-kicker fs">{product.collection} · Modular Outdoor Kitchen</span>
            <h2 className="ff">The complete {product.collection} kitchen</h2>
            <p className="rd-lede fs">Every module in the {product.collection} range is engineered to lock together into a single outdoor kitchen. The {product.name} is one piece of it.</p>
          </div>
        </section>
      )}

      <div className="rd-detail-topbar">
        <button type="button" className="rd-detail-back" onClick={goBack}>
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>
      </div>

      <main className="rd-detail-layout">
        <section className="rd-gallery-sticky" aria-label="Product gallery">
          <div className="rd-thumbs">
            {images.map((image, index) => (
              <button
                key={image + index}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={activeImg === index}
                onClick={() => setActiveImg(index)}
                style={{ padding: 0, border: "none", background: "none", cursor: "pointer", display: "block" }}
              >
                <img
                  src={image}
                  srcSet={productSrcSet(image)}
                  sizes="72px"
                  alt={`${product.name} view ${index + 1}`}
                  className={`rd-thumb ${activeImg === index ? "active" : ""}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
          <div className="rd-main-photo">
            {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`} style={{ position: "absolute", top: 16, left: 16, zIndex: 3 }}>{product.tag}</span>}
            <div className="rd-mobile-gallery-track" aria-label="Swipe through product images">
              {images.map((image, index) => (
                <button key={`${image}-mobile-${index}`} type="button" onClick={() => { setActiveImg(index); setLightboxOpen(true) }} aria-label={`Open image ${index + 1}`}>
                  <img src={image} srcSet={productSrcSet(image)} sizes="88vw" alt={`${product.name} view ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                </button>
              ))}
            </div>
            <button className="rd-desktop-main-image" type="button" aria-label="Open full-size image" onClick={() => setLightboxOpen(true)} style={{ padding: 0, border: "none", background: "none", cursor: "zoom-in", display: "block", width: "100%" }}>
              <img src={images[safeActiveImg]} alt={product.name} />
            </button>
          </div>
        </section>

        <aside className="rd-product-panel">
          <span className="rd-kicker fs" style={{ marginTop: 28 }}>{product.collection} Collection</span>
          <h1 className="rd-title ff" data-no-translate style={{ color: "var(--text-dark)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>{product.name}</h1>
          <div className="la" style={{ marginBottom: 20 }} />
          <p className="rd-lede fs">{product.tagline}</p>

          <div className="rd-swatch-row" aria-label={product.colorLabel || "Colours"}>
            {(product.colors || []).map((colour) => (
              <div key={colour.name} title={colour.name}>
                <div className="rd-swatch" style={{ background: colour.hex }} />
                <span className="fs" style={{ display: "block", marginTop: 8, fontSize: 10, color: "var(--sand-d)", textAlign: "center" }}>{colour.name}</span>
              </div>
            ))}
          </div>

          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <span className="fs" style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--sand-d)", marginBottom: 14 }}>Select Size</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {product.sizeOptions.map((opt, i) => (
                  <button key={opt.sku} type="button" className="fs" style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", border: i === 0 ? "2px solid var(--accent)" : "1px solid var(--mid-grey)",
                    background: i === 0 ? "var(--accent-light)" : "transparent", borderRadius: 2, cursor: "pointer",
                    transition: "all .3s", textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-light)"; }}
                  onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.borderColor = "var(--mid-grey)"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-dark)", display: "block" }}>{opt.label}</span>
                      <span style={{ fontSize: 11, color: "var(--text-grey)", marginTop: 2, display: "block" }}>{displayDimension(opt.dimensions)}</span>
                    </div>
                    <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--text-grey)", whiteSpace: "nowrap" }}>SKU: {opt.sku}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <LocalizedLink className="cb cg" to="/contact" state={enquireState}>Request a proposal</LocalizedLink>
            <LocalizedLink className="cb cd" to="/contact" state={enquireState}>Book a showroom visit</LocalizedLink>
            <a className="cb cd" href={whatsappUrl(`Hello STATVS, I'm interested in the ${product.name}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>

          {availableTabs.length > 0 && <div className="rd-tabs">
            {availableTabs.map((tab) => (
              <button key={tab.key} type="button" className={`rd-tab-btn ${effectiveActiveTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>}
          {availableTabs.length > 0 && <div className="rd-tab-panel">{renderTab()}</div>}
        </aside>
      </main>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">{isSameCollection ? "Related products" : "From the catalogue"}</span>
            <h2 className="ff">{isSameCollection ? "Pieces that work together" : "You may also like"}</h2>
          </div>
          <button type="button" className="rd-back-link" onClick={() => goTo("/products")}>View all</button>
        </div>
        <div className="rd-horizontal-scroll">
          {relatedProducts.map((item) => {
            const openItem = () => navigate(withLang(item.route || `/product/${item.id}`, currentLang), { state: { product: item } });
            return (
            <article
              key={item.id}
              className={`rd-product-card ${item.category === "kitchen" ? "kitchen-product" : ""}`}
              role="link"
              tabIndex={0}
              aria-label={`View ${item.name}`}
              onClick={openItem}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openItem(); } }}
            >
              <div className="rd-product-media">
                <img src={item.img} srcSet={productSrcSet(item.img)} sizes="(max-width: 640px) 60vw, 280px" alt={item.name} loading="lazy" decoding="async" />
              </div>
              <div className="rd-product-info">
                <h3 className="ff" data-no-translate>{item.name}</h3>
                <div className={`rd-product-meta fs ${item.category === "kitchen" ? "kitchen-product-meta" : ""}`}>
                  <span data-no-translate>{productCollectionLabel(item)}</span>
                  <span>View</span>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </section>

      <div className="rd-mobile-cta">
        <LocalizedLink className="cb cg" style={{ width: "100%", justifyContent: "center" }} to="/contact" state={enquireState}>Request a proposal</LocalizedLink>
      </div>

      {lightboxOpen && (
        <div className="rd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button type="button" aria-label="Close" onClick={() => setLightboxOpen(false)}>×</button>
          <img src={images[safeActiveImg]} alt={product.name} />
        </div>
      )}
    </Layout>
  );
};

export default PRODUCT_DETAIL;
