-- STEP 2: RLS and policies (run after step 1, same project)

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marquee_logos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_settings_read" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_write" ON public.site_settings;
CREATE POLICY "site_settings_read" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_write" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "projects_read" ON public.projects;
DROP POLICY IF EXISTS "projects_write" ON public.projects;
CREATE POLICY "projects_read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_write" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "project_media_read" ON public.project_media;
DROP POLICY IF EXISTS "project_media_write" ON public.project_media;
CREATE POLICY "project_media_read" ON public.project_media FOR SELECT USING (true);
CREATE POLICY "project_media_write" ON public.project_media FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "marquee_logos_read" ON public.marquee_logos;
DROP POLICY IF EXISTS "marquee_logos_write" ON public.marquee_logos;
CREATE POLICY "marquee_logos_read" ON public.marquee_logos FOR SELECT USING (true);
CREATE POLICY "marquee_logos_write" ON public.marquee_logos FOR ALL USING (auth.role() = 'authenticated');
