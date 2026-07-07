import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import heroImg from "../assets/images/enhanced/hero-2.webp";

const COVERS = [
  ["Seasonal cleaning", "Deep cleaning of frames, cushions and fabrics at the turn of each season, so surfaces stay as they arrived."],
  ["Maintenance & repairs", "Checks and small repairs by our own team — fixings, mechanisms and fabric care handled before they become problems."],
  ["Winter care & storage", "Protection and storage through the off-season, so the terrace is ready the day you return, not a project when you arrive."],
];

const STEPS = [
  ["We visit and assess", "Our team looks at your pieces in place and notes what each one needs through the year."],
  ["You get a care proposal", "A clear plan for the season ahead, tailored to your furniture and your home."],
  ["Your pieces are looked after", "We carry out the care each season, keeping every piece as it was delivered."],
];

const enquireState = { interest: "After Care Service" };

export default function AfterCare() {
  return (
    <Layout>
      <section className="rd-page-hero" style={{ minHeight: "46vh" }}>
        <img className="rd-hero-img" src={heroImg} alt="" />
        <div className="rd-hero-inner">
          <span className="rd-kicker fs">After Care &amp; Valet Service</span>
          <h1 className="rd-title ff">Delivered. Then looked after.</h1>
          <p className="rd-lede fs">Seasonal cleaning, maintenance and winter care by our own team — so the terrace is ready the day you arrive, not a project when you do.</p>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">What it covers</span>
            <h2 className="ff">Care that continues after delivery</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {COVERS.map(([title, body]) => (
            <div key={title} style={{ padding: "28px 26px", background: "var(--light-grey)", borderRadius: 3 }}>
              <h3 className="ff" style={{ fontSize: 20, fontWeight: 400, marginBottom: 10, color: "var(--text-dark)" }}>{title}</h3>
              <p className="fs" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">How it works</span>
            <h2 className="ff">Three steps, every season</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {STEPS.map(([title, body], i) => (
            <div key={title}>
              <div className="ff" style={{ fontSize: 32, fontWeight: 300, color: "var(--accent)", marginBottom: 10 }} aria-hidden="true">{i + 1}</div>
              <h3 className="ff" style={{ fontSize: 18, fontWeight: 400, marginBottom: 8, color: "var(--text-dark)" }}>{title}</h3>
              <p className="fs" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rd-section" style={{ textAlign: "center" }}>
        <span className="rd-kicker fs">Keep every piece as day one</span>
        <h2 className="ff" style={{ fontSize: "clamp(28px, 3.6vw, 42px)", fontWeight: 300, margin: "10px 0 22px" }}>Plan your After Care with us</h2>
        <p className="rd-lede fs" style={{ margin: "0 auto 32px" }}>Tell us about your outdoor space and we will prepare a seasonal care plan around it.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <LocalizedLink className="cb cg" to="/contact" state={enquireState}>Request After Care</LocalizedLink>
          <LocalizedLink className="cb cd" to="/contact" state={enquireState}>Book a showroom visit</LocalizedLink>
        </div>
      </section>
    </Layout>
  );
}
