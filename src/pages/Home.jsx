import '../App.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import ContactForm from '../components/ContactForm'
import {
  fetchSiteSettingsQuery,
  fetchProjectsQuery,
  fetchMarqueeLogosQuery,
} from '../lib/siteDataQueries'

const DEFAULTS = {
  heroText: 'an(y) designs',
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
        <div className="hero-logo">
          {displayedText}
          {isTyping && <span className="typewriter-cursor">|</span>}
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
                <Link
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
                </Link>
              )
            }) : null}
          </div>
        </div>
      </section>
      <section className="see-other-works-section">
        <Link to="/work" className="see-other-works-link">
          <div className="see-other-works-button">View All Works</div>
        </Link>
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
