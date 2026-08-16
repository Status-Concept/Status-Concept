import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './context/ToastContext'
import ConsentNotice from './components/ConsentNotice'
import TranslationLayer from './components/TranslationLayer'
import Homepage from './pages/status-concept-homepage'
import ScrollToTop from './ScrollToTop'
import RouteMetadata from './components/RouteMetadata'
import { SITE_FEATURES } from './config/sitePhase'

// Route-level code splitting: only the homepage ships in the entry chunk.
const Products = lazy(() => import('./pages/status-concept-products'))
const ProductDetail = lazy(() => import('./pages/status-concept-product-detail'))
const About = lazy(() => import('./pages/status-concept-about'))
const Contact = lazy(() => import('./pages/status-concept-contact'))
const Legal = lazy(() => import('./pages/status-concept-legal'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))
const DraftCataloguePage = import.meta.env.DEV
  ? lazy(() => import('./dev/catalog-draft/DraftCataloguePage'))
  : null
const DraftProductPage = import.meta.env.DEV
  ? lazy(() => import('./dev/catalog-draft/DraftProductPage'))
  : null

const routesFor = (prefix = '') => (
  <>
    {import.meta.env.DEV && DraftCataloguePage && DraftProductPage ? (
      <>
        <Route path={(prefix || '') + '/__dev/catalog-draft'} element={<DraftCataloguePage />} />
        <Route path={(prefix || '') + '/__dev/catalog-draft/:id'} element={<DraftProductPage />} />
      </>
    ) : null}
    <Route path={prefix || '/'} element={<Homepage />} />
    {SITE_FEATURES.products && <Route path={`${prefix}/products`} element={<Products />} />}
    {SITE_FEATURES.products && <Route path={`${prefix}/product/:id`} element={<ProductDetail />} />}
    {SITE_FEATURES.showrooms && <Route path={`${prefix}/about`} element={<About />} />}
    <Route path={`${prefix}/contact`} element={<Contact />} />
    <Route path={`${prefix}/login`} element={<Login />} />
    <Route path={`${prefix}/privacy`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/privacidade`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/cookies`} element={<Legal doc="cookies" />} />
    <Route path={`${prefix}/terms`} element={<Legal doc="terms" />} />
  </>
)

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <RouteMetadata />
      <TranslationLayer />
      <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} aria-busy="true" />}>
        <Routes>
          {routesFor()}
          {routesFor('/en')}
          {routesFor('/pt')}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ConsentNotice />
    </ToastProvider>
  )
}

export default App
