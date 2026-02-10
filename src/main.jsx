import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { subscribeToAdminSync } from './lib/adminSync'
import App from './App.jsx'
import './index.css'

// Синхронизация с админкой: при сохранении в другой вкладке — обновляем данные
subscribeToAdminSync(queryClient)

// Отключаем автоматическое восстановление позиции скролла браузером
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
)
