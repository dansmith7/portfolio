import { useState, useEffect } from 'react'
import * as api from '../../lib/dataApi'
import { queryClient } from '../../lib/queryClient'
import { broadcastAdminSave } from '../../lib/adminSync'
import AdminMediaField from '../../components/admin/AdminMediaField'
import AdminLocalizedTextField from '../../components/admin/AdminLocalizedTextField'
import { LOCALES, normalizeTranslations } from '../../lib/textLayout'
import './Admin.css'

const SITE_TEXT_FIELDS = [
  'hero_text',
  'description_text',
  'about_description_text',
  'why_us_text',
  'latest_works_label',
  'view_all_works_label',
  'why_us_title',
  'contact_title',
  'contact_description_text',
  'contact_form_text',
]

export default function AdminSettings() {
  const [activeLocale, setActiveLocale] = useState('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    why_us_photo_url: '',
    showreel_video_url: '',
    contact_email: '',
    contact_telegram: '',
    translations: normalizeTranslations(null, { hero_text: 'an(y) designs' }, SITE_TEXT_FIELDS),
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await api.getSiteSettings()
      if (data) {
        setForm({
          why_us_photo_url: data.why_us_photo_url ?? '',
          showreel_video_url: data.showreel_video_url ?? '',
          contact_email: data.contact_email ?? '',
          contact_telegram: data.contact_telegram ?? '',
          translations: normalizeTranslations(data.translations, data, SITE_TEXT_FIELDS),
        })
      }
    } catch (e) {
      setError(e.message || 'Ошибка загрузки. Локально: npm run server. На хостинге: задайте VITE_SUPABASE_* в Vercel.')
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError('')
    try {
      await api.updateSiteSettings({ ...form, updated_at: new Date().toISOString() })
      queryClient.invalidateQueries({ queryKey: ['site_settings'] })
      broadcastAdminSave()
    } catch (e) {
      setError(e.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  function updateTranslation(field, value) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: { ...current.translations[activeLocale], [field]: value },
      },
    }))
  }

  function updateWrapSettings(value) {
    setForm((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [activeLocale]: { ...current.translations[activeLocale], wrap_settings: value },
      },
    }))
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
      {loading ? (
        formSkeleton
      ) : (
        <div className="admin-form">
          <div className="admin-localized-editor">
            <div className="admin-locale-tabs" role="tablist" aria-label="Язык сайта">
              {LOCALES.map((locale) => (
                <button
                  key={locale.code}
                  type="button"
                  role="tab"
                  aria-selected={activeLocale === locale.code}
                  className={activeLocale === locale.code ? 'active' : ''}
                  onClick={() => setActiveLocale(locale.code)}
                >
                  {locale.label}
                  <span>{locale.code.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <div className="admin-locale-note">
              Авторские переносы включены по умолчанию. Для каждого текста можно переключиться на автоматический режим.
            </div>

            {[
              ['hero_text', 'Hero-текст', 3, 'admin-preview-hero'],
              ['description_text', 'Описание на главной', 5, 'admin-preview-site-body'],
              ['about_description_text', 'Вводный текст About', 5, 'admin-preview-site-body'],
              ['latest_works_label', 'Заголовок Latest works', 2, 'admin-preview-site-body'],
              ['view_all_works_label', 'Кнопка View all works', 2, 'admin-preview-site-body'],
              ['why_us_title', 'Заголовок Why us', 2, 'admin-preview-site-body'],
              ['why_us_text', 'Текст блока Why us', 7, 'admin-preview-site-body'],
              ['contact_title', 'Заголовок Contact us', 2, 'admin-preview-site-body'],
              ['contact_description_text', 'Описание блока Contact us', 4, 'admin-preview-site-body'],
              ['contact_form_text', 'Финальный призыв к действию', 3, 'admin-preview-site-body'],
            ].map(([field, label, rows, previewClassName]) => (
              <AdminLocalizedTextField
                key={`${activeLocale}-${field}`}
                field={field}
                label={label}
                rows={rows}
                value={form.translations[activeLocale]?.[field] || ''}
                wrapSettings={form.translations[activeLocale]?.wrap_settings || {}}
                onValueChange={(value) => updateTranslation(field, value)}
                onWrapSettingsChange={updateWrapSettings}
                previewClassName={previewClassName}
              />
            ))}
          </div>

          <AdminMediaField
            label="Фото блока Why us"
            value={form.why_us_photo_url}
            onChange={(url) => setForm((f) => ({ ...f, why_us_photo_url: url }))}
            accept="image/*"
          />
          <label>
            Ссылка на showreel (видео)
            <input
              type="url"
              value={form.showreel_video_url}
              onChange={(e) => setForm((f) => ({ ...f, showreel_video_url: e.target.value }))}
            />
          </label>
          <label>
            Email для контактов
            <input
              type="text"
              value={form.contact_email}
              onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
            />
          </label>
          <label>
            Telegram
            <input
              type="text"
              value={form.contact_telegram}
              onChange={(e) => setForm((f) => ({ ...f, contact_telegram: e.target.value }))}
            />
          </label>
        </div>
      )}
    </>
  )
}
