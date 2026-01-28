import '../App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProjects } from '../lib/siteData'

const FALLBACK = [
  { slug: 'ingv', name: 'SERIE A', subtitle: 'UX/UI Design • Design System', cover_image_url: '/projects/2025-12-21%2001.48.57.jpg' },
]

function Work() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects().then((p) => setProjects(p.length ? p : FALLBACK)).catch(() => setProjects(FALLBACK))
  }, [])

  const list = projects.length ? projects : FALLBACK

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
            {list.map((p, i) => {
              const imgUrl = p.cover_image_url || '/projects/2025-12-21%2001.48.57.jpg'
              const imgKey = p.updated_at ? `${imgUrl}?v=${new Date(p.updated_at).getTime()}` : imgUrl
              return (
                <div key={`${p.id || i}-${p.updated_at || p.created_at}`} className="project-card-wrapper">
                  <Link 
                    to={`/work/${p.slug}`} 
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
                  </Link>
                  <div className="project-info">
                    <div className="project-name">{p.name || '—'}</div>
                    <div className="project-category">{p.subtitle || '—'}</div>
                    <div className="project-number">{list.length - i}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Work
