import '../App.css'
import { Link } from 'react-router-dom'

function Work() {
  return (
    <div className="work-page">
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
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="SERIE A" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">SERIE A</div>
                <div className="project-category">UX/UI Design • Design System</div>
                <div className="project-number">26</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ATLANTIS" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">ATLANTIS</div>
                <div className="project-category">E-Commerce UX/UI Design</div>
                <div className="project-number">25</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="COMUNE DI BRESCIA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">COMUNE DI BRESCIA</div>
                <div className="project-category">Website Design</div>
                <div className="project-number">24</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="ISTITUTO NAZIONALE DI GEOFISICA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">ISTITUTO NAZIONALE DI GEOFISICA</div>
                <div className="project-category">UX/UI Design</div>
                <div className="project-number">23</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="STEMA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">STEMA</div>
                <div className="project-category">Website • UX/UI Design</div>
                <div className="project-number">22</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="SMANAPP" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">SMANAPP</div>
                <div className="project-category">UX/UI Design</div>
                <div className="project-number">21</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="Project 7" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">Project 7</div>
                <div className="project-category">Website</div>
                <div className="project-number">20</div>
              </div>
            </Link>
            <Link to="/work/ingv" className="project-card">
              <div className="project-image">
                <img src="/projects/2025-12-21%2001.48.57.jpg" alt="Project 8" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
              <div className="project-info">
                <div className="project-name">Project 8</div>
                <div className="project-category">Website</div>
                <div className="project-number">19</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Work

