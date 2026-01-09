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
  const [cursorType, setCursorType] = useState('open') // 'open' или 'arrow'
  const [isVisible, setIsVisible] = useState(false)
  const [hoverColor, setHoverColor] = useState('#FFE5B4') // светло-желтый по умолчанию

  // Массив цветов для плашки и стрелки
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

    let cursorUpdateTimeout = null
    
    const updateCursor = (e) => {
      // Throttling для updateCursor, чтобы не блокировать скролл
      if (cursorUpdateTimeout) return
      
      cursorUpdateTimeout = requestAnimationFrame(() => {
        cursorUpdateTimeout = null
        
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
      })
    }

    let lastHoveredElement = null
    let lastMouseX = 0
    let lastMouseY = 0
    let hoverTimeout = null

    const checkHover = (x, y) => {
      // Используем актуальные координаты мыши для проверки hover
      const target = document.elementFromPoint(x, y)
      if (!target) {
        setIsHovering(false)
        setCursorType('open')
        lastHoveredElement = null
        return
      }
      
      // Определяем большие элементы (карточки проектов)
      const largeElement = target.closest('.project-card')
      
      // Определяем кнопки, которые должны показывать стрелку
      const arrowButton = target.closest('.see-other-works-button') ||
                         target.closest('.email-button') ||
                         target.closest('.telegram-button') ||
                         target.closest('.contact-button')
      
      // Определяем текстовые ссылки
      const textLink = target.closest('a') && !target.closest('.project-card') && 
                       !target.closest('.see-other-works-button')
      
      const clickableElement = largeElement || 
                              textLink ||
                              arrowButton ||
                              target.closest('button') ||
                              target.closest('.input-email') ||
                              target.closest('[role="button"]') ||
                              (target.tagName === 'A' ? target : null) ||
                              (target.tagName === 'BUTTON' ? target : null)
      
      // Избегаем getComputedStyle если возможно, так как это может быть медленно
      const isClickable = !!clickableElement
      
      // Определяем тип курсора
      if (isClickable) {
        if (largeElement) {
          setCursorType('open')
        } else if (arrowButton || textLink || (target.tagName === 'A' && !target.closest('.project-card'))) {
          setCursorType('arrow')
        } else {
          setCursorType('open')
        }
      }
      
      // Если навели на новый элемент, меняем цвет
      if (isClickable && clickableElement !== lastHoveredElement) {
        const randomColor = cursorColors[Math.floor(Math.random() * cursorColors.length)]
        setHoverColor(randomColor)
        lastHoveredElement = clickableElement
      }
      
      if (!isClickable) {
        lastHoveredElement = null
        setCursorType('open')
      }
      
      setIsHovering(isClickable)
    }


    // НЕ отслеживаем скролл, чтобы не блокировать его
    // Просто проверяем hover при движении мыши
    const handleMouseMove = (e) => {
      lastMouseX = e.clientX
      lastMouseY = e.clientY
      updateCursor(e)
      
      // Проверяем hover сразу через requestAnimationFrame для плавности
      if (hoverTimeout) cancelAnimationFrame(hoverTimeout)
      hoverTimeout = requestAnimationFrame(() => {
        checkHover(lastMouseX, lastMouseY)
        hoverTimeout = null
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    const handleMouseLeave = () => {
      setIsVisible(false)
      setIsHovering(false)
    }
    
    const handleMouseEnter = () => {
      setIsVisible(true)
    }
    
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    document.addEventListener('mouseenter', handleMouseEnter, { passive: true })

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      if (cursorUpdateTimeout) {
        cancelAnimationFrame(cursorUpdateTimeout)
      }
      if (hoverTimeout) cancelAnimationFrame(hoverTimeout)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'cursor-hover' : ''} ${isHovering && cursorType === 'arrow' ? 'cursor-arrow' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: isHovering ? hoverColor : '#000000',
      }}
    >
      {isHovering && cursorType === 'open' && (
        <>
          <span className="cursor-dot"></span>
          <span className="cursor-text">open</span>
        </>
      )}
      {isHovering && cursorType === 'arrow' && (
        <svg className="cursor-arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12L12 4M12 4H6M12 4V10" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
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

