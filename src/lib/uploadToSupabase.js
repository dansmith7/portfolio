const BUCKET = 'uploads'

function safeName(name) {
  return name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')
}

/**
 * Загружает файл в Supabase Storage и возвращает публичную ссылку.
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {File} file
 * @param {string} folder — папка внутри bucket (например 'media', 'settings')
 * @returns {Promise<string>} публичный URL файла
 */
export async function uploadFile(supabase, file, folder = 'media') {
  if (!supabase) throw new Error('Supabase не настроен')
  if (!file) throw new Error('Файл не выбран')

  const ext = (file.name.match(/\.[^.]+$/) || ['.bin'])[0]
  const baseName = safeName(file.name.replace(/\.[^.]+$/, '')) || 'file'
  const path = `${folder}/${Date.now()}-${baseName}${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) {
    if (error.message && (error.message.includes('Bucket not found') || error.message.includes('not found'))) {
      throw new Error(
        'Bucket «uploads» не найден. Создайте его в Supabase: Storage → New bucket → имя «uploads» → включите Public bucket → Create.'
      )
    }
    throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
