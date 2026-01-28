# Настройка админки

## 1. Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **Settings → API** скопируйте:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Создайте файл `.env` в корне проекта:
   ```
   VITE_SUPABASE_URL=https://ваш-проект.supabase.co
   VITE_SUPABASE_ANON_KEY=ваш-anon-key
   ```

## 2. База данных

В Supabase откройте **SQL Editor**, создайте новый запрос и выполните скрипт из файла `supabase-schema.sql` в корне проекта. Так создадутся таблицы и политики доступа.

## 3. Пользователь админки

В Supabase: **Authentication → Users → Add user → Create new user**.  
Укажите email и пароль — ими вы будете входить в админку по адресу `/admin`.

## 4. Bucket для загрузок с компьютера (обязательно для загрузки фото)

Если при загрузке фото появляется ошибка **Bucket not found** — создайте bucket:

1. В Supabase откройте **Storage** (левое меню).
2. Нажмите **New bucket**.
3. **Name:** введите **uploads** (именно так, без пробелов).
4. Включите **Public bucket** (чтобы ссылки на загруженные файлы открывались на сайте).
5. Нажмите **Create bucket**.

После этого кнопки «С компьютера» в настройках сайта и в карточках проектов будут загружать файлы в этот bucket.

**Если при загрузке фото появляется ошибка «new row violates row-level security policy»** — добавьте политики для Storage: в Supabase откройте **SQL Editor** → New query → вставьте содержимое файла **supabase-storage-policies.sql** из корня проекта → Run. Так вы разрешите авторизованному пользователю загружать файлы в bucket «uploads» и всем — читать их.

**Если при загрузке фото появляется ошибка «new row violates row-level security policy»** — добавьте политики для Storage: в Supabase откройте **SQL Editor** → New query → вставьте содержимое файла **supabase-storage-policies.sql** из корня проекта → Run. Так вы разрешите авторизованному пользователю загружать файлы в bucket «uploads» и всем — читать их.

**Если при загрузке фото появляется ошибка «new row violates row-level security policy»** — добавьте политики для Storage: в Supabase откройте **SQL Editor** → New query → вставьте содержимое файла **supabase-storage-policies.sql** из корня проекта → Run. Так вы разрешите авторизованному пользователю загружать файлы в bucket «uploads» и всем — читать их.

## 5. Запуск

- Сайт: `npm run dev` — главная по `http://localhost:3000/`
- Админка: `http://localhost:3000/admin` → вход по логину/паролю из п.3

Поддомен для админки настраивается на этапе деплоя (отдельное приложение или правило в nginx/Vercel).
