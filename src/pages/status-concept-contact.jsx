import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import { sanitizePhone, sanitizeText } from "../utils/sanitize";
import { SHOWROOMS, CONTACT, HOURS } from "../data/showrooms";
import { whatsappUrl } from "../utils/whatsapp";
import "../styles/contact.css";
const showroomAlmancilImg = "/photography/showroom-almancil-original-clean-1440.webp";
const showroomQuintaImg = "/photography/showroom-quinta-1440.webp";

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
  // the contact-page-specific fields (mobile, gps and image) stay here.
  const showroomExtra = {
    "quinta-do-lago": { mobile: "+351 937 573 600", gps: "37.062229, -8.038336", img: showroomQuintaImg },
    "almancil": { mobile: "+351 937 573 600", gps: "37.0927, -8.0400", img: showroomAlmancilImg },
  };
  const showrooms = SHOWROOMS.map((s) => ({ name: s.name, address: s.address, phone: s.phone, maps: s.maps, ...showroomExtra[s.key] }));

  const active = showrooms[activeShowroom];
  const interests = ["Outdoor Furniture", "Shade Solutions", "Outdoor Kitchens", "General Enquiry"];

  const canSubmit = formData.name.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || status === "sending") return;
    if (!isSupabaseConfigured) {
      window.location.assign(mailtoFallback);
      return;
    }
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
      <div className="contact-page">
        <section className="contact-intro" aria-labelledby="contact-title">
          <div className="contact-intro-copy">
            <h1 id="contact-title" className="ff">Let's plan outside.</h1>
            <button className="cb cd" type="button" onClick={() => document.getElementById("contact-enquiry").scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" })}>Start an enquiry <span aria-hidden="true">↗</span></button>
          </div>
          <figure className="contact-hero-photo">
            <img src={showroomQuintaImg} srcSet="/photography/showroom-quinta-800.webp 800w, /photography/showroom-quinta-1440.webp 1440w" sizes="(max-width: 760px) 100vw, 62vw" width="1440" height="808" fetchPriority="high" alt="Outdoor lounge, dining and shade displays at our Quinta do Lago showroom" />
            <figcaption className="fs"><span>Visit us in the Algarve</span><span>Quinta do Lago · Almancil</span></figcaption>
          </figure>
        </section>

        <section className="contact-visit" aria-labelledby="visit-heading">
          <div className="contact-visit-details">
            <h2 id="visit-heading" className="ff">Our showrooms</h2>
            <div className="contact-location-picker" role="group" aria-label="Choose a showroom">
              {showrooms.map((showroom, index) => (
                <button key={showroom.name} type="button" aria-pressed={activeShowroom === index} aria-controls="contact-location" onClick={() => setActiveShowroom(index)}>{showroom.name}</button>
              ))}
            </div>
            <div id="contact-location" className="contact-location" aria-live="polite" aria-atomic="true">
              <h3 className="ff">{active.name}</h3>
              <address className="fs" data-no-translate>{active.address}</address>
              <a className="contact-text-link fs" href={active.maps} target="_blank" rel="noopener noreferrer">Get directions <span aria-hidden="true">↗</span></a>
              <a className="contact-location-phone fs" href={telHref(active.phone)} data-no-translate>{active.phone}</a>
            </div>
            <dl className="contact-hours fs">{HOURS.map((hour) => <div key={hour.label}><dt>{hour.label}</dt><dd>{hour.value}</dd></div>)}</dl>
          </div>
          <figure className={`contact-visit-photo${activeShowroom === 1 ? " contact-visit-photo--almancil" : ""}`}>
            <img src={activeShowroom === 0 ? "/photography/showroom-quinta-2-1440.webp" : active.img} srcSet={activeShowroom === 1 ? "/photography/showroom-almancil-original-clean-800.webp 800w, /photography/showroom-almancil-original-clean-1440.webp 1440w" : undefined} sizes="(max-width: 760px) 100vw, 55vw" alt={`Showroom ${active.name}`} loading="lazy" width="1440" height={activeShowroom === 1 ? "481" : "808"} />
            <figcaption className="fs"><span>{active.name}</span>{activeShowroom === 1 && <span>AI-retouched photograph</span>}</figcaption>
          </figure>
        </section>

        <section id="contact-enquiry" className="contact-enquiry" aria-labelledby="enquiry-heading">
          <div className="contact-enquiry-copy">
            <h2 className="ff">Get in touch</h2>
            <div className="contact-direct fs">
              <a href={CONTACT.phoneHref}><span>Call the team</span><span data-no-translate>{CONTACT.phone}</span></a>
              <a href={CONTACT.emailHref}><span>Email us</span><span data-no-translate>{CONTACT.email}</span></a>
              <a href={whatsappUrl("Hello STATVS, I'd like help with my outdoor space.")} target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><span>Send a message ↗</span></a>
            </div>
          </div>
        <div className="contact-form-panel">
          {enquiryProduct && <p className="contact-form-context fs" data-no-translate title={enquiryProduct}>{enquiryProduct}</p>}
          <h2 id="enquiry-heading" className="ff">Tell us what you need</h2>

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
                <label htmlFor="enquiry-name">Name</label>
                <input id="enquiry-name" name="name" maxLength={200} value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} autoComplete="name" required />
              </div>
              <div className="rd-field">
                <label htmlFor="enquiry-email">Email</label>
                <input id="enquiry-email" name="email" maxLength={320} type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} autoComplete="email" required />
              </div>
              <div className="rd-field">
                <label htmlFor="enquiry-phone">Phone</label>
                <input id="enquiry-phone" name="phone" type="tel" maxLength={40} value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} autoComplete="tel" />
              </div>
              <div className="rd-field">
                <label htmlFor="enquiry-interest">Interest</label>
                <select id="enquiry-interest" name="interest" value={formData.interest} onChange={(event) => setFormData({ ...formData, interest: event.target.value })}>
                  <option value="">Choose an option</option>
                  {interests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
                </select>
              </div>
              <div className="rd-field">
                <label htmlFor="enquiry-message">Message</label>
                <textarea id="enquiry-message" name="message" maxLength={4000} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required />
              </div>
              <button type="submit" className="cb cg" style={{ alignSelf: "start", opacity: canSubmit && status !== "sending" ? 1 : 0.6 }} disabled={!canSubmit || status === "sending"}>
                {status === "sending" ? "Sending…" : (isSupabaseConfigured ? "Send enquiry" : "Prepare email enquiry")}
              </button>
              <p className="fs" style={{ fontSize: 12, color: "var(--text-grey)", marginTop: 4, lineHeight: 1.6 }}>
                {isSupabaseConfigured ? "We reply within one business day. Your details are only used for this enquiry." : "Review the prepared email and press Send."}
              </p>
            </form>
          )}
        </div>
      </section>

      </div>
    </Layout>
  );
};

export default CONTACT_PAGE;
