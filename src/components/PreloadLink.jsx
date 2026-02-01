import { Link, useNavigate } from 'react-router-dom'
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

async function preloadPath(path) {
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

/**
 * Ссылка на /work — клик НЕ переходит сразу, а дожидается полной загрузки, потом navigate()
 */
export default function PreloadLink({ to, children, className, ...rest }) {
  const navigate = useNavigate()
  const path = typeof to === 'string' ? to : to?.pathname ?? ''

  if (!path.startsWith('/work') || path.includes('#')) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const overlay = document.createElement('div')
    overlay.setAttribute('data-preload-overlay', '')
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(255,255,255,0.95);z-index:99998;opacity:0;transition:opacity 0.15s'
    document.body.appendChild(overlay)
    requestAnimationFrame(() => { overlay.style.opacity = '1' })
    const hide = () => {
      overlay.style.opacity = '0'
      setTimeout(() => overlay.remove(), 150)
    }
    const onReady = () => {
      document.removeEventListener('preload-page-ready', onReady)
      clearTimeout(timeout)
      hide()
    }
    const timeout = setTimeout(hide, 3000)
    document.addEventListener('preload-page-ready', onReady, { once: true })
    preloadPath(path).then(
      () => navigate(path),
      () => { document.removeEventListener('preload-page-ready', onReady); clearTimeout(timeout); hide(); navigate(path) }
    )
  }

  return (
    <a href={path} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
