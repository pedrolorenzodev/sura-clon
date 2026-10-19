create table public.missions (
  id text primary key,
  sort_order int not null unique,
  title text not null,
  description text not null,
  reward_points int not null check (reward_points > 0),
  image_src text not null,
  category text not null check (category in ('sociales', 'sura', 'eventos')),
  ended boolean not null default false,
  featured boolean not null default false,
  highlighted boolean not null default false,
  home_position int unique check (home_position > 0)
);

alter table public.missions enable row level security;

create policy "Missions are readable by everyone"
  on public.missions for select
  to anon, authenticated
  using (true);

grant select on public.missions to anon, authenticated;