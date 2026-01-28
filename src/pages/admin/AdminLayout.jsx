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
        <h2>Админка</h2>
        <NavLink to="/admin" end>Главная</NavLink>
        <NavLink to="/admin/settings">Настройки сайта</NavLink>
        <NavLink to="/admin/projects">Проекты</NavLink>
        {user && (
          <button
            type="button"
            onClick={handleLogout}
            style={{
              margin: '1rem 1.2rem 0',
              padding: '0.4rem 0.8rem',
              background: 'transparent',
              border: '1px solid #666',
              color: '#ccc',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
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
