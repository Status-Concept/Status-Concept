import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StaffRoute({ children }) {
  const { isAuthenticated, loading, profile, isSupabaseConfigured } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="account-shell account-loading">
        <div className="loader" />
        <p className="fs">A carregar sessão...</p>
      </div>
    )
  }

  if (!isSupabaseConfigured || !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!['delivery', 'admin'].includes(profile?.role)) {
    return <Navigate to="/cliente" replace />
  }

  return children
}
