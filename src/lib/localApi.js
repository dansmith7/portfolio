/**
 * Локальный API вместо Supabase. Данные в server/data/*.json на твоём компьютере.
 * Запуск: npm run server (порт 5006), в другом терминале npm run dev (порт 5005).
 */

const API_BASE = import.meta.env.VITE_API_URL || ''

function getUrl(path) {
  return `${API_BASE}${path}`
}

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('admin_token') || ''
}

async function request(method, path, body, options = {}) {
  const url = getUrl(path)
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (getToken()) headers.Authorization = `Bearer ${getToken()}`
  const res = await fetch(url, { method, headers, ...(body != null && { body: JSON.stringify(body) }), ...options })
  if (res.status === 204) return null
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText || `HTTP ${res.status}`)
  return data
}

export async function getSiteSettings() {
  const data = await request('GET', '/api/site-settings')
  return data
}

export async function updateSiteSettings(body) {
  return request('PUT', '/api/site-settings', body)
}

export async function getProjects(opts = {}) {
  const q = opts.onlyShowOnHome ? '?show_on_home=true' : ''
  return request('GET', `/api/projects${q}`)
}

export async function getProjectBySlug(slug) {
  if (!slug) return null
  const data = await request('GET', `/api/projects/${encodeURIComponent(slug)}`)
  return data
}

export async function createProject(body) {
  return request('POST', '/api/projects', body)
}

export async function updateProject(slug, body) {
  return request('PUT', `/api/projects/${encodeURIComponent(slug)}`, body)
}

export async function deleteProject(slug) {
  return request('DELETE', `/api/projects/${encodeURIComponent(slug)}`)
}

export async function getMarqueeLogos() {
  return request('GET', '/api/marquee-logos')
}

export async function updateMarqueeLogos(list) {
  return request('PUT', '/api/marquee-logos', list)
}

export async function login(password) {
  const data = await request('POST', '/api/auth/login', { password })
  if (data?.token && typeof window !== 'undefined') localStorage.setItem('admin_token', data.token)
  return data
}

export async function uploadFile(file, folder = 'media') {
  const url = getUrl('/api/upload')
  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  const token = getToken()
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { method: 'POST', body: form, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText || 'Ошибка загрузки')
  const base = import.meta.env.VITE_API_URL || ''
  return data.url ? `${base}${data.url}` : data.url
}

export function isLocalApiConfigured() {
  return true
}
