import { useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import LocalizedLink from '../components/LocalizedLink'
import { getLangFromPath } from '../utils/language'

export default function NotFound() {
  const location = useLocation()
  const isPortuguese = getLangFromPath(location.pathname) === 'pt'

  return (
    <Layout>
      <main className="not-found-page">
        <span className="fs sl">404</span>
        <h1 className="ff">{isPortuguese ? 'Esta página não existe.' : 'This page does not exist.'}</h1>
        <p className="fs">
          {isPortuguese
            ? 'Pode continuar a explorar a coleção ou falar diretamente com a nossa equipa.'
            : 'Continue exploring the collection or speak directly with our showroom team.'}
        </p>
        <div className="not-found-actions">
          <LocalizedLink className="cb cg" to="/products">{isPortuguese ? 'Explorar produtos' : 'Explore products'}</LocalizedLink>
          <LocalizedLink className="cb co" to="/contact">{isPortuguese ? 'Contactar a equipa' : 'Contact the team'}</LocalizedLink>
        </div>
      </main>
    </Layout>
  )
}
