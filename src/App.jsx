import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import ProjectDetail from './pages/ProjectDetail'

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hoverColor, setHoverColor] = useState('#FFE5B4') // светло-желтый по умолчанию

  // Массив цветов для плашки
  const cursorColors = [
    '#FFE5B4', // светло-желтый
    '#FFA07A', // оранжевый
    '#B0E0E6', // светло-мятный зеленый
    '#ADD8E6', // светло-синий
    '#DDA0DD', // светло-фиолетовый/розовый
    '#FF7F50', // красно-оранжевый
    '#20B2AA', // темно-бирюзовый/зеленый
  ]

  useEffect(() => {
    // Проверяем, не мобильное ли устройство
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      return // Не показываем кастомный курсор на мобильных устройствах
    }

    setIsVisible(true)

    let animationFrame = null
    let currentX = 0
    let currentY = 0

    const updateCursor = (e) => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      
      const targetX = e.clientX
      const targetY = e.clientY
      
      const animate = () => {
        // Увеличиваем коэффициент для менее плавного движения
        currentX += (targetX - currentX) * 0.35
        currentY += (targetY - currentY) * 0.35
        setPosition({ x: currentX, y: currentY })
        
        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
          animationFrame = requestAnimationFrame(animate)
        } else {
          animationFrame = null
        }
      }
      
      animationFrame = requestAnimationFrame(animate)
    }

    let lastHoveredElement = null

    const checkHover = (e) => {
      const target = e.target
      if (!target) {
        setIsHovering(false)
        lastHoveredElement = null
        return
      }
      
      const clickableElement = target.closest('a') || 
                              target.closest('button') ||
                              target.closest('.project-card') ||
                              target.closest('.see-other-works-button') ||
                              target.closest('.contact-button') ||
                              target.closest('.input-email') ||
                              target.closest('.telegram-button') ||
                              target.closest('[role="button"]') ||
                              (target.tagName === 'A' ? target : null) ||
                              (target.tagName === 'BUTTON' ? target : null)
      
      const isClickable = !!clickableElement || window.getComputedStyle(target).cursor === 'pointer'
      
      // Если навели на новый элемент, меняем цвет
      if (isClickable && clickableElement !== lastHoveredElement) {
        const randomColor = cursorColors[Math.floor(Math.random() * cursorColors.length)]
        setHoverColor(randomColor)
        lastHoveredElement = clickableElement
      }
      
      if (!isClickable) {
        lastHoveredElement = null
      }
      
      setIsHovering(isClickable)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    window.addEventListener('mousemove', updateCursor)
    document.addEventListener('mouseover', checkHover)
    document.addEventListener('mouseout', (e) => {
      if (!e.relatedTarget || !e.target.contains(e.relatedTarget)) {
        setIsHovering(false)
      }
    })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      window.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseover', checkHover)
      document.removeEventListener('mouseout', handleMouseLeave)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'cursor-hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: isHovering ? hoverColor : '#000000',
      }}
    >
      {isHovering && (
        <>
          <span className="cursor-dot"></span>
          <span className="cursor-text">open</span>
        </>
      )}
    </div>
  )
}

function AppContent() {
  const location = useLocation()
  const isWorkPage = location.pathname === '/work'
  const isAboutPage = location.pathname === '/about'
  const isProjectPage = location.pathname.startsWith('/work/') && location.pathname !== '/work'
  const isStaticHeader = isWorkPage || isAboutPage || isProjectPage
  
  return (
    <div className={`App ${isWorkPage ? 'work-page-active' : ''}`}>
      <CustomCursor />
      <header className={`header ${isStaticHeader ? 'header-static' : ''}`}>
          <div className="header-content">
            <div className="header-name">Ani.Designs</div>
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
            <Route path="/work/:projectId" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <nav className="footer-nav">
                <Link to="/">Home</Link>
                <Link to="/work">Work</Link>
              </nav>
            </div>
            <div className="footer-center">
              <nav className="footer-nav">
                <Link to="/about">About</Link>
                <a href="#contatti">Contacts</a>
              </nav>
            </div>
            <div className="footer-right">
              <a href="mailto:info@ani.designs.com" className="footer-email">info@ani.designs.com</a>
              <div className="footer-copyright">©2025</div>
            </div>
          </div>
          <div className="footer-logo-container">
            <div className="footer-logo">@any.designs</div>
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

