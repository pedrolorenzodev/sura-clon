create table public.leaderboard_entries (
  metric text not null check (metric in ('sura-points', 'medallas', 'racha', 'eventos')),
  period text not null check (period in ('historico', 'mensual', 'semanal', 'diario')),
  player_id text not null references public.players (id) on delete cascade,
  position int not null check (position > 0),
  points int not null check (points >= 0),
  medal_count int not null check (medal_count >= 0),
  streak int not null check (streak >= 0),
  events int not null check (events >= 0),
  primary key (metric, period, player_id)
);

create index on public.leaderboard_entries (player_id);

alter table public.leaderboard_entries enable row level security;

create policy "Leaderboard entries are readable by everyone"
  on public.leaderboard_entries for select
  to anon, authenticated
  using (true);

grant select on public.leaderboard_entries to anon, authenticated;