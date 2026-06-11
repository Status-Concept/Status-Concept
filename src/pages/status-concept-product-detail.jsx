import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import { kitchenProductDetails, kitchenProducts } from "../data/kitchenProducts";
import { glatzProductDetails, glatzProducts } from "../data/glatzProducts";
import { getLangFromPath, withLang } from "../utils/language";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";
import baliDivanoImg from "../assets/images/bali-divano.jpg";
import mayaImg from "../assets/images/maya.jpg";
import boraBoraImg from "../assets/images/bora-bora.jpg";
import berlinImg from "../assets/images/berlin.jpg";

const titleFromSlug = (value = "product") => value
  .split("-")
  .filter(Boolean)
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const PRODUCT_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const currentLang = getLangFromPath(location.pathname);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allProducts = {
    ...kitchenProductDetails,
    ...glatzProductDetails,
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
  const product = allProducts[id] || {
    id,
    name: passedProduct?.name || titleFromSlug(id),
    collection: passedProduct?.collectionName || passedProduct?.collection || "Status Concept",
    category: passedProduct?.category || "catalog",
    tagline: passedProduct?.desc || "Detailed specifications for this product are being prepared. Contact the showroom team for current availability, finishes and dimensions.",
    images: passedProduct?.images?.length ? passedProduct.images : [passedProduct?.img || sicilyCornerImg],
    specs: [
      { label: "Status", value: "Details available on request" },
      { label: "Category", value: "Outdoor living" },
    ],
    materials: ["Product information available through the showroom team"],
  };
  const images = product.images?.length ? product.images : [product.image || sicilyCornerImg];
  const safeActiveImg = activeImg < images.length ? activeImg : 0;
  const goTo = (path) => navigate(withLang(path, currentLang));

  const isSameCollection = product.category === "kitchen" || product.id === "sicily-modular-set";
  const relatedProducts = (() => {
    if (product.category === "kitchen") {
      return kitchenProducts
        .filter((item) => item.id !== product.id && (item.collection === product.collectionSlug || item.collectionName === product.collection))
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
      { id: "bali-lounge-set", name: "Bali Lounge Set", collectionName: "Bali", img: baliDivanoImg, route: "/product/bali-lounge-set" },
      { id: "maya-sofa-set", name: "Maya Sofa Set", collectionName: "Maya", img: mayaImg, route: "/product/maya-sofa-set" },
      { id: "berlin-sofa-set", name: "Berlin Sofa Set", collectionName: "Berlin", img: berlinImg, route: "/product/berlin-sofa-set" },
      { id: "bora-bora-sofa-set", name: "Bora Bora Sofa Set", collectionName: "Bora Bora", img: boraBoraImg, route: "/product/bora-bora-sofa-set" },
    ].filter((item) => item.id !== product.id).slice(0, 4);
  })();

  const renderTab = () => {
    if (activeTab === "dimensions") {
      return (
        <table className="rd-dim-table fs">
          <thead>
            <tr>
              {["Piece", "W", "D", "H", "Seat H"].map((heading) => <th key={heading}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {(product.dims || []).map((row) => (
              <tr key={row.piece}>
                <td>{row.piece}</td>
                <td>{row.w}</td>
                <td>{row.d}</td>
                <td>{row.h}</td>
                <td>{row.sh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === "materials") {
      return (
        <div className="rd-spec-list fs">
          {(product.materials || []).map((material) => (
            <div key={material}>
              <span>{material}</span>
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
            <strong>{spec.value}</strong>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <main className="rd-detail-layout">
        <section className="rd-gallery-sticky" aria-label="Product gallery">
          <div className="rd-thumbs">
            {images.map((image, index) => (
              <img
                key={image + index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className={`rd-thumb ${activeImg === index ? "active" : ""}`}
                onClick={() => setActiveImg(index)}
              />
            ))}
          </div>
          <div className="rd-main-photo" onClick={() => setLightboxOpen(true)}>
            {product.tag && <span className={`tag ${product.tag === "New" ? "tag-new" : "tag-popular"}`} style={{ position: "absolute", top: 16, left: 16, zIndex: 3 }}>{product.tag}</span>}
            <FavoriteButton product={{ id: product.id || id, name: product.name, collection: product.collection, img: images[0], route: `/product/${product.id || id}` }} size={18} style={{ position: "absolute", top: 16, right: 16 }} />
            <img src={images[safeActiveImg]} alt={product.name} />
          </div>
        </section>

        <aside className="rd-product-panel">
          <button type="button" className="rd-back-link" onClick={() => goTo("/products")}>Back to products</button>
          <span className="rd-kicker fs" style={{ marginTop: 28 }}>{product.collection} Collection</span>
          <h1 className="rd-title ff" style={{ color: "var(--stone)", fontSize: "clamp(36px, 4.6vw, 58px)" }}>{product.name}</h1>
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
                    padding: "16px 20px", border: i === 0 ? "2px solid var(--gold)" : "1px solid var(--sand-l)",
                    background: i === 0 ? "rgba(196,30,58,.06)" : "transparent", borderRadius: 4, cursor: "pointer",
                    transition: "all .3s", textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.background = "rgba(196,30,58,.06)"; }}
                  onMouseLeave={e => { if (i !== 0) { e.currentTarget.style.borderColor = "var(--sand-l)"; e.currentTarget.style.background = "transparent"; } }}
                  >
                    <div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--stone)", display: "block" }}>{opt.label}</span>
                      <span style={{ fontSize: 11, color: "var(--sand-d)", marginTop: 2, display: "block" }}>{opt.dimensions}</span>
                    </div>
                    <span style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--sand-d)", whiteSpace: "nowrap" }}>SKU: {opt.sku}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <button type="button" className="cb cg" onClick={() => goTo("/contact")}>Request quote</button>
            <button type="button" className="cb cd" onClick={() => goTo("/contact")}>Book showroom</button>
          </div>

          <div className="rd-tabs">
            {[
              { key: "specs", label: "Specs" },
              { key: "dimensions", label: "Dimensions" },
              { key: "materials", label: "Materials" },
            ].map((tab) => (
              <button key={tab.key} type="button" className={`rd-tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="rd-tab-panel">{renderTab()}</div>
        </aside>
      </main>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">{isSameCollection ? "Same collection" : "From the catalogue"}</span>
            <h2 className="ff">{isSameCollection ? "Pieces that work together" : "You may also like"}</h2>
          </div>
          <button type="button" className="rd-back-link" onClick={() => goTo("/products")}>View all</button>
        </div>
        <div className="rd-horizontal-scroll">
          {relatedProducts.map((item) => (
            <article key={item.id} className="rd-product-card" onClick={() => navigate(withLang(item.route || `/product/${item.id}`, currentLang), { state: { product: item } })}>
              <div className="rd-product-media">
                <FavoriteButton product={{ id: item.id, name: item.name, collection: item.collectionName || item.collection, img: item.img, route: item.route || `/product/${item.id}` }} size={15} style={{ position: "absolute", top: 12, right: 12 }} />
                <img src={item.img} alt={item.name} />
              </div>
              <div className="rd-product-info">
                <h3 className="ff">{item.name}</h3>
                <div className="rd-product-meta fs">
                  <span>{item.collectionName || item.collection}</span>
                  <span>View</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="rd-mobile-cta">
        <button type="button" className="cb cg" style={{ width: "100%", justifyContent: "center" }} onClick={() => goTo("/contact")}>Request quote</button>
      </div>

      {lightboxOpen && (
        <div className="rd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)}>x</button>
          <img src={images[safeActiveImg]} alt={product.name} />
        </div>
      )}
    </Layout>
  );
};

export default PRODUCT_DETAIL;
