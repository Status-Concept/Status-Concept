export default function ColourSwatches({ model, selected, onChange, pt }) {
  return <>
    <div className="colour-studio-swatches" role="group" aria-label={pt ? 'Cor do tecido' : 'Fabric colour'}>
      {model.colours.map(colour => <button type="button" key={colour.name} disabled={!colour.image}
        aria-pressed={selected?.name === colour.name} onClick={() => onChange(colour)}>
        <img className="colour-studio-chip" src={colour.swatch} alt="" aria-hidden="true" width="48" height="48" />
        <span>{colour.name}</span>
      </button>)}
    </div>
    <button type="button" className="colour-studio-original" aria-pressed={!selected} onClick={() => onChange(null)}>Original</button>
  </>
}
