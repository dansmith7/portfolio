import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { queryClient } from '../../lib/queryClient'
import AdminMediaField from '../../components/admin/AdminMediaField'
import './Admin.css'

export default function AdminProjectEdit() {
  const { projectSlug } = useParams()
  const isNew = !projectSlug || projectSlug === 'new'
  const navigate = useNavigate()
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    slug: '',
    cover_image_url: '',
    name: '',
    subtitle: '',
    show_on_home: false,
    description_text: '',
    concept_text: '',
    requirements_text: '',
    output_text: '',
    first_horizontal_image_url: '',
    second_block_title: 'Premium, but not snobbish',
    second_block_text: 'Starting with a very strong graphic concept, a parallel growth, the line becomes the protagonist of the visual identity. A line that grows, connects and marks a path both for the eye and the mind.',
  })
  const [mediaBlocks, setMediaBlocks] = useState([])

  useEffect(() => {
    if (!isNew && projectSlug) load()
  }, [isNew, projectSlug])

  async function load() {
    try {
      const { data, error: e } = await supabase
        .from('projects')
        .select('*, project_media(id,type,image_url_1,image_url_2,sort_order)')
        .eq('slug', projectSlug)
        .single()
      if (e) throw e
      const project = data
      if (project) {
        setForm({
          slug: project.slug ?? '',
          cover_image_url: project.cover_image_url ?? '',
          name: project.name ?? '',
          subtitle: project.subtitle ?? '',
          show_on_home: project.show_on_home ?? false,
          description_text: project.description_text ?? '',
          concept_text: project.concept_text ?? '',
          requirements_text: project.requirements_text ?? '',
          output_text: project.output_text ?? '',
          first_horizontal_image_url: project.first_horizontal_image_url ?? '',
          second_block_title: project.second_block_title ?? 'Premium, but not snobbish',
          second_block_text: project.second_block_text ?? '',
        })
        const media = project.project_media ?? []
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
    if (!supabase) {
      setError('Supabase не настроен')
      return
    }
    setSaving(true)
    setError('')
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Таймаут сохранения (20 сек). Проверьте сеть и повторите.')), 20000)
    )
    const doSave = async () => {
      if (isNew) {
        const { data: inserted, error: insertErr } = await supabase
          .from('projects')
          .insert({
            slug: form.slug || form.name?.toLowerCase().replace(/\s+/g, '-') || 'project',
            name: form.name,
            subtitle: form.subtitle,
            cover_image_url: form.cover_image_url,
            show_on_home: form.show_on_home,
            description_text: form.description_text,
            concept_text: form.concept_text,
            requirements_text: form.requirements_text,
            output_text: form.output_text,
            first_horizontal_image_url: form.first_horizontal_image_url,
            second_block_title: form.second_block_title,
            second_block_text: form.second_block_text,
          })
          .select('id')
          .single()
        if (insertErr) throw insertErr
        const projectId = inserted?.id
        for (let i = 0; i < mediaBlocks.length; i++) {
          const b = mediaBlocks[i]
          await supabase.from('project_media').insert({
            project_id: projectId,
            type: b.type,
            image_url_1: b.image_url_1,
            image_url_2: b.image_url_2,
            sort_order: i,
          })
        }
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        queryClient.invalidateQueries({ queryKey: ['project'] })
        const slug = form.slug || form.name?.toLowerCase().replace(/\s+/g, '-') || 'project'
        navigate(`/admin/projects/${slug}`)
      } else {
        const { data: existing } = await supabase.from('projects').select('id').eq('slug', projectSlug).single()
        if (!existing) throw new Error('Проект не найден')
        const { error: updErr } = await supabase
          .from('projects')
          .update({
            slug: form.slug,
            name: form.name,
            subtitle: form.subtitle,
            cover_image_url: form.cover_image_url,
            show_on_home: form.show_on_home,
            description_text: form.description_text,
            concept_text: form.concept_text,
            requirements_text: form.requirements_text,
            output_text: form.output_text,
            first_horizontal_image_url: form.first_horizontal_image_url,
            second_block_title: form.second_block_title,
            second_block_text: form.second_block_text,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
        if (updErr) throw updErr
        await supabase.from('project_media').delete().eq('project_id', existing.id)
        for (let i = 0; i < mediaBlocks.length; i++) {
          const b = mediaBlocks[i]
          await supabase.from('project_media').insert({
            project_id: existing.id,
            type: b.type,
            image_url_1: b.image_url_1,
            image_url_2: b.image_url_2,
            sort_order: i,
          })
        }
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
    }
    try {
      await Promise.race([doSave(), timeout])
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
        <label>
          Название проекта
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </label>
        <label>
          Подзаголовок (категория)
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            placeholder="UX/UI Design • Design System"
          />
        </label>
        <div className="admin-checkbox-row">
          <input
            type="checkbox"
            id="show_on_home"
            checked={form.show_on_home}
            onChange={(e) => setForm((f) => ({ ...f, show_on_home: e.target.checked }))}
          />
          <label htmlFor="show_on_home" style={{ marginBottom: 0 }}>Отображать на главной (в блоке Latest works)</label>
        </div>
        <label>
          Описание проекта
          <textarea
            value={form.description_text}
            onChange={(e) => setForm((f) => ({ ...f, description_text: e.target.value }))}
          />
        </label>
        <label>
          CONCEPT
          <textarea
            value={form.concept_text}
            onChange={(e) => setForm((f) => ({ ...f, concept_text: e.target.value }))}
          />
        </label>
        <label>
          REQUIREMENTS
          <textarea
            value={form.requirements_text}
            onChange={(e) => setForm((f) => ({ ...f, requirements_text: e.target.value }))}
          />
        </label>
        <label>
          OUTPUT
          <textarea
            value={form.output_text}
            onChange={(e) => setForm((f) => ({ ...f, output_text: e.target.value }))}
          />
        </label>
        <AdminMediaField
          label="Первое горизонтальное фото (ссылка или загрузка)"
          value={form.first_horizontal_image_url}
          onChange={(url) => setForm((f) => ({ ...f, first_horizontal_image_url: url }))}
          accept="image/*"
        />
        <label>
          Заголовок второго описания
          <input
            type="text"
            value={form.second_block_title}
            onChange={(e) => setForm((f) => ({ ...f, second_block_title: e.target.value }))}
          />
        </label>
        <label>
          Текст второго описания
          <textarea
            value={form.second_block_text}
            onChange={(e) => setForm((f) => ({ ...f, second_block_text: e.target.value }))}
          />
        </label>

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
