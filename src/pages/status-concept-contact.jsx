import { useState } from "react";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.png";
import showroomAlmancilImg from "../assets/images/enhanced/showroom-almancil-ai.png";

const CONTACT_PAGE = () => {
  useNavLinks();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [activeShowroom, setActiveShowroom] = useState(0);

  const showrooms = [
    {
      name: "Quinta do Lago",
      address: "Estr. Quinta do Lago-Vale do Lobo, 8135-106 Almancil",
      phone: "+351 289 030 179",
      mobile: "+351 937 573 600",
      gps: "37.062229, -8.038336",
      img: showroomQuintaImg,
      desc: "Our flagship showroom between Quinta do Lago and Vale do Lobo, created for seeing complete outdoor settings in person.",
    },
    {
      name: "Almancil",
      address: "Avenida 5 de Outubro 298, 8135-103 Almancil",
      phone: "+351 289 092 890",
      mobile: "+351 937 573 600",
      gps: "37.0927, -8.0400",
      img: showroomAlmancilImg,
      desc: "A central showroom on the main avenue, with outdoor furniture, shade systems and kitchen displays.",
    },
  ];

  const active = showrooms[activeShowroom];
  const interests = ["Outdoor Furniture", "Shade Solutions", "Outdoor Kitchens", "Decor & Leisure", "After Care Service", "General Enquiry"];

  return (
    <Layout>
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={showroomQuintaImg} alt="" />
        <div className="rd-hero-inner">
          <span className="rd-kicker fs">Contact</span>
          <h1 className="rd-title ff">Visit, call or start a proposal</h1>
          <p className="rd-lede fs">Choose a showroom, send an enquiry or speak with the team about your outdoor space.</p>
        </div>
      </section>

      <section className="rd-section">
        <div className="rd-quick-grid">
          {[
            { label: "Call", value: "+351 289 030 179", sub: "Quinta do Lago" },
            { label: "WhatsApp", value: "+351 937 573 600", sub: "Direct message" },
            { label: "Email", value: "info@statusconcept.com", sub: "Replies within 24h" },
            { label: "Showrooms", value: "2 locations", sub: "Almancil and Quinta do Lago" },
          ].map((item) => (
            <article key={item.label} className="rd-quick-card">
              <span className="rd-kicker fs">{item.label}</span>
              <h3 className="ff" style={{ fontSize: 24, fontWeight: 400, margin: "8px 0" }}>{item.value}</h3>
              <p className="fs rd-count">{item.sub}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rd-contact-split">
        <aside className="rd-showroom-panel">
          <img src={active.img} alt={`Showroom ${active.name}`} />
          <span className="rd-kicker fs" style={{ color: "rgba(255,255,255,.72)" }}>Showroom</span>
          <h2 className="ff" style={{ fontSize: "clamp(34px, 4vw, 54px)", fontWeight: 300, lineHeight: 1.05 }}>{active.name}</h2>
          <p className="fs" style={{ maxWidth: 560, color: "rgba(255,255,255,.72)", lineHeight: 1.75, marginTop: 14 }}>{active.desc}</p>

          <div className="rd-showroom-tabs">
            {showrooms.map((showroom, index) => (
              <button key={showroom.name} type="button" className={`rd-showroom-tab ${activeShowroom === index ? "active" : ""}`} onClick={() => setActiveShowroom(index)}>
                <span className="fs" style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,.58)" }}>Showroom {index + 1}</span>
                <strong className="ff" style={{ display: "block", fontSize: 21, fontWeight: 400, marginTop: 4 }}>{showroom.name}</strong>
              </button>
            ))}
          </div>

          <div className="rd-map-card fs">
            Map placeholder / GPS {active.gps}
          </div>
        </aside>

        <div className="rd-form-panel">
          <span className="rd-kicker fs">Enquiry</span>
          <h2 className="ff" style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 300, marginBottom: 14 }}>Tell us what you need</h2>
          <p className="rd-lede fs" style={{ marginBottom: 34 }}>Share the type of space, the product family you are interested in and the best way to contact you.</p>

          <form className="rd-floating-grid">
            <div className="rd-field">
              <label>Name</label>
              <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} autoComplete="name" />
            </div>
            <div className="rd-field">
              <label>Email</label>
              <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} autoComplete="email" />
            </div>
            <div className="rd-field">
              <label>Phone</label>
              <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} autoComplete="tel" />
            </div>
            <div className="rd-field">
              <label>Interest</label>
              <select value={formData.interest} onChange={(event) => setFormData({ ...formData, interest: event.target.value })}>
                <option value="">Choose an option</option>
                {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
              </select>
            </div>
            <div className="rd-field">
              <label>Message</label>
              <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} />
            </div>
            <button type="button" className="cb cg" style={{ alignSelf: "start" }}>Send enquiry</button>
          </form>
        </div>
      </section>

      <section className="rd-section alt">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Showroom details</span>
            <h2 className="ff">Current selection</h2>
          </div>
        </div>
        <div className="rd-material-grid">
          {[
            { label: "Address", value: active.address },
            { label: "Phone", value: active.phone },
            { label: "Mobile", value: active.mobile },
            { label: "GPS", value: active.gps },
          ].map((item) => (
            <article key={item.label} className="rd-material-card">
              <span className="rd-kicker fs">{item.label}</span>
              <p className="fs rd-lede" style={{ fontSize: 14, marginTop: 10 }}>{item.value}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default CONTACT_PAGE;
