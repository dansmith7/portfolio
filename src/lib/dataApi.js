/**
 * Данные: Supabase (хостинг) или локальный API (server/data).
 * Если заданы VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY → Supabase.
 * Иначе — локальный npm run server.
 */

import { supabase } from './supabase'
import * as local from './localApi'
import { LOCALES, rowsToTranslations } from './textLayout'

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'
const TIMEOUT_MS = 15000

const withTimeout = (p, ms = TIMEOUT_MS) =>
  Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('Таймаут')), ms))])

function hasSupabaseClient() {
  return !!supabase
}

const SITE_TRANSLATION_FIELDS = [
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

const PROJECT_TRANSLATION_FIELDS = [
  'name',
  'subtitle',
  'description_text',
  'concept_text',
  'requirements_text',
  'output_text',
  'second_block_title',
  'second_block_text',
]

function mergeEnglishTranslation(record, relationKey) {
  const rows = record?.[relationKey] || []
  const translations = rowsToTranslations(rows)
  const english = translations.en || {}
  const base = { ...(record || {}) }
  delete base[relationKey]
  return { ...base, ...english, translations }
}

function translationRows(translations, foreignKey, id, fields) {
  return LOCALES.map(({ code }) => {
    const source = translations?.[code] || {}
    return {
      [foreignKey]: id,
      locale: code,
      ...Object.fromEntries(fields.map((field) => [field, source[field] || ''])),
      wrap_settings: source.wrap_settings || {},
      updated_at: new Date().toISOString(),
    }
  })
}

// --- Настройки ---
export async function getSiteSettings() {
  if (hasSupabaseClient()) {
    const translatedResult = await withTimeout(
      supabase
        .from('site_settings')
        .select('*, site_content_translations(*)')
        .eq('id', SETTINGS_ID)
        .single()
    )
    if (!translatedResult.error) {
      return mergeEnglishTranslation(translatedResult.data, 'site_content_translations')
    }

    // The translations migration may not be applied to an existing environment yet.
    // Keep the public site usable with the legacy columns until it is.
    const { data, error } = await withTimeout(
      supabase
        .from('site_settings')
        .select('*')
        .eq('id', SETTINGS_ID)
        .single()
    )
    if (error) return null
    return data
  }
  return withTimeout(local.getSiteSettings())
}

export async function updateSiteSettings(body) {
  if (hasSupabaseClient()) {
    const { translations, ...settings } = body
    const english = translations?.en || {}
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: SETTINGS_ID,
        ...settings,
        ...Object.fromEntries(
          ['hero_text', 'description_text', 'why_us_text'].map((field) => [field, english[field] ?? settings[field]])
        ),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    if (error) throw error
    if (translations) {
      const { error: translationError } = await supabase
        .from('site_content_translations')
        .upsert(translationRows(translations, 'settings_id', SETTINGS_ID, SITE_TRANSLATION_FIELDS), {
          onConflict: 'settings_id,locale',
        })
      if (translationError) throw translationError
    }
    return body
  }
  return withTimeout(local.updateSiteSettings(body))
}

// --- Проекты ---
export async function getProjects(opts = {}) {
  if (hasSupabaseClient()) {
    let translatedQuery = supabase
      .from('projects')
      .select('id,slug,name,subtitle,cover_image_url,show_on_home,created_at,updated_at,project_translations(locale,name,subtitle,wrap_settings)')
      .order('created_at', { ascending: false })
    if (opts.onlyShowOnHome) translatedQuery = translatedQuery.eq('show_on_home', true)
    const translatedResult = await withTimeout(translatedQuery)
    if (!translatedResult.error) {
      return (translatedResult.data ?? []).map((project) =>
        mergeEnglishTranslation(project, 'project_translations')
      )
    }

    let legacyQuery = supabase
      .from('projects')
      .select('id,slug,name,subtitle,cover_image_url,show_on_home,created_at,updated_at')
      .order('created_at', { ascending: false })
    if (opts.onlyShowOnHome) legacyQuery = legacyQuery.eq('show_on_home', true)
    const { data, error } = await withTimeout(legacyQuery)
    if (error) throw error
    return data ?? []
  }
  const data = await withTimeout(local.getProjects(opts))
  return Array.isArray(data) ? data : []
}

export async function getProjectBySlug(slug) {
  if (!slug) return null
  if (hasSupabaseClient()) {
    const translatedResult = await withTimeout(
      supabase
        .from('projects')
        .select('*, project_media(id,project_id,type,image_url_1,image_url_2,sort_order), project_translations(*)')
        .eq('slug', slug)
        .single()
    )
    let data = translatedResult.data
    let hasTranslations = !translatedResult.error

    if (translatedResult.error) {
      const legacyResult = await withTimeout(
        supabase
          .from('projects')
          .select('*, project_media(id,project_id,type,image_url_1,image_url_2,sort_order)')
          .eq('slug', slug)
          .single()
      )
      if (legacyResult.error || !legacyResult.data) return null
      data = legacyResult.data
      hasTranslations = false
    }

    const { project_media, ...project } = data
    const media = [...(project_media ?? [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    return {
      ...(hasTranslations ? mergeEnglishTranslation(project, 'project_translations') : project),
      media,
    }
  }
  const data = await withTimeout(local.getProjectBySlug(slug))
  if (!data) return null
  const media = [...(data.media || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  return { ...data, media }
}

export async function createProject(body) {
  if (hasSupabaseClient()) {
    const english = body.translations?.en || body
    let baseSlug = (body.slug || english.name?.toLowerCase().replace(/\s+/g, '-') || 'project').replace(/[^a-z0-9-]/g, '')
    let uniqueSlug = baseSlug
    let c = 1
    let slugAvailable = false
    while (!slugAvailable) {
      const { data: existing } = await supabase.from('projects').select('id').eq('slug', uniqueSlug).single()
      if (!existing) slugAvailable = true
      else uniqueSlug = `${baseSlug}-${c++}`
    }
    const { data: inserted, error: insertErr } = await supabase
      .from('projects')
      .insert({
        slug: uniqueSlug,
        name: english.name,
        subtitle: english.subtitle,
        cover_image_url: body.cover_image_url,
        show_on_home: !!body.show_on_home,
        description_text: english.description_text,
        concept_text: english.concept_text,
        requirements_text: english.requirements_text,
        output_text: english.output_text,
        first_horizontal_image_url: body.first_horizontal_image_url,
        second_block_title: english.second_block_title,
        second_block_text: english.second_block_text,
        presentation_url: body.presentation_url || null,
      })
      .select('id')
      .single()
    if (insertErr) throw insertErr
    if (body.translations) {
      const { error: translationError } = await supabase
        .from('project_translations')
        .upsert(translationRows(body.translations, 'project_id', inserted.id, PROJECT_TRANSLATION_FIELDS), {
          onConflict: 'project_id,locale',
        })
      if (translationError) throw translationError
    }
    const media = body.media || []
    for (let i = 0; i < media.length; i++) {
      const m = media[i]
      await supabase.from('project_media').insert({
        project_id: inserted.id,
        type: m.type || 'horizontal',
        image_url_1: m.image_url_1,
        image_url_2: m.image_url_2,
        sort_order: i,
      })
    }
    return { ...body, id: inserted.id, slug: uniqueSlug }
  }
  return withTimeout(local.createProject(body))
}

export async function updateProject(slug, body) {
  if (hasSupabaseClient()) {
    const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).single()
    if (!existing) throw new Error('Проект не найден')
    const english = body.translations?.en || body
    const { error: updErr } = await supabase
      .from('projects')
      .update({
        slug: body.slug,
        name: english.name,
        subtitle: english.subtitle,
        cover_image_url: body.cover_image_url,
        show_on_home: !!body.show_on_home,
        description_text: english.description_text,
        concept_text: english.concept_text,
        requirements_text: english.requirements_text,
        output_text: english.output_text,
        first_horizontal_image_url: body.first_horizontal_image_url,
        second_block_title: english.second_block_title,
        second_block_text: english.second_block_text,
        presentation_url: body.presentation_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
    if (updErr) throw updErr
    if (body.translations) {
      const { error: translationError } = await supabase
        .from('project_translations')
        .upsert(translationRows(body.translations, 'project_id', existing.id, PROJECT_TRANSLATION_FIELDS), {
          onConflict: 'project_id,locale',
        })
      if (translationError) throw translationError
    }
    await supabase.from('project_media').delete().eq('project_id', existing.id)
    const media = body.media || []
    for (let i = 0; i < media.length; i++) {
      const m = media[i]
      await supabase.from('project_media').insert({
        project_id: existing.id,
        type: m.type || 'horizontal',
        image_url_1: m.image_url_1,
        image_url_2: m.image_url_2,
        sort_order: i,
      })
    }
    return body
  }
  return withTimeout(local.updateProject(slug, body))
}

export async function deleteProject(slug) {
  if (hasSupabaseClient()) {
    const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).single()
    if (!existing) throw new Error('Проект не найден')
    await supabase.from('project_media').delete().eq('project_id', existing.id)
    const { error } = await supabase.from('projects').delete().eq('id', existing.id)
    if (error) throw error
    return
  }
  return withTimeout(local.deleteProject(slug))
}

// --- Логотипы ---
export async function getMarqueeLogos() {
  if (hasSupabaseClient()) {
    const { data, error } = await withTimeout(
      supabase.from('marquee_logos').select('id,url,alt,sort_order').order('sort_order')
    )
    if (error) return []
    return data ?? []
  }
  const data = await withTimeout(local.getMarqueeLogos())
  return Array.isArray(data) ? data : []
}

export async function updateMarqueeLogos(list) {
  if (hasSupabaseClient()) {
    const { error } = await supabase.from('marquee_logos').upsert(list, { onConflict: 'id' })
    if (error) throw error
    return list
  }
  return withTimeout(local.updateMarqueeLogos(list))
}

// --- Аутентификация ---
export function useSupabaseAuth() {
  return hasSupabaseClient()
}

export async function authGetSession() {
  if (hasSupabaseClient()) {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user ?? null
  }
  return typeof window !== 'undefined' && localStorage.getItem('admin_token') ? { token: true } : null
}

export function authOnStateChange(callback) {
  if (hasSupabaseClient()) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }
  return () => {}
}

export async function authSignIn(email, password) {
  if (hasSupabaseClient()) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }
  const data = await local.login(password || email)
  if (data?.token) return { user: { token: data.token } }
  throw new Error(data?.error || 'Ошибка входа')
}

export async function authSignOut() {
  if (hasSupabaseClient()) await supabase.auth.signOut()
  else if (typeof window !== 'undefined') localStorage.removeItem('admin_token')
}

// --- Загрузка файлов ---
export async function uploadFile(file, folder = 'media') {
  if (hasSupabaseClient()) {
    const ext = (file.name.match(/\.[^.]+$/) || ['.bin'])[0]
    const base = (file.name.replace(/\.[^.]+$/, '') || 'file').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
    const path = `${folder}/${Date.now()}-${base}${ext}`
    const { error } = await supabase.storage.from('uploads').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    const { data } = supabase.storage.from('uploads').getPublicUrl(path)
    return data.publicUrl
  }
  return local.uploadFile(file, folder)
}

export function canUpload() {
  return hasSupabaseClient() || true
}
