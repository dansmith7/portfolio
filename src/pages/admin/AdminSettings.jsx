import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { queryClient } from '../../lib/queryClient'
import AdminMediaField from '../../components/admin/AdminMediaField'
import './Admin.css'

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'

export default function AdminSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    hero_text: 'an(y) designs',
    description_text: '',
    why_us_photo_url: '',
    why_us_text: '',
    showreel_video_url: '',
    contact_email: '',
    contact_telegram: '',
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    if (!supabase) {
      setError('Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env')
      setLoading(false)
      return
    }
    try {
      const { data, error: e } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single()
      if (e) throw e
      if (data) setForm({
        hero_text: data.hero_text ?? '',
        description_text: data.description_text ?? '',
        why_us_photo_url: data.why_us_photo_url ?? '',
        why_us_text: data.why_us_text ?? '',
        showreel_video_url: data.showreel_video_url ?? '',
        contact_email: data.contact_email ?? '',
        contact_telegram: data.contact_telegram ?? '',
      })
    } catch (e) {
      const msg = e.message || 'Ошибка загрузки'
      if (msg.includes('schema cache') || msg.includes('relation') || msg.includes('does not exist')) {
        setError('Таблица site_settings не найдена. Выполните скрипт supabase-schema.sql в Supabase: SQL Editor → New query → вставьте содержимое файла supabase-schema.sql из корня проекта → Run.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    if (!supabase) return
    setSaving(true)
    setError('')
    try {
      const { error: e } = await supabase
        .from('site_settings')
        .upsert({
          id: SETTINGS_ID,
          ...form,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' })
      if (e) throw e
      queryClient.invalidateQueries({ queryKey: ['site_settings'] })
    } catch (e) {
      const msg = e.message || 'Ошибка сохранения'
      if (msg.includes('schema cache') || msg.includes('relation') || msg.includes('does not exist')) {
        setError('Таблица site_settings не найдена. Выполните скрипт supabase-schema.sql в Supabase (SQL Editor).')
      } else {
        setError(msg)
      }
    } finally {
      setSaving(false)
    }
  }

  const formSkeleton = (
    <div className="admin-form" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <div className="admin-skeleton admin-skeleton-line short" style={{ width: '24%', marginBottom: '0.4rem' }} />
          <div className="admin-skeleton admin-skeleton-block" style={{ height: i === 2 || i === 4 ? '4rem' : '2.5rem' }} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="admin-header">
        <h1>Настройки сайта</h1>
        <button type="button" onClick={save} disabled={saving} className="admin-btn">
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      {loading ? formSkeleton : (
      <div className="admin-form">
        <label>
          Hero-текст
          <input
            type="text"
            value={form.hero_text}
            onChange={(e) => setForm((f) => ({ ...f, hero_text: e.target.value }))}
          />
        </label>
        <label>
          Описание под hero
          <textarea
            value={form.description_text}
            onChange={(e) => setForm((f) => ({ ...f, description_text: e.target.value }))}
          />
        </label>
        <AdminMediaField
          label="Фото «Why us» (ссылка или загрузка с компьютера)"
          value={form.why_us_photo_url}
          onChange={(url) => setForm((f) => ({ ...f, why_us_photo_url: url }))}
          accept="image/*"
        />
        <label>
          Текст «Why us»
          <textarea
            value={form.why_us_text}
            onChange={(e) => setForm((f) => ({ ...f, why_us_text: e.target.value }))}
          />
        </label>
        <AdminMediaField
          label="Видео showreel (ссылка или загрузка с компьютера)"
          value={form.showreel_video_url}
          onChange={(url) => setForm((f) => ({ ...f, showreel_video_url: url }))}
          accept="video/*"
        />
        <label>
          Email контактов
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
          />
        </label>
        <label>
          Telegram контактов
          <input
            type="text"
            value={form.contact_telegram}
            onChange={(e) => setForm((f) => ({ ...f, contact_telegram: e.target.value }))}
            placeholder="@username"
          />
        </label>
      </div>
      )}
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Логотипы бегущей строки редактируются в разделе «Логотипы» (можно добавить отдельную страницу или блок ниже).
      </p>
    </>
  )
}
