import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import { kitchenProductDetails, kitchenProducts } from "../data/kitchenProducts";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";

const PRODUCT_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState("specs");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const allProducts = {
    ...kitchenProductDetails,
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

  const product = allProducts[id] || allProducts["sicily-modular-set"];
  const images = product.images?.length ? product.images : [product.image || sicilyCornerImg];

  const relatedProducts = useMemo(() => {
    if (product.category === "kitchen") {
      return kitchenProducts
        .filter((item) => item.id !== product.id && (item.collection === product.collectionSlug || item.collectionName === product.collection))
        .slice(0, 6);
    }
    return [
      { id: "sicily-modular-set", name: "Sicily Modular Set", collectionName: "Sicily", img: sicilyCornerImg, route: "/product/sicily-modular-set" },
      { id: "sicily-centre-module", name: "Sicily Centre Module", collectionName: "Sicily", img: sicilyCentreImg, route: "/product/sicily-modular-set" },
      { id: "sicily-ottoman", name: "Sicily Ottoman", collectionName: "Sicily", img: sicilyOttomanImg, route: "/product/sicily-modular-set" },
    ];
  }, [product]);

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
            <img src={images[activeImg]} alt={product.name} />
          </div>
        </section>

        <aside className="rd-product-panel">
          <button type="button" className="rd-back-link" onClick={() => navigate("/products")}>Back to products</button>
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
            <button type="button" className="cb cg" onClick={() => navigate("/contact")}>Request quote</button>
            <button type="button" className="cb cd" onClick={() => navigate("/contact")}>Book showroom</button>
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
            <span className="rd-kicker fs">Same collection</span>
            <h2 className="ff">Pieces that work together</h2>
          </div>
          <button type="button" className="rd-back-link" onClick={() => navigate("/products")}>View all</button>
        </div>
        <div className="rd-horizontal-scroll">
          {relatedProducts.map((item) => (
            <article key={item.id} className="rd-product-card" onClick={() => navigate(item.route || `/product/${item.id}`)}>
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
        <button type="button" className="cb cg" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/contact")}>Request quote</button>
      </div>

      {lightboxOpen && (
        <div className="rd-lightbox" onClick={() => setLightboxOpen(false)}>
          <button type="button" onClick={() => setLightboxOpen(false)}>x</button>
          <img src={images[activeImg]} alt={product.name} />
        </div>
      )}
    </Layout>
  );
};

export default PRODUCT_DETAIL;
