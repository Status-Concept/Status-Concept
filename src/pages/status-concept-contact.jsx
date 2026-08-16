import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getSupabase } from "../lib/supabase";
import { sanitizePhone, sanitizeText } from "../utils/sanitize";
import { SHOWROOMS, CONTACT } from "../data/showrooms";
import { whatsappUrl } from "../utils/whatsapp";
import showroomQuintaImg from "../assets/images/enhanced/showroom-quinta-ai.webp";
import showroomAlmancilImg from "../assets/images/enhanced/showroom-almancil-ai.webp";

const telHref = (n) => "tel:" + n.replace(/[^\d+]/g, "");

const CONTACT_PAGE = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  // A product enquiry can arrive via ?product= or router state (from a product page).
  const enquiryProduct = searchParams.get("product") || location.state?.product || "";
  const enquiryInterest = searchParams.get("interest") || location.state?.interest || "";
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", interest: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [activeShowroom, setActiveShowroom] = useState(0);

  useEffect(() => {
    if (!enquiryProduct && !enquiryInterest) return;
    setFormData((prev) => ({
      ...prev,
      interest: prev.interest || enquiryInterest,
      message: prev.message || (enquiryProduct ? `I'd like a proposal for the ${enquiryProduct}.` : prev.message),
    }));
  }, [enquiryProduct, enquiryInterest]);

  // Shared name/address/phone/maps come from the single-source data module;
  // the contact-page-specific fields (mobile, gps, image, description) stay here.
  const showroomExtra = {
    "quinta-do-lago": { mobile: "+351 937 573 600", gps: "37.062229, -8.038336", img: showroomQuintaImg, desc: "Our flagship showroom between Quinta do Lago and Vale do Lobo, created for seeing complete outdoor settings in person." },
    "almancil": { mobile: "+351 937 573 600", gps: "37.0927, -8.0400", img: showroomAlmancilImg, desc: "A central showroom on the main avenue, with outdoor furniture, shade systems and kitchen displays." },
  };
  const showrooms = SHOWROOMS.map((s) => ({ name: s.name, address: s.address, phone: s.phone, maps: s.maps, ...showroomExtra[s.key] }));

  const active = showrooms[activeShowroom];
  const interests = ["Outdoor Furniture", "Shade Solutions", "Outdoor Kitchens", "General Enquiry"];

  const canSubmit = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || status === "sending") return;
    setStatus("sending");

    const payload = {
      name: sanitizeText(formData.name).slice(0, 200),
      email: formData.email.trim().slice(0, 320),
      phone: sanitizePhone(formData.phone).slice(0, 40),
      interest: formData.interest.slice(0, 100),
      message: sanitizeText(formData.message).slice(0, 4000),
      source: enquiryProduct ? "product_enquiry" : "contact_page",
    };

    try {
      const supabase = await getSupabase();
      if (!supabase) throw new Error("no-backend");
      const { error } = await supabase.from("enquiries").insert(payload);
      if (error) throw error;
      setStatus("sent");
      setFormData({ name: "", email: "", phone: "", interest: "", message: "" });
    } catch {
      // Do NOT claim success on failure — surface an honest error with direct
      // contact routes, keeping the user's input so they can retry.
      setStatus("error");
    }
  };

  // Pre-composed mailto so a failed submit still has a one-click manual route.
  const mailtoFallback = `mailto:info@statusconcept.com?subject=${encodeURIComponent("Website enquiry — " + (formData.interest || enquiryProduct || "General"))}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nInterest: ${formData.interest || "—"}\n\n${formData.message}`)}`;

  return (
    <Layout>
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={showroomQuintaImg} alt="" />
      </section>
      <div className="rd-page-head">
        <span className="rd-kicker fs">Contact</span>
        <h1 className="rd-title ff">Visit, call or start a proposal</h1>
        <p className="rd-lede fs">Choose a showroom, send an enquiry or speak with the team about your outdoor space.</p>
      </div>

      <section className="rd-section">
        <div className="rd-quick-grid">
          {[
            { label: "Call", value: CONTACT.phone, sub: "Quinta do Lago", href: CONTACT.phoneHref },
            { label: "WhatsApp", value: "+351 937 573 600", sub: "Direct message", href: whatsappUrl("Hello STATVS, I'd like to enquire about"), external: true },
            { label: "Email", value: CONTACT.email, sub: "Replies within 24h", href: CONTACT.emailHref },
            { label: "Showrooms", value: "2 locations", sub: "Almancil and Quinta do Lago", href: showrooms[0].maps, external: true },
          ].map((item) => (
            <a
              key={item.label}
              className="rd-quick-card"
              href={item.href}
              data-no-translate
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ display: "block", textDecoration: "none", color: "inherit" }}
            >
              <span className="rd-kicker fs">{item.label}</span>
              <h3 className="ff" style={{ fontSize: 24, fontWeight: 400, margin: "8px 0" }}>{item.value}</h3>
              <p className="fs rd-count">{item.sub}</p>
            </a>
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

          <a className="rd-map-card fs" href={active.maps} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, textDecoration: "none", color: "inherit" }}>
            <span>{active.address}</span>
            <span style={{ whiteSpace: "nowrap", letterSpacing: 1.5, textTransform: "uppercase", fontSize: 11 }}>Get directions →</span>
          </a>
        </aside>

        <div className="rd-form-panel">
          <span className="rd-kicker fs">Enquiry</span>
              <h2 className="ff" style={{ fontSize: "clamp(32px, 4vw, 46px)", fontWeight: 300, marginBottom: 14 }}>{enquiryProduct ? `Enquire about ${enquiryProduct}` : "Tell us what you need"}</h2>
          <p className="rd-lede fs" style={{ marginBottom: 34 }}>Share the type of space, the product family you are interested in and the best way to contact you.</p>

          {status === "sent" ? (
            <div className="rd-form-success" style={{ padding: "32px 0" }}>
              <h3 className="ff" style={{ fontSize: 26, fontWeight: 400, marginBottom: 12 }}>Thank you — your enquiry is on its way.</h3>
              <p className="fs rd-lede" style={{ marginBottom: 24 }}>The showroom team replies within one business day. For anything urgent, call <a href="tel:+351289030179" data-no-translate style={{ color: "var(--accent)" }}>+351 289 030 179</a> or message us on <a href="https://wa.me/351937573600" target="_blank" rel="noopener noreferrer" data-no-translate style={{ color: "var(--accent)" }}>WhatsApp</a>.</p>
              <button type="button" className="cb cd" style={{ alignSelf: "start" }} onClick={() => setStatus("idle")}>Send another enquiry</button>
            </div>
          ) : (
            <form className="rd-floating-grid" onSubmit={handleSubmit}>
              {status === "error" && (
                <div className="rd-form-error" role="alert" style={{ padding: "14px 16px", border: "1px solid var(--mid-grey)", borderRadius: 2, background: "var(--off-white)", fontSize: 13, lineHeight: 1.6, color: "var(--text-dark)" }}>
                  We couldn't send your enquiry just now. Please try again — or reach us directly:{" "}
                  <a href="tel:+351289030179" data-no-translate style={{ color: "var(--accent-hover)" }}>call</a>,{" "}
                  <a href="https://wa.me/351937573600" target="_blank" rel="noopener noreferrer" data-no-translate style={{ color: "var(--accent-hover)" }}>WhatsApp</a>{" "}or{" "}
                  <a href={mailtoFallback} data-no-translate style={{ color: "var(--accent-hover)" }}>email</a>.
                </div>
              )}
              <div className="rd-field">
                <label>Name</label>
                <input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} autoComplete="name" required />
              </div>
              <div className="rd-field">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} autoComplete="email" required />
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
                <textarea value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required />
              </div>
              <button type="submit" className="cb cg" style={{ alignSelf: "start", opacity: canSubmit && status !== "sending" ? 1 : 0.6 }} disabled={!canSubmit || status === "sending"}>
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </button>
              <p className="fs" style={{ fontSize: 12, color: "var(--text-grey)", marginTop: 4, lineHeight: 1.6 }}>
                The showroom team replies within one business day. Your details are only used to respond to this enquiry.
              </p>
            </form>
          )}
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
            { label: "Address", value: active.address, href: active.maps, external: true },
            { label: "Phone", value: active.phone, href: telHref(active.phone) },
            { label: "Mobile", value: active.mobile, href: telHref(active.mobile) },
            { label: "GPS", value: active.gps, href: active.maps, external: true },
          ].map((item) => (
            <a key={item.label} className="rd-material-card" href={item.href} data-no-translate {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <span className="rd-kicker fs">{item.label}</span>
              <p className="fs rd-lede" style={{ fontSize: 14, marginTop: 10 }}>{item.value}</p>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default CONTACT_PAGE;
