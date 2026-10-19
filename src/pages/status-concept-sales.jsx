import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Layout from '../components/Layout'
import SalesEnquiry from '../components/SalesEnquiry'
import { getLangFromPath } from '../utils/language'
import { salesPrice as price } from '../utils/salesEnquiry'
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
const lowestPrice = offer => Math.min(...offer.options.map(option => option.sale))
const arrow = <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" /></svg>

function itemLines(details) {
  const lines = []
  for (let index = 0; index < details.length; index++) {
    if (/^\d+\s*x$/i.test(details[index]) && details[index + 1]) lines.push(`${details[index]} ${details[++index]}`)
    else lines.push(details[index])
  }
  return lines
}

export default function Sales() {
  const { pathname } = useLocation()
  const [params, setParams] = useSearchParams()
  const pt = getLangFromPath(pathname) === 'pt'
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const query = search.trim().toLocaleLowerCase()
  const shown = offers.filter(offer => (category === 'all' || offer.category === category)
    && (!query || `${offer.name} ${offer.subtitle} ${offer.details.join(' ')}`.toLocaleLowerCase().includes(query)))
    .sort((a, b) => sort === 'price' ? lowestPrice(a) - lowestPrice(b) : sort === 'discount' ? b.discount - a.discount : a.page - b.page)
  const selected = offers.find(offer => offer.id === params.get('offer'))
  const availability = pt ? 'Disponível enquanto houver stock. Confirme a disponibilidade com a nossa equipa.' : 'Available while stock lasts. Please confirm availability with our team.'

  function selectOffer(offer) {
    const next = new URLSearchParams(params)
    if (offer) next.set('offer', offer.id)
    else next.delete('offer')
    setParams(next, { replace: true })
  }

  return (
    <Layout>
      <main className="sales-page" data-no-translate>
        <section className="sales-intro" aria-labelledby="sales-title">
          <div className="sales-intro-copy">
            <h1 id="sales-title">Sales <span>2026</span></h1>
            <p className="sales-lead">{pt ? 'Uma seleção de conjuntos e peças de showroom para viver o exterior.' : 'Selected showroom sets and pieces for outdoor living.'}</p>
            <p className="sales-date">{pt ? 'A partir de 26 de outubro de 2026' : 'From 26 October 2026'}</p>
            <div className="sales-intro-actions"><a className="sales-browse" href="#sales-catalogue" onClick={event => { event.preventDefault(); document.getElementById('sales-catalogue').scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }}>{pt ? 'Explorar ofertas' : 'Explore the offers'}{arrow}</a>
              <a className="sales-pdf" href={pdf} target="_blank" rel="noreferrer">{pt ? 'Catálogo PDF' : 'PDF catalogue'}<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg></a></div>
          </div>
          <figure className="sales-hero-photo"><img src={offers[0].image} alt="Antigua Lounge Arrangement" width="931" height="419" fetchPriority="high" /><figcaption>ANTIGUA <span>Lounge Arrangement</span></figcaption></figure>
        </section>

        <section className="sales-catalogue" id="sales-catalogue" aria-label={pt ? 'Ofertas do catálogo' : 'Catalogue offers'}>
          <div className="sales-catalogue-heading"><h2>{pt ? 'Encontre a sua peça.' : 'Find your piece.'}</h2><p>{availability}</p></div>
          <div className="sales-toolbar">
            <label className="sales-filter" htmlFor="sales-category"><span>{pt ? 'Categoria' : 'Category'}</span><select id="sales-category" value={category} onChange={event => setCategory(event.target.value)}>
              <option value="all">{pt ? 'Todas as ofertas' : 'All offers'}</option>
              {categories.map(item => <option key={item} value={item}>{labels[item][pt ? 1 : 0]}</option>)}
            </select></label>
            <label className="sales-search"><span className="sales-sr-only">{pt ? 'Pesquisar ofertas' : 'Search offers'}</span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input type="search" placeholder={pt ? 'Procurar uma peça…' : 'Find a piece…'} value={search} onChange={event => setSearch(event.target.value)} /></label>
            <label className="sales-filter sales-sort"><span>{pt ? 'Ordenar por' : 'Sort by'}</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">{pt ? 'Ordem do catálogo' : 'Catalogue order'}</option><option value="price">{pt ? 'Preço: menor primeiro' : 'Price: low to high'}</option><option value="discount">{pt ? 'Maior desconto' : 'Biggest reduction'}</option></select></label>
          </div>
          <div className="sales-results"><p role="status">{shown.length} {pt ? 'ofertas' : 'offers'}</p>{(category !== 'all' || search || sort !== 'featured') && <button type="button" onClick={() => { setCategory('all'); setSearch(''); setSort('featured') }}>{pt ? 'Limpar filtros' : 'Reset filters'}</button>}</div>
          <div className="sales-grid">
            {shown.map(offer => (
              <article className="sales-offer" key={offer.id} aria-labelledby={`${offer.id}-title`}>
                <div className="sales-photo">
                  {offer.image ? <img src={offer.image} alt={`${offer.name} — ${offer.subtitle}`} loading="lazy" decoding="async" /> : <p>{pt ? 'Fotografia não fornecida no catálogo original' : 'Photograph not supplied in the original catalogue'}</p>}
                  <span className="sales-discount">−{offer.discount}%</span>
                </div>
                <div className="sales-offer-body">
                  <p className="sales-category">{labels[offer.category][pt ? 1 : 0]}</p>
                  <h3 id={`${offer.id}-title`}>{offer.name}</h3>
                  <p className="sales-subtitle">{offer.subtitle}</p>
                  <div className="sales-prices">{offer.options.map((option, index) => <div className="sales-price-row" key={index}>{option.quantity && <span>{option.quantity} {pt ? 'cadeiras' : 'chairs'}</span>}<span className="sales-price-values"><strong aria-label={pt ? 'Preço de saldo' : 'Sale price'}>{price(option.sale)}</strong><del aria-label={pt ? 'Preço original' : 'Original price'}>{price(option.original)}</del></span></div>)}</div>
                  <details className="sales-details"><summary>{pt ? 'Artigos incluídos e acabamentos' : 'Included items & finishes'}<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary><div lang="en">{itemLines(offer.details).map((line, index) => <p key={index}>{line}</p>)}</div><a href={`${pdf}#page=${offer.page}`} target="_blank" rel="noreferrer">{pt ? 'Consultar página original' : 'View original page'} {offer.page}</a></details>
                  <button className="sales-enquire" type="button" aria-haspopup="dialog" onClick={() => selectOffer(offer)}>{pt ? 'Confirmar disponibilidade' : 'Check availability'}{arrow}</button>
                </div>
              </article>
            ))}
          </div>
          {!shown.length && <div className="sales-empty"><h3>{pt ? 'Nenhuma oferta encontrada.' : 'No offers found.'}</h3><p>{pt ? 'Experimente outro nome ou escolha uma categoria diferente.' : 'Try another name or choose a different category.'}</p><button className="sales-browse" type="button" onClick={() => { setSearch(''); setCategory('all') }}>{pt ? 'Ver todas as ofertas' : 'View all offers'}{arrow}</button></div>}
          <p className="sales-end-note">{availability}</p>
        </section>
        {selected && <SalesEnquiry key={selected.id} offer={selected} pt={pt} onClose={() => selectOffer(null)} />}
      </main>
    </Layout>
  )
}
