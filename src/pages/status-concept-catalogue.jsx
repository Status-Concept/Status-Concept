// v1: on-site index only. PDF export deferred — open questions: gate behind
// email capture (ties to the subscribers table)? per-collection PDFs? A print
// stylesheet (@media print) may be the cheapest path later. The comment is the
// deliverable for that decision; nothing print-related is built here.
import { useRef } from "react";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import NoImagePlaceholder from "../components/NoImagePlaceholder";
import { catalogProducts } from "../data/catalogProducts";
import { glatzProducts } from "../data/glatzProducts";
import { kitchenProducts } from "../data/kitchenProducts";
import { noImageProducts } from "../data/productImageStatus";
import { productSrcSet } from "../utils/imageVariants";

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const hasImage = (product) => product.category === "kitchen" || !noImageProducts.has(product.id);
const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;

// Fixed category order for the index; label falls back to the data's own.
const CATEGORY_ORDER = [
  { key: "lounge", label: "Lounge" },
  { key: "dining", label: "Dining" },
  { key: "sunlounger", label: "Sun Loungers & Day Beds" },
  { key: "shade", label: "Shade Solutions" },
  { key: "kitchen", label: "Outdoor Kitchens" },
];

const ALL = [...catalogProducts, ...glatzProducts, ...kitchenProducts];

export default function Catalogue() {
  const sectionsRef = useRef({});
  const grouped = CATEGORY_ORDER.map((cat) => ({
    ...cat,
    items: ALL.filter((p) => p.category === cat.key),
  })).filter((g) => g.items.length > 0);

  const jumpTo = (key) => sectionsRef.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Layout>
      <div className="rd-page-head">
        <span className="rd-kicker fs">Catalogue</span>
        <h1 className="rd-title ff">Catalogue</h1>
        <p className="rd-lede fs">Every piece in one place — browse the full range by category, then open any product for details.</p>
        <div className="rd-range-strip" role="group" aria-label="Jump to category" style={{ marginTop: 20 }}>
          {grouped.map((g) => (
            <button key={g.key} type="button" className="rd-range-chip" onClick={() => jumpTo(g.key)}>{g.label}</button>
          ))}
        </div>
      </div>

      <main className="rd-products-layout">
        {grouped.map((g) => (
          <section key={g.key} ref={(el) => { sectionsRef.current[g.key] = el; }} style={{ marginBottom: 48 }}>
            <div className="rd-products-toolbar">
              <div>
                <span className="rd-kicker fs">{g.label}</span>
                <p className="rd-count fs">{g.items.length} products shown</p>
              </div>
            </div>
            <div className="rd-product-grid editorial">
              {g.items.map((product) => (
                <article key={product.id || product.name} className="rd-product-card">
                  <div className="rd-product-media">
                    {hasImage(product)
                      ? <img src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 300px" alt={product.name} loading="lazy" decoding="async" />
                      : <NoImagePlaceholder />}
                  </div>
                  <div className="rd-product-info">
                    <span className="rd-product-cat fs">{product.collectionName || product.collection || g.label}</span>
                    <h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={productRoute(product)} state={{ product }}>{product.name}</LocalizedLink></h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
