import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

export default function AdminGuard({ children }) {
  const { user, loading } = useAdminAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="admin-layout" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p>Загрузка…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}
