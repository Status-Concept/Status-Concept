import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import { getLangFromPath } from "../utils/language";
import photography from "../data/homepagePhotography.json";
import kitchenImg from "../assets/images/kitchen/kitchen-hero.webp";

function photograph(name) {
  const photo = photography.find((entry) => entry.name === name);
  return {
    src: photo.variants.at(-1).src,
    srcSet: photo.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    thumbnail: photo.variants[0].src,
    width: photo.width,
    height: photo.height,
  };
}
const berlin = photograph("berlin");
const dining = photograph("florida-orlando");
const showroom = photograph("showroom-quinta");
const showroomDetail = photograph("showroom-quinta-2");

const categories = [
  { key: "lounge", title: "Lounge", image: berlin.src, photo: berlin },
  { key: "dining", title: "Dining", image: dining.src, photo: dining },
  { key: "shade", title: "Shade Solutions", image: "/product-images/glatz/sombrano-s-plus/05.webp" },
  { key: "kitchen", title: "Outdoor Kitchens", image: kitchenImg },
];

const heroImages = [
  ["sicily", "Sicily modular lounge arrangement with a parasol"],
  ["berlin", "Berlin modular sofa on a waterfront terrace"],
  ["florida-orlando", "Florida dining table with Orlando dining armchairs on a terrace"],
  ["bella", "Bella reclining sofa set and coffee table"],
  ["reno", "Reno sofa set with matching armchairs"],
].map(([name, alt]) => {
  const photo = photograph(name);
  return {
    ...photo, alt,
    srcSet: `${photo.srcSet}, /photography/${name}-1920-ai.webp 1920w, /photography/${name}-3840-ai.webp 3840w`,
  };
});

const HomeMotion = lazy(() => import("../components/HomeMotion"));

export default function Homepage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const pt = getLangFromPath(useLocation().pathname) === "pt";
  const [heroSlide, setHeroSlide] = useState(0);
  const [playing, setPlaying] = useState(() => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const stopForReducedMotion = (event) => { if (event.matches) setPlaying(false); };
    preference?.addEventListener?.("change", stopForReducedMotion);
    return () => preference?.removeEventListener?.("change", stopForReducedMotion);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && heroRef.current?.getBoundingClientRect().bottom >= 0) {
        setHeroSlide((current) => (current + 1) % heroImages.length);
      }
    }, 6500);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <Layout>
      <main ref={pageRef} className="home-minimal home-authentic-photography">
        <section ref={heroRef} className="home-hero" aria-labelledby="home-title" aria-roledescription={pt ? "carrossel" : "carousel"} onFocus={(event) => {
          if (!event.target.matches(".home-hero-play") && event.target.matches(":focus-visible")) setPlaying(false);
        }}>
          <div className="home-hero-slides" aria-live={playing ? "off" : "polite"}>
            {heroImages.map((image, index) => (
              <img
                key={image.src}
                className={`home-hero-slide${heroSlide === index ? " is-active" : ""}`}
                src={image.src}
                srcSet={image.srcSet}
                sizes="max(100vw, 178svh)"
                width={image.width}
                height={image.height}
                fetchPriority={index === 0 ? "high" : "low"}
                loading={index === heroSlide ? "eager" : "lazy"}
                alt={heroSlide === index ? image.alt : ""}
                aria-hidden={heroSlide === index ? undefined : true}
              />
            ))}
          </div>
          <div className="home-hero-overlay" />
          <div className="home-hero-copy">
            <h1 id="home-title" className="ff">{pt ? "Viver ao ar livre." : "Live outdoors."}</h1>
          </div>
          <div className="home-hero-gallery" role="group" aria-label={pt ? "Controlos da galeria" : "Slideshow controls"}>
            <button type="button" className="home-hero-play" onClick={() => setPlaying(!playing)} aria-label={playing ? (pt ? "Pausar apresentação" : "Pause slideshow") : (pt ? "Retomar apresentação" : "Resume slideshow")}>
              <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d={playing ? "M5.5 3.5v9m5-9v9" : "m6 3.5 6 4.5-6 4.5z"} />
              </svg>
            </button>
            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                className={`home-hero-thumbnail${heroSlide === index ? " is-active" : ""}`}
                aria-label={pt ? `Ver foto ${index + 1}` : `Go to slide ${index + 1}`}
                aria-pressed={heroSlide === index}
                onClick={() => { setPlaying(false); setHeroSlide(index); }}
              >
                <img src={image.thumbnail} alt="" width="480" height="269" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <a className="home-scroll-cue" href="#home-categories" aria-label={pt ? "Desça para ver mais" : "Scroll to see more"} onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            categoriesRef.current?.focus({ preventScroll: true });
            categoriesRef.current?.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
          }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3v17m-7-7 7 7 7-7" /></svg>
          </a>
        </section>

        <section ref={categoriesRef} id="home-categories" className="home-categories" aria-labelledby="category-title" tabIndex={-1}>
          <div className="home-section-heading">
            <h2 id="category-title" className="ff">{pt ? "Explore o catálogo" : "Explore the catalogue"}</h2>
            <LocalizedLink className="home-text-link fs" to="/products">View all products <span aria-hidden="true">↗</span></LocalizedLink>
          </div>
          <div className="home-category-grid">
            {categories.map((category) => (
              <LocalizedLink key={category.key} className="home-category" to={`/products?cat=${category.key}`}>
                <span className="home-category-image"><img src={category.image} srcSet={category.photo?.srcSet} sizes="(max-width: 1040px) 46vw, (max-width: 1440px) 22vw, 320px" alt="" loading="lazy" decoding="async" /></span>
                <span className="home-category-name">{category.title}</span>
              </LocalizedLink>
            ))}
          </div>
        </section>

        <section className="home-visit" aria-labelledby="visit-title">
          <div className="home-visit-image"><img src={showroom.src} srcSet={showroom.srcSet} width={showroom.width} height={showroom.height} sizes="(max-width: 768px) 100vw, 60vw" alt={pt ? "Mobiliário de exterior no showroom da Quinta do Lago" : "Outdoor furniture at the Quinta do Lago showroom"} loading="lazy" decoding="async" /></div>
          <div className="home-visit-copy">
            <img className="home-visit-detail" src={showroomDetail.src} srcSet={showroomDetail.srcSet} width={showroomDetail.width} height={showroomDetail.height} sizes="(max-width: 768px) 44vw, 24vw" alt={pt ? "Outra vista do showroom da Quinta do Lago" : "Another view of the Quinta do Lago showroom"} loading="lazy" decoding="async" />
            <h2 id="visit-title" className="ff">{pt ? "Os nossos showrooms" : "Our showrooms"}</h2>
            <LocalizedLink className="home-text-link fs" to="/contact">Quinta do Lago · Almancil <span aria-hidden="true">↗</span></LocalizedLink>
          </div>
        </section>
      </main>
      <Suspense fallback={null}><HomeMotion pageRef={pageRef} /></Suspense>
    </Layout>
  );
}
