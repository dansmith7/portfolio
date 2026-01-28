import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Admin.css'

let cachedProjects = null

export function invalidateProjectsCache() {
  cachedProjects = null
}

export default function AdminProjects() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState(cachedProjects ?? [])
  const [loading, setLoading] = useState(!cachedProjects)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    if (!cachedProjects) setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/projects')
      let data = null
      try { data = await r.json() } catch (_) {}
      const err = !r.ok && (data?.error || `HTTP ${r.status}`)
      if (err) throw new Error(err)
      const list = Array.isArray(data) ? data : []
      cachedProjects = list
      setProjects(list)
    } catch (e) {
      const msg = e.message || 'Ошибка загрузки'
      if (/relation|does not exist|schema cache|not find/i.test(msg)) {
        setError('Таблица projects не найдена. Выполните supabase-schema.sql в Supabase (SQL Editor).')
      } else {
        setError(msg + ' Нажмите «Повторить» или «Добавить проект».')
      }
    } finally {
      setLoading(false)
    }
  }

  const showSkeleton = loading && projects.length === 0 && !error

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
        {showSkeleton ? (
          [...Array(5)].map((_, i) => (
            <li key={i} className="admin-skeleton-item">
              <div>
                <span className="admin-skeleton admin-skeleton-title" />
                <span className="admin-skeleton admin-skeleton-meta" />
              </div>
              <span className="admin-skeleton admin-skeleton-btn" />
            </li>
          ))
        ) : error ? (
          <li style={{ color: '#666', listStyle: 'none' }}>
            Исправьте ошибку выше и обновите (F5) или нажмите «Повторить». Кнопка «Добавить проект» всегда доступна.
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
              <Link to={`/admin/projects/${p.slug || p.id}`} className="admin-btn" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                Редактировать
              </Link>
            </li>
          ))
        )}
      </ul>
    </>
  )
}
