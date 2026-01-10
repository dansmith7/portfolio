import '../App.css'

function About() {
  return (
    <div className="about-page page-fade-in">
      <section className="about-hero">
        <div className="about-container">
          <div className="about-divider"></div>
          <h1 className="about-title">About</h1>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <div className="about-intro">
            <p className="about-intro-text">
              Digital designer con +5 anni di esperienza da freelance, collaborando con diversi studi di design, startup e aziende come UI/UX Designer, con un forte focus su user experience, web design art direction e design systems
            </p>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(SU DI ME)</h2>
            <div className="about-section-content">
              <p className="about-text">
                Mi piace mettere ordine, dalle piccole cose di ogni giorno ai file di lavoro. Allo stesso tempo non rinuncio mai alla creatività e a quel pizzico di follia che rende tutto più interessante.
              </p>
              <p className="about-text">
                Preferisco lavorare su progetti con obiettivi chiari, analizzando flussi e dati per migliorare l'esperienza utente ed esplorando nuove strade creative per raccontare l'identità di un brand online.
              </p>
              <p className="about-text">
                Fotografia, tipografia e branding sono il punto di partenza della mia ricerca e guidano la direzione artistica di ogni progetto. Webflow e lo studio dei framework, invece, sono fondamentali per organizzare i file e gestire al meglio l'handoff verso lo sviluppo o direttamente al cliente.
              </p>
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(SERVIZI)</h2>
            <div className="about-services">
              <div className="service-item">UI/UX Design</div>
              <div className="service-item">User Experience (UX)</div>
              <div className="service-item">E-commerce design</div>
              <div className="service-item">Landing page</div>
              <div className="service-item">Design System</div>
              <div className="service-item">Sviluppo in Webflow</div>
              <div className="service-item">Consulenza Figma/Design/Webflow</div>
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(WORKSPACE)</h2>
            <div className="about-section-content">
              {/* Workspace content can be added here */}
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(COLLABORAZIONI)</h2>
            <div className="about-section-content">
              <p className="about-text">
                Sono sempre aperto a nuove collaborazioni o anche solo a una chiacchierata per conoscerci meglio a <a href="mailto:info@anidesigns.com" className="about-link">info@anidesigns.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

