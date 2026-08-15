import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function StaffLayout() {
  const navigate = useNavigate()
  const { profile, user, logout } = useAuth()
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      showToast('Session ended.')
      navigate('/')
    } catch (error) {
      showToast(error.message || 'Could not end the session.', 'error')
    }
  }

  return (
    <Layout>
      <main className="staff-shell">
        <aside className="staff-sidebar">
          <div>
            <span className="fs sl">Staff workspace</span>
            <h1 className="ff">{profile?.name || user?.email}</h1>
            <span className="staff-role fs">{profile?.role}</span>
          </div>
          <nav className="staff-nav fs" aria-label="Staff navigation">
            <NavLink to="/staff/deliveries" end>Deliveries</NavLink>
          </nav>
          <button type="button" className="account-logout fs" onClick={handleLogout}>Log out</button>
        </aside>
        <section className="staff-content">
          <Outlet />
        </section>
      </main>
    </Layout>
  )
}
