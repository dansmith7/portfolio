import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
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
        name: 'supabase-preconnect',
        transformIndexHtml(html) {
          const url = env.VITE_SUPABASE_URL
          if (url && typeof url === 'string' && url.includes('supabase.co')) {
            try {
              const origin = new URL(url).origin
              return html.replace('</head>', `\n    <link rel="preconnect" href="${origin}" crossorigin>\n  </head>`)
            } catch {}
          }
          return html
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
      proxy: {
        '/api': { target: 'http://localhost:5006', changeOrigin: true },
        '/uploads': { target: 'http://localhost:5006', changeOrigin: true },
      },
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
            'vendor-libs': ['lenis'],
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

