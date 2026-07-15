// TODO: legal review — placeholder copy pending counsel sign-off.
// Authored bilingually in-component (keyed off the URL lang) because long-form
// legal prose does not fit the exact-string TranslationLayer dictionary.
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { getLangFromPath } from "../utils/language";

const CONTENT = {
  privacy: {
    en: {
      kicker: "Legal",
      title: "Privacy Policy",
      intro:
        "This policy explains what information Status Concept (STATVS) collects through this website and how it is used. For any question, contact us at info@statusconcept.com.",
      sections: [
        ["Who we are", "Status Concept (STATVS) is an outdoor-furniture retailer with showrooms in Almancil, Algarve, Portugal. We are the data controller for information submitted through this site."],
        ["What we collect", "Contact enquiries: name, email, phone, area of interest and your message. Account data (if you register): name and phone. Saved favourites: the products you shortlist. We do not collect payment details on this site."],
        ["Why we use it", "To respond to your enquiries, to provide account features (favourites, profile), and to contact you about your request. We do not sell your data or share it for advertising."],
        ["Where it is stored", "Data submitted through this site is processed by our backend provider, Supabase. Contact us for information about the hosting region and retention period that applies to your data."],
        ["Your rights", "Under the GDPR you may request access to, correction of, or erasure of your personal data. Exercise these rights by emailing info@statusconcept.com."],
      ],
    },
    pt: {
      kicker: "Legal",
      title: "Política de Privacidade",
      intro:
        "Esta política explica que informação a Status Concept (STATVS) recolhe através deste site e como é utilizada. Para qualquer questão, contacte-nos em info@statusconcept.com.",
      sections: [
        ["Quem somos", "A Status Concept (STATVS) é uma retalhista de mobiliário de exterior com showrooms em Almancil, Algarve, Portugal. Somos o responsável pelo tratamento dos dados submetidos através deste site."],
        ["O que recolhemos", "Pedidos de contacto: nome, email, telefone, área de interesse e a sua mensagem. Dados de conta (se se registar): nome e telefone. Favoritos guardados: os produtos que seleciona. Não recolhemos dados de pagamento neste site."],
        ["Porque os usamos", "Para responder aos seus pedidos, disponibilizar funcionalidades de conta (favoritos, perfil) e contactá-lo acerca do seu pedido. Não vendemos os seus dados nem os partilhamos para publicidade."],
        ["Onde são guardados", "Os dados submetidos através deste site são tratados pelo nosso fornecedor de backend, Supabase. Contacte-nos para saber a região de alojamento e o período de retenção aplicável aos seus dados."],
        ["Os seus direitos", "Ao abrigo do RGPD pode solicitar o acesso, a retificação ou o apagamento dos seus dados pessoais. Exerça estes direitos por email para info@statusconcept.com."],
      ],
    },
  },
  cookies: {
    en: {
      kicker: "Legal",
      title: "Cookie Policy",
      intro: "This site uses a minimal set of cookies and local storage, described below.",
      sections: [
        ["Essential storage", "cookie_consent (remembers your banner choice), your authentication session token when logged in, and your saved favourites. These are required for the site to work."],
        ["No advertising cookies", "We do not use third-party advertising or cross-site tracking cookies."],
        ["Changing your choice", "You can withdraw consent by clearing this site's data in your browser settings, which resets the cookie banner."],
      ],
    },
    pt: {
      kicker: "Legal",
      title: "Política de Cookies",
      intro: "Este site utiliza um conjunto mínimo de cookies e armazenamento local, descrito abaixo.",
      sections: [
        ["Armazenamento essencial", "cookie_consent (memoriza a sua escolha no aviso), o token de sessão de autenticação quando tem sessão iniciada, e os seus favoritos guardados. São necessários para o funcionamento do site."],
        ["Sem cookies de publicidade", "Não utilizamos cookies de publicidade de terceiros nem rastreamento entre sites."],
        ["Alterar a sua escolha", "Pode retirar o consentimento limpando os dados deste site nas definições do navegador, o que repõe o aviso de cookies."],
      ],
    },
  },
  terms: {
    en: {
      kicker: "Legal",
      title: "Terms",
      intro: "These terms govern the use of this informational website.",
      sections: [
        ["Informational catalogue", "This site presents our product range for reference. Product information, availability and specifications are indicative and non-contractual."],
        ["Enquiries are not orders", "Submitting an enquiry or requesting a proposal does not create a purchase contract. Orders are agreed directly with our team."],
        ["Governing law", "These terms are governed by Portuguese law."],
      ],
    },
    pt: {
      kicker: "Legal",
      title: "Termos",
      intro: "Estes termos regem a utilização deste site informativo.",
      sections: [
        ["Catálogo informativo", "Este site apresenta a nossa gama de produtos para referência. As informações, disponibilidade e especificações dos produtos são indicativas e não contratuais."],
        ["Pedidos não são encomendas", "Submeter um pedido ou solicitar uma proposta não cria um contrato de compra. As encomendas são acordadas diretamente com a nossa equipa."],
        ["Lei aplicável", "Estes termos são regidos pela lei portuguesa."],
      ],
    },
  },
};

export default function Legal({ doc }) {
  const location = useLocation();
  const lang = getLangFromPath(location.pathname);
  const data = (CONTENT[doc] || CONTENT.privacy)[lang] || CONTENT[doc].en;

  return (
    <Layout>
      <section className="rd-section" data-no-translate>
        <div className="rd-page-head" style={{ maxWidth: 760 }}>
          <span className="rd-kicker fs">{data.kicker}</span>
          <h1 className="rd-title ff">{data.title}</h1>
          <p className="rd-lede fs">{data.intro}</p>
        </div>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 28 }}>
          {data.sections.map(([heading, body]) => (
            <div key={heading}>
              <h2 className="ff" style={{ fontSize: 20, fontWeight: 400, marginBottom: 8, color: "var(--text-dark)" }}>{heading}</h2>
              <p className="fs" style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-body)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
