create table public.players (
  id text primary key,
  name text not null,
  avatar_src text not null,
  level text not null check (level in ('novato', 'guerrero', 'heroe', 'leyenda')),
  points int not null check (points >= 0),
  medal_count int not null check (medal_count >= 0),
  streak int not null check (streak >= 0),
  events int not null check (events >= 0),
  historic_rank int not null unique check (historic_rank > 0),
  days_at_rank int not null check (days_at_rank > 0)
);

alter table public.players enable row level security;

create policy "Players are readable by everyone"
  on public.players for select
  to anon, authenticated
  using (true);

grant select on public.players to anon, authenticated;