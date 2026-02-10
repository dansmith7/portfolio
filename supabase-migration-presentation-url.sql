-- Добавляет колонку presentation_url в таблицу projects.
-- Выполните в Supabase: SQL Editor → New query → вставьте весь текст ниже → Run

-- 1. Добавляем колонку
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS presentation_url TEXT;

-- 2. Обновляем schema cache (иначе ошибка "Could not find in schema cache")
NOTIFY pgrst, 'reload schema';
