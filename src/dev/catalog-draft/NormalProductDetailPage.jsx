import ProductDetailPage from '../../pages/status-concept-product-detail'
import { allProducts } from '../../data/productCatalog'
import draftProducts, { legacyImageOverrides } from 'virtual:status-concept-draft-catalog'
import { applyLegacyImageOverrides, buildNormalLocalCatalog } from './normalProductAdapter'

const localProducts = buildNormalLocalCatalog(draftProducts)
const legacyProducts = applyLegacyImageOverrides(allProducts, legacyImageOverrides)

export default function NormalProductDetailPage() {
  return <ProductDetailPage additionalProducts={[...legacyProducts, ...localProducts]} />
}
