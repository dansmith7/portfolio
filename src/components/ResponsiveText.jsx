/* eslint-disable react/prop-types */
import { AUTO_WRAP, getTextLayout, textForViewport } from '../lib/textLayout'

function Lines({ text, auto }) {
  if (auto) return text || null
  const lines = String(text || '').split('\n')
  return lines.map((line, index) => (
    <span key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ))
}

export default function ResponsiveText({ text, settings, field, className = '' }) {
  const layout = getTextLayout(settings, field)
  const mobileText = textForViewport(text, layout, true)
  const auto = layout.mode === AUTO_WRAP
  const hasMobileOverride = !auto && Boolean(layout.mobile_text?.trim())

  return (
    <span className={`responsive-copy ${auto ? 'responsive-copy-auto' : 'responsive-copy-authored'} ${className}`.trim()}>
      <span className={hasMobileOverride ? 'responsive-copy-desktop' : ''}>
        <Lines text={text} auto={auto} />
      </span>
      {hasMobileOverride && (
        <span className="responsive-copy-mobile">
          <Lines text={mobileText} auto={false} />
        </span>
      )}
    </span>
  )
}
