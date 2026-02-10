import '../App.css'
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import DelayedLink from '../components/DelayedLink'
import { useQuery } from '@tanstack/react-query'
import ContactForm from '../components/ContactForm'
import {
  fetchSiteSettingsQuery,
  fetchProjectsQuery,
  fetchMarqueeLogosQuery,
} from '../lib/siteDataQueries'

const DEFAULTS = {
  heroText: 'an(y)  designs',
  description: 'UI/UX Designer indipendente. Collaboro con studi di design, startup e aziende, con un forte focus su user experience, web design art direction e design systems',
  showreelUrl: 'https://cdn.jsdelivr.net/gh/pbaronio/media/homepage-gif.mp4',
  whyUsText: 'Мы специализируемся на создании уникальных дизайнерских решений, которые сочетают в себе эстетику и функциональность. Наш подход основан на глубоком понимании потребностей клиентов и трендов современного дизайна.\n\nМы работаем с различными проектами - от корпоративных сайтов до брендинга и digital-стратегий. Каждый проект - это возможность создать что-то особенное и запоминающееся.',
  contactEmail: 'info@example.com',
  contactTelegram: '@yourusername',
  contactImg: '/projects/2025-12-21%2001.48.57.jpg',
  whyUsImg: '/projects/2025-12-21%2001.48.57.jpg',
}

function Home() {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const heroLogoRef = useRef(null)
  const [logoFontSize, setLogoFontSize] = useState(360)

  const { data: settings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: fetchSiteSettingsQuery,
    staleTime: 1000 * 60 * 5,
  })

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'home'],
    queryFn: () => fetchProjectsQuery({ onlyShowOnHome: true }),
    staleTime: 1000 * 60 * 5,
  })

  const { data: logos = [] } = useQuery({
    queryKey: ['marquee_logos'],
    queryFn: fetchMarqueeLogosQuery,
    staleTime: 1000 * 60 * 5,
  })

  const heroText = (settings?.hero_text || DEFAULTS.heroText).trim() || DEFAULTS.heroText
  
  // Разделяем текст на две части для мобильной версии (две строки)
  // Ищем место разделения: после закрывающей скобки перед "designs"
  // Например: "an(y)  designs" -> "an(y) " и "designs"
  const splitPattern = /\)\s+designs/i
  const match = heroText.match(splitPattern)
  let splitIndex = match ? match.index + match[0].indexOf('designs') : -1
  // Fallback: если не нашлось, ищем "designs" в тексте
  if (splitIndex <= 0 && heroText.toLowerCase().includes('designs')) {
    splitIndex = heroText.toLowerCase().indexOf('designs')
  }
  const heroTextFirst = splitIndex > 0 ? heroText.slice(0, splitIndex).trimEnd() + ' ' : heroText
  const heroTextSecond = splitIndex > 0 ? heroText.slice(splitIndex).trimStart() : ''

  useEffect(() => {
    if (!isTyping) return
    let currentIndex = 0
    const typeInterval = setInterval(() => {
      if (currentIndex < heroText.length) {
        setDisplayedText(heroText.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
      }
    }, 120)
    return () => clearInterval(typeInterval)
  }, [isTyping, heroText])

  // Автоматический подбор размера шрифта для точного соответствия ширине рабочей области
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 5

    const adjustFontSize = () => {
      if (!heroLogoRef.current) {
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
      
      // Получаем позицию начала hero-screen и его padding
      const heroScreen = heroLogoRef.current.parentElement
      if (!heroScreen) return
      
      const heroScreenRect = heroScreen.getBoundingClientRect()
      const heroStyle = window.getComputedStyle(heroScreen)
      const heroPaddingLeft = parseFloat(heroStyle.paddingLeft) || 80
      const heroScreenStartX = heroScreenRect.left + heroPaddingLeft
      
      // Выравниваем hero-logo по началу рабочей области header
      const offset = headerStartX - heroScreenStartX
      heroLogoRef.current.style.marginLeft = `${offset}px`

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
      
      let textToMeasure = heroText
      
      // В мобильной версии (≤768px) измеряем самую длинную строку (две строки)
      if (isMobile && splitIndex > 0) {
        const firstLine = heroTextFirst
        const secondLine = heroTextSecond
        textToMeasure = firstLine.length > secondLine.length ? firstLine : secondLine
      } else {
        textToMeasure = heroText
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
      if (heroLogoRef.current) {
        heroLogoRef.current.style.setProperty('font-size', `${bestSize}px`, 'important')
      }
    }

    // Вызываем один раз после рендеринга (requestAnimationFrame не блокирует загрузку)
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
  }, [heroText, splitIndex, heroTextFirst, heroTextSecond])

  const description = settings?.description_text || DEFAULTS.description
  const showreelUrl = settings?.showreel_video_url || DEFAULTS.showreelUrl
  const whyUsText = settings?.why_us_text || DEFAULTS.whyUsText
  const whyUsImg = settings?.why_us_photo_url || DEFAULTS.whyUsImg
  const contactEmail = settings?.contact_email || DEFAULTS.contactEmail
  const contactTelegram = (settings?.contact_telegram || DEFAULTS.contactTelegram).replace(/^@/, '')
  const contactImg = settings?.why_us_photo_url || DEFAULTS.contactImg

  const telegramHref = contactTelegram.startsWith('http') ? contactTelegram : `https://t.me/${contactTelegram.replace(/^@/, '')}`

  const logoItems = logos.length > 0
    ? [...logos, ...logos].map((l, i) => (
        <div key={i} className="logo-item">
          <img src={l.url} alt={l.alt || ''} className="logo-image" onError={(e) => { e.target.style.display = 'none' }} />
        </div>
      ))
    : (
      <>
        {['/logos/3ecff6a8-0075-4a53-b.png', '/logos/ab30587a-c1e1-4d51-8.png', '/logos/d1c428f6-e989-4630-8.png', '/logos/1d6fe783-432b-43ff-9.png', '/logos/209f2efd-d289-42d7-9.png'].flatMap((src, i) => [
          <div key={`a-${i}`} className="logo-item"><img src={src} alt="" className="logo-image" onError={(e) => { e.target.style.display = 'none' }} /></div>,
          <div key={`b-${i}`} className="logo-item"><img src={src} alt="" className="logo-image" onError={(e) => { e.target.style.display = 'none' }} /></div>,
        ])}
      </>
    )

  const projectsList = Array.isArray(projects) ? projects : []
  const showProjectsSkeleton = projectsLoading && projectsList.length === 0

  return (
    <div className="page-fade-in">
      <section className="hero-screen">
        <div className="hero-logo" ref={heroLogoRef} style={{ fontSize: `${logoFontSize}px` }}>
          <span className="hero-logo-line hero-logo-first">
            {splitIndex > 0 && displayedText.length <= splitIndex
              ? displayedText
              : splitIndex > 0
              ? heroTextFirst
              : displayedText}
          </span>
          {splitIndex > 0 && (
            <span className="hero-logo-line hero-logo-second">
              {displayedText.length > splitIndex
                ? displayedText.slice(splitIndex).trim()
                : ''}
              {isTyping && displayedText.length > splitIndex && (
                <span className="typewriter-cursor">|</span>
              )}
            </span>
          )}
          {isTyping && (splitIndex <= 0 || displayedText.length <= splitIndex) && (
            <span className="typewriter-cursor">|</span>
          )}
        </div>
      </section>
      <section className="description-screen">
        <div className="hero-description">{description}</div>
      </section>
      <section className="video-screen">
        <div className="showreel">
          {showreelUrl && (showreelUrl.match(/\.(mp4|webm|ogg)$/i) ? (
            <video autoPlay muted playsInline loop src={showreelUrl} className="video about_img" />
          ) : (
            <img src={showreelUrl} alt="" className="video about_img" onError={(e) => { e.target.style.display = 'none' }} />
          ))}
        </div>
      </section>
      <section className="works-section">
        <div className="works-container">
          <div className="works-header">
            <div className="works-header-top">
              <div className="works-title-left">
                <div className="works-label">LATEST WORKS</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="projects-grid-section">
        <div className="projects-grid-container">
          <div className="projects-grid">
            {showProjectsSkeleton ? (
              Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="project-card home-projects-skeleton">
                  <div className="project-image" aria-hidden="true" />
                  <div className="project-info">
                    <div className="project-skeleton-line" />
                    <div className="project-skeleton-line short" />
                  </div>
                </div>
              ))
            ) : projectsList.length > 0 ? projectsList.map((p) => {
              const imgUrl = p.cover_image_url || '/projects/2025-12-21%2001.48.57.jpg'
              const imgKey = p.updated_at ? `${imgUrl}?v=${new Date(p.updated_at).getTime()}` : imgUrl
              return (
                <DelayedLink
                  to={`/work/${p.slug}`}
                  key={`${p.id}-${p.updated_at || p.created_at}`}
                  className="project-card"
                >
                  <div className="project-image">
                    <img
                      src={imgKey}
                      alt={p.name || ''}
                      className="project-img"
                      onError={(e) => { e.target.style.display = 'none' }}
                      loading="lazy"
                    />
                  </div>
                  <div className="project-info">
                    <span className="project-name">{p.name || '—'}</span>
                    <span className="project-designer">{p.subtitle || 'Design by Designer Name'}</span>
                  </div>
                </DelayedLink>
              )
            }) : null}
          </div>
        </div>
      </section>
      <section className="see-other-works-section">
        <DelayedLink to="/work" className="see-other-works-link">
          <div className="see-other-works-button">View All Works</div>
        </DelayedLink>
      </section>
      <section className="why-us-section">
        <div className="why-us-container">
          <h2 className="why-us-title">Why us</h2>
          <div className="why-us-content">
            <div className="why-us-image">
              <img src={whyUsImg} alt="Why us" className="why-us-img" onError={(e) => { e.target.style.display = 'none' }} />
            </div>
            <div className="why-us-text">
              {whyUsText.split('\n\n').filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="contact-us" className="contact-us-section">
        <div className="contact-us-container">
          <h2 className="contact-us-title">CONTACT US</h2>
          <div className="contact-us-content">
            <div className="contact-info-left">
              <p className="contact-us-description">Reach out to us and let&apos;s collaborate on bringing your project to life.</p>
              <div className="contact-info-item">
                <div className="contact-info-label">EMAIL</div>
                <a href={`mailto:${contactEmail}`} className="contact-info-value contact-button">{contactEmail}</a>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">TELEGRAM</div>
                <a href={telegramHref} target="_blank" rel="noopener noreferrer" className="contact-info-value contact-button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  <span>@{contactTelegram.replace(/^@/, '')}</span>
                </a>
              </div>
            </div>
            <div className="contact-us-image">
              <img src={contactImg} alt="Contact" className="contact-img" onError={(e) => { e.target.style.display = 'none' }} />
            </div>
          </div>
        </div>
      </section>
      <section className="logos-marquee-section">
        <div className="logos-marquee">
          <div className="logos-marquee-track">{logoItems}</div>
          <div className="logos-divider-container">
            <div className="logos-divider" />
          </div>
        </div>
      </section>
      <ContactForm />
    </div>
  )
}

export default Home
