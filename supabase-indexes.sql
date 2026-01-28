-- Индексы под slug, order, filters
-- Выполните в Supabase: SQL Editor → New query → вставьте → Run

CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_show_on_home ON public.projects(show_on_home) WHERE show_on_home = true;
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON public.project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_marquee_logos_sort_order ON public.marquee_logos(sort_order);
