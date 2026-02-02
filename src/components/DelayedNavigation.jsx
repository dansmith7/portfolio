import { useEffect, useRef } from 'react'
import { useNavigate, useLocation, unstable_useBlocker as useBlocker } from 'react-router-dom'

const DELAY_MS = 1000 // 1 секунда задержки

/** Блокирует навигацию и добавляет задержку 1 секунда */
export default function DelayedNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const pendingPathRef = useRef(null)
  const timeoutRef = useRef(null)

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    // Пропускаем админку
    if (nextLocation.pathname.startsWith('/admin')) return false
    // Пропускаем если это тот же путь (hash изменение)
    if (currentLocation.pathname === nextLocation.pathname) return false
    
    console.log('[DelayedNavigation] Блокируем переход с', currentLocation.pathname, 'на', nextLocation.pathname)
    pendingPathRef.current = nextLocation.pathname
    return true
  })

  useEffect(() => {
    if (blocker.state === 'blocked' && pendingPathRef.current) {
      console.log('[DelayedNavigation] Задержка', DELAY_MS, 'мс перед переходом на', pendingPathRef.current)
      
      timeoutRef.current = setTimeout(() => {
        console.log('[DelayedNavigation] Выполняем переход на', pendingPathRef.current)
        blocker.proceed()
        pendingPathRef.current = null
      }, DELAY_MS)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }
      }
    }
  }, [blocker.state, blocker])

  useEffect(() => {
    console.log('[DelayedNavigation] Компонент смонтирован, location:', location.pathname)
  }, [location.pathname])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return null
}
