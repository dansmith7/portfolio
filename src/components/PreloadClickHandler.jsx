import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { queryClient } from '../lib/queryClient'
import { fetchProjectsQuery, fetchProjectBySlugQuery } from '../lib/siteDataQueries'

function preloadImage(url) {
  if (!url) return Promise.resolve()
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = url
  })
}

async function preloadRoute(path) {
  const match = path.match(/^\/work\/([^/?#]+)/)
  const slug = match?.[1]

  if (slug) {
    const [project] = await Promise.all([
      queryClient.fetchQuery({
        queryKey: ['project', slug],
        queryFn: () => fetchProjectBySlugQuery(slug),
      }),
      import('../pages/ProjectDetail'),
    ])
    const img = (url) => (!url ? null : project?.updated_at ? `${url}?v=${new Date(project.updated_at).getTime()}` : url)
    const urls = [
      project?.cover_image_url && img(project.cover_image_url),
      project?.first_horizontal_image_url && img(project.first_horizontal_image_url),
      ...(project?.media?.slice(0, 3)?.flatMap((m) => [m?.image_url_1 && img(m.image_url_1), m?.image_url_2 && img(m.image_url_2)]) || []),
    ].filter(Boolean)
    await Promise.all(urls.map(preloadImage))
  } else {
    await Promise.all([
      queryClient.fetchQuery({ queryKey: ['projects', 'all'], queryFn: () => fetchProjectsQuery() }),
      import('../pages/Work'),
    ])
  }
}

/** Глобальный перехват ВСЕХ кликов по /work — capture phase, до любого другого обработчика */
export default function PreloadClickHandler() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => {
      const a = e.target.closest('a[href*="/work"]')
      if (!a) return
      let path
      try {
        path = new URL(a.href, window.location.origin).pathname
      } catch {
        path = (a.getAttribute('href') || '').split('?')[0]
      }
      if (!path?.startsWith('/work') || path.includes('#')) return

      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()

      const overlay = document.createElement('div')
      overlay.setAttribute('data-preload-overlay', '1')
      overlay.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:2147483647;display:flex;align-items:center;justify-content:center'
      overlay.innerHTML = '<div style="font-size:18px;color:#333">Загрузка…</div>'
      document.body.appendChild(overlay)

      const hide = () => {
        overlay.style.opacity = '0'
        overlay.style.transition = 'opacity 0.2s'
        setTimeout(() => overlay.remove(), 250)
      }
      const onReady = () => {
        document.removeEventListener('preload-page-ready', onReady)
        clearTimeout(t)
        hide()
      }
      const t = setTimeout(hide, 4000)
      document.addEventListener('preload-page-ready', onReady, { once: true })

      preloadRoute(path).then(
        () => {
          navigate(path)
        },
        () => {
          document.removeEventListener('preload-page-ready', onReady)
          clearTimeout(t)
          hide()
          navigate(path)
        }
      )
    }
    document.addEventListener('click', handler, true)
    return () => document.removeEventListener('click', handler, true)
  }, [navigate])

  return null
}
