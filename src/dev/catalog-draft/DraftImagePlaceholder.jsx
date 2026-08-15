export function privateAssetPath(image) {
  const value = typeof image === 'string'
    ? image
    : image?.url || image?.src || image?.photoPath || image?.path || ''
  if (!value) return ''
  if (value.startsWith('.catalog-private/')) return '/__status-private/' + value.slice('.catalog-private/'.length)
  if (value.startsWith('/.catalog-private/')) return '/__status-private/' + value.slice('/.catalog-private/'.length)
  if (/^https?:\/\//i.test(value)) return ''
  return value
}

export default function DraftImagePlaceholder({ label = 'Awaiting final product images' }) {
  return (
    <div className="draft-image-placeholder" role="img" aria-label={label} data-no-translate>
      <span className="draft-image-placeholder-mark" aria-hidden="true">SC</span>
      <span>{label}</span>
    </div>
  )
}
