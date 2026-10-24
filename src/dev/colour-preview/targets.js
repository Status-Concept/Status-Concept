const studioOriginals = import.meta.glob('./images/*-original-*.webp', { eager: true, query: '?url', import: 'default' })
const catalogueOriginals = import.meta.glob('/src/assets/images/sicily-*.jpg', { eager: true, query: '?url', import: 'default' })
export const colourTargets = [
  { key: 'berlin', model: 'berlin', label: 'Modular sofa', ptLabel: 'Sofá modular', original: '/product-images/berlin-tailored-v3/modular-studio.webp' },
  { key: 'berlin-set', model: 'berlin', label: 'Sofa set', ptLabel: 'Conjunto de sofás', original: '/product-images/berlin-tailored-v3/berlin-studio.webp' },
  { key: 'berlin-l', model: 'berlin', label: 'L-shaped sofa & ottoman', ptLabel: 'Sofá em L e pufe', original: '/product-images/berlin-tailored-v3/modular-charcoal-l-studio.webp' },
  { key: 'berlin-u', model: 'berlin', label: 'U-shaped sofa', ptLabel: 'Sofá em U', original: '/product-images/berlin-tailored-v3/modular-charcoal-u-studio.webp' },
  { key: 'berlin-grey-set', model: 'berlin', label: 'Two sofas & armchairs', ptLabel: 'Dois sofás e poltronas', original: '/product-images/berlin-tailored-v3/modular-grey-set-studio.webp' },
  { key: 'berlin-armchair', model: 'berlin', label: 'Armchair', ptLabel: 'Poltrona', original: '/product-images/berlin-tailored-v3/berlin-black-armchair-studio.webp' },
  { key: 'sicily', model: 'sicily', label: 'Corner module', ptLabel: 'Módulo de canto', original: '/src/assets/images/sicily-corner.jpg' },
  { key: 'sicily-centre', model: 'sicily', label: 'Centre module', ptLabel: 'Módulo central', original: '/src/assets/images/sicily-centre.jpg' },
  { key: 'sicily-ottoman', model: 'sicily', label: 'Ottoman', ptLabel: 'Pufe', original: '/src/assets/images/sicily-ottoman.jpg' },
  { key: 'luanda', model: 'luanda', label: 'Lounge set', ptLabel: 'Conjunto lounge', original: '/product-images/corrections/264-luanda-2.webp' },
  { key: 'luanda-lounge', model: 'luanda', label: 'Corner sofa', ptLabel: 'Sofá de canto', original: '/product-images/corrections/270-luanda.webp' },
  { key: 'luanda-armchair', model: 'luanda', label: 'Armchair', ptLabel: 'Poltrona', original: '/product-images/corrections/265-local-product-79d24eb70f26.webp' },
  { key: 'antigua', model: 'antigua', label: 'Sofa set', ptLabel: 'Conjunto de sofás', original: '/src/dev/colour-preview/images/antigua-original-v3.webp' },
  { key: 'antigua-xl', model: 'antigua', label: 'XL corner sofa', ptLabel: 'Sofá de canto XL', original: '/src/dev/colour-preview/images/antigua-xl-original-v3.webp' },
  { key: 'oxford', model: 'oxford', label: 'Sofa set', ptLabel: 'Conjunto de sofás', original: '/src/dev/colour-preview/images/oxford-original-v3.webp' },
  { key: 'oxford-modular', model: 'oxford', label: 'Modular sofa', ptLabel: 'Sofá modular', original: '/src/dev/colour-preview/images/oxford-modular-original-v3.webp' },
  { key: 'oxford-daybed', model: 'oxford', label: 'Daybed', ptLabel: 'Cama de dia', original: '/src/dev/colour-preview/images/oxford-daybed-original-v3.webp' },
  { key: 'bali', model: 'bali', label: 'Armchair & footstool', ptLabel: 'Poltrona e apoio de pés', original: '/product-images/bali-reference-v2/armchair-studio.webp' },
  { key: 'bali-single', model: 'bali', label: 'Single sun lounger', ptLabel: 'Espreguiçadeira simples', original: '/product-images/bali-reference-v2/single-studio.webp' },
  { key: 'bali-double', model: 'bali', label: 'Double sun lounger', ptLabel: 'Espreguiçadeira dupla', original: '/product-images/bali-reference-v2/double-studio.webp' },
  { key: 'gibraltar', model: 'gibraltar', label: 'Double sun lounger', ptLabel: 'Espreguiçadeira dupla', original: '/src/dev/colour-preview/images/gibraltar-original-v4.webp' },
  { key: 'crete', model: 'crete', label: 'Daybed', ptLabel: 'Cama de dia', original: '/src/dev/colour-preview/images/crete-original-v3.webp' },
].map(target => ({ ...target, original: studioOriginals[`./images/${target.original.split('/').at(-1)}`] || catalogueOriginals[target.original] || target.original }))

// Fixed-colour catalogue records stay unchanged; prepared views are matched explicitly.
export const productColourViews = {
  'berlin-modular-sofa': ['berlin', 'berlin-l', 'berlin-u', 'berlin-grey-set'],
  berlin: ['berlin-set', 'berlin', 'berlin-armchair'],
  'sicily-modular-set': ['sicily', 'sicily-centre', 'sicily-ottoman'],
  'luanda-2': ['luanda'], luanda: ['luanda-lounge'],
  'local-product-79d24eb70f26': ['luanda-armchair'],
  'bali-lounge-2': ['bali'], bali: ['bali-single'], 'bali-double-sun-lounger': ['bali-double'],
  'antigua-lounge': ['antigua'], 'antigua-xl-lounge': ['antigua-xl'],
  'oxford-2': ['oxford'], 'oxford-modular-sofa': ['oxford-modular'], oxford: ['oxford-daybed'],
  gibraltar: ['gibraltar'], 'crete-lounger': ['crete'],
}

// Configurations approved for publication; no dimensions or specifications inferred from photographs.
export const localColourPages = {
  'antigua-lounge': { key: 'antigua', name: 'Antigua Sofa Set', category: 'lounge' },
  'antigua-xl-lounge': { key: 'antigua-xl', name: 'Antigua Corner Sofa', category: 'lounge' },
  'oxford-2': { key: 'oxford', name: 'Oxford', category: 'lounge' },
  'oxford-modular-sofa': { key: 'oxford-modular', name: 'Oxford Modular Sofa', category: 'lounge' },
  oxford: { key: 'oxford-daybed', name: 'Oxford', category: 'sunlounger' },
  gibraltar: { key: 'gibraltar', name: 'Gibraltar Double Sun Lounger', category: 'sunlounger' },
  'crete-lounger': { key: 'crete', name: 'Crete Day Bed', category: 'sunlounger' },
}

export function getLocalColourProduct(id) {
  if (!Object.hasOwn(localColourPages, id)) return null
  const page = localColourPages[id]
  const target = colourTargets.find(item => item.key === page.key)
  return {
    id, name: page.name, category: page.category,
    collection: target.model, collectionSlug: target.model,
    collectionName: target.model[0].toUpperCase() + target.model.slice(1),
    categoryLabel: page.category === 'lounge' ? 'Lounge' : 'Sun Loungers',
    img: target.original, images: [target.original], curatedImages: true, fit: 'contain',
  }
}

export function getColourTarget(productId, part, imageIndex = 0) {
  const key = part
    ? (productId === 'sicily-modular-set' ? { corner: 'sicily', centre: 'sicily-centre', ottoman: 'sicily-ottoman' }[part] : null)
    : productColourViews[productId]?.[imageIndex]
  return colourTargets.find(target => target.key === key) || null
}
