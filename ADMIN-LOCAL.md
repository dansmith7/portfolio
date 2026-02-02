# Админка на локальном Supabase

Работа с админкой через локальный Supabase — без зависимости от скорости облачного сервера.

## Требования

- **Docker** (Docker Desktop, OrbStack, Rancher Desktop или Podman)
- **Node.js** 18+

## Быстрый старт

### 1. Установите Supabase CLI (если ещё нет)

```bash
npm install supabase --save-dev
```

### 2. Запустите локальный Supabase

```bash
npm run supabase:start
```

При первом запуске скачаются образы Docker (~2–5 мин). Дождитесь вывода с URL и ключами.

### 3. Скопируйте ключи

В выводе команды найдите:

```
API URL: http://127.0.0.1:54321
anon key: eyJhbGciOiJIUzI1NiIs...
```

### 4. Создайте .env.local

```bash
cp example.env.local .env.local
```

Откройте `.env.local` и при необходимости обновите URL и anon key из вывода `supabase start` (в примере указаны типичные значения для локального Supabase).

### 5. Создайте пользователя для входа в админку

Откройте **Supabase Studio**: http://127.0.0.1:54323

1. **Authentication** → **Users** → **Add user** → **Create new user**
2. Email и пароль — любые (например `admin@local.test` / `admin123`)
3. Нажмите **Create user**

### 6. Запустите проект

```bash
npm run dev
```

Откройте http://localhost:3000/admin/login и войдите с созданным email и паролем.

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm run supabase:start` | Запуск локального Supabase |
| `npm run supabase:stop` | Остановка |
| `npm run supabase:status` | Статус и ключи |
| `npm run dev` | Запуск сайта (читает `.env` или `.env.local`) |

## Режимы работы

- **`.env`** — облачный Supabase (production/staging)
- **`.env.local`** — локальный Supabase (приоритет над `.env`)

Vite загружает `.env.local` автоматически, если он есть. Для локальной админки создайте `.env.local` с локальными ключами.

## Синхронизация данных

Данные локального и облачного Supabase **не синхронизируются**. Это разные базы.

- **Локально** — быстрая работа, тестовые данные
- **Облако** — боевые данные для production

При необходимости можно выгрузить данные из облака и импортировать локально через SQL или Supabase Studio.

## Остановка

```bash
npm run supabase:stop
```
