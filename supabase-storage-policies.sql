-- Политики RLS для bucket "uploads" (загрузка фото из админки).
-- Выполните в Supabase: SQL Editor → New query → вставьте этот файл → Run.
-- Bucket "uploads" должен быть создан заранее: Storage → New bucket → имя "uploads" → Public bucket.

DROP POLICY IF EXISTS "uploads_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "uploads_public_select" ON storage.objects;

CREATE POLICY "uploads_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "uploads_public_select" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'uploads');
