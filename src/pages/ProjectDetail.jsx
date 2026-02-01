import '../App.css'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'
import { usePreloadReady } from '../contexts/PreloadContext'
import { fetchProjectBySlugQuery } from '../lib/siteDataQueries'

const FALLBACK_IMG = '/projects/2025-12-21%2001.48.57.jpg'

function ProjectDetail() {
  const { projectId } = useParams()

  useLayoutEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [projectId])

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectBySlugQuery(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })

  const hasContent = !!project || isError || !projectId
  usePreloadReady(hasContent)

  if (!projectId) {
    return (
      <div className="project-detail-page page-fade-in">
        <p style={{ padding: '2rem', textAlign: 'center' }}>Проект не указан.</p>
        <p style={{ textAlign: 'center' }}><Link to="/work">Все проекты</Link></p>
      </div>
    )
  }

  if (isLoading && !project) {
    return (
      <div className="project-detail-page page-fade-in">
        <section className="project-detail-main">
          <div className="project-detail-container">
            <div className="project-detail-content">
              <div className="project-detail-left" style={{ opacity: 0.5 }}>
                <div className="project-skeleton-line" style={{ height: 48, maxWidth: 400, marginBottom: 24 }} />
                <div className="project-skeleton-line" style={{ height: 80, marginBottom: 24 }} />
                <div className="project-skeleton-line" style={{ height: 60, marginBottom: 16 }} />
                <div className="project-skeleton-line" style={{ height: 60 }} />
              </div>
              <div className="project-detail-right">
                <div className="project-skeleton-line" style={{ aspectRatio: '3/4', minHeight: 400 }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!project || isError) {
    return (
      <div className="project-detail-page page-fade-in">
        <p style={{ padding: '2rem', textAlign: 'center' }}>Проект не найден.</p>
        <p style={{ textAlign: 'center' }}><Link to="/work">Все проекты</Link></p>
      </div>
    )
  }

  const img = (url) => {
    const baseUrl = url || FALLBACK_IMG
    if (!url) return baseUrl
    return project.updated_at ? `${baseUrl}?v=${new Date(project.updated_at).getTime()}` : baseUrl
  }
  const media = project.media || []

  return (
    <div className="project-detail-page page-fade-in">
      <section className="project-detail-main">
        <div className="project-detail-container">
          <div className="project-detail-content">
            <div className="project-detail-left">
              <h1 className="project-detail-title">{project.name}</h1>
              <div className="project-detail-description">
                <p>{project.description_text}</p>
              </div>
              <div className="project-detail-section project-detail-section-hidden">
                <h2 className="project-detail-section-title">Visual identity /25</h2>
              </div>
              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider" />
                  <h3 className="project-detail-section-label">CONCEPT</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.concept_text}</p>
                </div>
              </div>
              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider" />
                  <h3 className="project-detail-section-label">REQUIREMENTS</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.requirements_text}</p>
                </div>
              </div>
              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider" />
                  <h3 className="project-detail-section-label">OUTPUT</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.output_text}</p>
                </div>
              </div>
            </div>
            <div className="project-detail-right">
              <div className="project-detail-image">
                <img
                  src={img(project.cover_image_url)}
                  alt={project.name}
                  className="project-detail-img"
                  onError={(e) => { e.target.src = FALLBACK_IMG }}
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {project.first_horizontal_image_url && (
        <>
          <div className="project-detail-spacer" />
          <section className="project-detail-fullscreen">
            <div className="project-detail-fullscreen-image">
              <img
                src={img(project.first_horizontal_image_url)}
                alt={project.name}
                className="project-detail-fullscreen-img"
                onError={(e) => { e.target.src = FALLBACK_IMG }}
                loading="lazy"
              />
            </div>
          </section>
        </>
      )}

      {(project.second_block_title || project.second_block_text) && (
        <>
          <div className="project-detail-spacer" />
          <section className="project-detail-text-block">
            <div className="project-detail-text-container">
              <h2 className="project-detail-text-title">{project.second_block_title || '—'}</h2>
              <p className="project-detail-text-content">{project.second_block_text || ''}</p>
            </div>
          </section>
        </>
      )}

      {media.map((m, i) => {
        if (m.type === 'horizontal' && m.image_url_1) {
          return (
            <div key={m.id || i}>
              <div className="project-detail-spacer" />
              <section className="project-detail-fullscreen">
                <div className="project-detail-fullscreen-image">
                  <img
                    src={img(m.image_url_1)}
                    alt={project.name}
                    className="project-detail-fullscreen-img"
                    onError={(e) => { e.target.src = FALLBACK_IMG }}
                    loading="lazy"
                  />
                </div>
              </section>
            </div>
          )
        }
        if (m.type === 'two_verticals' && (m.image_url_1 || m.image_url_2)) {
          return (
            <div key={m.id || i}>
              <div className="project-detail-spacer" />
              <section className="project-detail-two-images">
                <div className="project-detail-two-images-container">
                  <div className="project-detail-two-images-item">
                    <img
                      src={img(m.image_url_1)}
                      alt={project.name}
                      className="project-detail-two-images-img"
                      onError={(e) => { e.target.src = FALLBACK_IMG }}
                      loading="lazy"
                    />
                  </div>
                  <div className="project-detail-two-images-item">
                    <img
                      src={img(m.image_url_2)}
                      alt={project.name}
                      className="project-detail-two-images-img"
                      onError={(e) => { e.target.src = FALLBACK_IMG }}
                      loading="lazy"
                    />
                  </div>
                </div>
              </section>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

export default ProjectDetail
