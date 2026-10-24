import { colourConfigurations } from './variants'
import ColourSwatches from './ColourSwatches'
import './colour-preview.css'

export default function ProductColourPicker({ targetKey, selected, onChange, pt }) {
  const model = colourConfigurations.find(item => item.key === targetKey)
  if (!model) return null
  return <div className="colour-product-picker" data-no-translate>
    <p className="colour-studio-selection" role="status">{selected?.name || 'Original'}</p>
    <ColourSwatches model={model} selected={selected} pt={pt} onChange={onChange} />
    <p className="colour-studio-note">{pt ? 'Cores ilustrativas aproximadas. Confirme uma amostra física antes de escolher.' : 'Illustrative, approximate colours. Confirm a physical sample before choosing.'}</p>
  </div>
}
