import { useEffect, useState } from 'react'

export default function AppPreloader({ children }) {
  const [showLoader, setShowLoader] = useState(true)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLoader(false)
    }, 500)

    const timer2 = setTimeout(() => {
      setShowContent(true)
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  if (showLoader) {
    return (
      <div className="app-preloader">
        <div className="app-preloader-content">
          <div className="app-preloader-text">Загрузка...</div>
        </div>
      </div>
    )
  }

  return showContent ? children : null
}
