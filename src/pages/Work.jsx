import '../App.css'
import { Link } from 'react-router-dom'
import parallelScreen4 from '../assets/images/68d85ba814a43e6ce6e89ce6_parallel-screen-4.jpg'
import parallelScreen5 from '../assets/images/68d85ba9c9027aee8bcda2f6_parallel-screen-5.jpg'
import parallelScreen51 from '../assets/images/68d85ba9c9027aee8bcda2f6_parallel-screen-5 (1).jpg'
import parallelScreen6 from '../assets/images/68d85ba578ad30d1cb1ca91a_parallel-screen 6.jpg'

function Work() {
  return (
    <div className="work-page page-fade-in">
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
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen4} alt="SERIE A" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">SERIE A</div>
                <div className="project-category">UX/UI Design • Design System</div>
                <div className="project-number">26</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen5} alt="ATLANTIS" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">ATLANTIS</div>
                <div className="project-category">E-Commerce UX/UI Design</div>
                <div className="project-number">25</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen51} alt="COMUNE DI BRESCIA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">COMUNE DI BRESCIA</div>
                <div className="project-category">Website Design</div>
                <div className="project-number">24</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen6} alt="ISTITUTO NAZIONALE DI GEOFISICA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">ISTITUTO NAZIONALE DI GEOFISICA</div>
                <div className="project-category">UX/UI Design</div>
                <div className="project-number">23</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen4} alt="STEMA" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">STEMA</div>
                <div className="project-category">Website • UX/UI Design</div>
                <div className="project-number">22</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen5} alt="SMANAPP" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">SMANAPP</div>
                <div className="project-category">UX/UI Design</div>
                <div className="project-number">21</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen51} alt="Project 7" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">Project 7</div>
                <div className="project-category">Website</div>
                <div className="project-number">20</div>
              </div>
            </div>
            <div className="project-card-wrapper">
              <Link to="/work/ingv" className="project-card">
                <div className="project-image">
                  <img src={parallelScreen6} alt="Project 8" className="project-img" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </Link>
              <div className="project-info">
                <div className="project-name">Project 8</div>
                <div className="project-category">Website</div>
                <div className="project-number">19</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Work

