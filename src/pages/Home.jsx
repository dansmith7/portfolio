import '../App.css'

function Home() {
  return (
    <>
      <section className="hero-screen">
        <div className="hero-logo">©BARONIO</div>
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
          <div className="works-divider"></div>
          <div className="works-header">
            <div className="works-header-top">
              <div className="works-title-left">
                <div className="works-label">LATEST</div>
                <div className="works-label works-label-second">WORKS</div>
              </div>
              <div className="works-title-right">
                <div className="works-year">('25)</div>
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
                <div className="project-name">SERIE A</div>
                <div className="project-category">Website</div>
                <div className="project-number">26</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ATLANTIS" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">ATLANTIS</div>
                <div className="project-category">Website</div>
                <div className="project-number">25</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="COMUNE DI BRESCIA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">COMUNE DI BRESCIA</div>
                <div className="project-category">Website</div>
                <div className="project-number">24</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ISTITUTO NAZIONALE DI GEOFISICA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">ISTITUTO NAZIONALE DI GEOFISICA</div>
                <div className="project-category">Website</div>
                <div className="project-number">23</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="STEMA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">STEMA</div>
                <div className="project-category">Website</div>
                <div className="project-number">22</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="SMANAPP" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">SMANAPP</div>
                <div className="project-category">Website</div>
                <div className="project-number">21</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="Project 7" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">Project 7</div>
                <div className="project-category">Website</div>
                <div className="project-number">20</div>
              </div>
            </div>
            <div className="project-card">
              <div className="project-image project-image-text">
                <div className="project-see-all">See all projects</div>
              </div>
              <div className="project-info">
                <div className="project-name">Project 8</div>
                <div className="project-category">Website</div>
                <div className="project-number">19</div>
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

