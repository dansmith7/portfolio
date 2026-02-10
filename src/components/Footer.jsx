import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import DelayedLink from './DelayedLink'
import '../App.css'

const FOOTER_TEXT = 'an(y)  designs'

export default function Footer() {
  const footerLogoRef = useRef(null)
  const [logoFontSize, setLogoFontSize] = useState(360)

  // Автоматический подбор размера шрифта для точного соответствия ширине рабочей области
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 5

    const adjustFontSize = () => {
      if (!footerLogoRef.current) {
        if (retryCount++ < maxRetries) setTimeout(adjustFontSize, 50)
        return
      }

      const headerContent = document.querySelector('.header-content')
      if (!headerContent) {
        if (retryCount++ < maxRetries) setTimeout(adjustFontSize, 50)
        return
      }

      // Получаем реальные отступы header
      const headerStyle = window.getComputedStyle(headerContent)
      const headerPaddingLeft = parseFloat(headerStyle.paddingLeft) || 80
      const headerPaddingRight = parseFloat(headerStyle.paddingRight) || 80
      
      // Получаем позицию начала рабочей области header
      const headerRect = headerContent.getBoundingClientRect()
      const headerStartX = headerRect.left + headerPaddingLeft
      
      // Находим элемент "Contacts" в header для измерения его правой границы
      const contactsLink = headerContent.querySelector('a[href*="contact"], a[href*="#contact-us"]')
      let headerEndX = headerRect.right - headerPaddingRight // Fallback: конец рабочей области
      
      if (contactsLink) {
        const contactsRect = contactsLink.getBoundingClientRect()
        headerEndX = contactsRect.right
      } else {
        // Если не нашли ссылку, ищем текст "Contacts" в nav
        const nav = headerContent.querySelector('.nav')
        if (nav) {
          const navRect = nav.getBoundingClientRect()
          headerEndX = navRect.right
        }
      }
      
      // Вычисляем ширину рабочей области от начала до конца "Contacts"
      const safetyMargin = 0
      const headerWorkingWidth = Math.max(headerEndX - headerStartX - safetyMargin, 100) // Минимум 100px
      
      // Получаем позицию начала footer-logo-container и его padding
      const footerContainer = footerLogoRef.current.parentElement
      if (!footerContainer) return
      
      const footerContainerRect = footerContainer.getBoundingClientRect()
      const footerStyle = window.getComputedStyle(footerContainer)
      const footerPaddingLeft = parseFloat(footerStyle.paddingLeft) || 80
      const footerContainerStartX = footerContainerRect.left + footerPaddingLeft
      
      // Выравниваем footer-logo по началу рабочей области header
      const offset = headerStartX - footerContainerStartX
      footerLogoRef.current.style.marginLeft = `${offset}px`

      // Проверяем мобильную версию
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      
      // Создаем временный элемент для измерения ширины текста
      const tempElement = document.createElement('span')
      tempElement.style.position = 'absolute'
      tempElement.style.visibility = 'hidden'
      tempElement.style.whiteSpace = 'nowrap'
      tempElement.style.fontFamily = "'Jost', Arial, sans-serif"
      tempElement.style.fontWeight = '400'
      tempElement.style.letterSpacing = isMobile ? '-0.03em' : '-0.04em'
      
      // В мобильной версии (≤768px) измеряем самую длинную строку (две строки)
      let textToMeasure = FOOTER_TEXT
      if (isMobile) {
        const firstLine = 'an(y) '
        const secondLine = 'designs'
        textToMeasure = firstLine.length > secondLine.length ? firstLine : secondLine
      }
      
      tempElement.textContent = textToMeasure
      document.body.appendChild(tempElement)

      // UX: Бинарный поиск максимального размера шрифта, при котором текст ВПИСЫВАЕТСЯ в рабочую область
      // Принцип: никогда не допускаем переполнения — если не вписывается, уменьшаем кегль
      let minSize = 50
      let maxSize = 500
      let bestSize = 360

      for (let i = 0; i < 40; i++) {
        const testSize = (minSize + maxSize) / 2
        tempElement.style.fontSize = `${testSize}px`
        const textWidth = tempElement.offsetWidth

        if (textWidth <= headerWorkingWidth) {
          // Текст помещается — сохраняем и ищем больший размер
          minSize = testSize
          bestSize = testSize
        } else {
          // Текст не помещается — уменьшаем максимальный размер
          maxSize = testSize
        }
      }
      
      // Округляем вниз; на десктопе — бонус чтобы логотип доходил до конца "Contacts"
      const reduction = isMobile ? 5 : 0
      const desktopBonus = isMobile ? 0 : 25
      bestSize = Math.max(50, Math.floor(bestSize) - reduction + desktopBonus)

      document.body.removeChild(tempElement)
      setLogoFontSize(bestSize)
      // Применяем напрямую к DOM с !important для переопределения CSS на мобильных
      if (footerLogoRef.current) {
        footerLogoRef.current.style.setProperty('font-size', `${bestSize}px`, 'important')
      }
    }

    // Вызываем один раз после рендеринга
    const rafId = requestAnimationFrame(() => {
      setTimeout(adjustFontSize, 0)
    })

    let resizeTimer
    const resizeHandler = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(adjustFontSize, 100)
    }
    const orientationHandler = () => setTimeout(adjustFontSize, 100)

    window.addEventListener('resize', resizeHandler)
    window.addEventListener('orientationchange', orientationHandler)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resizeHandler)
      window.removeEventListener('orientationchange', orientationHandler)
    }
  }, [])

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <nav className="footer-nav">
            <DelayedLink to="/">Home</DelayedLink>
            <DelayedLink to="/work">Work</DelayedLink>
          </nav>
        </div>
        <div className="footer-center">
          <nav className="footer-nav">
            <DelayedLink to="/about">About</DelayedLink>
            <Link to="/#contact-us">Contacts</Link>
          </nav>
        </div>
        <div className="footer-right">
          <a href="mailto:info@ani.designs.com" className="footer-email">info@ani.designs.com</a>
          <div className="footer-copyright">©2025</div>
        </div>
      </div>
      <div className="footer-logo-container">
        <div className="footer-logo" ref={footerLogoRef} style={{ fontSize: `${logoFontSize}px` }}>
          <span className="footer-logo-line footer-logo-first">an(y) </span>
          <span className="footer-logo-line footer-logo-second">designs</span>
        </div>
      </div>
    </footer>
  )
}
