import '../App.css'
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useLayoutEffect } from 'react'
import { fetchProjectBySlug } from '../lib/siteData'

const FALLBACK_IMG = '/projects/2025-12-21%2001.48.57.jpg'

function ProjectDetail() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  // Сброс скролла до отрисовки (useLayoutEffect) при переходе на страницу проекта
  useLayoutEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [projectId])

  useEffect(() => {
    if (!projectId) {
      setLoading(false)
      return
    }
    
    setLoading(true)
    let cancelled = false
    
    fetchProjectBySlug(projectId)
      .then((p) => {
        if (!cancelled) {
          setProject(p)
          requestAnimationFrame(() => {
            window.scrollTo(0, 0)
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
          })
        }
      })
      .catch(() => {
        if (!cancelled) setProject(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    
    return () => { 
      cancelled = true
    }
  }, [projectId])

  if (loading) {
    return (
      <div className="project-detail-page page-fade-in">
        <p style={{ padding: '2rem', textAlign: 'center' }}>Загрузка…</p>
        <p style={{ padding: '0 2rem 2rem', textAlign: 'center', fontSize: '0.9rem', color: '#666' }}>
          Если загрузка долгая, проверьте подключение к интернету или <Link to="/work">вернитесь к списку проектов</Link>.
        </p>
      </div>
    )
  }
  
  if (!project) {
    return (
      <div className="project-detail-page page-fade-in">
        <p style={{ padding: '2rem', textAlign: 'center' }}>Проект не найден.</p>
        <p style={{ textAlign: 'center' }}><Link to="/work">Все проекты</Link></p>
      </div>
    )
  }

  // Добавляем версию к URL для обхода кэша при обновлении проекта
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
