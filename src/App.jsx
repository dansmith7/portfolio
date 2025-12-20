import './App.css'

function App() {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-name">Paolo Baronio</div>
          <nav className="nav">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#contatti">Contatti</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero-screen">
          <div className="hero-logo">©BARONIO</div>
        </section>
        <section className="description-screen">
          <div className="hero-description">
            UI/UX Designer indipendente. Collaboro con studi di design, startup e aziende, con un forte focus su user experience, web design art direction e design systems
          </div>
        </section>
      </main>
    </div>
  )
}

export default App

