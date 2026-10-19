create table public.tournament_prizes (
tournament_id text not null references public.tournaments (id) on delete cascade,
position int not null check (position between 1 and 10),
amount int check (amount > 0),
primary key (tournament_id, position)
);

create table public.tournament_participants (
tournament_id text not null references public.tournaments (id) on delete cascade,
player_id text not null references public.players (id) on delete cascade,
position int not null check (position > 0),
primary key (tournament_id, player_id),
unique (tournament_id, position)
);

create index on public.tournament_participants (player_id);

alter table public.tournament_prizes enable row level security;
alter table public.tournament_participants enable row level security;

create policy "Tournament prizes are readable by everyone"
  on public.tournament_prizes for select
  to anon, authenticated
  using (true);

create policy "Tournament participants are readable by everyone"
  on public.tournament_participants for select
  to anon, authenticated
  using (true);

grant select on public.tournament_prizes to anon, authenticated;
grant select on public.tournament_participants to anon, authenticated;