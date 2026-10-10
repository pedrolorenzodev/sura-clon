alter table public.games
  add column in_catalog boolean not null default true,
  add column gallery text[] not null default '{}';