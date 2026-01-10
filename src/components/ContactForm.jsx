import { useState, useEffect, useRef } from 'react'
import '../App.css'

// Массив цветов для плашек
const PLAQUE_COLORS = [
  '#FFE5B4', // светло-желтый
  '#FFA07A', // оранжевый
  '#B0E0E6', // светло-мятный зеленый
  '#ADD8E6', // светло-синий
  '#DDA0DD', // светло-фиолетовый/розовый
  '#FF7F50', // красно-оранжевый
  '#20B2AA', // темно-бирюзовый/зеленый
  '#98FB98', // светло-зеленый
  '#FFD700', // золотой
  '#FF69B4', // розовый
  '#87CEEB', // небесно-голубой
  '#D3D3D3', // светло-серый
]

// Тексты для плашек (как на референсе)
const PLAQUE_TEXTS = [
  "hello!",
  "say g'day",
  "come on in",
  "start now",
  "no smoking",
  "take it",
  "okay",
  "<3",
  "haaaa",
  "hello?",
  "ready",
  "set",
  "action",
  "huh?",
  "yaaa",
  "who?",
  "jump in",
  "ready?",
  "don't wait",
  "click",
  "it's time",
  "go",
  "find out",
  ":)"
]

function ContactForm() {

  const [isInside, setIsInside] = useState(false)
  const [plaques, setPlaques] = useState([]) // Массив зафиксированных плашек
  const containerRef = useRef(null)
  const lastPlaquePosRef = useRef(null) // Позиция последней созданной плашки
  const totalDistanceRef = useRef(0) // Общее пройденное расстояние
  const isMouseInsideRef = useRef(false)
  
  // Примерная ширина плашки (нужно для расчета расстояния)
  const PLAQUE_WIDTH = 120

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Проверяем, находится ли курсор внутри контейнера
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        if (!isMouseInsideRef.current) {
          isMouseInsideRef.current = true
          setIsInside(true)
          // Инициализируем первую позицию и создаем первую плашку сразу
          lastPlaquePosRef.current = { x, y }
          totalDistanceRef.current = 0
          
          // Создаем первую плашку сразу при входе
          const randomText = PLAQUE_TEXTS[Math.floor(Math.random() * PLAQUE_TEXTS.length)]
          const randomColor = PLAQUE_COLORS[Math.floor(Math.random() * PLAQUE_COLORS.length)]
          const angle = (Math.random() - 0.5) * 15
          
          const createdAt = Date.now()
          const fadeDelay = 2000 + Math.random() * 500 // 2-2.5 секунды
          
          setPlaques(prev => [...prev, {
            id: createdAt + Math.random(),
            x: x,
            y: y,
            text: randomText,
            color: randomColor,
            angle: angle,
            opacity: 1,
            createdAt: createdAt,
            fadeStartTime: createdAt + fadeDelay // Время начала затухания
          }])
        } else {
          // Вычисляем расстояние от последней плашки
          if (lastPlaquePosRef.current) {
            const dx = x - lastPlaquePosRef.current.x
            const dy = y - lastPlaquePosRef.current.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            totalDistanceRef.current += distance

            // Если прошли расстояние, равное ширине плашки, создаем новую
            if (totalDistanceRef.current >= PLAQUE_WIDTH) {
              // Выбираем случайный текст и цвет
              const randomText = PLAQUE_TEXTS[Math.floor(Math.random() * PLAQUE_TEXTS.length)]
              const randomColor = PLAQUE_COLORS[Math.floor(Math.random() * PLAQUE_COLORS.length)]
              
              // Небольшой случайный угол для визуального эффекта (как на скриншотах)
              const angle = (Math.random() - 0.5) * 15 // от -7.5 до +7.5 градусов
              
              // Создаем плашку в текущей позиции курсора
              const createdAt = Date.now()
              const fadeDelay = 2000 + Math.random() * 500 // 2-2.5 секунды
              
              setPlaques(prev => [...prev, {
                id: createdAt + Math.random(),
                x: x,
                y: y,
                text: randomText,
                color: randomColor,
                angle: angle,
                opacity: 1,
                createdAt: createdAt,
                fadeStartTime: createdAt + fadeDelay // Время начала затухания
              }])
              
              // Обновляем позицию последней плашки и сбрасываем счетчик расстояния
              lastPlaquePosRef.current = { x, y }
              totalDistanceRef.current = 0
            }
            // Обновляем позицию для следующего расчета расстояния
            lastPlaquePosRef.current = { x, y }
          }
        }
      } else {
        if (isMouseInsideRef.current) {
          isMouseInsideRef.current = false
          setIsInside(false)
          // Сбрасываем при выходе, но плашки остаются видимыми
        }
      }
    }

    const handleMouseLeave = () => {
      isMouseInsideRef.current = false
      setIsInside(false)
      // Не удаляем плашки при выходе - они остаются на экране
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Эффект для затухания плашек через 2-2.5 секунды
  useEffect(() => {
    if (plaques.length === 0) return

    const fadeInterval = setInterval(() => {
      const now = Date.now()

      setPlaques(prev => {
        return prev.map(plaque => {
          if (!plaque.fadeStartTime) return plaque
          
          const age = now - plaque.fadeStartTime
          
          if (age >= 0) {
            // Плавное затухание
            const fadeDuration = 500 // 0.5 секунды на полное исчезновение
            const fadeProgress = Math.min(1, age / fadeDuration)
            const newOpacity = Math.max(0, 1 - fadeProgress)
            
            return { ...plaque, opacity: newOpacity }
          }
          return plaque
        }).filter(plaque => plaque.opacity > 0) // Удаляем полностью прозрачные плашки
      })
    }, 50) // Проверяем каждые 50мс для плавности

    return () => clearInterval(fadeInterval)
  }, [plaques.length])

  const handleClick = () => {
    window.open('https://t.me/oli_anna', '_blank', 'noopener,noreferrer')
  }

  return (
    <a 
      href="https://t.me/oli_anna" 
      target="_blank" 
      rel="noopener noreferrer"
      className="contact-form-section" 
      ref={containerRef}
      onClick={handleClick}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div className="contact-form-container">
        <p className="contact-form-text">Feel Like We Could Collaborate? Get in Touch!</p>
      </div>
      
      {/* Хвост из плашек */}
      {plaques.length > 0 && (
        <div className="plaque-trail">
          {plaques.map((plaque) => (
            <div
              key={plaque.id}
              className="trail-plaque"
              style={{
                left: `${plaque.x}px`,
                top: `${plaque.y}px`,
                backgroundColor: plaque.color,
                opacity: plaque.opacity,
                transform: `translate(-50%, -50%) rotate(${plaque.angle}deg)`,
              }}
            >
              <span className="trail-dot"></span>
              <span className="trail-text">{plaque.text}</span>
            </div>
          ))}
        </div>
      )}
    </a>
  )
}

export default ContactForm

