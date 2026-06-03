import { useNavigate } from "react-router-dom";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import FavoriteButton from "../FavoriteButton";
import collectionBellaImg from "../assets/images/collection-bella.jpg";
import collectionSicilyImg from "../assets/images/collection-sicily.jpg";
import collectionLagunaImg from "../assets/images/collection-laguna.jpg";
import collectionCairoImg from "../assets/images/collection-cairo.jpg";
import collectionMiamiImg from "../assets/images/collection-miami.jpg";
import collectionOxfordImg from "../assets/images/collection-oxford.jpg";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";
import sicilyCentreImg from "../assets/images/sicily-centre.jpg";
import sicilyOttomanImg from "../assets/images/sicily-ottoman.jpg";
import prodLoungeImg from "../assets/images/prod-lounge-set.jpg";
import prodCoffeeImg from "../assets/images/prod-coffee-table.jpg";
import prodArmchairImg from "../assets/images/prod-armchair.jpg";

const COLLECTION_DETAIL = () => {
  useNavLinks();
  const navigate = useNavigate();

  const collection = {
    name: "Bella",
    tagline: "Reclining elegance for outdoor rooms",
    desc: "The Bella collection brings together sophisticated proportions, soft outdoor comfort and practical modular flexibility. It is presented as a premium lounge and dining story for homes that use their terraces every day.",
    hero: collectionBellaImg,
    gallery: [collectionBellaImg, sicilyCornerImg, sicilyCentreImg, sicilyOttomanImg, collectionLagunaImg, collectionOxfordImg],
    materials: [
      { title: "Sunbrella Fabrics", desc: "UV resistant upholstery selected for colour stability and daily outdoor use." },
      { title: "Interpon Finish", desc: "Powder coated aluminium protection for coastal weather and long-term durability." },
      { title: "Quick-dry Comfort", desc: "Outdoor foam systems designed to recover quickly after humid mornings or rain." },
      { title: "Modular Logic", desc: "Pieces can be combined into lounge, dining and relaxed entertaining layouts." },
    ],
    products: [
      { id: "bella-3-seat-reclining-sofa", name: "Bella 3-Seat Reclining Sofa", type: "Sofa", img: prodLoungeImg },
      { id: "bella-2-seat-reclining-sofa", name: "Bella 2-Seat Reclining Sofa", type: "Sofa", img: sicilyCentreImg },
      { id: "bella-reclining-dining-set", name: "Bella Reclining Dining Set", type: "Dining Set", img: collectionLagunaImg },
      { id: "bella-dining-table", name: "Bella Dining Table", type: "Table", img: prodCoffeeImg },
      { id: "bella-dining-chair", name: "Bella Dining Chair", type: "Chair", img: prodArmchairImg },
      { id: "bella-coffee-table", name: "Bella Coffee Table", type: "Coffee Table", img: prodCoffeeImg },
    ],
    otherCollections: [
      { name: "Sicily", img: collectionSicilyImg },
      { name: "Laguna", img: collectionLagunaImg },
      { name: "Cairo", img: collectionCairoImg },
      { name: "Miami", img: collectionMiamiImg },
      { name: "Oxford", img: collectionOxfordImg },
    ],
  };

  return (
    <Layout>
      <section className="rd-full-hero">
        <img src={collection.hero} alt={collection.name} />
        <div className="rd-full-hero-content">
          <span className="rd-kicker fs" style={{ color: "rgba(255,255,255,.7)" }}>Collection</span>
          <h1 className="rd-title ff">{collection.name}</h1>
          <p className="rd-lede fs">{collection.tagline}</p>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">About the collection</span>
            <h2 className="ff">A complete outdoor language</h2>
          </div>
          <button type="button" className="cb cd" onClick={() => navigate("/contact")}>Request quote</button>
        </div>
        <p className="rd-lede fs">{collection.desc}</p>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Gallery</span>
            <h2 className="ff">Materials, shapes and setting</h2>
          </div>
        </div>
        <div className="rd-masonry">
          {collection.gallery.map((image, index) => (
            <figure key={image + index} className="rd-masonry-item">
              <img src={image} alt={`${collection.name} view ${index + 1}`} style={{ aspectRatio: index % 2 === 0 ? "4 / 5" : "5 / 4" }} />
            </figure>
          ))}
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Material palette</span>
            <h2 className="ff">Built for Algarve conditions</h2>
          </div>
        </div>
        <div className="rd-material-grid">
          {collection.materials.map((material) => (
            <article key={material.title} className="rd-material-card">
              <h3 className="ff">{material.title}</h3>
              <p className="fs rd-lede" style={{ fontSize: 13 }}>{material.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Shop the range</span>
            <h2 className="ff">Bella products</h2>
          </div>
          <span className="fs rd-count">{collection.products.length} pieces</span>
        </div>
        <div className="rd-bento-grid">
          {collection.products.map((product) => (
            <article key={product.id} className="rd-bento-card" onClick={() => navigate(`/product/${product.id}`)}>
              <FavoriteButton product={{ ...product, collection: collection.name, route: `/product/${product.id}` }} size={16} style={{ position: "absolute", top: 12, right: 12, zIndex: 4 }} />
              <img src={product.img} alt={product.name} />
              <div>
                <span className="fs" style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-l)" }}>{product.type}</span>
                <h3 className="ff" style={{ fontSize: 25, fontWeight: 400 }}>{product.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Discover more</span>
            <h2 className="ff">Other collections</h2>
          </div>
          <button type="button" className="rd-back-link" onClick={() => navigate("/products")}>View all products</button>
        </div>
        <div className="rd-horizontal-scroll">
          {collection.otherCollections.map((item) => (
            <article key={item.name} className="rd-collection-choice-card" style={{ minHeight: 330 }} onClick={() => navigate("/collection")}>
              <img src={item.img} alt={item.name} />
              <div>
                <span className="rd-kicker fs" style={{ color: "var(--gold-l)" }}>Collection</span>
                <h3 className="ff">{item.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default COLLECTION_DETAIL;
