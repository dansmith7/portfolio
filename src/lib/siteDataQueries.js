import { supabase } from './supabase'

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'
const TIMEOUT_MS = 5000

const withTimeout = (promise, ms = TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Таймаут')), ms)
    ),
  ])

export async function fetchSiteSettingsQuery() {
  if (!supabase) return null
  const { data, error } = await withTimeout(
    supabase.from('site_settings').select('*').eq('id', SETTINGS_ID).single()
  )
  if (error) return null
  return data
}

export async function fetchProjectsQuery(opts = {}) {
  if (!supabase) return []
  let q = supabase
    .from('projects')
    .select('id,slug,name,subtitle,cover_image_url,show_on_home,created_at,updated_at')
    .order('created_at', { ascending: false })
  if (opts.onlyShowOnHome) q = q.eq('show_on_home', true)
  const { data, error } = await withTimeout(q)
  if (error) return []
  return data ?? []
}

export async function fetchProjectBySlugQuery(slug) {
  if (!supabase || !slug) return null
  const { data, error } = await withTimeout(
    supabase
      .from('projects')
      .select('*, project_media(id,project_id,type,image_url_1,image_url_2,sort_order)')
      .eq('slug', slug)
      .single()
  )
  if (error || !data) return null
  const { project_media, ...project } = data
  const media = [...(project_media ?? [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  )
  return { ...project, media }
}

export async function fetchMarqueeLogosQuery() {
  if (!supabase) return []
  const { data, error } = await withTimeout(
    supabase.from('marquee_logos').select('id,url,alt,sort_order').order('sort_order')
  )
  if (error) return []
  return data ?? []
}
