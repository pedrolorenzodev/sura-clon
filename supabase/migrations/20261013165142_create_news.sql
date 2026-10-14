create table public.news (
  id text primary key,
  sort_order int not null unique,
  title text not null,
  image_src text not null,
  category text not null check (category in ('lanzamientos', 'actualizaciones', 'guias', 'esports', 'sura')),
  published_at date not null,
  read_minutes int not null check (read_minutes > 0),
  body jsonb not null check (jsonb_typeof(body) = 'array')
);

alter table public.news enable row level security;

create policy "News are readable by everyone"
  on public.news for select
  to anon, authenticated
  using (true);

grant select on public.news to anon, authenticated;