import '../App.css'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { usePreloadReady } from '../contexts/PreloadContext'
import { fetchProjectsQuery } from '../lib/siteDataQueries'

function Work() {
  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => fetchProjectsQuery(),
    staleTime: 1000 * 60 * 5,
  })

  const list = Array.isArray(projects) ? projects : []
  const hasContent = !isLoading || list.length > 0
  usePreloadReady(hasContent)

  if (isLoading && list.length === 0) {
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
            <div className="projects-grid work-skeleton">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="project-card-wrapper">
                  <div className="project-card" aria-hidden="true" />
                  <div className="project-info">
                    <div className="project-skeleton-line" />
                    <div className="project-skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }

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
            {list.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                {isError ? 'Ошибка загрузки' : 'Нет проектов'}
              </p>
            ) : list.map((p, i) => {
              const imgUrl = p.cover_image_url || '/projects/2025-12-21%2001.48.57.jpg'
              const imgKey = p.updated_at ? `${imgUrl}?v=${new Date(p.updated_at).getTime()}` : imgUrl
              return (
                <div key={`${p.id || i}-${p.updated_at || p.created_at}`} className="project-card-wrapper">
                  <Link to={`/work/${p.slug}`} className="project-card">
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
