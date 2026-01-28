/**
 * Загрузка данных с сервера (API). Service role только на сервере.
 * Никогда не грузим JSON/blocks для списка. Картинки — только public URL из таблицы.
 */

const API = ''

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'
const CACHE_TTL = 60000
const CACHE_PREFIX = 'site_cache_'
const FETCH_TIMEOUT = 5000

const cache = new Map()

function getCached(key) {
  const c = cache.get(key)
  if (c && Date.now() - c.timestamp < CACHE_TTL) return c.data
  cache.delete(key)
  return null
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

async function apiFetch(path, opts = {}) {
  const controller = new AbortController()
  const tid = setTimeout(() => controller.abort(), opts.timeout ?? FETCH_TIMEOUT)
  const sep = path.includes('?') ? '&' : '?'
  const url = `${API}${path}${sep}_=${Date.now()}`
  try {
    const r = await fetch(url, { signal: controller.signal, ...opts })
    clearTimeout(tid)
    if (!r.ok) return null
    return r.json()
  } catch (e) {
    clearTimeout(tid)
    if (opts.silent !== true) console.warn('siteData fetch:', e?.message || e)
    return null
  }
}

/** Настройки сайта (главная, контакты, showreel и т.д.) */
export async function fetchSiteSettings() {
  const key = `${CACHE_PREFIX}settings`
  const cached = getCached(key)
  if (cached !== null) return cached
  const data = await apiFetch('/api/settings')
  if (data) setCached(key, data)
  return data
}

/** Список проектов. Только поля списка — без JSON/blocks. */
export async function fetchProjects(opts = {}) {
  const key = `${CACHE_PREFIX}projects_${opts.onlyShowOnHome ? 'home' : 'all'}`
  const cached = getCached(key)
  if (cached !== null) return cached
  const q = opts.onlyShowOnHome ? '?onlyShowOnHome=1' : ''
  const data = await apiFetch(`/api/projects${q}`)
  const result = Array.isArray(data) ? data : []
  setCached(key, result)
  return result
}

/** Один проект по slug + медиа. Без JSON/blocks. Картинки — public URL из таблицы. */
export async function fetchProjectBySlug(slug) {
  if (!slug) return null
  const key = `${CACHE_PREFIX}project_${slug}`
  const cached = getCached(key)
  if (cached !== null) return cached
  const data = await apiFetch(`/api/project-by-slug?slug=${encodeURIComponent(slug)}`)
  if (data) setCached(key, data)
  return data
}

/** Логотипы бегущей строки */
export async function fetchMarqueeLogos() {
  const key = `${CACHE_PREFIX}logos`
  const cached = getCached(key)
  if (cached !== null) return cached
  const data = await apiFetch('/api/logos')
  const result = Array.isArray(data) ? data : []
  setCached(key, result)
  return result
}

export function clearCache() {
  cache.clear()
}
