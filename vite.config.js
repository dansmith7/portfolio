import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '')

  return {
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    plugins: [
      react(),
      {
        name: 'html-preconnect',
        transformIndexHtml(html) {
          if (!supabaseUrl) return html
          const preconnect = `<link rel="preconnect" href="${supabaseUrl}" crossorigin />`
          return html.replace(
            '<!-- Preconnect к Supabase — ускоряет первые запросы к API (инжектится при сборке) -->',
            preconnect
          )
        },
      },
      {
        name: 'html-cache-bust',
        transformIndexHtml(html, ctx) {
          if (ctx.server) {
            const ts = Date.now()
            return html.replace(/src="([^"]+)\?v=\d+"/, `src="$1?v=${ts}"`)
          }
          return html
        },
      },
    ],
    server: {
      port: 5005,
      strictPort: true,
      open: true,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      hmr: {
        overlay: true,
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-libs': ['lenis', '@supabase/supabase-js'],
          },
        },
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || ''),
    },
  }
})

