/* eslint-disable react/prop-types */
import { AUTO_WRAP, AUTHORED_WRAP, getTextLayout } from '../../lib/textLayout'

export default function AdminLocalizedTextField({
  label,
  value,
  field,
  wrapSettings,
  onValueChange,
  onWrapSettingsChange,
  rows = 4,
  previewClassName = '',
  singleLine = false,
}) {
  const layout = getTextLayout(wrapSettings, field)
  const isAuthored = layout.mode !== AUTO_WRAP

  const setLayout = (patch) => {
    onWrapSettingsChange({
      ...wrapSettings,
      [field]: { ...layout, ...patch },
    })
  }

  const previewText = (text) => {
    if (layout.mode === AUTO_WRAP) return String(text || '').replace(/\s+/g, ' ').trim()
    return text || 'Текст появится здесь'
  }

  return (
    <section className="admin-copy-field">
      <div className="admin-copy-field-heading">
        <div>
          <h3>{label}</h3>
          <p>Одна строка в поле = одна авторская строка в макете.</p>
        </div>
        <div className="admin-wrap-toggle" role="group" aria-label={`Переносы: ${label}`}>
          <button
            type="button"
            className={isAuthored ? 'active' : ''}
            onClick={() => setLayout({ mode: AUTHORED_WRAP })}
          >
            Авторские
          </button>
          <button
            type="button"
            className={!isAuthored ? 'active' : ''}
            onClick={() => setLayout({ mode: AUTO_WRAP, mobile_text: '' })}
          >
            Авто
          </button>
        </div>
      </div>

      {singleLine && !isAuthored ? (
        <input type="text" value={value} onChange={(event) => onValueChange(event.target.value)} />
      ) : (
        <textarea rows={rows} value={value} onChange={(event) => onValueChange(event.target.value)} />
      )}

      {isAuthored && (
        <label className="admin-mobile-copy">
          <span>Mobile — необязательно</span>
          <small>Оставьте пустым, чтобы использовать те же строки, что и на desktop.</small>
          <textarea
            rows={Math.max(2, Math.min(rows, 4))}
            value={layout.mobile_text || ''}
            onChange={(event) => setLayout({ mobile_text: event.target.value })}
            placeholder="Отдельные переносы для мобильной версии"
          />
        </label>
      )}

      <div className="admin-copy-preview-grid">
        <div className="admin-copy-preview desktop">
          <span className="admin-copy-preview-label">Desktop · 540 px</span>
          <div className={previewClassName}>{previewText(value)}</div>
        </div>
        <div className="admin-copy-preview mobile">
          <span className="admin-copy-preview-label">Mobile · 320 px</span>
          <div className={previewClassName}>{previewText(layout.mobile_text?.trim() ? layout.mobile_text : value)}</div>
        </div>
      </div>
    </section>
  )
}
