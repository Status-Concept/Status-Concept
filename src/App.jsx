import { Routes, Route } from 'react-router-dom'
import Homepage from './pages/status-concept-homepage'
import Products from './pages/status-concept-products'
import Collection from './pages/status-concept-collection'
import ProductDetail from './pages/status-concept-product-detail'
import About from './pages/status-concept-about'
import Contact from './pages/status-concept-contact'
import Projects from './pages/status-concept-projects'
import ScrollToTop from './ScrollToTop'
import PageNav from './PageNav'

function App() {
  return (
    <>
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
      </Routes>
    </>
  )
}

export default App
