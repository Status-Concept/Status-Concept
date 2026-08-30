import ProductsPage from '../../pages/status-concept-products'
import { allProducts } from '../../data/productCatalog'
import draftProducts from 'virtual:status-concept-draft-catalog'
import { buildNormalLocalCatalog } from './normalProductAdapter'

const localProducts = buildNormalLocalCatalog(draftProducts)
const productCatalog = [...allProducts, ...localProducts]

export default function NormalProductsPage() {
  return <ProductsPage productCatalog={productCatalog} localProducts={localProducts} />
}
