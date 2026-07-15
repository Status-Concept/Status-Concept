import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LocalizedLink from "./LocalizedLink";
import { catalogProducts } from "../data/catalogProducts";
import { glatzProducts } from "../data/glatzProducts";
import { kitchenProducts } from "../data/kitchenProducts";
import { getLangFromPath, withLang } from "../utils/language";
import { rankProducts, uniqueProducts } from "../utils/productSearch";

const products = uniqueProducts([
  ...catalogProducts,
  ...glatzProducts,
  ...kitchenProducts,
]);

const copy = {
  en: {
    label: "Search products",
    placeholder: "Are you looking for a specific product?",
    close: "Close",
    clear: "Clear",
    hint: "Enter at least two characters",
    empty: "No products matched your search",
    result: "result",
    results: "results",
    all: "View all results",
  },
  pt: {
    label: "Pesquisar produtos",
    placeholder: "Procura um produto especifico?",
    close: "Fechar",
    clear: "Limpar",
    hint: "Introduza pelo menos dois caracteres",
    empty: "Nenhum produto corresponde a pesquisa",
    result: "resultado",
    results: "resultados",
    all: "Ver todos os resultados",
  },
};

const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const productRoute = (product) => product.route || `/product/${product.id || slug(product.name)}`;
const productCategory = (product) => product.categoryLabel || product.collectionName || product.collection || product.category || "Outdoor living";

export default function ProductSearch({ onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const language = getLangFromPath(location.pathname);
  const labels = copy[language] || copy.en;
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const matches = useMemo(() => rankProducts(products, query), [query]);
  const visibleResults = matches.slice(0, 8);
  const hasQuery = query.trim().length >= 2;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const openAllResults = () => {
    const value = query.trim();
    if (value.length < 2) return;
    navigate(withLang(`/products?q=${encodeURIComponent(value)}`, language));
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const activeProduct = visibleResults[activeIndex];
    if (activeProduct) {
      navigate(withLang(productRoute(activeProduct), language), { state: { product: activeProduct } });
      onClose();
      return;
    }
    openAllResults();
  };

  const handleKeyDown = (event) => {
    if (!visibleResults.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % visibleResults.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current <= 0 ? visibleResults.length - 1 : current - 1));
    }
  };

  return (
    <div className="site-search-panel" role="search">
      <div className="site-search-inner">
        <form className="site-search-form" onSubmit={handleSubmit}>
          <label className="site-search-label fs" htmlFor="site-product-search">{labels.label}</label>
          <div className="site-search-field">
            <span className="site-search-field-icon" aria-hidden="true" />
            <input
              ref={inputRef}
              id="site-product-search"
              type="search"
              value={query}
              placeholder={labels.placeholder}
              autoComplete="off"
              aria-autocomplete="list"
              aria-controls="site-search-results"
              aria-expanded={hasQuery}
              aria-activedescendant={activeIndex >= 0 ? `site-search-result-${activeIndex}` : undefined}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button type="button" className="site-search-clear fs" onClick={() => setQuery("")}>
                {labels.clear}
              </button>
            )}
            <button type="button" className="site-search-close fs" onClick={onClose}>
              {labels.close}
            </button>
          </div>
        </form>

        <div className="site-search-status fs" aria-live="polite">
          {!hasQuery
            ? labels.hint
            : matches.length
              ? `${matches.length} ${matches.length === 1 ? labels.result : labels.results}`
              : labels.empty}
        </div>

        {hasQuery && visibleResults.length > 0 && (
          <>
            <ul id="site-search-results" className="site-search-results" role="listbox">
              {visibleResults.map((product, index) => (
                <li
                  id={`site-search-result-${index}`}
                  key={product.id || product.name}
                  role="option"
                  aria-selected={activeIndex === index}
                  className={activeIndex === index ? "active" : ""}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <LocalizedLink
                    to={productRoute(product)}
                    state={{ product }}
                    onClick={onClose}
                    data-no-translate
                  >
                    <span className="site-search-result-media" aria-hidden="true">S</span>
                    <span className="site-search-result-copy">
                      <strong>{product.name}</strong>
                      <span>{productCategory(product)}</span>
                    </span>
                    <span className="site-search-result-arrow" aria-hidden="true">→</span>
                  </LocalizedLink>
                </li>
              ))}
            </ul>
            {matches.length > visibleResults.length && (
              <button type="button" className="site-search-all fs" onClick={openAllResults}>
                {labels.all} <span aria-hidden="true">→</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
