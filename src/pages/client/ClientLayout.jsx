import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function ClientLayout() {
  const navigate = useNavigate()
  const { profile, user, logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Sessao terminada.')
      navigate('/')
    } catch (error) {
      showToast(error.message || 'Nao foi possivel terminar sessao.', 'error')
    }
  }

  return (
    <main className="account-shell">
      <aside className="account-sidebar">
        <Link to="/" className="auth-logo ff">ST<span>A</span>TVS</Link>
        <div>
          <span className="fs sl">Area de cliente</span>
          <h1 className="ff">{profile?.name || user?.email}</h1>
        </div>
        <nav className="account-nav fs">
          <NavLink to="/cliente" end>Resumo</NavLink>
          <NavLink to="/cliente/perfil">Perfil</NavLink>
          <NavLink to="/cliente/favoritos">Favoritos</NavLink>
        </nav>
        <button type="button" className="account-logout fs" onClick={handleLogout}>Terminar sessao</button>
      </aside>
      <section className="account-content">
        <Outlet />
      </section>
    </main>
  )
}

