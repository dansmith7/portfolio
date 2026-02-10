import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const supabaseUrl = (env.VITE_SUPABASE_URL || '').replace(/\/$/, '')

  return {
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
    ],
    server: {
      port: 3002,
      strictPort: false,
      open: true,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
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

