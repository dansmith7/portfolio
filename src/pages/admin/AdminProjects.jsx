import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../../lib/dataApi'
import './Admin.css'

export default function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Таймаут: запрос не ответил за 15 сек.')), 15000)
      )
      const data = await Promise.race([api.getProjects(), timeout])
      setProjects(Array.isArray(data) ? data : [])
    } catch (e) {
      const msg = e.message || 'Ошибка загрузки'
      setError(msg + (msg.includes('Таймаут') ? ' Локально: npm run server. На хостинге: VITE_SUPABASE_* в Vercel.' : ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Проекты</h1>
        <button
          type="button"
          className="admin-btn"
          onClick={() => navigate('/admin/projects/new')}
        >
          Добавить проект
        </button>
      </div>
      {error && (
        <div className="admin-error">
          {error}
          <button type="button" className="admin-btn secondary" onClick={load} style={{ marginLeft: '0.5rem', marginTop: '0.25rem' }}>
            Повторить
          </button>
        </div>
      )}
      <ul className="admin-projects-list">
        {loading && !error
          ? Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="admin-skeleton-row" aria-hidden="true">
                <div className="left">
                  <div className={`admin-skeleton admin-skeleton-line ${i % 2 ? 'medium' : 'long'}`} style={{ marginBottom: '0.35rem' }} />
                  <div className="admin-skeleton admin-skeleton-line short" />
                </div>
                <div className="admin-skeleton right" />
              </li>
            ))
          : error ? (
            <li style={{ color: '#666', listStyle: 'none' }}>
              Локально: <code>npm run server</code>. На хостинге: задайте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Vercel.
            </li>
          ) : projects.length === 0 ? (
            <li>Проектов пока нет. <button type="button" className="admin-link-btn" onClick={() => navigate('/admin/projects/new')}>Создать первый</button></li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <div>
                  <Link to={`/admin/projects/${p.slug || p.id}`}>{p.name || 'Без названия'}</Link>
                  <div className="admin-project-meta">
                    {p.subtitle && <span>{p.subtitle}</span>}
                    {p.show_on_home && <span> • На главной</span>}
                  </div>
                </div>
                <Link to={`/admin/projects/${p.slug || p.id}`} className="admin-btn" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', fontSize: '0.85rem', color: '#fff' }}>
                  Редактировать
                </Link>
              </li>
            ))
          )}
      </ul>
    </>
  )
}
