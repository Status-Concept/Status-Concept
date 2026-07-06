import { useState } from "react";
import useNavLinks from "../useNavLinks";
import Layout from "../components/Layout";
import LocalizedLink from "../components/LocalizedLink";
import projectQuintaImg from "../assets/images/project-quinta.jpg";
import projectValeImg from "../assets/images/project-valedolobo.webp";
import projectVilamouraImg from "../assets/images/project-vilamoura.jpg";
import projectAlmancilImg from "../assets/images/project-almancil.jpg";
import collectionSicilyImg from "../assets/images/collection-sicily.jpg";
import collectionMiamiImg from "../assets/images/collection-miami.jpg";

const PROJECTS_PAGE = () => {
  useNavLinks();
  const [activeProject, setActiveProject] = useState(null);
  const [filter, setFilter] = useState("all");

  const projects = [
    { name: "Villa Serena", location: "Quinta do Lago", type: "villa", img: projectQuintaImg, gallery: [projectQuintaImg, collectionSicilyImg, projectAlmancilImg], desc: "A contemporary villa where the outdoor lounge, dining and poolside areas were planned as one continuous living space.", products: ["Oxford Modular Sofa", "Glatz Parasol", "Outdoor Kitchen", "Laguna Dining Set"], year: "2024" },
    { name: "Residence Vale Royal", location: "Vale do Lobo", type: "villa", img: projectValeImg, gallery: [projectValeImg, collectionMiamiImg, projectVilamouraImg], desc: "A coastal property furnished with durable pieces selected for sea air, shade coverage and quiet elegance.", products: ["Bella Reclining Sofa", "Antalya Daybed", "Sun Loungers", "Naples Coffee Table"], year: "2024" },
    { name: "Villa Mimosa", location: "Vilamoura", type: "villa", img: projectVilamouraImg, gallery: [projectVilamouraImg, collectionSicilyImg, projectQuintaImg], desc: "A marina-facing terrace divided into lounge, dining and sunbathing zones with a modular furniture system.", products: ["Sicily Modular Set", "Crete Sun Loungers", "Dining Table", "Bioclimatic Pergola"], year: "2023" },
    { name: "Casa Algarvia", location: "Almancil", type: "villa", img: projectAlmancilImg, gallery: [projectAlmancilImg, projectQuintaImg, collectionMiamiImg], desc: "A traditional Algarve home refreshed with relaxed seating, outdoor dining and retractable shade.", products: ["Cairo Sofa Set", "Laguna Dining Set", "Retractable Pergola", "Coffee Table"], year: "2023" },
    { name: "Penthouse Azure", location: "Tavira", type: "apartment", img: collectionMiamiImg, gallery: [collectionMiamiImg, projectValeImg], desc: "A compact rooftop terrace organised around low-profile furniture, shade and easy entertaining.", products: ["Balcony Set", "Compact BBQ", "Parasol", "Poufs"], year: "2024" },
    { name: "Villa Oceanica", location: "Carvoeiro", type: "villa", img: collectionSicilyImg, gallery: [collectionSicilyImg, projectVilamouraImg], desc: "A clifftop outdoor setting with clean lines, generous seating and a calm material palette.", products: ["Miami Sofa Set", "Dining Table", "Bonaire Sun Loungers", "Shade System"], year: "2023" },
  ];

  const filtered = filter === "all" ? projects : projects.filter((project) => project.type === filter);
  const selected = activeProject !== null ? projects[activeProject] : null;

  return (
    <Layout>
      <section className="rd-page-hero">
        <img className="rd-hero-img" src={projectQuintaImg} alt="" />
      </section>
      <div className="rd-page-head">
        <span className="rd-kicker fs">Portfolio</span>
        <h1 className="rd-title ff">Featured outdoor projects</h1>
        <p className="rd-lede fs">Private villas, terraces and poolside spaces furnished across the Algarve.</p>
      </div>

      <section className="rd-section">
        <div className="rd-section-head">
          <div>
            <span className="rd-kicker fs">Browse projects</span>
            <h2 className="ff">Installed settings</h2>
          </div>
          <div className="rd-pill-row">
            {[{ key: "all", label: "All projects" }, { key: "villa", label: "Villas" }, { key: "apartment", label: "Apartments" }].map((item) => (
              <button key={item.key} type="button" className={`rd-pill ${filter === item.key ? "active" : ""}`} onClick={() => setFilter(item.key)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rd-project-grid">
          {filtered.map((project, index) => (
            <article
              key={project.name}
              className={`rd-project-card ${index === 0 || index === 4 ? "wide" : ""} ${index === 1 ? "tall" : ""}`}
              onClick={() => setActiveProject(projects.indexOf(project))}
            >
              <div className="rd-project-media">
                <img src={project.img} alt={project.name} />
                <span className="rd-location-tag fs">{project.location}</span>
              </div>
              <div className="rd-project-info">
                <span className="fs" style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-grey)" }}>{project.year}</span>
                <h3 className="ff" style={{ fontSize: 21, fontWeight: 400, margin: "6px 0" }}>{project.name}</h3>
                <span className="rd-arrow fs" style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>View project -&gt;</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && (
        <div className="rd-project-modal" onClick={() => setActiveProject(null)}>
          <div className="rd-project-modal-inner" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="rd-remove-x" onClick={() => setActiveProject(null)} style={{ position: "sticky", top: 16, marginLeft: "calc(100% - 50px)", marginTop: 16 }}>x</button>
            <div className="rd-modal-gallery">
              <img src={selected.gallery[0]} alt={selected.name} />
              <div style={{ display: "grid", gap: 8 }}>
                {selected.gallery.slice(1).map((image, index) => (
                  <img key={image + index} src={image} alt={`${selected.name} detail ${index + 1}`} />
                ))}
              </div>
            </div>
            <div style={{ padding: "38px 44px 44px" }}>
              <span className="rd-kicker fs">{selected.location} / {selected.year}</span>
              <h2 className="ff" style={{ fontSize: "clamp(34px, 4vw, 50px)", fontWeight: 300, marginBottom: 14 }}>{selected.name}</h2>
              <p className="rd-lede fs" style={{ marginBottom: 28 }}>{selected.desc}</p>
              <span className="rd-kicker fs">Products featured</span>
              <div className="rd-pill-row" style={{ marginTop: 12, marginBottom: 30 }}>
                {selected.products.map((product) => <span key={product} className="mb">{product}</span>)}
              </div>
              <LocalizedLink className="cb cg" to="/contact">Request similar project</LocalizedLink>
            </div>
          </div>
        </div>
      )}

      <section className="rd-section alt" style={{ textAlign: "center" }}>
        <span className="rd-kicker fs">Your project next</span>
        <h2 className="ff" style={{ fontSize: "clamp(30px, 4vw, 44px)", fontWeight: 300, margin: "10px 0 18px" }}>Let us furnish the full outdoor setting</h2>
        <p className="rd-lede fs" style={{ margin: "0 auto 30px" }}>From one terrace to a complete villa, the team can prepare a proposal around your plan, mood and timeline.</p>
        <LocalizedLink className="cb cd" to="/contact">Start a project</LocalizedLink>
      </section>
    </Layout>
  );
};

export default PROJECTS_PAGE;
