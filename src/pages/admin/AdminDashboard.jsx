import { Link } from 'react-router-dom'
import './Admin.css'

export default function AdminDashboard() {
  return (
    <>
      <div className="admin-header">
        <h1>Панель управления</h1>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>
            Настройки сайта
          </h3>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#64748b' }}>
            Hero, описание, Why us, видео, контакты
          </p>
          <Link 
            to="/admin/settings" 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Открыть →
          </Link>
        </div>
        <div style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>
            Проекты
          </h3>
          <p style={{ margin: '0 0 1rem', fontSize: '0.875rem', color: '#64748b' }}>
            Список проектов, карточки для Work и для главной
          </p>
          <Link 
            to="/admin/projects" 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Открыть →
          </Link>
        </div>
      </div>
    </>
  )
}
