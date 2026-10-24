import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import ImageDialog from '../components/ImageDialog'
import { getLangFromPath } from '../utils/language'
import { finishLibrary } from '../data/fabrics'
import '../styles/fabric-library.css'

export default function FabricLibrary() {
  const pt = getLangFromPath(useLocation().pathname) === 'pt'
  const [query, setQuery] = useState('')
  const [material, setMaterial] = useState('fabric')
  const [selected, setSelected] = useState(null)
  const shown = finishLibrary[material].filter(finish => [finish.name, finish.code, finish.range, finish.manufacturer, finish.supplier, finish.material].filter(Boolean).join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  const clearFilters = () => { setQuery(''); setMaterial('fabric') }
  const labels = pt ? { fabric: 'Tecidos', rope: 'Cordas', base: 'Bases e estruturas' } : { fabric: 'Fabrics', rope: 'Rope', base: 'Bases & frames' }

  return (
    <Layout>
      <main className="fabric-library" data-no-translate>
        <header className="fabric-library-heading">
          <div>
            <h1>{pt ? 'Biblioteca de tecidos e acabamentos' : 'Fabric & finish library'}</h1>
            <p>{pt ? 'Explore as texturas. Encontre o seu acabamento.' : 'Explore the textures. Find your finish.'}</p>
          </div>
          <p className="fabric-library-note">{pt
            ? 'Só os acabamentos selecionados para este catálogo. As referências em falta estão identificadas; confirme a compatibilidade e disponibilidade com a equipa.'
            : 'Only the finishes selected for this catalogue. Missing references are marked; confirm compatibility and availability with our team.'}</p>
        </header>
        <div className="fabric-library-tools">
          <label>{pt ? 'Pesquisar acabamentos' : 'Search finishes'}
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)}
              placeholder={pt ? 'Nome ou código do acabamento' : 'Finish name or code'} />
          </label>
          <label><span id="finish-material-label">Material</span>
            <select aria-labelledby="finish-material-label" value={material} onChange={(event) => setMaterial(event.target.value)}>
              {Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <p role="status">{shown.length} {pt ? 'acabamentos' : 'finishes'}</p>
          {(query || material !== 'fabric') && <button type="button" onClick={clearFilters}>{pt ? 'Limpar filtros' : 'Clear filters'}</button>}
        </div>
        <div className="fabric-library-grid">
          {shown.map((fabric) => <article key={fabric.name}>
            <button type="button" className="fabric-library-sample" onClick={() => setSelected(fabric)}
              aria-label={`${pt ? 'Ver' : 'View'} ${fabric.name}`} aria-haspopup="dialog">
              {fabric.image ? <img src={fabric.image} alt={fabric.name} loading="lazy" decoding="async" width="600" height="600" />
                : <span className="fabric-library-pending">{pt ? 'Amostra por confirmar' : 'Sample reference pending'}</span>}
              <span className="fabric-library-expand" aria-hidden="true">{fabric.image ? '+' : 'i'}</span>
            </button>
            <div className="fabric-library-caption">
              <h2>{fabric.name}</h2><span>{labels[fabric.kind]}</span>
            </div>
          </article>)}
        </div>
        {material === 'rope' && <p className="fabric-library-empty">{pt ? 'Modelo Able e referência da corda ainda por confirmar.' : 'Able model and rope reference still to be confirmed.'}</p>}
        {material === 'base' && <p className="fabric-library-empty">{pt ? 'White, Charcoal e Permateak disponíveis em todos os modelos Divano. Confirme uma amostra física com a equipa.' : 'White, Charcoal and Permateak available on all Divano models. Confirm a physical sample with our team.'}</p>}
        {!shown.length && <p className="fabric-library-empty">{pt ? 'Não foram encontrados acabamentos. Experimente outro código ou limpe os filtros.' : 'No finishes found. Try another code or clear the filters.'}</p>}
        <footer className="fabric-library-footer">
          <p>{pt ? 'As cores no ecrã podem diferir das amostras físicas.' : 'Screen colours may differ from physical samples.'}</p>
        </footer>
      </main>
      {selected && <ImageDialog className="fabric-library-dialog" label={selected.name} onClose={() => setSelected(null)}>
        <div className={`fabric-library-detail${selected.image ? '' : ' fabric-library-detail--no-sample'}`} data-no-translate>
          <button type="button" className="fabric-library-close" aria-label={pt ? 'Fechar amostra' : 'Close sample'} onClick={() => setSelected(null)}>×</button>
          {selected.image && <img src={selected.image} alt={selected.name} />}
          <div>
            <p>{labels[selected.kind]}{selected.manufacturer || selected.supplier ? ` · ${selected.manufacturer || selected.supplier}` : ''}</p><h2>{selected.name}</h2>
            {selected.code && <p>{selected.range} · {selected.code}</p>}
            {selected.material && <p>{selected.material}</p>}
            {selected.availableOn && <p>{pt ? 'Disponível em todos os modelos Divano.' : 'Available on all Divano models.'}</p>}
            {selected.grade && <p>{pt ? 'Nível do fornecedor' : 'Supplier grade'} {selected.grade}</p>}
            {!selected.image && <p>{pt ? 'Amostra oficial ainda por confirmar; não mostramos uma cor inventada.' : 'Official sample reference pending; no substitute colour is shown.'}</p>}
            {selected.kind === 'rope' && <p>{pt ? 'Modelo Able e referência da corda ainda por confirmar.' : 'Able model and rope reference still to be confirmed.'}</p>}
            <p>{pt ? 'Confirme as amostras disponíveis com a nossa equipa antes de escolher. A compatibilidade depende do modelo.' : 'Confirm available samples with our team before choosing. Compatibility depends on the model.'}</p>
            {selected.source && <p><a href={selected.source} target="_blank" rel="noopener noreferrer">{pt ? 'Referência do fornecedor' : 'Supplier reference'}</a></p>}
            <LocalizedLink className="cb cd" to={`/contact?product=${encodeURIComponent(`${{ rope: 'Rope', base: 'Base', fabric: 'Fabric' }[selected.kind]} — ${selected.name}`)}`}>
              {pt ? 'Pedir informações sobre este acabamento' : 'Ask about this finish'}
            </LocalizedLink>
          </div>
        </div>
      </ImageDialog>}
    </Layout>
  )
}
