import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import ImageDialog from "../components/ImageDialog";
import NotFound from "./NotFound";
import { whatsappUrl } from "../utils/whatsapp";
import { productSrcSet } from "../utils/imageVariants";
import { productCollectionLabel } from "../utils/productLabels";
import { glatzProductDetails } from "../data/glatzProducts";
import { kitchenProductDetails, kitchenCollectionHeroes } from "../data/kitchenProducts";
import { demoProducts, demoProductIds } from "../data/demoProducts";
import { publishedCorrectionProducts, publicSearchProducts } from "../data/productCatalog";
import { baliProductById, retiredBaliProductIds } from "../data/baliCollection";
import { floridaProductById, retiredFloridaProductIds } from "../data/floridaCollection";
import { berlinProductById, retiredBerlinProductIds } from "../data/berlinCollection";
import { limitPageImages } from "../config/contentLimits";
import { formatFacetLabel, getProductFacets, normalizeProduct } from "../data/productTaxonomy";
import { getLangFromPath, withLang } from "../utils/language";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";
import { getColourTarget, getLocalColourProduct, productColourViews } from '../dev/colour-preview/targets';
import { finishLibrary } from '../data/fabrics';

const ProductColourPicker = lazy(() => import('../dev/colour-preview/ProductColourPicker'));

const displayDimension = (value) => /^(todo:|see source sheet)/i.test(String(value || '').trim())
  ? 'Available on request'
  : value;

const isStandaloneDiningTable = (product, facets) => facets.category === "dining"
  && facets.productType.includes("table")
  && !/\b(bar|coffee|side|detail|chairs?|armchairs?|armchiars?)\b/i.test(product.name);

const PRODUCT_DETAIL = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const selectedPart = new URLSearchParams(location.search).get("part");
  const currentLang = getLangFromPath(location.pathname);
  const [activeImg, setActiveImg] = useState(0);
  const [previewColour, setPreviewColour] = useState(null);
  const [previewError, setPreviewError] = useState(false);
  const [frameFinish, setFrameFinish] = useState('');
  const mobileGallery = useRef(null);
  const [activeTab, setActiveTab] = useState("specs");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedSizeSku, setSelectedSizeSku] = useState(null);
  const [activeRelatedFilter, setActiveRelatedFilter] = useState(null);
  useEffect(() => {
    const partIndex = id === "sicily-modular-set"
      ? ({ corner: 0, centre: 1, ottoman: 2 }[selectedPart] ?? 0)
      : 0;
    setActiveImg(partIndex);
    setPreviewColour(null);
    setPreviewError(false);
    setFrameFinish('');
    setActiveTab("specs");
    setLightboxOpen(false);
    setSelectedSizeSku(null);
    setActiveRelatedFilter(null);
  }, [id, selectedPart]);

  useEffect(() => {
    if (!productColourViews[id]) return;
    const alignSelectedImage = () => {
      const track = mobileGallery.current;
      const image = track?.children[previewColour ? 0 : activeImg] || track?.firstElementChild;
      if (image) track.scrollLeft = image.offsetLeft - track.firstElementChild.offsetLeft;
    };
    alignSelectedImage();
    window.addEventListener('resize', alignSelectedImage);
    return () => window.removeEventListener('resize', alignSelectedImage);
  }, [id, selectedPart, activeImg, previewColour]);

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
  if (retiredBaliProductIds.has(id)) return <Navigate to={withLang("/products?cat=lounge&collection=bali", currentLang)} replace />;
  if (retiredFloridaProductIds.has(id)) return <Navigate to={withLang("/products?cat=dining&collection=florida", currentLang)} replace />;
  if (retiredBerlinProductIds.has(id)) return <Navigate to={withLang("/products?cat=lounge&collection=berlin", currentLang)} replace />;
  const curatedProduct = baliProductById.get(id) || floridaProductById.get(id) || berlinProductById.get(id);
  const correction = curatedProduct || publishedCorrectionProducts.find((item) => item.id === id);
  const localColourProduct = getLocalColourProduct(id);
  if (!demoProductIds.has(id) && !correction && !localColourProduct) return <NotFound />;
  const product = correction
    ? {
        ...(allProducts[id] || {}),
        ...(curatedProduct || {}),
        id: correction.id,
        name: correction.name,
        category: correction.category,
        collection: correction.collectionName || correction.collection,
        images: correction.images,
        image: correction.img,
        standalone: correction.standalone,
        publishedCorrection: !correction.originalPhotos,
      }
    : allProducts[id] || localColourProduct;
  if (!product) return <NotFound />;
  const previewTarget = getColourTarget(id, selectedPart, activeImg);
  const hasColourPreview = Boolean(previewTarget);
  const images = hasColourPreview && previewColour
    ? [previewColour.image]
    : (hasColourPreview && selectedPart ? [previewTarget.original] : limitPageImages(product.images?.length ? product.images : [product.image || sicilyCornerImg], product));
  const safeActiveImg = activeImg < images.length ? activeImg : 0;
  const previewImageError = () => {
    if (hasColourPreview && previewColour) { setPreviewColour(null); setPreviewError(true); }
  };
  const displayName = product.id === "sicily-modular-set"
    ? ({ corner: "Sicily Corner Module", centre: "Sicily Centre Module", ottoman: "Sicily Ottoman" }[selectedPart] || product.name)
    : product.id === "bermuda-divano"
      ? ({ left: "Bermuda Left Lounge Chair", center: "Bermuda Ottoman", right: "Bermuda Right Lounge Chair" }[selectedPart] || product.name)
    : product.name;
  const goTo = (path) => navigate(withLang(path, currentLang));
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    goTo("/products");
  };

  // Carry the product (and a sensible interest) into the enquiry form.
  const INTEREST_BY_CATEGORY = { shade: "Shade Solutions", kitchen: "Outdoor Kitchens", lounge: "Outdoor Furniture", dining: "Outdoor Furniture", sunlounger: "Outdoor Furniture", decor: "Decor & Leisure", leisure: "Decor & Leisure" };
  const selectedSize = product.sizeOptions?.find((option) => option.sku === selectedSizeSku) || product.sizeOptions?.[0];
  const enquiryProduct = selectedSize ? `${displayName} (${selectedSize.label}, SKU: ${selectedSize.sku})` : displayName;
  const selectedFinishes = [previewColour && `Fabric: ${previewColour.name}`, frameFinish && `Frame: ${frameFinish}`].filter(Boolean);
  const enquiryName = selectedFinishes.length ? `${enquiryProduct} — ${selectedFinishes.join('; ')}` : enquiryProduct;
  const enquireState = { product: enquiryName, interest: INTEREST_BY_CATEGORY[product.category] || "" };

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
    if (product.id === "sicily-modular-set") {
      return [
        { id: "sicily-corner-module", part: "corner", name: "Sicily Corner Module", collectionName: "Sicily", category: "lounge", productType: ["modular"], img: sicilyCornerImg },
        { id: "sicily-centre-module", part: "centre", name: "Sicily Centre Module", collectionName: "Sicily", category: "lounge", productType: ["modular"], img: sicilyCentreImg },
        { id: "sicily-ottoman", part: "ottoman", name: "Sicily Ottoman", collectionName: "Sicily", category: "lounge", productType: ["pouf"], img: sicilyOttomanImg },
      ].filter((piece) => piece.part !== (selectedPart || "corner"))
        .map((piece) => ({ ...piece, route: `/product/sicily-modular-set?part=${piece.part}` }));
    }
    const currentFacets = getProductFacets(product);
    const isDiningTable = isStandaloneDiningTable(product, currentFacets);
    return [...new Map(publicSearchProducts
      .filter((item) => item.id !== product.id && !/\bdetail\b/i.test(item.name)
        && getProductFacets(item).category === currentFacets.category)
      .map((item) => [item.id, item])).values()]
      .map((item) => ({ item, facets: getProductFacets(item) }))
      .filter(({ item, facets }) => !isDiningTable || (
        isStandaloneDiningTable(item, facets)
        || (currentFacets.collection && facets.collection === currentFacets.collection
          && facets.productType.some((type) => ["chair", "armchair", "dining-set"].includes(type)))
      ))
      .sort((a, b) => {
        const score = ({ facets }) => (currentFacets.collection && facets.collection === currentFacets.collection ? 5 : 0)
          + (facets.productType.some((type) => currentFacets.productType.includes(type)) ? 6 : 0)
          + (isDiningTable && facets.collection === currentFacets.collection && facets.productType.some((type) => ["chair", "armchair"].includes(type)) ? 2 : 0)
          + facets.materialFamilies.filter((material) => currentFacets.materialFamilies.includes(material)).length;
        return score(b) - score(a);
      })
      .map(({ item }) => item);
  })();
  const currentFacets = getProductFacets(product);
  const isCornerProduct = /\bcorner\b|\bsectional\b|\bl[- ]shaped\b/i.test([
    product.name, product.tagline, product.desc, ...(product.specs || []).map((spec) => `${spec.label} ${spec.value}`),
  ].join(" "));
  const relatedFilterOptions = [
    ...(isCornerProduct ? [{ key: "corner", label: currentLang === "pt" ? "Sofás de canto" : "Corner sofas" }] : []),
    ...currentFacets.productType.map((type) => ({
      key: `type:${type}`,
      label: currentLang === "pt"
        ? (type === "modular" && currentFacets.category === "lounge" ? "Sofás modulares" : formatFacetLabel(type))
        : (type === "modular" && currentFacets.category === "lounge" ? "Modular sofas" : formatFacetLabel(type)),
    })),
    ...currentFacets.materialFamilies.map((material) => ({
      key: `material:${material}`,
      label: currentLang === "pt" ? `Material: ${formatFacetLabel(material)}` : formatFacetLabel(material),
    })),
  ].filter((option) => relatedProducts.some((item) => {
    const facets = getProductFacets(item);
    if (option.key === "corner") return /\bcorner\b|\bsectional\b|\bl[- ]shaped\b/i.test(`${item.name} ${item.tagline || ""} ${item.desc || ""}`);
    if (option.key.startsWith("type:")) return facets.productType.includes(option.key.slice(5));
    if (option.key.startsWith("material:")) return facets.materialFamilies.includes(option.key.slice(9));
    return false;
  }));
  const visibleRelatedProducts = relatedProducts.filter((item) => {
    if (!activeRelatedFilter) return true;
    const facets = getProductFacets(item);
    if (activeRelatedFilter === "corner") return /\bcorner\b|\bsectional\b|\bl[- ]shaped\b/i.test(`${item.name} ${item.tagline || ""} ${item.desc || ""}`);
    if (activeRelatedFilter.startsWith("type:")) return facets.productType.includes(activeRelatedFilter.slice(5));
    if (activeRelatedFilter.startsWith("material:")) return facets.materialFamilies.includes(activeRelatedFilter.slice(9));
    return true;
  }).slice(0, 6);
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
        <section className={`rd-gallery-sticky${hasColourPreview ? ' colour-preview-gallery' : ''}`} aria-label="Product gallery">
          <div className="rd-thumbs">
            {images.map((image, index) => (
              <button
                key={image + index}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-pressed={safeActiveImg === index}
                onClick={() => { if (!previewColour) { setActiveImg(index); setPreviewError(false); } }}
                style={{ padding: 0, border: "none", background: "none", cursor: "pointer", display: "block" }}
              >
                <img
                  src={image}
                  srcSet={productSrcSet(image)}
                  sizes="72px"
                  alt={`${displayName} view ${index + 1}`}
                  className={`rd-thumb ${safeActiveImg === index ? "active" : ""}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
          <div className="rd-main-photo">
            {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`} style={{ position: "absolute", top: 16, left: 16, zIndex: 3 }}>{product.tag}</span>}
            <div ref={mobileGallery} className="rd-mobile-gallery-track" aria-label="Swipe through product images" onScroll={event => {
              if (!productColourViews[id] || previewColour) return;
              const track = event.currentTarget;
              const index = [...track.children].findIndex(image => Math.abs(image.offsetLeft - track.firstElementChild.offsetLeft - track.scrollLeft) < 2);
              if (index >= 0 && index !== activeImg) { setActiveImg(index); setPreviewError(false); }
            }}>
              {images.map((image, index) => (
                <button key={`${image}-mobile-${index}`} type="button" onClick={() => { if (!previewColour) setActiveImg(index); setLightboxOpen(true) }} aria-label={`Open image ${index + 1}`}>
                  <img src={image} srcSet={productSrcSet(image)} sizes="88vw" alt={`${displayName} view ${index + 1}`} loading={index === 0 ? "eager" : "lazy"} decoding="async" onError={previewImageError} />
                </button>
              ))}
            </div>
            <button className="rd-desktop-main-image" type="button" aria-label="Open full-size image" onClick={() => setLightboxOpen(true)} style={{ padding: 0, border: "none", background: "none", cursor: "zoom-in", display: "block", width: "100%" }}>
              <img src={images[safeActiveImg]} alt={displayName} onError={previewImageError} />
            </button>
          </div>
        </section>

        <aside className="rd-product-panel">
          {!product.standalone && <span className="rd-kicker fs" style={{ marginTop: 28 }}>{product.collection} Collection</span>}
          <h1 className="rd-title ff" data-no-translate style={{ color: "var(--text-dark)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400 }}>{displayName}</h1>
          <div className="la" style={{ marginBottom: 20 }} />
          {product.tagline && <p className="rd-lede fs">{product.tagline}</p>}
          {product.publishedCorrection && <p className="rd-lede fs">{currentLang === "pt"
            ? "Imagem ilustrativa; confirme o modelo e os acabamentos com a nossa equipa."
            : "Illustrative image; please confirm the model and finishes with our team."}</p>}

          {hasColourPreview && ProductColourPicker ? <Suspense fallback={null}>
            <ProductColourPicker key={previewTarget.key} targetKey={previewTarget.key} selected={previewColour} pt={currentLang === 'pt'} onChange={colour => { setPreviewColour(colour); setPreviewError(false); }} />
          </Suspense> : <div className="rd-swatch-row" aria-label={product.colorLabel || "Colours"}>
            {(product.colors || []).map((colour) => (
              <div key={colour.name} title={colour.name}>
                <div className="rd-swatch" style={{ background: colour.hex }} />
                <span className="fs" style={{ display: "block", marginTop: 8, fontSize: 10, color: "var(--sand-d)", textAlign: "center" }}>{colour.name}</span>
              </div>
            ))}
          </div>}
          {productColourViews[id] && !hasColourPreview && <p className="colour-studio-note">{currentLang === 'pt' ? 'Esta vista ainda não tem pré-visualização de cor. Selecione uma vista preparada na galeria.' : 'Colour preview is not prepared for this view yet. Select a prepared gallery view.'}</p>}
          {productColourViews[id] && <div className="colour-frame-picker" data-no-translate>
            <label>{currentLang === 'pt' ? 'Acabamento da estrutura' : 'Frame finish'}
              <select value={frameFinish} onChange={event => setFrameFinish(event.target.value)}>
                <option value="">{currentLang === 'pt' ? 'Escolher acabamento' : 'Choose a finish'}</option>
                {finishLibrary.base.map(finish => <option key={finish.name} value={finish.name}>{finish.name}</option>)}
              </select>
            </label>
            <p className="colour-studio-note">{currentLang === 'pt'
              ? 'A estrutura escolhida fica incluída no pedido; a imagem mantém o acabamento de referência.'
              : 'Frame finish selection is included in your enquiry; the image retains its reference frame.'}</p>
          </div>}
          {previewError && <p role="alert">{currentLang === 'pt' ? 'Não foi possível carregar esta cor. Mostramos o original.' : 'This colour could not load. Showing the original.'}</p>}

          {product.sizeOptions && product.sizeOptions.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <span className="fs" style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--sand-d)", marginBottom: 14 }}>Select Size</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {product.sizeOptions.map((opt) => (
                  <button key={opt.sku} type="button" className="fs" aria-pressed={selectedSize?.sku === opt.sku} onClick={() => setSelectedSizeSku(opt.sku)} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", border: selectedSize?.sku === opt.sku ? "2px solid var(--accent)" : "1px solid var(--mid-grey)",
                    background: selectedSize?.sku === opt.sku ? "var(--accent-light)" : "transparent", borderRadius: 2, cursor: "pointer",
                    transition: "all .3s", textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-light)"; }}
                  onMouseLeave={e => { if (selectedSize?.sku !== opt.sku) { e.currentTarget.style.borderColor = "var(--mid-grey)"; e.currentTarget.style.background = "transparent"; } }}
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
            <a className="cb cd" href={whatsappUrl(`Hello STATVS, I'm interested in the ${enquiryName}.`)} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
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

      <section className="rd-section alt" aria-labelledby="related-products-heading">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">{isSameCollection ? "Related products" : "From the catalogue"}</span>
            <h2 id="related-products-heading" className="ff">{isSameCollection ? "Pieces that work together" : "You may also like"}</h2>
          </div>
          <button type="button" className="rd-back-link" onClick={() => goTo("/products")}>View all</button>
        </div>
        {relatedFilterOptions.length > 0 && (
          <div className="rd-related-filters" role="group" aria-label={currentLang === "pt" ? "Filtrar recomendações por característica" : "Filter recommendations by feature"}>
            <span className="rd-related-filters-label fs">{currentLang === "pt" ? "Explorar por" : "Explore by"}</span>
            {relatedFilterOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`rd-filter-chip ${activeRelatedFilter === option.key ? "active" : ""}`}
                aria-pressed={activeRelatedFilter === option.key}
                onClick={() => setActiveRelatedFilter(activeRelatedFilter === option.key ? null : option.key)}
              >
                {option.label}
              </button>
            ))}
            {activeRelatedFilter && (
              <button type="button" className="rd-related-clear fs" onClick={() => setActiveRelatedFilter(null)}>
                {currentLang === "pt" ? "Limpar" : "Clear"}
              </button>
            )}
          </div>
        )}
        <div className="rd-horizontal-scroll">
          {visibleRelatedProducts.map((item) => {
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
        {visibleRelatedProducts.length === 0 && (
          <p className="rd-related-empty fs" role="status">
            {currentLang === "pt" ? "Não encontrámos recomendações com esta característica." : "No recommendations match this feature."}
          </p>
        )}
      </section>

      <div className="rd-mobile-cta">
        <LocalizedLink className="cb cg" style={{ width: "100%", justifyContent: "center" }} to="/contact" state={enquireState}>Request a proposal</LocalizedLink>
      </div>

      {lightboxOpen && (
        <ImageDialog className="rd-lightbox" label={`${product.name} full-size image`} onClose={() => setLightboxOpen(false)}>
          <button type="button" aria-label="Close" onClick={() => setLightboxOpen(false)}>×</button>
          <img src={images[safeActiveImg]} alt={displayName} />
        </ImageDialog>
      )}
    </Layout>
  );
};

export default PRODUCT_DETAIL;
