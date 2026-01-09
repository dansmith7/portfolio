import '../App.css'
import { useParams, Link } from 'react-router-dom'

function ProjectDetail() {
  const { projectId } = useParams()
  
  // Данные проекта (в будущем можно вынести в отдельный файл или API)
  const projectData = {
    'ingv': {
      title: 'INGV',
      category: 'Civic & Public',
      year: '©2024',
      cliente: 'Istituto Nazionale di Geofisica',
      committente: 'Fightbean',
      role: 'Product Designer',
      description: [
        "Per l'Istituto Nazionale di Geofisica e Vulcanologia abbiamo sviluppato una piattaforma dedicata alla visualizzazione degli eventi sismici su mappa e alla consultazione delle sorgenti estese per i tecnici.",
        "La sfida principale è stata tradurre contenuti scientifici complessi in un'esperienza chiara e accessibile, mantenendo al tempo stesso un alto livello di precisione e affidabilità."
      ],
      myRole: [
        "Mi sono occupato del design dell'interfaccia e del design system, lavorando per organizzare e priorizzare le informazioni scientifiche in modo efficace. Ho partecipato ai workshop e alle fasi di testing per garantire un'esperienza utente ottimale, bilanciando rigore tecnico e chiarezza comunicativa."
      ],
      relatedProjects: [
        { name: 'SERIE A', category: 'UX/UI Design • Design System', link: '/work/serie-a' },
        { name: 'SMANAPP', category: 'UX/UI Design', link: '/work/smanapp' }
      ]
    }
  }
  
  const project = projectData[projectId] || projectData['ingv']
  
  return (
    <div className="project-detail-page">
      <section className="project-hero">
        <div className="project-container">
          <div className="project-divider"></div>
          <div className="project-header">
            <div className="project-title-section">
              <div className="project-category-label">{project.category}</div>
              <h1 className="project-title">{project.title}</h1>
            </div>
            <div className="project-year">{project.year}</div>
          </div>
        </div>
      </section>

      <section className="project-info-section">
        <div className="project-container">
          <div className="project-info-grid">
            <div className="project-info-item">
              <div className="project-info-label">Cliente:</div>
              <div className="project-info-value">{project.cliente}</div>
              <div className="project-download-content">
                <p className="project-download-text">Download project presentation</p>
                <a href="#" className="project-download-button" download>
                  Download
                </a>
              </div>
            </div>
            <div className="project-info-item">
              <div className="project-info-label">Committente:</div>
              <div className="project-info-value">{project.committente}</div>
            </div>
            <div className="project-info-item">
              <div className="project-info-label">Il mio ruolo:</div>
              <div className="project-info-value">{project.role}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-overview">
        <div className="project-container">
          <h2 className="project-overview-title">Overview Progetto</h2>
          
          <div className="project-overview-section">
            <div className="project-section-label">(DESCRIZIONE)</div>
            <div className="project-section-content">
              {project.description.map((paragraph, index) => (
                <p key={index} className="project-text">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="project-overview-section">
            <div className="project-section-label">(IL MIO RUOLO)</div>
            <div className="project-section-content">
              {project.myRole.map((paragraph, index) => (
                <p key={index} className="project-text">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      <section className="project-media-section">
        <div className="project-media-container">
          <div className="project-media-wrapper">
            <img 
              src="/projects/2025-12-21%2001.48.57.jpg" 
              alt={project.title} 
              className="project-media-image"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          </div>
        </div>
      </section>

      {project.relatedProjects && project.relatedProjects.length > 0 && (
        <section className="project-related">
          <div className="project-container">
            <h3 className="project-related-title">Progetti correlati:</h3>
            <div className="project-related-list">
              {project.relatedProjects.map((related, index) => (
                <Link key={index} to={related.link} className="project-related-item">
                  <span className="project-related-name">{related.name}</span>
                  <span className="project-related-category">{related.category}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProjectDetail

