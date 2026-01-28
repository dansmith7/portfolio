# Чеклист производительности

Ответы по пунктам и что сделано.

---

## 1. Запросы идут с клиента или сервера?

**С сервера (API).**  
Данные загружаются через серверные API (Vercel Functions в `api/`). Service role **только на сервере**; клиент никогда не обращается к Supabase за чтением. Админка сохраняет и загружает файлы по‑прежнему с клиента (anon + RLS).

---

## 2. Есть ли `select *`? Грузим ли JSON/blocks для списка?

**Нет.**  
Никогда не грузим JSON/blocks для списка. Везде явный список полей:

- **site_settings:** `hero_text`, `description_text`, `why_us_photo_url`, `why_us_text`, `showreel_video_url`, `contact_email`, `contact_telegram`
- **projects (список):** только `id`, `slug`, `name`, `subtitle`, `cover_image_url`, `show_on_home`, `created_at`, `updated_at` — без `description_text`, `concept_text`, blocks и т.п.
- **projects (страница + админка):** нужные колонки + `project_media(...)`, без тяжёлых полей в списках
- **marquee_logos:** `id`, `url`, `alt`, `sort_order`

---

## 3. Индексы под slug / order / filters

**Да, в `supabase-indexes.sql`.**  
Обязательно выполнить в Supabase: SQL Editor → New query → вставить → Run.

Если сортируешь (order), фильтруешь (eq, in, ilike) или грузишь по slug без индекса — Supabase начинает тормозить в 10–100 раз.

| Таблица       | Индекс                 | Назначение            |
|---------------|------------------------|------------------------|
| projects      | slug                   | поиск по slug         |
| projects      | created_at DESC        | сортировка списка     |
| projects      | show_on_home (partial) | фильтр «на главной»   |
| project_media | project_id             | джойн с проектом      |
| marquee_logos | sort_order             | сортировка логотипов  |

---

## 4. Storage при рендере? Изображения

**Нет.**  
Storage **никогда** не дергается при рендере страницы.

**Правильно:**

- Хранить готовый **public URL** в таблице (`cover_image_url`, `image_url_1`, `image_url_2` и т.д.).
- Использовать CDN или Supabase public bucket; отдавать по этим URL.
- Не запрашивать signed URLs и не делать `list` файлов по каждому проекту.

**Сейчас:** загрузка файла только по клику в админке (`uploadFile` → `getPublicUrl` → URL сохраняем в БД). На рендере только подставляем URL из данных.

---

## 5. Revalidate

**Да.**  
Кэш на клиенте (siteData) с TTL 1 мин; при сохранении в админке `clearCache()`. Список проектов в админке — stale‑while‑revalidate. API отдаёт `Cache-Control: public, max-age=0, must-revalidate`, чтобы CDN/edge не кэшировали ответы и после сохранения в админке сайт сразу получал свежие данные (синхронизация с админкой).

---

## 6. Регионы Supabase и Vercel

Проверять вручную. Желательно совпадение (например, EU).

- **Supabase:** Dashboard → проект → Settings → General → Region  
- **Vercel:** проект → Settings → General → Region  

---

## Кратко

| Вопрос | Ответ |
|--------|--------|
| Запросы с клиента или сервера? | С **сервера** (API), service role только на сервере |
| JSON/blocks для списка? | **Нет**, только поля списка |
| Индексы под slug / order / filters? | **Да**, `supabase-indexes.sql` (выполнить) |
| Storage при рендере? | **Нет**; изображения — только public URL из таблицы |
| Revalidate? | **Да**: TTL, clear при сохранении, SWR в админке |
| Регионы Supabase и Vercel? | **Проверить вручную**, лучше совпадение |
