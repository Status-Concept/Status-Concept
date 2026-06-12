import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const PLACEHOLDER = ({ title, subtitle }) => {
  const navigate = useNavigate();
  return (
    <Layout>
      <section style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 48px", background: "var(--white)" }}>
        <span className="fs sl" style={{ marginBottom: 16, letterSpacing: 3 }}>Coming soon</span>
        <h1 className="ff" style={{ fontSize: "clamp(32px,4.6vw,52px)", fontWeight: 400, marginBottom: 20, color: "var(--text-dark)" }}>{title}</h1>
        <p className="fs" style={{ fontSize: 15, color: "var(--text-grey)", maxWidth: 420, lineHeight: 1.7, marginBottom: 40 }}>{subtitle}</p>
        <button className="cb cg" onClick={() => navigate("/contact")}>Get in touch</button>
      </section>
    </Layout>
  );
};

export default PLACEHOLDER;
