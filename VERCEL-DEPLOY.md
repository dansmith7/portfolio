# Деплой на Vercel

## Загрузка данных с сервера

Данные грузятся **через API** (Vercel Functions в `api/`). Service role **только на сервере**; клиент не обращается к Supabase за чтением. Списки — только поля списка, без JSON/blocks. Изображения — только public URL из таблицы, Storage при рендере не дергается.

---

## Переменные окружения в Vercel

1. Откройте [vercel.com](https://vercel.com) → ваш проект.
2. **Settings** → **Environment Variables**.
3. Добавьте:

| Name | Value | Где |
|------|--------|-----|
| `SUPABASE_URL` | `https://ваш-проект.supabase.co` | **Сервер** (API) |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key из Supabase (Dashboard → Settings → API) | **Сервер** (API) |
| `VITE_SUPABASE_URL` | то же `https://ваш-проект.supabase.co` | **Клиент** (админка: сохранение, загрузка файлов) |
| `VITE_SUPABASE_ANON_KEY` | anon public key из Supabase | **Клиент** (админка) |

4. **Save**.

`SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` используются только в `api/` (сервер). Никогда не добавляйте service role в `VITE_*` и не светите его на клиенте.

---

## Пересборка и деплой

После добавления/изменения переменных:

- **Deployments** → у последнего деплоя **⋯** → **Redeploy** (галочку **Use existing Build Cache** лучше снять),  
- или новый коммит и пуш в Git — Vercel задеплоит сам.

Без нового билда старые значения env остаются в приложении.

---

## Локальная разработка с API

Для полного стека (фронт + API) локально:

```bash
vercel dev
```

Так поднимаются и Vite, и функции в `api/`. Запросы к `/api/*` идут на серверные обработчики.

Только фронт: `npm run dev` — но тогда `/api/*` недоступны, данные не подгрузятся (останутся fallback).

---

## Дополнительно

- **Кэш:** после сохранения в админке вызывается `clearCache()`; следующие запросы к API отдают свежие данные.
- **Проверка:** F12 → Network. При загрузке главной/проектов видны запросы к `/api/settings`, `/api/projects`, `/api/project-by-slug`, `/api/logos` (same-origin). Прямых запросов к `*.supabase.co` за **чтением** данных нет.
