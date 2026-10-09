import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import * as api from '../../lib/dataApi'
import { queryClient } from '../../lib/queryClient'
import { broadcastAdminSave } from '../../lib/adminSync'
import AdminMediaField from '../../components/admin/AdminMediaField'
import AdminLocalizedTextField from '../../components/admin/AdminLocalizedTextField'
import { LOCALES, normalizeTranslations } from '../../lib/textLayout'
import './Admin.css'

const PROJECT_TEXT_FIELDS = [
  'name',
  'subtitle',
  'description_text',
  'concept_text',
  'requirements_text',
  'output_text',
  'second_block_title',
  'second_block_text',
]

const EMPTY_TRANSLATIONS = normalizeTranslations(
  null,
  {
    second_block_title: 'Premium, but not snobbish',
    second_block_text: 'Starting with a very strong graphic concept, a parallel growth, the line becomes the protagonist of the visual identity.',
  },
  PROJECT_TEXT_FIELDS
)

export default function AdminProjectEdit() {
  const { projectSlug } = useParams()
  const isNew = !projectSlug || projectSlug === 'new'
  const navigate = useNavigate()
  const [activeLocale, setActiveLocale] = useState('en')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    slug: '',
    cover_image_url: '',
    show_on_home: false,
    first_horizontal_image_url: '',
    presentation_url: '',
    translations: EMPTY_TRANSLATIONS,
  })
  const [mediaBlocks, setMediaBlocks] = useState([])

  useEffect(() => {
    if (!isNew && projectSlug) load()
    // load is intentionally scoped to this editor and keyed by the route params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, projectSlug])

  async function load() {
    try {
      const project = await api.getProjectBySlug(projectSlug)
      if (project) {
        setForm({
          slug: project.slug ?? '',
          cover_image_url: project.cover_image_url ?? '',
          show_on_home: project.show_on_home ?? false,
          first_horizontal_image_url: project.first_horizontal_image_url ?? '',
          presentation_url: project.presentation_url ?? '',
          translations: normalizeTranslations(project.translations, project, PROJECT_TEXT_FIELDS),
        })
        const media = project.media ?? []
        setMediaBlocks(
          [...media]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((m) => ({
              id: m.id,
              type: m.type,
              image_url_1: m.image_url_1 ?? '',
              image_url_2: m.image_url_2 ?? '',
            }))
        )
      }
    } catch (e) {
      setError(e.message || 'Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setSaving(true)
    setError('')
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Таймаут сохранения (20 сек).')), 20000)
    )
    try {
      const body = {
        ...form,
        media: mediaBlocks.map((b, i) => ({
          id: b.id,
          type: b.type,
          image_url_1: b.image_url_1,
          image_url_2: b.image_url_2,
          sort_order: i,
        })),
      }
      if (isNew) {
        const created = await Promise.race([api.createProject(body), timeout])
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['project'] })
        navigate(`/admin/projects/${created.slug}`)
      } else {
        await Promise.race([api.updateProject(projectSlug, body), timeout])
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['project'] })
        queryClient.removeQueries({ queryKey: ['project', form.slug] })
        queryClient.removeQueries({ queryKey: ['project', projectSlug] })
        broadcastAdminSave()
      }
    } catch (e) {
      setError(e.message || 'Ошибка сохранения')
    } finally {
      setSaving(false)
    }
  }

  function addMediaBlock(type) {
    setMediaBlocks((prev) => [...prev, { id: crypto.randomUUID(), type, image_url_1: '', image_url_2: '' }])
  }

  function removeMediaBlock(index) {
    setMediaBlocks((prev) => prev.filter((_, i) => i !== index))
  }

  function updateMediaBlock(index, field, value) {
    setMediaBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, [field]: value } : b)))
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
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
        <div key={i} style={{ marginBottom: '1rem' }}>
          <div className="admin-skeleton admin-skeleton-line short" style={{ width: '28%', marginBottom: '0.4rem' }} />
          <div className="admin-skeleton admin-skeleton-block" style={{ height: i >= 4 && i <= 7 ? '4rem' : '2.5rem' }} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      <div className="admin-header">
        <h1>{isNew ? 'Новый проект' : 'Редактирование проекта'}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to="/admin/projects" className="admin-btn secondary" style={{ textDecoration: 'none' }}>Назад</Link>
          <button type="button" onClick={save} disabled={saving} className="admin-btn">
            {saving ? 'Сохранение…' : 'Сохранить'}
          </button>
        </div>
      </div>
      {error && <div className="admin-error">{error}</div>}
      {loading ? (
        formSkeleton
      ) : (
      <div className="admin-form">
        <label>
          Slug (URL, например ingv)
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="ingv"
            disabled={!isNew}
          />
        </label>
        <AdminMediaField
          label="Заглавное фото — идёт на Work и на страницу проекта (ссылка или загрузка)"
          value={form.cover_image_url}
          onChange={(url) => setForm((f) => ({ ...f, cover_image_url: url }))}
          accept="image/*"
        />
        <div className="admin-checkbox-row">
          <input
            type="checkbox"
            id="show_on_home"
            checked={form.show_on_home}
            onChange={(e) => setForm((f) => ({ ...f, show_on_home: e.target.checked }))}
          />
          <label htmlFor="show_on_home" style={{ marginBottom: 0 }}>Отображать на главной (в блоке Latest works)</label>
        </div>

        <div className="admin-localized-editor">
          <div className="admin-locale-tabs" role="tablist" aria-label="Язык проекта">
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
            Авторские переносы включены по умолчанию. Enter фиксирует строку; пустая строка создаёт абзац.
          </div>

          {[
            ['name', 'Название проекта', 2, 'admin-preview-project-title'],
            ['subtitle', 'Подзаголовок / категория', 2, 'admin-preview-project-subtitle'],
            ['description_text', 'Описание проекта', 4, 'admin-preview-project-body'],
            ['concept_text', 'CONCEPT', 6, 'admin-preview-project-body'],
            ['requirements_text', 'REQUIREMENTS', 6, 'admin-preview-project-body'],
            ['output_text', 'OUTPUT', 6, 'admin-preview-project-body'],
            ['second_block_title', 'Заголовок второго описания', 3, 'admin-preview-project-title'],
            ['second_block_text', 'Текст второго описания', 6, 'admin-preview-project-body'],
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
          label="Presentation (ссылка или загрузка PDF/презентации — кнопка «Download project presentation»)"
          value={form.presentation_url}
          onChange={(url) => setForm((f) => ({ ...f, presentation_url: url }))}
          accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          folder="presentations"
        />
        <AdminMediaField
          label="Первое горизонтальное фото (ссылка или загрузка)"
          value={form.first_horizontal_image_url}
          onChange={(url) => setForm((f) => ({ ...f, first_horizontal_image_url: url }))}
          accept="image/*"
        />
        <h3 style={{ marginTop: '1.5rem' }}>Дополнительные медиа</h3>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Добавьте блоки: горизонтальное фото или два вертикальных.
        </p>
        <div style={{ marginTop: '0.5rem' }}>
          <button type="button" onClick={() => addMediaBlock('horizontal')} className="admin-btn secondary" style={{ marginRight: '0.5rem' }}>
            + Горизонтальное фото
          </button>
          <button type="button" onClick={() => addMediaBlock('two_verticals')} className="admin-btn secondary">
            + Два вертикальных
          </button>
        </div>
        <div className="admin-media-blocks">
          {mediaBlocks.map((b, i) => (
            <div key={b.id} className="admin-media-block">
              <h4>{b.type === 'horizontal' ? 'Горизонтальное фото' : 'Два вертикальных'}</h4>
              {b.type === 'horizontal' && (
                <AdminMediaField
                  label="Изображение"
                  value={b.image_url_1}
                  onChange={(url) => updateMediaBlock(i, 'image_url_1', url)}
                  accept="image/*"
                />
              )}
              {b.type === 'two_verticals' && (
                <>
                  <AdminMediaField
                    label="Первое изображение"
                    value={b.image_url_1}
                    onChange={(url) => updateMediaBlock(i, 'image_url_1', url)}
                    accept="image/*"
                  />
                  <AdminMediaField
                    label="Второе изображение"
                    value={b.image_url_2}
                    onChange={(url) => updateMediaBlock(i, 'image_url_2', url)}
                    accept="image/*"
                  />
                </>
              )}
              <div className="admin-actions-inline">
                <button type="button" className="danger" onClick={() => removeMediaBlock(i)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
    </>
  )
}
