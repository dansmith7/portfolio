import { useEffect } from 'react'
import { queryClient } from '../lib/queryClient'
import { fetchProjectsQuery, fetchProjectBySlugQuery } from '../lib/siteDataQueries'

const prefetched = new Set()

/** Prefetch данных при наведении на ссылки Work / проекты — к моменту клика данные уже в кэше React Query */
export function usePrefetchOnHover(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleEnter = (e) => {
      const a = e.target.closest('a[href^="/work"]')
      if (!a) return
      const href = (a.getAttribute('href') || '').split('?')[0]
      if (prefetched.has(href)) return
      prefetched.add(href)

      const match = href.match(/^\/work\/([^/]+)/)
      const slug = match?.[1]
      if (slug) {
        queryClient.prefetchQuery({ queryKey: ['project', slug], queryFn: () => fetchProjectBySlugQuery(slug) })
        import('../pages/ProjectDetail').catch(() => {})
      } else if (href === '/work') {
        queryClient.prefetchQuery({ queryKey: ['projects', 'all'], queryFn: () => fetchProjectsQuery() })
        import('../pages/Work').catch(() => {})
      }
    }

    document.addEventListener('mouseover', handleEnter, { capture: true, passive: true })
    document.addEventListener('touchstart', handleEnter, { capture: true, passive: true })
    return () => {
      document.removeEventListener('mouseover', handleEnter, { capture: true })
      document.removeEventListener('touchstart', handleEnter, { capture: true })
    }
  }, [enabled])
}
