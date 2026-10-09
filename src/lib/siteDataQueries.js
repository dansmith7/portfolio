import * as api from './dataApi'

const TIMEOUT_MS = 5000

const withTimeout = (promise, ms = TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Таймаут')), ms)
    ),
  ])

export async function fetchSiteSettingsQuery() {
  try {
    const data = await withTimeout(api.getSiteSettings())
    return data
  } catch (e) {
    console.warn('[fetchSiteSettingsQuery]', e.message)
    return null
  }
}

export async function fetchProjectsQuery(opts = {}) {
  try {
    const data = await withTimeout(api.getProjects(opts))
    const list = Array.isArray(data) ? data : []
    return list
  } catch (e) {
    console.error('[fetchProjectsQuery]', e.message)
    return []
  }
}

export async function fetchProjectBySlugQuery(slug) {
  if (!slug) return null
  try {
    const data = await withTimeout(api.getProjectBySlug(slug))
    if (!data) return null
    const media = [...(data.media || [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    return { ...data, media }
  } catch (e) {
    console.warn('[fetchProjectBySlugQuery]', e.message)
    return null
  }
}

export async function fetchMarqueeLogosQuery() {
  try {
    const data = await withTimeout(api.getMarqueeLogos())
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('[fetchMarqueeLogosQuery]', e.message)
    return []
  }
}
