import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Outlet } from 'react-router-dom'
import { Suspense, lazy, useEffect, useLayoutEffect, useState, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Home from './pages/Home'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import AdminGuard from './pages/admin/AdminGuard'
import AdminLayout from './pages/admin/AdminLayout'

const Work = lazy(() => import('./pages/Work'))
const About = lazy(() => import('./pages/About'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'))
const AdminProjectEdit = lazy(() => import('./pages/admin/AdminProjectEdit'))

const PageFallback = () => <p style={{ padding: '2rem', textAlign: 'center' }}>Загрузка…</p>

// Плавный скролл с Lenis
function SmoothScroll({ lenisRef }) {
  const location = useLocation()

  useEffect(() => {
    // Сбрасываем скролл при смене маршрута
    window.scrollTo(0, 0)
    
    // Инициализация Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Обработка якорных ссылок
    const handleLinkClick = (e) => {
      const target = e.target.closest('a[href*="#"]')
      if (!target) return
      
      const href = target.getAttribute('href')
      if (!href || href === '#') return
      
      let hash = null
      if (href.includes('/#')) {
        hash = href.split('/#')[1]
      } else if (href.startsWith('#')) {
        hash = href.replace('#', '')
      }
      
      if (!hash) return
      
      const targetElement = document.getElementById(hash)
      if (targetElement && lenis) {
        e.preventDefault()
        if (window.location.pathname === '/') {
          lenis.scrollTo(targetElement, {
            offset: -100,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
        } else {
          window.location.href = `/#${hash}`
        }
      }
    }

    document.addEventListener('click', handleLinkClick)
    
    const handleHashNavigation = () => {
      if (window.location.hash && lenis && window.location.pathname === '/') {
        const hash = window.location.hash.replace('#', '')
        const targetElement = document.getElementById(hash)
        if (targetElement) {
          setTimeout(() => {
            lenis.scrollTo(targetElement, {
              offset: -100,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            })
          }, 100)
        }
      }
    }
    
    handleHashNavigation()
    window.addEventListener('hashchange', handleHashNavigation)

    return () => {
      lenis.destroy()
      document.removeEventListener('click', handleLinkClick)
      window.removeEventListener('hashchange', handleHashNavigation)
    }
  }, [location, lenisRef])

  // Сброс скролла при смене маршрута (useLayoutEffect = до отрисовки, чтобы не было "прыжка")
  useLayoutEffect(() => {
    const isProjectPage = location.pathname.startsWith('/work/') && location.pathname !== '/work'
    if (isProjectPage && window.location.hash) {
      window.history.replaceState(null, '', location.pathname)
    }
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [location.pathname])

  return null
}

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [cursorType, setCursorType] = useState('arrow') // 'arrow' для всех кликабельных элементов
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
        setCursorType('arrow')
        lastHoveredElement = null
        return
      }
      
      // Пропускаем проверку для последнего экрана с хвостом из плашек
      if (target.closest('.contact-form-section')) {
        setIsHovering(false)
        setCursorType('arrow')
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
        // Все кликабельные элементы показывают стрелку
        setCursorType('arrow')
      }
      
      // Если навели на новый элемент, меняем цвет
      if (isClickable && clickableElement !== lastHoveredElement) {
        const randomColor = cursorColors[Math.floor(Math.random() * cursorColors.length)]
        setHoverColor(randomColor)
        lastHoveredElement = clickableElement
      }
      
      if (!isClickable) {
        lastHoveredElement = null
        setCursorType('arrow')
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
  const isAdmin = location.pathname.startsWith('/admin')
  const isWorkPage = location.pathname === '/work'
  const isAboutPage = location.pathname === '/about'
  const isProjectPage = location.pathname.startsWith('/work/') && location.pathname !== '/work'
  const isStaticHeader = isWorkPage || isAboutPage || isProjectPage
  const lenisRef = useRef(null)

  if (isAdmin) {
    return (
      <AdminAuthProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/admin" element={<Outlet />}>
              <Route path="login" element={<AdminLogin />} />
              <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
                <Route index element={<AdminDashboard />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectEdit />} />
                <Route path="projects/:projectSlug" element={<AdminProjectEdit />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    )
  }

  
  return (
    <div className={`App ${isWorkPage ? 'work-page-active' : ''}`}>
      <SmoothScroll lenisRef={lenisRef} />
      <CustomCursor />
      <header className={`header ${isStaticHeader ? 'header-static' : ''}`}>
          <div className="header-content">
            <Link to="/" className="header-name header-name-visible">an(y) designs</Link>
            <nav className="nav">
              <Link to="/">Home</Link>
              <Link to="/work">Work</Link>
              <Link to="/about">About</Link>
              <Link to="/#contact-us">Contacts</Link>
            </nav>
          </div>
        </header>

        <main className="main">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/work" element={<Work />} />
              <Route path="/work/:projectId" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
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
                <Link to="/#contact-us">Contacts</Link>
              </nav>
            </div>
            <div className="footer-right">
              <a href="mailto:info@ani.designs.com" className="footer-email">info@ani.designs.com</a>
              <div className="footer-copyright">©2025</div>
            </div>
          </div>
          <div className="footer-logo-container">
            <div className="footer-logo">an(y) designs</div>
          </div>
        </footer>
      </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  )
}


export default App

