/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react'
import { LocaleContext } from './LocaleContext'

const STORAGE_KEY = 'portfolio_locale'

function initialLocale() {
  if (typeof window === 'undefined') return 'en'
  return window.localStorage.getItem(STORAGE_KEY) === 'ru' ? 'ru' : 'en'
}

export default function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(initialLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo(() => ({
    locale,
    setLocale(nextLocale) {
      const normalized = nextLocale === 'ru' ? 'ru' : 'en'
      setLocaleState(normalized)
      window.localStorage.setItem(STORAGE_KEY, normalized)
      document.documentElement.lang = normalized
    },
  }), [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
