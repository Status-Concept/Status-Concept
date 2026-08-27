import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './FavoritesContext'
import ConsentNotice from './components/ConsentNotice'
import TranslationLayer from './components/TranslationLayer'
import Homepage from './pages/status-concept-homepage'
import ScrollToTop from './ScrollToTop'
import RouteMetadata from './components/RouteMetadata'
import { SITE_FEATURES } from './config/sitePhase'

// Route-level code splitting: only the homepage ships in the entry chunk.
const Products = lazy(() => import('./pages/status-concept-products'))
const ProductDetail = lazy(() => import('./pages/status-concept-product-detail'))
const Glatz = lazy(() => import('./pages/status-concept-glatz'))
const Projects = lazy(() => import('./pages/status-concept-projects'))
const AfterCare = lazy(() => import('./pages/status-concept-aftercare'))
const About = lazy(() => import('./pages/status-concept-about'))
const Contact = lazy(() => import('./pages/status-concept-contact'))
const Legal = lazy(() => import('./pages/status-concept-legal'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const FuturePhase = lazy(() => import('./pages/FuturePhase'))
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
    {SITE_FEATURES.products && <Route path={`${prefix}/glatz-parasols`} element={<Glatz />} />}
    {SITE_FEATURES.projects
      ? <Route path={`${prefix}/projects`} element={<Projects />} />
      : <Route path={`${prefix}/projects`} element={<FuturePhase />} />}
    {SITE_FEATURES.afterCare
      ? <Route path={`${prefix}/after-care`} element={<AfterCare />} />
      : <Route path={`${prefix}/after-care`} element={<FuturePhase />} />}
    {SITE_FEATURES.showrooms && <Route path={`${prefix}/about`} element={<About />} />}
    <Route path={`${prefix}/contact`} element={<Contact />} />
    <Route path={`${prefix}/login`} element={<Login />} />
    <Route path={`${prefix}/register`} element={<Register />} />
    <Route path={`${prefix}/registar`} element={<Register />} />
    <Route path={`${prefix}/privacy`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/privacidade`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/cookies`} element={<Legal doc="cookies" />} />
    <Route path={`${prefix}/terms`} element={<Legal doc="terms" />} />
  </>
)

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
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
      </FavoritesProvider>
    </AuthProvider>
  )
}

export default App
