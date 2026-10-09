import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import photography from "../data/homepagePhotography.json";
import shadeImg from "../assets/images/shade-parasols.jpg";
import kitchenImg from "../assets/images/kitchen/kitchen-hero.webp";

function photograph(name) {
  const photo = photography.find((entry) => entry.name === name);
  return {
    src: photo.variants.at(-1).src,
    srcSet: photo.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    width: photo.width,
    height: photo.height,
  };
}
const berlin = photograph("berlin");
const dining = photograph("florida-orlando");
const showroom = photograph("showroom-quinta");

const categories = [
  { key: "lounge", title: "Lounge", copy: "Upholstered, rope and aluminium seating.", image: berlin.src, photo: berlin, alt: "Berlin modular sofa overlooking the water" },
  { key: "dining", title: "Dining", copy: "Tables, chairs and settings for outdoor meals.", image: dining.src, photo: dining, alt: "Florida dining table with Orlando dining armchairs" },
  { key: "shade", title: "Shade Solutions", copy: "Pergolas, parasols and awnings.", image: shadeImg },
  { key: "kitchen", title: "Outdoor Kitchens", copy: "Modular kitchens, BBQs and accessories.", image: kitchenImg },
];

const heroImages = [
  { ...photograph("sicily"), alt: "Sicily modular lounge arrangement with a parasol" },
  { ...berlin, alt: "Berlin modular sofa on a waterfront terrace" },
  { ...dining, alt: "Florida dining table with Orlando dining armchairs on a terrace" },
  { ...photograph("bella"), alt: "Bella reclining sofa set and coffee table" },
  { ...photograph("reno"), alt: "Reno sofa set with matching armchairs" },
];

export default function Homepage() {
  const [heroSlide, setHeroSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(() => document.hidden);

  useEffect(() => {
    const updateVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (paused || hidden) return undefined;
    // Restart the full viewing period after an arrow/dot selection too.
    const timer = window.setTimeout(() => {
      setHeroSlide((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [heroSlide, paused, hidden]);

  const moveHero = (direction) => {
    setHeroSlide((current) => (current + direction + heroImages.length) % heroImages.length);
  };

  return (
    <Layout>
      <main className="home-minimal home-authentic-photography">
        <section className="home-hero" aria-labelledby="home-title" aria-roledescription="carousel" aria-label="Featured outdoor settings">
          <div className="home-hero-slides">
            {heroImages.map((image, index) => (
              <img
                key={image.src}
                className={`home-hero-slide${heroSlide === index ? " is-active" : ""}`}
                src={image.src}
                srcSet={image.srcSet}
                sizes="100vw"
                width={image.width}
                height={image.height}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === heroSlide || index === (heroSlide + 1) % heroImages.length ? "eager" : "lazy"}
                alt={heroSlide === index ? image.alt : ""}
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
          <div className="home-hero-dots" role="group" aria-label="Choose hero slide">
            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`home-hero-dot${heroSlide === index ? " is-active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={heroSlide === index}
                onClick={() => setHeroSlide(index)}
              />
            ))}
            <button type="button" className="home-hero-pause fs" aria-label={paused ? "Play slideshow" : "Pause slideshow"} aria-pressed={paused} onClick={() => setPaused((current) => !current)}>{paused ? "▶ Play" : "Ⅱ Pause"}</button>
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
                <span className="home-category-image"><img src={category.image} srcSet={category.photo?.srcSet} sizes="(max-width: 768px) 100vw, 60vw" alt={category.alt || ""} loading="lazy" decoding="async" /></span>
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

        <section className="home-visit" aria-labelledby="visit-title">
          <div className="home-visit-image"><img {...showroom} sizes="(max-width: 768px) 100vw, 60vw" alt="Outdoor furniture displays at the Status Concept Quinta do Lago showroom" loading="lazy" decoding="async" /></div>
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
