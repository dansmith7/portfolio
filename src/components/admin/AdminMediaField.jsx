import { useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/uploadToSupabase'

/**
 * Поле: ссылка ИЛИ загрузка файла с компьютера.
 * accept — например "image/*", ".pdf,.ppt,.pptx"
 * folder — папка в bucket (media, presentations и т.д.)
 */
export default function AdminMediaField({ value, onChange, accept = 'image/*', label, folder = 'media' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const canUpload = !!supabase

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file || !supabase) return
    e.target.value = ''
    setUploadError('')
    setUploading(true)
    try {
      const url = await uploadFile(supabase, file, folder)
      onChange(url)
    } catch (err) {
      setUploadError(err.message || 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="admin-media-field">
      {label && <span className="admin-media-field-label">{label}</span>}
      <div className="admin-media-field-row">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ссылка или загрузите файл"
          className="admin-media-field-input"
        />
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="admin-btn admin-media-field-btn"
            disabled={uploading || !canUpload}
            onClick={() => canUpload && inputRef.current?.click()}
            title={!canUpload ? 'Настройте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env' : undefined}
          >
            {uploading ? 'Загрузка…' : 'Загрузить с компьютера'}
          </button>
        </>
      </div>
      {uploadError && <div className="admin-error admin-media-field-error">{uploadError}</div>}
    </label>
  )
}
