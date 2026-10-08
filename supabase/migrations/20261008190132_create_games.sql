create table public.games (
  id text primary key,
  sort_order int not null unique,
  title text not null,
  about text not null,
  badges text[] not null default '{}',
  genres text[] not null default '{}' check (genres <@ array['accion', 'aventura', 'casual', 'estrategia', 'rpg']),
  platforms text[] not null default '{}' check (platforms <@ array['pc', 'consola', 'mobile', 'web']),
  statuses text[] not null default '{}' check (statuses <@ array['disponible', 'beta', 'proximamente']),
  socials text[] not null default '{}' check (socials <@ array['discord', 'x', 'instagram', 'youtube', 'twitch', 'tiktok']),
  image_src text not null,
  hero_src text not null,
  rating numeric(2,1) not null check (rating between 0 and 5),
  reviews_count int not null check (reviews_count >= 0)
);

alter table public.games enable row level security;

create policy "Games are readable by everyone"
  on public.games for select
  to anon, authenticated
  using (true);

grant select on public.games to anon, authenticated;