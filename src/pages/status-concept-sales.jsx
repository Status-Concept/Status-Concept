import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import { getLangFromPath } from '../utils/language'
import offers from '../data/sales2026.json'
import '../styles/sales.css'

const categories = [...new Set(offers.map(offer => offer.category))]
const labels = {
  'LOUNGE LIVING': ['Lounge', 'Lounge'],
  'REST & RELAXATION': ['Sun loungers & relaxation', 'Espreguiçadeiras e descanso'],
  'OUTDOOR DINING': ['Dining sets', 'Conjuntos de refeição'],
  'OUTDOOR TABLES': ['Tables', 'Mesas'],
  'DINING CHAIRS': ['Dining chairs', 'Cadeiras de refeição'],
  'SHADE COLLECTION': ['Parasols', 'Chapéus de sol'],
  'OUTDOOR ACCESSORIES': ['Accessories', 'Acessórios'],
}
const pdf = '/sales/2026/status-concept-sales-2026.pdf'
const price = value => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value / 100)

export default function Sales() {
  const { pathname } = useLocation()
  const pt = getLangFromPath(pathname) === 'pt'
  const [category, setCategory] = useState('all')
  const shown = offers.filter(offer => category === 'all' || offer.category === category)
  const availability = pt
    ? 'Disponível enquanto houver stock. Confirme a disponibilidade com a nossa equipa.'
    : 'Available while stock lasts. Please confirm availability with our team.'

  return (
    <Layout>
      <main className="sales-page" data-no-translate>
        <section className="sales-intro" aria-labelledby="sales-title">
          <div>
            <p className="sales-date">{pt ? 'A partir de 26 de outubro de 2026' : 'From 26 October 2026'}</p>
            <h1 id="sales-title">Sales <span>2026</span></h1>
            <p className="sales-lead">{pt ? 'Uma seleção de conjuntos e peças de showroom para viver o exterior.' : 'Selected showroom sets and pieces for outdoor living.'}</p>
            <p className="sales-availability">{availability}</p>
            <a className="sales-pdf" href={pdf} target="_blank" rel="noreferrer">{pt ? 'Ver catálogo completo em PDF' : 'View the full PDF catalogue'}</a>
          </div>
          <img src={offers[0].image} alt="Antigua Lounge Arrangement" width="931" height="419" fetchPriority="high" />
        </section>

        <section className="sales-catalogue" aria-label={pt ? 'Ofertas do catálogo' : 'Catalogue offers'}>
          <div className="sales-toolbar">
            <label htmlFor="sales-category">{pt ? 'Categoria' : 'Category'}</label>
            <select id="sales-category" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="all">{pt ? 'Todas as ofertas' : 'All offers'}</option>
              {categories.map(item => <option key={item} value={item}>{labels[item][pt ? 1 : 0]}</option>)}
            </select>
            <p role="status">{shown.length} {pt ? 'ofertas' : 'offers'}</p>
          </div>
          <div className="sales-grid">
            {shown.map(offer => (
              <article className="sales-offer" key={offer.id} aria-labelledby={`${offer.id}-title`}>
                <div className="sales-photo">
                  {offer.image
                    ? <img src={offer.image} alt={`${offer.name} — ${offer.subtitle}`} loading="lazy" decoding="async" />
                    : <p>{pt ? 'Fotografia não fornecida no catálogo original' : 'Photograph not supplied in the original catalogue'}</p>}
                  <span className="sales-discount">−{offer.discount}%</span>
                </div>
                <div className="sales-offer-body">
                  <p className="sales-category">{labels[offer.category][pt ? 1 : 0]}</p>
                  <h2 id={`${offer.id}-title`}>{offer.name}</h2>
                  <p className="sales-subtitle">{offer.subtitle}</p>
                  <div className="sales-prices">
                    {offer.options.map((option, index) => (
                      <div className="sales-price-row" key={index}>
                        {option.quantity && <span>{option.quantity} {pt ? 'cadeiras' : 'chairs'}</span>}
                        <span className="sales-price-values"><del aria-label={pt ? 'Preço original' : 'Original price'}>{price(option.original)}</del><strong aria-label={pt ? 'Preço de saldo' : 'Sale price'}>{price(option.sale)}</strong></span>
                      </div>
                    ))}
                  </div>
                  <details className="sales-details">
                    <summary>{pt ? 'Artigos incluídos e acabamentos' : 'Included items & finishes'}</summary>
                    <div lang="en">{offer.details.map((line, index) => <p key={index}>{line}</p>)}</div>
                    <a href={`${pdf}#page=${offer.page}`} target="_blank" rel="noreferrer">{pt ? 'Consultar página original' : 'View original page'} {offer.page}</a>
                  </details>
                  <LocalizedLink className="sales-enquire" to={`/contact?product=${encodeURIComponent(`Sales 2026 — ${offer.name} ${offer.subtitle} (PDF p. ${offer.page})`)}`}>
                    {pt ? 'Confirmar disponibilidade' : 'Check availability'}
                  </LocalizedLink>
                </div>
              </article>
            ))}
          </div>
          <p className="sales-end-note">{availability}</p>
        </section>
      </main>
    </Layout>
  )
}
