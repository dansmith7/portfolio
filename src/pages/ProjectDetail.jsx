import '../App.css'
import { useParams, Link } from 'react-router-dom'
import parallelScreen4 from '../assets/images/68d85ba814a43e6ce6e89ce6_parallel-screen-4.jpg'
import parallelScreen5 from '../assets/images/68d85ba9c9027aee8bcda2f6_parallel-screen-5.jpg'
import parallelScreen51 from '../assets/images/68d85ba9c9027aee8bcda2f6_parallel-screen-5 (1).jpg'
import parallelScreen6 from '../assets/images/68d85ba578ad30d1cb1ca91a_parallel-screen 6.jpg'

function ProjectDetail() {
  const { projectId } = useParams()
  
  // Данные проекта (в будущем можно вынести в отдельный файл или API)
  const projectData = {
    'ingv': {
      title: 'SERIE A',
      description: 'Logo and visual identity design for Serie A, providing a personalised mentorship service for young students by building a role model relationships with more experienced student mentors in academic life.',
      concept: 'Serie A wanted to communicate its premium and sophisticated soul. The concept is inspired by the name, which symbolises a path of growth and parallel accompaniment of the mentor and mentee, brought back to the graphic sign of growth and rise.',
      requirements: 'Serie A needed a strong enough visual identity to differentiate itself in a rather crowded market environment. Premium, but not snobby, trustworthy, but not cold.',
      output: 'Initial applications included flyers, posters, pitch decks and social media graphics. The identity ensures flexibility across online and offline media, ensuring strong immediate recognisability.',
      image: '/projects/2025-12-21%2001.48.57.jpg'
    }
  }
  
  const project = projectData[projectId] || projectData['ingv']
  
  return (
    <div className="project-detail-page page-fade-in">
      <section className="project-detail-main">
        <div className="project-detail-container">
          <div className="project-detail-content">
            <div className="project-detail-left">
              <h1 className="project-detail-title">{project.title}</h1>
              
              <div className="project-detail-description">
                <p>{project.description}</p>
              </div>

              <div className="project-detail-section">
                <h2 className="project-detail-section-title">Visual identity /25</h2>
              </div>

              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider"></div>
                  <h3 className="project-detail-section-label">CONCEPT</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.concept}</p>
                </div>
              </div>

              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider"></div>
                  <h3 className="project-detail-section-label">REQUIREMENTS</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.requirements}</p>
                </div>
              </div>

              <div className="project-detail-section">
                <div className="project-detail-section-header">
                  <div className="project-detail-section-divider"></div>
                  <h3 className="project-detail-section-label">OUTPUT</h3>
                </div>
                <div className="project-detail-section-content">
                  <p>{project.output}</p>
                </div>
              </div>
            </div>

            <div className="project-detail-right">
              <div className="project-detail-image">
                <img 
                  src={parallelScreen4} 
                  alt={project.title} 
                  className="project-detail-img"
                  onError={(e) => { e.target.src = project.image || '/projects/2025-12-21%2001.48.57.jpg'; }} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="project-detail-spacer"></div>

      <section className="project-detail-fullscreen">
        <div className="project-detail-fullscreen-image">
          <img 
            src={parallelScreen5} 
            alt={project.title} 
            className="project-detail-fullscreen-img"
            onError={(e) => { e.target.src = project.image || '/projects/2025-12-21%2001.48.57.jpg'; }} 
          />
        </div>
      </section>

      <div className="project-detail-spacer"></div>

      <section className="project-detail-text-block">
        <div className="project-detail-text-container">
          <h2 className="project-detail-text-title">Premium, but not snobbish</h2>
          <p className="project-detail-text-content">Starting with a very strong graphic concept, a parallel growth, the line becomes the protagonist of the visual identity. A line that grows, connects and marks a path both for the eye and the mind.</p>
        </div>
      </section>

      <div className="project-detail-spacer"></div>

      <section className="project-detail-fullscreen">
        <div className="project-detail-fullscreen-image">
          <img 
            src={parallelScreen6} 
            alt={project.title} 
            className="project-detail-fullscreen-img"
            onError={(e) => { e.target.src = project.image || '/projects/2025-12-21%2001.48.57.jpg'; }} 
          />
        </div>
      </section>

      <div className="project-detail-spacer"></div>

      <section className="project-detail-two-images">
        <div className="project-detail-two-images-container">
          <div className="project-detail-two-images-item">
            <img 
              src={parallelScreen4} 
              alt={project.title} 
              className="project-detail-two-images-img"
              onError={(e) => { e.target.src = project.image || '/projects/2025-12-21%2001.48.57.jpg'; }} 
            />
          </div>
          <div className="project-detail-two-images-item">
            <img 
              src={parallelScreen51} 
              alt={project.title} 
              className="project-detail-two-images-img"
              onError={(e) => { e.target.src = project.image || '/projects/2025-12-21%2001.48.57.jpg'; }} 
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProjectDetail

