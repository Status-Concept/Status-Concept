import { useState } from "react";
import useNavLinks from "../useNavLinks";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import { glatzProducts } from "../data/glatzProducts";
import heroImg from "../assets/images/glatz/sunwing-casa-1.webp";
import catWoodImg from "../assets/images/glatz/cat-wood.jpg";
import catCentreImg from "../assets/images/glatz/cat-centre.png";
import catSidemastImg from "../assets/images/glatz/cat-sidemast.jpg";
import catVitaImg from "../assets/images/glatz/cat-vita.png";
import catWindproofImg from "../assets/images/glatz/cat-windproof.png";
import catGiantImg from "../assets/images/glatz/cat-giant.png";

const byId = Object.fromEntries(glatzProducts.map((p) => [p.id, p]));

const CATEGORIES = [
  { key: "sidemast", label: "Side-Mast Parasols", sub: "Garden parasols", img: catSidemastImg,
    blurb: "Cantilever shade that floats above the furniture: move freely beneath the canopy.",
    models: ["glatz-sunwing-casa", "glatz-sombrano-s-plus", "glatz-pendalex-p-plus", "glatz-ambiente-nova", "glatz-fortano", "glatz-vita-sfera"] },
  { key: "centre", label: "Aluminium Centre-Pole", sub: "Garden parasols", img: catCentreImg,
    blurb: "The everyday classics: precise, convenient and made for dining tables and terraces.",
    models: ["glatz-alu-twist", "glatz-alu-smart", "glatz-vita-torna", "glatz-vita-piana"] },
  { key: "wood", label: "Wood & Wood Look", sub: "Garden parasols", img: catWoodImg,
    blurb: "Warm, natural elegance: from precious timber to wind-resistant wood-look frames.",
    models: ["glatz-piazza", "glatz-teakwood", "glatz-alexo"] },
  { key: "vita", label: "VITA® Line", sub: "Design line", img: catVitaImg,
    blurb: "Glatz's design line: minimalist forms with fully resolved ergonomics.",
    models: ["glatz-vita-torna", "glatz-vita-piana", "glatz-vita-sfera"] },
  { key: "windproof", label: "Windproof Parasols", sub: "Contract line", img: catWindproofImg,
    blurb: "Engineered for exposed coastal terraces, restaurants and beach clubs.",
    models: ["glatz-fortano", "glatz-fortino-pro", "glatz-fortello-led", "glatz-fortello-pro", "glatz-fortero-pro"] },
  { key: "giant", label: "Giant Parasols", sub: "Contract line", img: catGiantImg,
    blurb: "Large-format Swiss shading for hotels, events and grand gatherings.",
    models: ["glatz-castello-pro", "glatz-palazzo-style", "glatz-palazzo-noblesse", "glatz-palazzo-royal"] },
];

const WHY = [
  { n: "1895", l: "Swiss made in Frauenfeld since" },
  { n: "19", l: "Models: the world's largest range" },
  { n: "20,000+", l: "Possible combinations" },
  { n: ">98%", l: "UV filtered: SPF 50 equivalent" },
];

const FABRICS = [
  { cls: "Class 5", mat: "100% polyacrylic · 300 g/m²", light: "350–700 sunny days", note: "Glatz recommends" },
  { cls: "Class 4", mat: "100% polyester staple fibre · 250 g/m²", light: "min. 350 days", note: "" },
  { cls: "Class 2", mat: "100% polyester · 220 g/m²", light: "80–160 days", note: "" },
];

const STATUS_CONCEPT_GLATZ = () => {
  useNavLinks();
  const navigate = useLocalizedNavigate();
  const { S } = useScrollAnimation();
  const [activeCat, setActiveCat] = useState("sidemast");
  const current = CATEGORIES.find((c) => c.key === activeCat);

  return (
    <Layout>
      {/* HERO */}
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={heroImg} alt="Glatz parasol on a terrace" />
      </section>
      <div className="rd-page-head">
        <span className="rd-kicker fs">Official Glatz partner · Swiss made since 1895</span>
        <h1 className="rd-title ff">Glatz Parasols</h1>
        <p className="rd-lede fs">The world's largest parasol range. Wind-tunnel tested Swiss shade engineering, supplied and cared for in the Algarve by Status Concept.</p>
      </div>

      {/* INTRO STATEMENT */}
      <section id="glatz-intro" data-animate style={{ padding: "var(--section-padding) 48px", textAlign: "center", ...S("glatz-intro") }}>
        <div className="la" style={{ margin: "0 auto 28px" }} />
        <p className="ff" style={{ fontSize: "clamp(20px,2.6vw,30px)", fontWeight: 300, lineHeight: 1.6, maxWidth: 760, margin: "0 auto", color: "var(--stone-l)" }}>
          Every Glatz parasol is designed and engineered in Switzerland. Production and assembly under one roof, every detail optimised for ergonomics, every model proven in the wind tunnel.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 36, flexWrap: "wrap" }}>
          <span className="mb">SWISSMADE</span><span className="mb">Wind-Tunnel Tested</span><span className="mb">UV Protection SPF 50</span><span className="mb">PFAS-Free Fabrics</span>
        </div>
      </section>

      {/* CATEGORY TILES — Glatz's flyout method */}
      <section id="glatz-cats" data-animate style={{ padding: "0 48px var(--section-padding)", ...S("glatz-cats") }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, maxWidth: 1240, margin: "0 auto" }}>
          {CATEGORIES.map((c) => (
            <div key={c.key} onClick={() => setActiveCat(c.key)}
              style={{ position: "relative", height: 230, cursor: "pointer", overflow: "hidden", borderRadius: 4,
                outline: activeCat === c.key ? "2px solid var(--gold)" : "1px solid var(--sand-l)", outlineOffset: -2,
                transition: "outline-color .3s" }}>
              <img src={c.img} alt={c.label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                filter: activeCat === c.key ? "brightness(.85)" : "brightness(.62)", transition: "filter .4s, transform .8s cubic-bezier(.16,1,.3,1)",
                transform: activeCat === c.key ? "scale(1.05)" : "scale(1)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(26,26,46,.78))" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                <span className="fs" style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--gold-l)", display: "block", marginBottom: 4 }}>{c.sub} · {c.models.length} models</span>
                <span className="ff" style={{ fontSize: 17, fontWeight: 400, color: "#fff", lineHeight: 1.2, display: "block" }}>{c.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTIVE CATEGORY — MODEL SHOWCASE */}
      <section style={{ padding: "var(--section-padding) 48px", background: "var(--cream-w)", borderTop: "1px solid var(--sand-l)", borderBottom: "1px solid var(--sand-l)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span className="fs sl">{current.sub}</span>
            <h2 className="ff" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 300, marginTop: 12, letterSpacing: "-0.01em" }}>{current.label}</h2>
            <p className="fs" style={{ fontSize: 14, color: "var(--sand-d)", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7, fontWeight: 300 }}>{current.blurb}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {current.models.map((id) => {
              const p = byId[id];
              if (!p) return null;
              return (
                <article key={id} className="rd-product-card" style={{ background: "#fff", borderRadius: 4, overflow: "hidden", border: "1px solid var(--sand-l)" }}>
                  <div style={{ height: 240, padding: 20, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", position: "relative" }}>
                    {p.tag && <span className={`tag ${p.tag === "New" ? "tag-new" : "tag-popular"}`} style={{ position: "absolute", top: 12, left: 12 }}>{p.tag}</span>}
                    <img src={p.img} alt={p.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <div style={{ padding: "18px 20px 20px", borderTop: "1px solid var(--sand-l)" }}>
                    <h3 className="ff" style={{ fontSize: 19, fontWeight: 400, marginBottom: 6 }}><LocalizedLink className="rd-card-link" to={`/product/${id}`}>{p.name}</LocalizedLink></h3>
                    <p className="fs" style={{ fontSize: 12.5, color: "var(--sand-d)", lineHeight: 1.6, fontWeight: 300, marginBottom: 12 }}>{p.desc}</p>
                    <span className="fs" style={{ fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", color: "var(--gold)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                      Discover <span style={{ display: "inline-block", width: 18, height: 1, background: "var(--gold)" }} />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY GLATZ */}
      <section id="glatz-why" data-animate style={{ padding: "var(--section-padding) 48px", textAlign: "center", ...S("glatz-why") }}>
        <span className="fs sl">Why Glatz</span>
        <h2 className="ff" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 300, marginTop: 12, marginBottom: 48, letterSpacing: "-0.01em" }}>Swiss shade engineering</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, maxWidth: 1100, margin: "0 auto" }}>
          {WHY.map((s) => (
            <div key={s.l}>
              <div className="ff" style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 300, color: "var(--gold)" }}>{s.n}</div>
              <div className="fs" style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "var(--sand-d)", marginTop: 10 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FABRICS */}
      <section id="glatz-fabrics" data-animate style={{ padding: "var(--section-padding) 48px", background: "var(--stone)", color: "#fff", ...S("glatz-fabrics") }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <span className="fs sl" style={{ color: "var(--gold-l)" }}>Made to measure</span>
          <h2 className="ff" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 300, marginTop: 12, marginBottom: 18, letterSpacing: "-0.01em" }}>70 colours. Three fabric qualities.</h2>
          <p className="fs" style={{ fontSize: 14, color: "rgba(255,255,255,.65)", maxWidth: 620, margin: "0 auto 44px", lineHeight: 1.8, fontWeight: 300 }}>
            From the "Morning Light" and "Sunset Glow" ranges. Every canopy filters more than 98% of UV rays, in every class. Choose your size, shape, frame finish and colour: over 20,000 combinations, configured with our team in the showroom.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {FABRICS.map((f) => (
              <div key={f.cls} style={{ border: "1px solid rgba(255,255,255,.14)", borderRadius: 4, padding: "26px 22px", textAlign: "left", background: "rgba(255,255,255,.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                  <span className="ff" style={{ fontSize: 21, fontWeight: 400 }}>{f.cls}</span>
                  {f.note && <span className="fs" style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--gold-l)" }}>{f.note}</span>}
                </div>
                <div className="fs" style={{ fontSize: 12.5, color: "rgba(255,255,255,.6)", lineHeight: 1.8, fontWeight: 300 }}>
                  {f.mat}<br />Colour-fast for {f.light}<br />UV protection &gt;98%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "var(--section-padding) 48px", textAlign: "center" }}>
        <span className="fs sl">See them in the Algarve sun</span>
        <h2 className="ff" style={{ fontSize: "clamp(28px,3.6vw,44px)", fontWeight: 300, marginTop: 12, marginBottom: 20, letterSpacing: "-0.01em" }}>Configure your Glatz with us</h2>
        <p className="fs" style={{ fontSize: 14, color: "var(--sand-d)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7, fontWeight: 300 }}>
          As a direct Glatz supplier we configure, deliver and install your parasol, and keep it beautiful with seasonal after care.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <LocalizedLink className="cb cg" to="/contact">Request quote</LocalizedLink>
          <LocalizedLink className="cb cd" to="/products?cat=shade">Browse all shade</LocalizedLink>
        </div>
      </section>
    </Layout>
  );
};

export default STATUS_CONCEPT_GLATZ;
