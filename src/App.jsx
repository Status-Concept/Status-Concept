import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'
import ConsentNotice from './components/ConsentNotice'
import TranslationLayer from './components/TranslationLayer'
import Homepage from './pages/status-concept-homepage'
import ScrollToTop from './ScrollToTop'
import PageNav from './PageNav'
import RouteMetadata from './components/RouteMetadata'

// Route-level code splitting: only the homepage ships in the entry chunk.
const Products = lazy(() => import('./pages/status-concept-products'))
const GlatzParasols = lazy(() => import('./pages/status-concept-glatz'))
const ProductDetail = lazy(() => import('./pages/status-concept-product-detail'))
const About = lazy(() => import('./pages/status-concept-about'))
const Contact = lazy(() => import('./pages/status-concept-contact'))
const Projects = lazy(() => import('./pages/status-concept-projects'))
const Favorites = lazy(() => import('./pages/status-concept-favorites'))
const Placeholder = lazy(() => import('./pages/status-concept-placeholder'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const ClientLayout = lazy(() => import('./pages/client/ClientLayout'))
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'))
const ClientProfile = lazy(() => import('./pages/client/ClientProfile'))
const ClientFavorites = lazy(() => import('./pages/client/ClientFavorites'))
const Legal = lazy(() => import('./pages/status-concept-legal'))
const AfterCare = lazy(() => import('./pages/status-concept-aftercare'))
const Catalogue = lazy(() => import('./pages/status-concept-catalogue'))
const NotFound = lazy(() => import('./pages/NotFound'))

const routesFor = (prefix = '') => (
  <>
    <Route path={prefix || '/'} element={<Homepage />} />
    <Route path={`${prefix}/products`} element={<Products />} />
    <Route path={`${prefix}/glatz-parasols`} element={<GlatzParasols />} />
    <Route path={`${prefix}/product/:id`} element={<ProductDetail />} />
    <Route path={`${prefix}/about`} element={<About />} />
    <Route path={`${prefix}/contact`} element={<Contact />} />
    <Route path={`${prefix}/projects`} element={<Projects />} />
    <Route path={`${prefix}/favorites`} element={<Favorites />} />
    <Route path={`${prefix}/after-care`} element={<AfterCare />} />
    <Route path={`${prefix}/gallery`} element={<Placeholder title="Gallery" subtitle="Completed outdoor spaces from across the Algarve." />} />
    <Route path={`${prefix}/catalogue`} element={<Catalogue />} />
    <Route path={`${prefix}/privacy`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/privacidade`} element={<Legal doc="privacy" />} />
    <Route path={`${prefix}/cookies`} element={<Legal doc="cookies" />} />
    <Route path={`${prefix}/terms`} element={<Legal doc="terms" />} />
    <Route path={`${prefix}/login`} element={<Login />} />
    <Route path={`${prefix}/registar`} element={<Register />} />
    <Route path={`${prefix}/register`} element={<Register />} />
    <Route
      path={`${prefix}/cliente`}
      element={
        <ProtectedRoute>
          <ClientLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<ClientDashboard />} />
      <Route path="perfil" element={<ClientProfile />} />
      <Route path="favoritos" element={<ClientFavorites />} />
    </Route>
  </>
)

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ScrollToTop />
          <RouteMetadata />
          <TranslationLayer />
          {import.meta.env.DEV && <PageNav />}
          <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} aria-busy="true" />}>
            <Routes>
              {routesFor()}
              {routesFor('/en')}
              {routesFor('/pt')}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <ConsentNotice />
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
