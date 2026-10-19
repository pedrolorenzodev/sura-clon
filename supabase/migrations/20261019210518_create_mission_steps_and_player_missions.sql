create table public.mission_steps (
  mission_id text not null references public.missions (id) on delete cascade,
  position int not null check (position > 0),
  text text not null,
  primary key (mission_id, position)
);

create table public.player_missions (
  player_id text not null references public.players (id) on delete cascade,
  mission_id text not null references public.missions (id) on delete cascade,
  primary key (player_id, mission_id)
);

create index on public.player_missions (mission_id);

alter table public.mission_steps enable row level security;
alter table public.player_missions enable row level security;

create policy "Mission steps are readable by everyone"
  on public.mission_steps for select
  to anon, authenticated
  using (true);

create policy "Player missions are readable by everyone"
  on public.player_missions for select
  to anon, authenticated
  using (true);

grant select on public.mission_steps to anon, authenticated;
grant select on public.player_missions to anon, authenticated;