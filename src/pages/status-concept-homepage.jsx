import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import { allProducts } from "../data/productCatalog";
import { productSrcSet } from "../utils/imageVariants";
import { noImageProducts } from "../data/productImageStatus";
import hero1Img from "../assets/images/enhanced/hero-1.webp";
import hero3Img from "../assets/images/enhanced/hero-3.webp";
import hero4Img from "../assets/images/enhanced/hero-4.webp";
import sicilyImg from "../assets/images/sicily-modular-set-full.webp";
import shadeImg from "../assets/images/shade-parasols.jpg";
import kitchenImg from "../assets/images/kitchen/kitchen-hero.webp";
import diningImg from "../assets/images/prod-lounge-set.webp";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.webp";

const categories = [
  { key: "lounge", title: "Lounge", copy: "Upholstered, rope and aluminium seating.", image: sicilyImg },
  { key: "dining", title: "Dining", copy: "Tables, chairs and settings for outdoor meals.", image: diningImg },
  { key: "shade", title: "Shade Solutions", copy: "Pergolas, parasols and awnings.", image: shadeImg },
  { key: "kitchen", title: "Outdoor Kitchens", copy: "Modular kitchens, BBQs and accessories.", image: kitchenImg },
];

const productHasImage = (product) => product.category === "kitchen" || !noImageProducts.has(product.id);
const productRoute = (product) => product.route || `/product/${product.id}`;
const heroImages = [hero1Img, hero3Img, hero4Img];

export default function Homepage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const featured = ["lounge", "dining", "shade", "kitchen"]
    .map((category) => allProducts.find((product) => product.category === category && productHasImage(product) && product.img))
    .filter(Boolean);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const interval = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const moveHero = (direction) => {
    setHeroSlide((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  return (
    <Layout>
      <main className="home-minimal">
        <section className="home-hero" aria-labelledby="home-title" aria-roledescription="carousel" aria-label="Featured outdoor settings">
          <div className="home-hero-slides">
            {heroImages.map((image, index) => (
              <img
                key={image}
                className={`home-hero-slide${heroSlide === index ? " is-active" : ""}`}
                src={image}
                alt={heroSlide === index ? "A considered outdoor living space in the Algarve" : ""}
                aria-hidden={heroSlide === index ? undefined : true}
              />
            ))}
          </div>
          <div className="home-hero-overlay" />
          <div className="home-hero-copy">
            <span className="home-kicker fs">Outdoor living / Algarve</span>
            <h1 id="home-title" className="ff">Outdoor spaces,<br />made to stay outside.</h1>
            <LocalizedLink className="home-hero-link fs" to="/products">Explore the collection <span aria-hidden="true">↗</span></LocalizedLink>
          </div>
          <button type="button" className="home-hero-control home-hero-control-prev" onClick={() => moveHero(-1)} aria-label="Previous slide">‹</button>
          <button type="button" className="home-hero-control home-hero-control-next" onClick={() => moveHero(1)} aria-label="Next slide">›</button>
          <div className="home-hero-dots" role="tablist" aria-label="Choose hero slide">
            {heroImages.map((image, index) => (
              <button
                key={image}
                type="button"
                role="tab"
                className={`home-hero-dot${heroSlide === index ? " is-active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={heroSlide === index}
                onClick={() => setHeroSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className="home-categories" aria-labelledby="category-title">
          <div className="home-section-heading">
            <div>
              <span className="rd-kicker fs">The collection</span>
              <h2 id="category-title" className="ff">Find your outdoor room.</h2>
            </div>
            <LocalizedLink className="home-text-link fs" to="/products">View all products <span aria-hidden="true">↗</span></LocalizedLink>
          </div>
          <div className="home-category-grid">
            {categories.map((category, index) => (
              <LocalizedLink key={category.key} className={`home-category home-category-${index + 1}`} to={`/products?cat=${category.key}`}>
                <span className="home-category-image"><img src={category.image} alt="" loading="lazy" /></span>
                <span className="home-category-copy">
                  <span className="home-category-index fs">0{index + 1}</span>
                  <strong className="ff">{category.title}</strong>
                  <small className="fs">{category.copy}</small>
                  <span className="home-category-arrow" aria-hidden="true">↗</span>
                </span>
              </LocalizedLink>
            ))}
          </div>
        </section>

        <section className="home-featured" aria-labelledby="featured-title">
          <div className="home-section-heading">
            <div>
              <span className="rd-kicker fs">A considered edit</span>
              <h2 id="featured-title" className="ff">Selected pieces.</h2>
            </div>
            <p className="fs">Furniture, shade and kitchens selected for the Algarve climate.</p>
          </div>
          <div className="home-featured-grid">
            {featured.map((product) => (
              <LocalizedLink key={product.id} className="home-product" data-no-translate to={productRoute(product)} state={{ product }}>
                <span className="home-product-image">
                  <img src={product.img} srcSet={productSrcSet(product.img)} sizes="(max-width: 640px) 50vw, 25vw" alt={product.name} loading="lazy" decoding="async" />
                </span>
                <span className="home-product-meta">
                  <small className="fs">{product.categoryLabel || product.category}</small>
                  <strong className="ff">{product.name}</strong>
                </span>
              </LocalizedLink>
            ))}
          </div>
        </section>

        <section className="home-visit" aria-labelledby="visit-title">
          <div className="home-visit-image"><img src={showroomQuintaImg} alt="Status Concept showroom in Quinta do Lago" loading="lazy" /></div>
          <div className="home-visit-copy">
            <span className="rd-kicker fs">Visit in person</span>
            <h2 id="visit-title" className="ff">See the collection<br />in its setting.</h2>
            <p className="fs">Visit our showrooms in Quinta do Lago or Almancil. Our team can help you plan a complete outdoor space, from first sketch to installation.</p>
            <LocalizedLink className="home-text-link fs" to="/contact">Plan a showroom visit <span aria-hidden="true">↗</span></LocalizedLink>
          </div>
        </section>
      </main>
    </Layout>
  );
}
