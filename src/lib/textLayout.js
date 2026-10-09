export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export const AUTHORED_WRAP = 'authored'
export const AUTO_WRAP = 'auto'

export function defaultTextLayout() {
  return { mode: AUTHORED_WRAP, mobile_text: '' }
}

export function getTextLayout(settings, field) {
  const value = settings?.[field]
  return {
    ...defaultTextLayout(),
    ...(value && typeof value === 'object' ? value : {}),
  }
}

export function normalizeTranslations(translations, legacy = {}, fields = []) {
  const source = translations && typeof translations === 'object' ? translations : {}
  const result = {}

  for (const { code } of LOCALES) {
    const translation = source[code] || {}
    result[code] = fields.reduce(
      (acc, field) => ({ ...acc, [field]: translation[field] ?? (code === 'en' ? legacy[field] ?? '' : '') }),
      { wrap_settings: translation.wrap_settings || {} }
    )
  }

  return result
}

export function rowsToTranslations(rows = []) {
  return Object.fromEntries((rows || []).map((row) => [row.locale, row]))
}

export function resolveTranslation(record, locale = 'en') {
  const fallback = record?.translations?.en || record || {}
  const selected = record?.translations?.[locale] || {}
  const result = { ...(record || {}), ...fallback }
  const keys = new Set([...Object.keys(fallback), ...Object.keys(selected)])
  const wrapSettings = {}

  for (const key of keys) {
    if (['locale', 'wrap_settings', 'created_at', 'updated_at'].includes(key)) continue
    const selectedValue = selected[key]
    const hasSelectedValue = selectedValue != null && (
      typeof selectedValue !== 'string' || selectedValue.trim() !== ''
    )
    if (locale !== 'en' && hasSelectedValue && selectedValue != null) result[key] = selectedValue
    const selectedLayout = selected.wrap_settings?.[key]
    const fallbackLayout = fallback.wrap_settings?.[key]
    wrapSettings[key] = locale !== 'en' && hasSelectedValue
      ? selectedLayout || fallbackLayout
      : fallbackLayout
  }

  return { ...result, locale, wrap_settings: wrapSettings }
}

export function textForViewport(text, layout, isMobile = false) {
  if (isMobile && layout?.mobile_text?.trim()) return layout.mobile_text
  return text || ''
}

export function collapseAuthoredLines(text) {
  return (text || '').replace(/\s+/g, ' ').trim()
}
