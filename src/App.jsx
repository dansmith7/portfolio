import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'

function AppContent() {
  const location = useLocation()
  const isWorkPage = location.pathname === '/work'
  const isAboutPage = location.pathname === '/about'
  const isStaticHeader = isWorkPage || isAboutPage
  
  return (
    <div className={`App ${isWorkPage ? 'work-page-active' : ''}`}>
      <header className={`header ${isStaticHeader ? 'header-static' : ''}`}>
          <div className="header-content">
            <div className="header-name">Paolo Baronio</div>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/work">Work</Link>
              <Link to="/about">About</Link>
              <a href="#contatti">Contatti</a>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-brand">Paolo Baronio™</div>
              <div className="footer-credits">Designed and Developed by Paolo Baronio</div>
            </div>
            <div className="footer-center">
              <div className="footer-email">info@paolobaronio.it</div>
              <nav className="footer-nav">
                <Link to="/">Home</Link>
                <Link to="/work">Work</Link>
                <Link to="/about">About</Link>
                <a href="#contatti">Contatti</a>
              </nav>
            </div>
            <div className="footer-copyright">©2025</div>
          </div>
          <div className="footer-logo-container">
            <div className="footer-logo">©BARONIO</div>
          </div>
        </footer>
      </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

