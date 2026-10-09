const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const cors = require('cors')

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')
const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'

function authoredWrapSettings(fields) {
  return Object.fromEntries(fields.map((field) => [field, { mode: 'authored', mobile_text: '' }]))
}

function defaultSiteTranslations(legacy = {}) {
  const fields = ['hero_text', 'description_text', 'about_description_text', 'latest_works_label', 'view_all_works_label', 'why_us_title', 'why_us_text', 'contact_title', 'contact_description_text', 'contact_form_text']
  return {
    en: {
      hero_text: legacy.hero_text || 'an(y) designs',
      description_text: legacy.description_text || '',
      about_description_text: legacy.about_description_text || legacy.description_text || '',
      latest_works_label: legacy.latest_works_label || 'LATEST WORKS',
      view_all_works_label: legacy.view_all_works_label || 'View All Works',
      why_us_title: legacy.why_us_title || 'Why us',
      why_us_text: legacy.why_us_text || '',
      contact_title: legacy.contact_title || 'CONTACT US',
      contact_description_text: legacy.contact_description_text || "Reach out to us and let's collaborate on bringing your project to life.",
      contact_form_text: legacy.contact_form_text || 'Feel Like We Could Collaborate? Get in Touch!',
      wrap_settings: authoredWrapSettings(fields),
    },
    ru: {
      hero_text: '', description_text: '', about_description_text: '', latest_works_label: '',
      view_all_works_label: '', why_us_title: '', why_us_text: '', contact_title: '',
      contact_description_text: '', contact_form_text: '', wrap_settings: authoredWrapSettings(fields),
    },
  }
}

function defaultProjectTranslations(legacy = {}) {
  const fields = ['name', 'subtitle', 'description_text', 'concept_text', 'requirements_text', 'output_text', 'second_block_title', 'second_block_text']
  return {
    en: {
      ...Object.fromEntries(fields.map((field) => [field, legacy[field] || ''])),
      wrap_settings: authoredWrapSettings(fields),
    },
    ru: {
      ...Object.fromEntries(fields.map((field) => [field, ''])),
      wrap_settings: authoredWrapSettings(fields),
    },
  }
}

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
;[UPLOADS_DIR, path.join(UPLOADS_DIR, 'media'), path.join(UPLOADS_DIR, 'presentations')].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

function readJson(name) {
  const p = path.join(DATA_DIR, name)
  if (!fs.existsSync(p)) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 2), 'utf8')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body?.folder || 'media'
    const dir = path.join(UPLOADS_DIR, folder)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = (file.originalname.match(/\.[^.]+$/) || ['.bin'])[0]
    const base = (file.originalname.replace(/\.[^.]+$/, '') || 'file').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    cb(null, `${Date.now()}-${base}${ext}`)
  },
})
const upload = multer({ storage })

const app = express()
const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS || '*'
app.use(cors({ origin: ALLOW_ORIGINS === '*' ? true : ALLOW_ORIGINS.split(',').map((o) => o.trim()) }))
app.use(express.json())

app.use('/uploads', express.static(UPLOADS_DIR))

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token
  const valid = process.env.ADMIN_PASSWORD && token === process.env.ADMIN_PASSWORD
  if (!valid && (req.path.includes('/api/') && !req.path.endsWith('/auth/login') && req.method !== 'GET')) {
    return res.status(401).json({ error: 'Не авторизован' })
  }
  next()
}
app.use(authMiddleware)

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body || {}
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return res.status(500).json({ error: 'Сервер: задайте ADMIN_PASSWORD в .env' })
  if (password === expected) return res.json({ ok: true, token: expected })
  res.status(401).json({ error: 'Неверный пароль' })
})

app.get('/api/site-settings', (req, res) => {
  const data = readJson('site_settings.json')
  if (!data) {
    const base = { id: SETTINGS_ID, hero_text: 'an(y) designs', description_text: '', why_us_photo_url: '', why_us_text: '', showreel_video_url: '', contact_email: '', contact_telegram: '', updated_at: null }
    const def = { ...base, translations: defaultSiteTranslations(base) }
    writeJson('site_settings.json', def)
    return res.json(def)
  }
  const translations = data.translations || defaultSiteTranslations(data)
  res.json({ ...data, ...(translations.en || {}), translations })
})

app.put('/api/site-settings', (req, res) => {
  const previous = readJson('site_settings.json') || {}
  const translations = req.body.translations || previous.translations || defaultSiteTranslations(previous)
  const data = {
    ...previous,
    ...req.body,
    ...(translations.en || {}),
    translations,
    id: SETTINGS_ID,
    updated_at: new Date().toISOString(),
  }
  writeJson('site_settings.json', data)
  res.json(data)
})

app.get('/api/projects', (req, res) => {
  const onlyHome = req.query.show_on_home === 'true'
  let list = readJson('projects.json') || []
  if (!Array.isArray(list)) list = []
  if (onlyHome) list = list.filter((p) => p.show_on_home)
  list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
  res.json(list)
})

app.get('/api/projects/:slug', (req, res) => {
  const list = readJson('projects.json') || []
  const project = list.find((p) => p.slug === req.params.slug)
  if (!project) return res.status(404).json({ error: 'Проект не найден' })
  const media = (project.media || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  res.json({ ...project, media })
})

app.post('/api/projects', (req, res) => {
  const list = readJson('projects.json') || []
  const body = req.body || {}
  const requestedName = body.translations?.en?.name || body.name || ''
  const slug = (body.slug || requestedName.toLowerCase().replace(/\s+/g, '-') || 'project').replace(/[^a-z0-9-]/g, '')
  let uniqueSlug = slug
  let c = 1
  while (list.some((p) => p.slug === uniqueSlug)) uniqueSlug = `${slug}-${c++}`
  const now = new Date().toISOString()
  const translations = body.translations || defaultProjectTranslations(body)
  const english = translations.en || body
  const project = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    slug: uniqueSlug,
    name: english.name || '',
    subtitle: english.subtitle || '',
    cover_image_url: body.cover_image_url || '',
    show_on_home: !!body.show_on_home,
    description_text: english.description_text || '',
    concept_text: english.concept_text || '',
    requirements_text: english.requirements_text || '',
    output_text: english.output_text || '',
    first_horizontal_image_url: body.first_horizontal_image_url || '',
    second_block_title: english.second_block_title || 'Premium, but not snobbish',
    second_block_text: english.second_block_text || '',
    presentation_url: body.presentation_url || '',
    created_at: now,
    updated_at: now,
    translations,
    media: (body.media || []).map((m, i) => ({ id: m.id || `m-${i}`, type: m.type || 'horizontal', image_url_1: m.image_url_1 || '', image_url_2: m.image_url_2 || '', sort_order: i })),
  }
  list.unshift(project)
  writeJson('projects.json', list)
  res.status(201).json(project)
})

app.put('/api/projects/:slug', (req, res) => {
  const list = readJson('projects.json') || []
  const idx = list.findIndex((p) => p.slug === req.params.slug)
  if (idx < 0) return res.status(404).json({ error: 'Проект не найден' })
  const body = req.body || {}
  const prev = list[idx]
  const translations = body.translations || prev.translations || defaultProjectTranslations(prev)
  const english = translations.en || body
  const media = (body.media || []).map((m, i) => ({ id: m.id || `m-${i}`, type: m.type || 'horizontal', image_url_1: m.image_url_1 || '', image_url_2: m.image_url_2 || '', sort_order: i }))
  list[idx] = {
    ...prev,
    slug: body.slug ?? prev.slug,
    name: english.name ?? prev.name,
    subtitle: english.subtitle ?? prev.subtitle,
    cover_image_url: body.cover_image_url ?? prev.cover_image_url,
    show_on_home: body.show_on_home ?? prev.show_on_home,
    description_text: english.description_text ?? prev.description_text,
    concept_text: english.concept_text ?? prev.concept_text,
    requirements_text: english.requirements_text ?? prev.requirements_text,
    output_text: english.output_text ?? prev.output_text,
    first_horizontal_image_url: body.first_horizontal_image_url ?? prev.first_horizontal_image_url,
    second_block_title: english.second_block_title ?? prev.second_block_title,
    second_block_text: english.second_block_text ?? prev.second_block_text,
    presentation_url: body.presentation_url ?? prev.presentation_url,
    updated_at: new Date().toISOString(),
    translations,
    media,
  }
  writeJson('projects.json', list)
  res.json(list[idx])
})

app.delete('/api/projects/:slug', (req, res) => {
  const list = readJson('projects.json') || []
  const filtered = list.filter((p) => p.slug !== req.params.slug)
  if (filtered.length === list.length) return res.status(404).json({ error: 'Проект не найден' })
  writeJson('projects.json', filtered)
  res.status(204).send()
})

app.get('/api/marquee-logos', (req, res) => {
  const data = readJson('marquee_logos.json') || []
  const list = Array.isArray(data) ? data : []
  res.json(list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)))
})

app.put('/api/marquee-logos', (req, res) => {
  const list = Array.isArray(req.body) ? req.body : []
  writeJson('marquee_logos.json', list)
  res.json(list)
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' })
  const folder = req.body?.folder || 'media'
  const url = `/uploads/${folder}/${req.file.filename}`
  res.json({ url })
})

const PORT = process.env.PORT || 5006
const HOST = process.env.HOST || '0.0.0.0'
app.listen(PORT, HOST, () => {
  console.log(`API: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
  console.log(`Данные: ${DATA_DIR}`)
})
