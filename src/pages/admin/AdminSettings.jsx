import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { clearCache } from '../../lib/siteData'
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
    setError('')
    try {
      const r = await fetch('/api/settings')
      let data = null
      try { data = await r.json() } catch (_) {}
      const err = !r.ok && (data?.error || `HTTP ${r.status}`)
      if (err) throw new Error(err)
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
      if (/relation|does not exist|schema cache/i.test(msg)) {
        setError('Таблица site_settings не найдена. Выполните supabase-schema.sql в Supabase (SQL Editor).')
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
      clearCache()
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

  return (
    <>
      <div className="admin-header">
        <h1>Настройки сайта</h1>
        <button type="button" onClick={save} disabled={saving || loading} className="admin-btn">
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
      </div>
      {error && <div className="admin-error">{error}</div>}
      <div className="admin-form" aria-busy={loading}>
        <label>
          Hero-текст
          <input
            type="text"
            value={form.hero_text}
            onChange={(e) => setForm((f) => ({ ...f, hero_text: e.target.value }))}
            disabled={loading}
          />
        </label>
        <label>
          Описание под hero
          <textarea
            value={form.description_text}
            onChange={(e) => setForm((f) => ({ ...f, description_text: e.target.value }))}
            disabled={loading}
          />
        </label>
        <AdminMediaField
          label="Фото «Why us» (ссылка или загрузка с компьютера)"
          value={form.why_us_photo_url}
          onChange={(url) => setForm((f) => ({ ...f, why_us_photo_url: url }))}
          accept="image/*"
          disabled={loading}
        />
        <label>
          Текст «Why us»
          <textarea
            value={form.why_us_text}
            onChange={(e) => setForm((f) => ({ ...f, why_us_text: e.target.value }))}
            disabled={loading}
          />
        </label>
        <AdminMediaField
          label="Видео showreel (ссылка или загрузка с компьютера)"
          value={form.showreel_video_url}
          onChange={(url) => setForm((f) => ({ ...f, showreel_video_url: url }))}
          accept="video/*"
          disabled={loading}
        />
        <label>
          Email контактов
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
            disabled={loading}
          />
        </label>
        <label>
          Telegram контактов
          <input
            type="text"
            value={form.contact_telegram}
            onChange={(e) => setForm((f) => ({ ...f, contact_telegram: e.target.value }))}
            placeholder="@username"
            disabled={loading}
          />
        </label>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Логотипы бегущей строки редактируются в разделе «Логотипы» (можно добавить отдельную страницу или блок ниже).
      </p>
    </>
  )
}
