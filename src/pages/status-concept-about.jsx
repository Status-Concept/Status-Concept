import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.png";
import whyStatusImg from "../assets/images/why-status.jpg";

const ABOUT_PAGE = () => {
  useNavLinks();
  const navigate = useLocalizedNavigate();

  const timeline = [
    { year: "2013", title: "The first outdoor vision", desc: "Statvs begins with a focused idea: bring high-quality outdoor furniture to the Algarve with proper guidance, materials and service." },
    { year: "2016", title: "A stronger supplier network", desc: "Partnerships expand across premium European manufacturers, giving clients more choice in finishes, fabrics and modular systems." },
    { year: "2019", title: "Showroom experience", desc: "The showroom model becomes central, allowing clients to see scale, comfort and material quality before choosing their outdoor setting." },
    { year: "2022", title: "After care becomes essential", desc: "Seasonal valet and furniture care services are formalised to protect pieces from coastal sun, humidity and winter storage cycles." },
    { year: "Present", title: "Complete outdoor living", desc: "The offer now covers furniture, shade, kitchens, decor and project support for the Algarve's most demanding homes." },
  ];

  const stats = [
    { value: "10+", label: "Years of outdoor experience" },
    { value: "2", label: "Algarve showrooms" },
    { value: "76+", label: "Furniture pieces curated" },
    { value: "5", label: "Core service areas" },
  ];

  const values = [
    { num: "01", title: "Material honesty", desc: "Every fabric, frame and finish is chosen because it performs outdoors, not because it photographs well for one season." },
    { num: "02", title: "Showroom-led decisions", desc: "Clients can test proportions, comfort and finishes in person before committing to a complete outdoor setting." },
    { num: "03", title: "Design without excess", desc: "The aim is quiet luxury: pieces that feel composed, durable and natural within Algarve architecture." },
    { num: "04", title: "Care after delivery", desc: "Maintenance, valet care and practical guidance help the furniture keep its value over years of use." },
  ];

  const partners = ["Sunbrella", "Glatz", "Interpon", "Premium Aluminium", "Outdoor Kitchens", "Custom Upholstery"];

  return (
    <Layout>
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={showroomQuintaImg} alt="" />
        <div className="rd-hero-inner">
          <span className="rd-kicker fs">About Statvs</span>
          <h1 className="rd-title ff">Outdoor excellence since 2013</h1>
          <p className="rd-lede fs">A decade of furnishing terraces, gardens and poolside spaces for the Algarve lifestyle.</p>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Our story</span>
            <h2 className="ff">A quieter kind of luxury</h2>
          </div>
        </div>
        <div className="rd-story-grid">
          <p className="rd-lede fs">
            Proud of what we represent and attentive to our customers' needs, Statvs is committed to outdoor furniture of the highest quality. The work is built through chosen manufacturers, thoughtful materials and a service culture that continues after delivery.
          </p>
          <img src={whyStatusImg} alt="Statvs outdoor lounge furniture on an Algarve terrace" style={{ width: "100%", borderRadius: 2 }} />
        </div>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Timeline</span>
            <h2 className="ff">From one idea to complete outdoor living</h2>
          </div>
        </div>
        <div className="rd-about-timeline">
          {timeline.map((item) => (
            <article key={item.year} className="rd-timeline-row">
              <strong className="rd-timeline-year ff">{item.year}</strong>
              <div>
                <h3 className="ff" style={{ fontSize: 25, fontWeight: 400, marginBottom: 8 }}>{item.title}</h3>
                <p className="fs rd-lede" style={{ fontSize: 14 }}>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-stats-grid">
          {stats.map((stat) => (
            <article key={stat.label} className="rd-stat-card">
              <strong className="ff">{stat.value}</strong>
              <span className="fs rd-kicker">{stat.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Values</span>
            <h2 className="ff">How we choose and deliver</h2>
          </div>
        </div>
        <div className="rd-values-list">
          {values.map((value) => (
            <article key={value.num} className="rd-value-row">
              <b className="ff">{value.num}</b>
              <div>
                <h3 className="ff" style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>{value.title}</h3>
                <p className="fs rd-lede" style={{ fontSize: 13 }}>{value.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-partner-marquee" aria-label="Partners">
        <div className="rd-partner-track">
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <span key={`${partner}-${index}`} className="fs">{partner}</span>
          ))}
        </div>
      </section>

      <section className="rd-section" style={{ textAlign: "center" }}>
        <span className="rd-kicker fs">Visit us</span>
        <h2 className="ff" style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, margin: "10px 0 18px" }}>Experience the materials in person</h2>
        <p className="rd-lede fs" style={{ margin: "0 auto 30px" }}>The easiest way to choose outdoor furniture well is to sit in it, touch the materials and see the scale beside real settings.</p>
        <button type="button" className="cb cg" onClick={() => navigate("/contact")}>Plan showroom visit</button>
      </section>
    </Layout>
  );
};

export default ABOUT_PAGE;
