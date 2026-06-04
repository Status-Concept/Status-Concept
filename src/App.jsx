import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'
import CookieBanner from './components/CookieBanner'
import Homepage from './pages/status-concept-homepage'
import Products from './pages/status-concept-products'
import Collection from './pages/status-concept-collection'
import ProductDetail from './pages/status-concept-product-detail'
import About from './pages/status-concept-about'
import Contact from './pages/status-concept-contact'
import Projects from './pages/status-concept-projects'
import Favorites from './pages/status-concept-favorites'
import Login from './pages/Login'
import Register from './pages/Register'
import ClientLayout from './pages/client/ClientLayout'
import ClientDashboard from './pages/client/ClientDashboard'
import ClientProfile from './pages/client/ClientProfile'
import ClientFavorites from './pages/client/ClientFavorites'
import ScrollToTop from './ScrollToTop'
import PageNav from './PageNav'

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <ScrollToTop />
          <PageNav />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registar" element={<Register />} />
            <Route
              path="/cliente"
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
          </Routes>
          <CookieBanner />
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  )
}

export default App
