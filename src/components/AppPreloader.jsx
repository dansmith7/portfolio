import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { queryClient } from '../lib/queryClient'
import {
  fetchSiteSettingsQuery,
  fetchProjectsQuery,
  fetchMarqueeLogosQuery,
} from '../lib/siteDataQueries'

/** Полный экран прелоадер при первой загрузке — скрывает весь контент до загрузки данных */
export default function AppPreloader({ children }) {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // При первой загрузке или перезагрузке страницы
    if (isInitialLoad) {
      const loadAllData = async () => {
        try {
          // Предзагружаем все данные параллельно
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: ['site_settings'],
              queryFn: fetchSiteSettingsQuery,
            }),
            queryClient.prefetchQuery({
              queryKey: ['projects', 'all'],
              queryFn: () => fetchProjectsQuery(),
            }),
            queryClient.prefetchQuery({
              queryKey: ['projects', 'home'],
              queryFn: () => fetchProjectsQuery({ onlyShowOnHome: true }),
            }),
            queryClient.prefetchQuery({
              queryKey: ['marquee_logos'],
              queryFn: fetchMarqueeLogosQuery,
            }),
          ])
        } catch (error) {
          console.error('[AppPreloader] Ошибка предзагрузки:', error)
        } finally {
          // Минимальная задержка для плавности
          setTimeout(() => {
            setIsLoading(false)
            setIsInitialLoad(false)
          }, 300)
        }
      }

      loadAllData()
    }
  }, [isInitialLoad])

  // При навигации между страницами не показываем прелоадер
  useEffect(() => {
    if (!isInitialLoad) {
      setIsLoading(false)
    }
  }, [location.pathname, isInitialLoad])

  if (isLoading && isInitialLoad) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#fff',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #333',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ fontSize: '16px', color: '#333' }}>Загрузка…</div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
  }

  return children
}
