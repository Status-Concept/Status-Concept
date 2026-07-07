import { useState } from "react";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import { useFavorites } from "../FavoritesContext";
import { whatsappUrl, whatsappShortlistMessage } from "../utils/whatsapp";
import sicilyCornerImg from "../assets/images/sicily-corner.jpg";

const FAVORITES_PAGE = () => {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [removingId, setRemovingId] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const removeWithMotion = (event, id) => {
    event.stopPropagation();
    setRemovingId(id);
    setTimeout(() => {
      removeFavorite(id);
      setRemovingId(null);
    }, 240);
  };

  const clearAll = () => {
    if (confirmClear) {
      clearFavorites();
      setConfirmClear(false);
      return;
    }
    setConfirmClear(true);
    setTimeout(() => setConfirmClear(false), 3000);
  };

  return (
    <Layout>
      <section className="rd-page-hero" style={{ minHeight: "42vh" }}>
        <img className="rd-hero-img" src={sicilyCornerImg} alt="" />
        <div className="rd-hero-inner">
          <span className="rd-kicker fs">My selection</span>
          <h1 className="rd-title ff">Favorites</h1>
          <p className="rd-lede fs">
            {favorites.length === 0
              ? "Save products you love and build a shortlist before requesting a proposal."
              : `${favorites.length} saved ${favorites.length === 1 ? "piece" : "pieces"} ready for review.`}
          </p>
        </div>
      </section>

      {favorites.length === 0 ? (
        <section className="rd-empty-favorites">
          <svg width="92" height="92" viewBox="0 0 24 24" fill="none" stroke="var(--sand)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 28 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="rd-kicker fs">Nothing saved yet</span>
          <h2 className="ff" style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 300, margin: "8px 0 16px" }}>Start a shortlist</h2>
          <p className="rd-lede fs" style={{ margin: "0 auto 32px" }}>Tap the heart on any product or collection and it will appear here for easy comparison.</p>
          <LocalizedLink className="cb cd" to="/products">Browse products</LocalizedLink>
        </section>
      ) : (
        <>
          <section className="rd-section">
            <div className="rd-section-head">
              <div>
                <span className="rd-kicker fs">Saved pieces</span>
                <h2 className="ff">Your current shortlist</h2>
              </div>
              <button type="button" className="rd-back-link" onClick={clearAll}>{confirmClear ? "Confirm clear all" : "Clear all"}</button>
            </div>

            <div className="rd-favorites-grid">
              {favorites.map((item) => (
                <article
                  key={item.id}
                  className={`rd-fav-card rd-product-card ${removingId === item.id ? "removing" : ""}`}
                >
                  <button type="button" className="rd-remove-x" onClick={(event) => removeWithMotion(event, item.id)}>x</button>
                  <div className="rd-product-media">
                    <img src={item.img || item.image || sicilyCornerImg} alt={item.name || item.id} />
                    <div className="rd-product-overlay">
                      <span className="rd-overlay-pill fs">View details</span>
                    </div>
                  </div>
                  <div className="rd-product-info">
                    <h3 className="ff"><LocalizedLink className="rd-card-link" data-no-translate to={item.route || `/product/${item.id}`}>{item.name || item.id}</LocalizedLink></h3>
                    <div className="rd-product-meta fs">
                      <span>{item.collection || "Statvs"}</span>
                      <span>Saved</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="rd-sticky-quote">
            <div>
              <span className="rd-kicker fs" style={{ marginBottom: 0 }}>Ready to quote</span>
              <p className="fs rd-count">{favorites.length} selected {favorites.length === 1 ? "item" : "items"}</p>
            </div>
            <LocalizedLink className="cb cg" to="/contact" state={{ shortlist: favorites.map((f) => f.name || f.id) }}>Request a proposal for these</LocalizedLink>
            <a className="cb cd" href={whatsappUrl(whatsappShortlistMessage(favorites.map((f) => f.name || f.id)))} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>
        </>
      )}
    </Layout>
  );
};

export default FAVORITES_PAGE;
