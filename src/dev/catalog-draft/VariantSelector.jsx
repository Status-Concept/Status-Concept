function variantLabel(variant) {
  return variant.label || variant.name || variant.sourceDescription || variant.sku
}

export default function VariantSelector({ variants = [], selectedSku, onChange }) {
  if (variants.length <= 1) return null
  return (
    <fieldset className="draft-variant-selector" data-no-translate>
      <legend className="draft-section-label">Configuration / colour</legend>
      <div className="draft-variant-options">
        {variants.map((variant) => {
          const selected = variant.sku === selectedSku
          const unavailable = variant.isAvailable === false || variant.disabled === true
          return (
            <button
              key={variant.sku}
              type="button"
              className={selected ? 'is-selected' : ''}
              aria-pressed={selected}
              aria-label={variantLabel(variant)}
              disabled={unavailable}
              onClick={() => onChange(variant)}
            >
              <span>{variant.sku}</span>
              <small>{variantLabel(variant)}</small>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
