import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../FavoritesContext'

export default function ClientDashboard() {
  const { profile, user } = useAuth()
  const { favorites } = useFavorites()

  return (
    <div className="account-panel">
      <span className="fs sl">Resumo</span>
      <h2 className="ff">Bem-vindo, {profile?.name || user?.email}</h2>
      <p className="fs account-copy">Aqui podes acompanhar favoritos, dados pessoais e futuros pedidos de orcamento.</p>

      <div className="account-stats">
        <article>
          <span className="fs">Favoritos guardados</span>
          <strong className="ff">{favorites.length}</strong>
          <Link to="/cliente/favoritos">Ver favoritos</Link>
        </article>
        <article>
          <span className="fs">Perfil</span>
          <strong className="ff">{profile?.phone ? 'Completo' : 'Parcial'}</strong>
          <Link to="/cliente/perfil">Editar dados</Link>
        </article>
      </div>

      <div className="quote-placeholder">
        <span className="fs sl">Orcamentos</span>
        <p className="fs">Em breve, os pedidos feitos no site aparecerao aqui com estado, notas e historico.</p>
      </div>
    </div>
  )
}

