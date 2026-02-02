import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

export default function DelayedLink({ to, children, className, onClick, ...rest }) {
  const navigate = useNavigate()
  const timeoutRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('DelayedLink clicked, navigating to:', to)
    
    // Очищаем предыдущий таймер, если есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (onClick) {
      onClick()
    }

    // Устанавливаем задержку в 0,65 секунды
    timeoutRef.current = setTimeout(() => {
      console.log('Navigating to:', to)
      navigate(to)
      timeoutRef.current = null
    }, 650)
  }

  return (
    <a 
      href={to} 
      onClick={handleClick} 
      className={className}
      style={{ cursor: 'pointer' }}
      {...rest}
    >
      {children}
    </a>
  )
}
