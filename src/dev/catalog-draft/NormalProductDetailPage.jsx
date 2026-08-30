import ProductDetailPage from '../../pages/status-concept-product-detail'
import draftProducts from 'virtual:status-concept-draft-catalog'
import { buildNormalLocalCatalog } from './normalProductAdapter'

const localProducts = buildNormalLocalCatalog(draftProducts)

export default function NormalProductDetailPage() {
  return <ProductDetailPage additionalProducts={localProducts} />
}
