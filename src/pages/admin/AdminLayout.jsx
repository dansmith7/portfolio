import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import './Admin.css'

export default function AdminLayout() {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Панель управления</h2>
        <nav>
          <NavLink to="/admin" end>Главная</NavLink>
          <NavLink to="/admin/settings">Настройки сайта</NavLink>
          <NavLink to="/admin/projects">Проекты</NavLink>
        </nav>
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            Выйти
          </button>
        )}
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
