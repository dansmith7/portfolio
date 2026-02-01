import { useEffect } from 'react'

/** Вызвать когда страница полностью готова — скрывает оверлей предзагрузки */
export function usePreloadReady(ready = true) {
  useEffect(() => {
    if (!ready) return
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('preload-page-ready'))
      })
    })
    return () => cancelAnimationFrame(id)
  }, [ready])
}
