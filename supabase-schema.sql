-- Схема для админки портфолио
-- Выполните в Supabase: SQL Editor → New query → вставьте весь текст ниже → Run

-- 1. Таблица настроек сайта
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_text TEXT DEFAULT 'an(y) designs',
  description_text TEXT,
  why_us_photo_url TEXT,
  why_us_text TEXT,
  showreel_video_url TEXT,
  contact_email TEXT,
  contact_telegram TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Запись по умолчанию (можно запускать несколько раз)
INSERT INTO public.site_settings (id, hero_text, description_text, why_us_text, contact_email, contact_telegram)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'an(y) designs',
  'UI/UX Designer indipendente. Collaboro con studi di design, startup e aziende, con un forte focus su user experience, web design art direction e design systems',
  'Мы специализируемся на создании уникальных дизайнерских решений...',
  'info@example.com',
  '@yourusername'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Логотипы бегущей строки
CREATE TABLE IF NOT EXISTS public.marquee_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Проекты
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  cover_image_url TEXT,
  name TEXT NOT NULL,
  subtitle TEXT,
  show_on_home BOOLEAN DEFAULT false,
  description_text TEXT,
  concept_text TEXT,
  requirements_text TEXT,
  output_text TEXT,
  first_horizontal_image_url TEXT,
  second_block_title TEXT DEFAULT 'Premium, but not snobbish',
  second_block_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Медиа проекта
CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('horizontal', 'two_verticals')),
  image_url_1 TEXT,
  image_url_2 TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Включаем RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marquee_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Удаляем старые политики (если скрипт уже запускали), затем создаём заново
DROP POLICY IF EXISTS "site_settings_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_write" ON public.site_settings;
DROP POLICY IF EXISTS "marquee_logos_read" ON public.marquee_logos;
DROP POLICY IF EXISTS "marquee_logos_write" ON public.marquee_logos;
DROP POLICY IF EXISTS "projects_read" ON public.projects;
DROP POLICY IF EXISTS "projects_write" ON public.projects;
DROP POLICY IF EXISTS "project_media_read" ON public.project_media;
DROP POLICY IF EXISTS "project_media_write" ON public.project_media;

-- Политики: чтение — всем, запись — только авторизованным (WITH CHECK для INSERT)
CREATE POLICY "site_settings_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_write" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "marquee_logos_read" ON public.marquee_logos FOR SELECT USING (true);
CREATE POLICY "marquee_logos_write" ON public.marquee_logos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "projects_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_write" ON public.projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "project_media_read" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "project_media_write" ON public.project_media FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Storage: политики для bucket "uploads" (загрузка фото из админки)
-- Создайте bucket "uploads" в Storage → New bucket, затем выполните блок ниже.
DROP POLICY IF EXISTS "uploads_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "uploads_public_select" ON storage.objects;
CREATE POLICY "uploads_authenticated_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "uploads_public_select" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
