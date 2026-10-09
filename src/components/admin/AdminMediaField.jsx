import { useRef, useState } from 'react'
import { uploadFile, canUpload } from '../../lib/dataApi'

/**
 * Поле: ссылка ИЛИ загрузка файла.
 * Supabase: Storage bucket "uploads". Локально: server/data/uploads.
 */
export default function AdminMediaField({ value, onChange, accept = 'image/*', label, folder = 'media' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadError('')
    setUploading(true)
    try {
      const url = await uploadFile(file, folder)
      onChange(url)
    } catch (err) {
      setUploadError(err.message || 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  const can = canUpload()

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
            disabled={uploading || !can}
            onClick={() => can && inputRef.current?.click()}
            title={!can ? 'Запустите npm run server' : undefined}
          >
            {uploading ? 'Загрузка…' : 'Загрузить с компьютера'}
          </button>
        </>
      </div>
      {uploadError && <div className="admin-error admin-media-field-error">{uploadError}</div>}
    </label>
  )
}
