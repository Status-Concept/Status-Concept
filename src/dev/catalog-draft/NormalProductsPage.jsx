import ProductsPage from '../../pages/status-concept-products'
import { allProducts } from '../../data/productCatalog'
import draftProducts, { categoryHeroOverrides, legacyImageOverrides } from 'virtual:status-concept-draft-catalog'
import { applyLegacyImageOverrides, buildNormalLocalCatalog, privateImageUrl } from './normalProductAdapter'

const localProducts = buildNormalLocalCatalog(draftProducts)
const legacyProducts = applyLegacyImageOverrides(allProducts, legacyImageOverrides)
const productCatalog = [...legacyProducts, ...localProducts]
const heroOverrides = Object.fromEntries(
  Object.entries(categoryHeroOverrides).map(([category, image]) => [category, privateImageUrl(image)]),
)

export default function NormalProductsPage() {
  return <ProductsPage productCatalog={productCatalog} localProducts={localProducts} categoryHeroOverrides={heroOverrides} />
}
