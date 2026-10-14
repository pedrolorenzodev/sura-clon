create table public.medals (
  id text primary key,
  sort_order int not null unique,
  label text not null,
  art text not null check (art in ('devocion', 'social', 'first-victory', 'consistencia', 'point-collector', 'sharpshooter', 'event-master', 'influencer', 'ranking')),
  sparkle boolean not null default false,
  reward_points int not null check (reward_points > 0)
);

create table public.player_medals (
  player_id text not null references public.players (id) on delete cascade,
  medal_id text not null references public.medals (id) on delete cascade,
  claimed boolean not null default true,
  primary key (player_id, medal_id)
);

create index on public.player_medals (medal_id);

alter table public.medals enable row level security;

alter table public.player_medals enable row level security;

create policy "Medals are readable by everyone"
  on public.medals for select
  to anon, authenticated
  using (true);

create policy "Player medals are readable by everyone"
  on public.player_medals for select
  to anon, authenticated
  using (true);

grant select on public.medals to anon, authenticated;
grant select on public.player_medals to anon, authenticated;