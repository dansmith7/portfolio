import { supabase } from './supabase'

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'
const CACHE_TTL = 60000 // 1 минута кэша для данных
const CACHE_PREFIX = 'site_cache_'

// Простое кэширование в памяти
const cache = new Map()

function getCached(key) {
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('nocache') === '1') {
    cache.delete(key)
    return null
  }
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

/** Настройки сайта (главная, контакты, showreel и т.д.) */
export async function fetchSiteSettings() {
  if (!supabase) return null
  
  const cacheKey = `${CACHE_PREFIX}settings`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут загрузки настроек')), 5000)
  )
  try {
    const { data, error } = await Promise.race([
      supabase.from('site_settings').select('*').eq('id', SETTINGS_ID).single(),
      timeout
    ])
    if (error) return null
    if (data) setCached(cacheKey, data)
    return data
  } catch (e) {
    console.warn('Ошибка загрузки настроек:', e.message)
    return null
  }
}

/** Все проекты (для Work) или только show_on_home (для главной) */
export async function fetchProjects(opts = {}) {
  if (!supabase) {
    console.error('[siteData] ❌ Supabase не подключен!')
    console.error('[siteData] VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ задан' : '❌ отсутствует')
    console.error('[siteData] VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ задан' : '❌ отсутствует')
    console.error('[siteData] Проверьте .env (локально) или настройки Vercel')
    return []
  }
  
  const cacheKey = `${CACHE_PREFIX}projects_${opts.onlyShowOnHome ? 'home' : 'all'}`
  const cached = getCached(cacheKey)
  if (cached !== null) {
    console.log(`[siteData] 📦 Кэш для ${cacheKey}:`, cached.length, 'проектов')
    return cached
  }
  
  console.log(`[siteData] 🔄 Загрузка проектов (${opts.onlyShowOnHome ? 'только для главной' : 'все'})...`)
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут загрузки проектов')), 5000)
  )
  try {
    // Выбираем только нужные поля для ускорения
    let q = supabase
      .from('projects')
      .select('id,slug,name,subtitle,cover_image_url,show_on_home,created_at,updated_at')
      .order('created_at', { ascending: false })
    if (opts.onlyShowOnHome) q = q.eq('show_on_home', true)
    const { data, error } = await Promise.race([q, timeout])
    if (error) {
      console.error('[siteData] ❌ Ошибка Supabase:', error)
      console.error('[siteData] Код:', error.code, 'Сообщение:', error.message)
      return []
    }
    const result = data ?? []
    console.log(`[siteData] ✅ Загружено проектов:`, result.length)
    if (result.length > 0) {
      console.log('[siteData] Проекты:', result.map(p => ({ name: p.name, slug: p.slug, show_on_home: p.show_on_home })))
    }
    setCached(cacheKey, result)
    return result
  } catch (e) {
    console.error('[siteData] ❌ Исключение при загрузке:', e.message)
    return []
  }
}

/** Один проект по slug + медиа (один запрос — быстрее) */
export async function fetchProjectBySlug(slug) {
  if (!supabase || !slug) return null
  
  const cacheKey = `${CACHE_PREFIX}project_${slug}`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут загрузки проекта')), 5000)
  )
  try {
    const { data, error } = await Promise.race([
      supabase
        .from('projects')
        .select('*, project_media(id,project_id,type,image_url_1,image_url_2,sort_order)')
        .eq('slug', slug)
        .single(),
      timeout
    ])
    if (error || !data) return null
    
    const { project_media, ...project } = data
    const media = [...(project_media ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    const result = { ...project, media }
    setCached(cacheKey, result)
    return result
  } catch (e) {
    console.warn('Ошибка загрузки проекта:', e.message)
    return null
  }
}

/** Логотипы бегущей строки */
export async function fetchMarqueeLogos() {
  if (!supabase) return []
  
  const cacheKey = `${CACHE_PREFIX}logos`
  const cached = getCached(cacheKey)
  if (cached !== null) return cached
  
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Таймаут загрузки логотипов')), 5000)
  )
  try {
    const { data, error } = await Promise.race([
      supabase.from('marquee_logos').select('id,url,alt,sort_order').order('sort_order'),
      timeout
    ])
    if (error) return []
    const result = data ?? []
    setCached(cacheKey, result)
    return result
  } catch (e) {
    console.warn('Ошибка загрузки логотипов:', e.message)
    return []
  }
}

/** Очистить кэш (вызвать после изменений в админке) */
export function clearCache() {
  cache.clear()
}
