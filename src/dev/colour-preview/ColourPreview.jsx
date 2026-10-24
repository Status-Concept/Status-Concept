import { useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import Layout from '../../components/Layout'
import LocalizedLink from '../../components/LocalizedLink'
import { getLangFromPath } from '../../utils/language'
import { colourModels } from './variants'
import { localColourPages } from './targets'
import ColourSwatches from './ColourSwatches'
import './colour-preview.css'

function Configurator({ model, pt }) {
  const [selected, setSelected] = useState(null)
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const choose = colour => {
    if (colour && colour.name === selected?.name) return
    setSelected(colour); setFailed(false); setLoading(Boolean(colour))
  }
  const name = selected?.name || 'Original'
  const imageName = model.key === model.model ? model.name : `${model.name} · ${pt ? model.ptLabel : model.label}`
  const productId = Object.entries(localColourPages).find(([, page]) => page.key === model.key)?.[0]
  return <section className="colour-studio-layout" aria-labelledby="colour-model-name">
    <div className="colour-studio-picture" aria-busy={loading}>
      <img src={selected?.image || model.original} alt={`${imageName} — ${name}`}
        onLoad={() => setLoading(false)} onError={() => { setSelected(null); setFailed(true); setLoading(false) }} />
      {loading && <span className="colour-studio-loading" role="status">{pt ? 'A carregar…' : 'Loading…'}</span>}
    </div>
    <div className="colour-studio-options">
      <p className="sl">{pt ? 'Estofos' : 'Upholstery'}</p>
      <h1 id="colour-model-name" className="ff">{model.name}</h1>
      <p className="colour-studio-selection" role="status">{name}</p>
      <ColourSwatches model={model} selected={selected} pt={pt} onChange={choose} />
      {productId && <p><LocalizedLink to={`/product/${productId}`}>{pt ? 'Ver página local do produto' : 'View local product page'}</LocalizedLink></p>}
      {failed && <p role="alert">{pt ? 'Não foi possível carregar esta cor. Mostramos o original.' : 'This colour could not load. Showing the original.'}</p>}
      <p className="colour-studio-note">{pt
        ? 'Pré-visualização local com cores aproximadas. Não substitui uma amostra oficial. As almofadas acompanham o tecido selecionado; estruturas, mesas e guarda-sóis mantêm o acabamento de referência.'
        : 'Local preview with approximate colours. Not a substitute for an official sample. Cushions follow the selected fabric; frames, tables and parasols retain their reference finish.'}</p>
    </div>
  </section>
}

export default function ColourPreview() {
  const pt = getLangFromPath(useLocation().pathname) === 'pt'
  const [params, setParams] = useSearchParams()
  const model = colourModels.find(item => item.key === params.get('model')) || colourModels[0]
  const configuration = model.configurations.find(target => target.key === params.get('configuration')) || model.configurations[0]
  return <Layout><main className="colour-studio" data-no-translate>
    <header className="colour-studio-heading">
      <div><p className="sl">{pt ? 'Pré-visualização · apenas local' : 'Preview · local only'}</p>
        <h2 className="ff">{pt ? 'Explore as cores' : 'Explore the colours'}</h2></div>
      <label>{pt ? 'Modelo' : 'Model'}<select value={model.key} onChange={event => setParams({ model: event.target.value })}
        aria-label={pt ? 'Modelo' : 'Model'}>
        {colourModels.map(item => <option key={item.key} value={item.key}>{item.name}</option>)}
      </select></label>
      {model.configurations.length > 1 && <label>{pt ? 'Configuração' : 'Configuration'}<select value={configuration.key}
        aria-label={pt ? 'Configuração' : 'Configuration'} onChange={event => setParams({ model: model.key, configuration: event.target.value })}>
        {model.configurations.map(target => <option key={target.key} value={target.key}>{pt ? target.ptLabel : target.label}</option>)}
      </select></label>}
    </header>
    <Configurator key={configuration.key} model={configuration} pt={pt} />
  </main></Layout>
}
