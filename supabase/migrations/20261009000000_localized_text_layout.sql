-- Localized copy with authored line breaks by default.

create table if not exists public.site_content_translations (
  settings_id uuid not null references public.site_settings(id) on delete cascade,
  locale text not null,
  hero_text text not null default '',
  description_text text not null default '',
  about_description_text text not null default '',
  why_us_text text not null default '',
  latest_works_label text not null default 'LATEST WORKS',
  view_all_works_label text not null default 'View All Works',
  why_us_title text not null default 'Why us',
  contact_title text not null default 'CONTACT US',
  contact_description_text text not null default '',
  contact_form_text text not null default '',
  wrap_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (settings_id, locale),
  constraint site_content_translations_locale_check check (locale in ('en', 'ru')),
  constraint site_content_translations_wrap_settings_check check (jsonb_typeof(wrap_settings) = 'object')
);

create table if not exists public.project_translations (
  project_id uuid not null references public.projects(id) on delete cascade,
  locale text not null,
  name text not null default '',
  subtitle text not null default '',
  description_text text not null default '',
  concept_text text not null default '',
  requirements_text text not null default '',
  output_text text not null default '',
  second_block_title text not null default '',
  second_block_text text not null default '',
  wrap_settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (project_id, locale),
  constraint project_translations_locale_check check (locale in ('en', 'ru')),
  constraint project_translations_wrap_settings_check check (jsonb_typeof(wrap_settings) = 'object')
);

-- Backfill the current single-language content as English without overwriting
-- translations that may already have been entered.
insert into public.site_content_translations (
  settings_id,
  locale,
  hero_text,
  description_text,
  about_description_text,
  why_us_text,
  contact_description_text,
  contact_form_text,
  latest_works_label,
  view_all_works_label,
  why_us_title,
  contact_title
)
select
  id,
  'en',
  coalesce(hero_text, ''),
  coalesce(description_text, ''),
  coalesce(description_text, ''),
  coalesce(why_us_text, ''),
  'Reach out to us and let''s collaborate on bringing your project to life.',
  'Feel Like We Could Collaborate? Get in Touch!',
  'LATEST WORKS',
  'View All Works',
  'Why us',
  'CONTACT US'
from public.site_settings
on conflict (settings_id, locale) do nothing;

insert into public.project_translations (
  project_id,
  locale,
  name,
  subtitle,
  description_text,
  concept_text,
  requirements_text,
  output_text,
  second_block_title,
  second_block_text
)
select
  id,
  'en',
  coalesce(name, ''),
  coalesce(subtitle, ''),
  coalesce(description_text, ''),
  coalesce(concept_text, ''),
  coalesce(requirements_text, ''),
  coalesce(output_text, ''),
  coalesce(second_block_title, ''),
  coalesce(second_block_text, '')
from public.projects
on conflict (project_id, locale) do nothing;

alter table public.site_content_translations enable row level security;
alter table public.project_translations enable row level security;

drop policy if exists "site_content_translations_read" on public.site_content_translations;
drop policy if exists "site_content_translations_write" on public.site_content_translations;
create policy "site_content_translations_read"
  on public.site_content_translations for select using (true);
create policy "site_content_translations_write"
  on public.site_content_translations for all to authenticated
  using (true) with check (true);

drop policy if exists "project_translations_read" on public.project_translations;
drop policy if exists "project_translations_write" on public.project_translations;
create policy "project_translations_read"
  on public.project_translations for select using (true);
create policy "project_translations_write"
  on public.project_translations for all to authenticated
  using (true) with check (true);
