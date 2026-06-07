import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'
import CookieBanner from './components/CookieBanner'
import TranslationLayer from './components/TranslationLayer'
import Homepage from './pages/status-concept-homepage'
import Products from './pages/status-concept-products'
import Collection from './pages/status-concept-collection'
import ProductDetail from './pages/status-concept-product-detail'
import About from './pages/status-concept-about'
import Contact from './pages/status-concept-contact'
import Projects from './pages/status-concept-projects'
import Favorites from './pages/status-concept-favorites'
import Placeholder from './pages/status-concept-placeholder'
import Login from './pages/Login'
import Register from './pages/Register'
import ClientLayout from './pages/client/ClientLayout'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProfile from './pages/client/ClientProfile'
import ClientFavorites from './pages/client/ClientFavorites'
import ScrollToTop from './ScrollToTop'
import PageNav from './PageNav'

const routesFor = (prefix = '') => (
  <>
    <Route path={prefix || '/'} element={<Homepage />} />
    <Route path={`${prefix}/products`} element={<Products />} />
    <Route path={`${prefix}/collection`} element={<Collection />} />
    <Route path={`${prefix}/product/:id`} element={<ProductDetail />} />
    <Route path={`${prefix}/about`} element={<About />} />
    <Route path={`${prefix}/contact`} element={<Contact />} />
    <Route path={`${prefix}/projects`} element={<Projects />} />
    <Route path={`${prefix}/favorites`} element={<Favorites />} />
    <Route path={`${prefix}/after-care`} element={<Placeholder title="After Care & Valet Service" subtitle="Seasonal care, cleaning and maintenance for your outdoor furniture. Full details coming soon." />} />
    <Route path={`${prefix}/gallery`} element={<Placeholder title="Gallery" subtitle="A curated collection of completed outdoor spaces across the Algarve. Coming soon." />} />
    <Route path={`${prefix}/catalogue`} element={<Placeholder title="Catalogue" subtitle="Browse and download our full product catalogue. Coming soon." />} />
    <Route path={`${prefix}/login`} element={<Login />} />
    <Route path={`${prefix}/registar`} element={<Register />} />
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
          <TranslationLayer />
          <PageNav />
          <Routes>
            {routesFor()}
            {routesFor('/en')}
            {routesFor('/pt')}
          </Routes>
          <CookieBanner />
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
