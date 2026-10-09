import useLocale from '../hooks/useLocale'

export default function LanguageSwitch() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="language-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={locale === 'ru' ? 'active' : ''}
        aria-pressed={locale === 'ru'}
        onClick={() => setLocale('ru')}
      >
        ru
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={locale === 'en' ? 'active' : ''}
        aria-pressed={locale === 'en'}
        onClick={() => setLocale('en')}
      >
        eng
      </button>
    </div>
  )
}

