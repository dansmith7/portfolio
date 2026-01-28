import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
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
    if (!supabase) {
      setError('Supabase не настроен. Добавьте переменные в .env')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Таймаут: запрос к БД не ответил за 15 сек. Проверьте сеть.')), 15000)
      )
      const query = supabase
        .from('projects')
        .select('id,slug,name,subtitle,show_on_home,created_at')
        .order('created_at', { ascending: false })
      const { data, error: e } = await Promise.race([query, timeout])
      if (e) throw e
      setProjects(data ?? [])
    } catch (e) {
      const msg = e.message || 'Ошибка загрузки'
      if (msg.startsWith('Таймаут:')) {
        setError(msg + ' Нажмите «Повторить» или «Добавить проект».')
      } else if (msg.includes('schema cache') || msg.includes('relation') || msg.includes('does not exist') || msg.includes('not find')) {
        setError(
          'Таблица projects не найдена. Выполните supabase-schema.sql в Supabase (SQL Editor). ' +
          '(Точная ошибка: ' + msg + ')'
        )
      } else {
        setError(msg)
      }
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
      {loading && !error && <p>Загрузка…</p>}
      {!loading && (
      <ul className="admin-projects-list">
        {error ? (
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
      )}
    </>
  )
}
