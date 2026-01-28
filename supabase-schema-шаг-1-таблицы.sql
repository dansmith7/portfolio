-- ШАГ 1: только таблицы (без политик)
-- Выполните в том же проекте Supabase, что и URL в .env

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY,
  hero_text TEXT,
  description_text TEXT,
  why_us_photo_url TEXT,
  why_us_text TEXT,
  showreel_video_url TEXT,
  contact_email TEXT,
  contact_telegram TEXT
);

INSERT INTO public.site_settings (id, hero_text, description_text, why_us_text, contact_email, contact_telegram)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'an(y) designs',
  'UI/UX Designer indipendente.',
  'Мы специализируемся на создании уникальных дизайнерских решений...',
  'info@example.com',
  '@yourusername'
)
ON CONFLICT (id) DO NOTHING;

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
  second_block_title TEXT,
  second_block_text TEXT
);

CREATE TABLE IF NOT EXISTS public.project_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  image_url_1 TEXT,
  image_url_2 TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.marquee_logos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);
