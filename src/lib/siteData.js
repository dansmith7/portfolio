import * as api from './dataApi'

const CACHE_TTL = 60000
const CACHE_PREFIX = 'site_cache_'
const cache = new Map()

function getCached(key) {
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('nocache') === '1') {
    cache.delete(key)
    return null
  }
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data
  cache.delete(key)
  return null
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function fetchSiteSettings() {
  const cacheKey = `${CACHE_PREFIX}settings`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  try {
    const data = await api.getSiteSettings()
    if (data) setCached(cacheKey, data)
    return data
  } catch (e) {
    console.warn('Ошибка загрузки настроек:', e.message)
    return null
  }
}

export async function fetchProjects(opts = {}) {
  const cacheKey = `${CACHE_PREFIX}projects_${opts.onlyShowOnHome ? 'home' : 'all'}`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  try {
    const data = await api.getProjects(opts)
    const result = Array.isArray(data) ? data : []
    setCached(cacheKey, result)
    return result
  } catch (e) {
    console.warn('Ошибка загрузки проектов:', e.message)
    return []
  }
}

export async function fetchProjectBySlug(slug) {
  if (!slug) return null
  const cacheKey = `${CACHE_PREFIX}project_${slug}`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  try {
    const data = await api.getProjectBySlug(slug)
    if (data) setCached(cacheKey, data)
    return data
  } catch (e) {
    console.warn('Ошибка загрузки проекта:', e.message)
    return null
  }
}

export async function fetchMarqueeLogos() {
  const cacheKey = `${CACHE_PREFIX}logos`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  try {
    const data = await api.getMarqueeLogos()
    const result = Array.isArray(data) ? data : []
    setCached(cacheKey, result)
    return result
  } catch (e) {
    console.warn('Ошибка загрузки логотипов:', e.message)
    return []
  }
}

export function clearCache() {
  cache.clear()
}
