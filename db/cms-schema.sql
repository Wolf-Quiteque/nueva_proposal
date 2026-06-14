create table if not exists cms_entries (
  key text primary key,
  value text not null,
  field_type text not null check (field_type in ('text', 'textarea', 'image')),
  section text not null,
  label text not null,
  updated_at timestamptz not null default now()
);

create table if not exists cms_assets (
  key text primary key references cms_entries(key) on delete cascade,
  url text not null,
  pathname text,
  content_type text,
  size_bytes integer,
  updated_at timestamptz not null default now()
);

create index if not exists cms_entries_section_idx on cms_entries(section);
