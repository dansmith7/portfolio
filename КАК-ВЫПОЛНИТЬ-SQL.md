# Таблица projects не найдена — что сделать

Ошибка значит: в том проекте Supabase, к которому подключается сайт (по .env), нет таблицы `projects`. Либо скрипт не запускали, либо запускали в **другом** проекте.

**SQL нужно выполнять в том же проекте Supabase, для которого в `.env` указаны `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`.**

---

## Вариант 1: одной командой (рекомендуется)

Скрипт сам выполнит SQL в вашем проекте. Нужно один раз взять строку подключения к БД из Supabase.

1. **Supabase** → ваш проект (тот же, что в .env) → **Settings** (шестерёнка) → **Database**.
2. В блоке **Connection string** выберите **URI**.
3. Скопируйте строку вида  
   `postgresql://postgres.[ref]:[YOUR-PASSWORD]@...supabase.com:6543/postgres`
4. Замените `[YOUR-PASSWORD]` на **пароль от БД** (тот, что задавали при создании проекта).
5. Добавьте в файл **.env** в корне проекта строку (в одну строку, без переноса):
   ```
   SUPABASE_DB_URL=postgresql://postgres.xxx:ваш_пароль@aws-0-xxx.pooler.supabase.com:6543/postgres
   ```
6. В терминале из папки проекта выполните:
   ```bash
   npm install
   npm run db:schema
   ```
7. В конце должно появиться: «Готово. Таблицы site_settings, projects и др. созданы.»
8. Обновите страницу админки (F5).

Если пароль забыли: **Settings → Database** в Supabase есть «Reset database password».

---

Выполняйте SQL в том же проекте, что и URL в .env.

1. **supabase.com** → проект (URL из .env) → **SQL Editor** → **New query**.
2. Откройте **supabase-schema.sql**, скопируйте **весь** текст, вставьте в запрос → **Run**.
3. **Table Editor** — проверьте, что есть таблицы **site_settings** и **projects**.
4. Обновите админку (F5).

---

## Вариант 3: по шагам (если вариант 2 не сработал)

**Шаг 1 — таблицы**

1. Supabase → тот же проект → **SQL Editor** → **New query**.
2. Скопируйте **весь** текст из файла **supabase-step1-tables.sql**.
3. Вставьте в запрос → **Run**.
4. Откройте **Table Editor**. Должны появиться **site_settings**, **projects**, **project_media**, **marquee_logos**. Если их нет — в панели результатов SQL смотрите текст ошибки (красным).

**Шаг 2 — политики**

1. **SQL Editor** → **New query**.
2. Скопируйте **весь** текст из файла **supabase-step2-rls.sql**.
3. Вставьте → **Run**.
4. Обновите админку (F5).

---

## Проверка проекта в .env

В корне проекта в `.env` должно быть примерно так:

```
VITE_SUPABASE_URL=https://XXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

В Supabase: **Settings** (иконка шестерёнки) → **API** → **Project URL**. Этот URL и должен быть в `VITE_SUPABASE_URL`. Если там другой проект — либо поменяйте .env на текущий проект, либо выполните SQL в том проекте, который указан в .env.

После любых изменений в .env перезапустите dev-сервер (`npm run dev`).
