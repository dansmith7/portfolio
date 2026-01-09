import '../App.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      <section className="hero-screen">
        <div className="hero-logo">@any.designs</div>
      </section>
      <section className="description-screen">
        <div className="hero-description">
          UI/UX Designer indipendente. Collaboro con studi di design, startup e aziende, con un forte focus su user experience, web design art direction e design systems
        </div>
      </section>
      <section className="video-screen">
        <div className="showreel">
          <video 
            autoPlay 
            muted 
            playsInline 
            loop 
            src="https://cdn.jsdelivr.net/gh/pbaronio/media/homepage-gif.mp4" 
            className="video about_img"
          ></video>
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
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="SERIE A" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">SERIE A</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ATLANTIS" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">ATLANTIS</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="COMUNE DI BRESCIA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">COMUNE DI BRESCIA</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ISTITUTO NAZIONALE DI GEOFISICA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">ISTITUTO NAZIONALE DI GEOFISICA</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="STEMA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">STEMA</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="SMANAPP" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <span className="project-name">SMANAPP</span>
                <span className="project-designer">Design by Designer Name</span>
              </div>
            </div>
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
              <img src="/projects/2025-12-21%2001.48.57.jpg" alt="Why us" className="why-us-img" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <div className="why-us-text">
              <p>Мы специализируемся на создании уникальных дизайнерских решений, которые сочетают в себе эстетику и функциональность. Наш подход основан на глубоком понимании потребностей клиентов и трендов современного дизайна.</p>
              <p>Мы работаем с различными проектами - от корпоративных сайтов до брендинга и digital-стратегий. Каждый проект - это возможность создать что-то особенное и запоминающееся.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-us-section">
        <div className="contact-us-container">
          <h2 className="contact-us-title">CONTACT US</h2>
          <div className="form-section">
            <div className="contact-item">
              <h2 className="subtitle">YOUR NAME</h2>
              <div className="input-row">
                <a href="mailto:info@example.com" className="input-email email-button">info@example.com</a>
                <a href="https://t.me/yourusername" target="_blank" rel="noopener noreferrer" className="telegram-button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            <div className="contact-item">
              <h2 className="subtitle">ANOTHER NAME</h2>
              <div className="input-row">
                <a href="mailto:contact@example.com" className="input-email email-button">contact@example.com</a>
                <a href="https://t.me/anotherusername" target="_blank" rel="noopener noreferrer" className="telegram-button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                  <span>Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="logos-marquee-section">
        <div className="logos-marquee">
          <div className="logos-marquee-track">
            <div className="logo-item">
              <img src="/logos/3ecff6a8-0075-4a53-b.png" alt="Сбер Банк" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/ab30587a-c1e1-4d51-8.png" alt="РЖД" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/d1c428f6-e989-4630-8.png" alt="Банк России" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/1d6fe783-432b-43ff-9.png" alt="Ростелеком" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/209f2efd-d289-42d7-9.png" alt="Департамент информационных технологий города Москвы" className="logo-image" />
            </div>
            {/* Дублируем для бесшовной анимации */}
            <div className="logo-item">
              <img src="/logos/3ecff6a8-0075-4a53-b.png" alt="Сбер Банк" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/ab30587a-c1e1-4d51-8.png" alt="РЖД" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/d1c428f6-e989-4630-8.png" alt="Банк России" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/1d6fe783-432b-43ff-9.png" alt="Ростелеком" className="logo-image" />
            </div>
            <div className="logo-item">
              <img src="/logos/209f2efd-d289-42d7-9.png" alt="Департамент информационных технологий города Москвы" className="logo-image" />
            </div>
          </div>
          <div className="logos-divider-container">
            <div className="logos-divider"></div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home

