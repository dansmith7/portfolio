# Развёртывание бэкенда (админка на хостинге)

Есть два варианта: **Supabase** (проще) или **свой сервер** (Render/Railway).

---

## Вариант A: Supabase (рекомендуется)

1. Создай проект на [supabase.com](https://supabase.com).
2. Выполни SQL из `supabase-schema.sql` в SQL Editor (таблицы, RLS, Storage bucket `uploads`).
3. Создай пользователя в **Authentication** → **Users** → **Add user** (email + пароль) — это логин в админку.
4. В **Vercel** → проект → **Settings** → **Environment Variables** добавь:
   - `VITE_SUPABASE_URL` — из Supabase → Settings → API
   - `VITE_SUPABASE_ANON_KEY` — из Supabase → Settings → API
5. Сделай **Redeploy** проекта.

Админка на хостинге будет использовать Supabase. Локально без этих переменных — `npm run server` (локальный API).

**Локально:** создай `.env` в корне проекта (скопируй из `.env.example`) и подставь `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` из Supabase → Settings → API. Перезапусти `npm run dev`.

**Нет подключения?** Проверь: 1) переменные в `.env` (локально) или в Vercel (хостинг); 2) Supabase проект не в статусе Paused (Restore в дашборде); 3) после смены .env — перезапуск dev-сервера.

---

## Вариант B: Свой сервер

### 1. Railway

1. Зайди на [railway.app](https://railway.app), войди через GitHub.
2. **New Project** → **Deploy from GitHub repo** → выбери этот репозиторий.
3. Railway может подхватить корень репо. Нужно указать папку `server`:
   - В проекте открой сервис → **Settings** → **Build**.
   - **Root Directory**: укажи `server` (или в **Source** выбери branch и Root Directory `server`).
   - **Build Command**: `npm install`.
   - **Start Command**: `npm start`.
4. **Variables** (переменные окружения):
   - `ADMIN_PASSWORD` — пароль входа в админку (обязательно).
   - При необходимости: `ALLOW_ORIGINS` = `https://твой-сайт.vercel.app` (через запятую несколько доменов без пробелов).
5. **Deploy**. После деплоя в **Settings** → **Networking** → **Generate Domain** — скопируй URL (например `https://portfolio-admin-server.up.railway.app`).

---

### 2. Render

1. Зайди на [render.com](https://render.com), войди через GitHub.
2. **New** → **Web Service** → выбери этот репозиторий.
3. Настройки:
   - **Root Directory**: `server`.
   - **Build Command**: `npm install`.
   - **Start Command**: `npm start`.
   - **Instance Type**: Free (или платный при необходимости).
4. **Environment** (переменные):
   - `ADMIN_PASSWORD` — пароль входа в админку (обязательно).
   - При необходимости: `ALLOW_ORIGINS` = `https://твой-сайт.vercel.app`.
5. **Create Web Service**. Скопируй URL сервиса (например `https://portfolio-admin-server.onrender.com`).

---

### 3. Подключение фронта (Vercel) к своему бэкенду

1. В [Vercel](https://vercel.com) открой проект сайта → **Settings** → **Environment Variables**.
2. Добавь переменную:
   - **Name**: `VITE_API_URL`
   - **Value**: URL бэкенда **без слэша в конце** (например `https://portfolio-admin-server.up.railway.app` или `https://portfolio-admin-server.onrender.com`).
   - Отметь окружения: Production, Preview, Development (если хочешь).
3. Сохрани и сделай **Redeploy** проекта (чтобы в сборку подставился новый `VITE_API_URL`).

После этого:
- Сайт на Vercel запрашивает данные с твоего бэкенда.
- Админка по адресу `https://твой-сайт.vercel.app/admin` логинится паролем из `ADMIN_PASSWORD` и сохраняет изменения на бэкенде — сайт отображает эти данные.

---

## Важно

- **Пароль**: на Railway/Render обязательно задай `ADMIN_PASSWORD`. Без него вход в админку на бэкенде будет недоступен.
- **CORS**: по умолчанию разрешены все домены (`*`). Чтобы ограничить, задай `ALLOW_ORIGINS` списком через запятую (например `https://mysite.vercel.app,https://www.mysite.com`).
- **Данные**: на бесплатных планах файловая система может сбрасываться при перезапуске. Для постоянного хранения данных используй платный диск (Railway Volumes / Render Persistent Disk) или позже перенеси данные в БД.
- **Локально**: без `VITE_API_URL` фронт по-прежнему ходит на `localhost` (прокси на порт 5006). Локальный запуск: `npm run server` и `npm run dev`.
