create table public.events (
  id text primary key,
  sort_order int not null unique,
  tournament_id text not null references public.tournaments (id) on delete cascade,
  description text not null,
  surface text not null check (surface in ('gamepad', 'sunset', 'dota', 'valorant', 'fortnite', 'lol')),
  art text not null check (art in ('domino', 'squad', 'juggernaut', 'reyna', 'omega', 'yone'))
);

create index on public.events (tournament_id);

alter table public.events enable row level security;

create policy "Events are readable by everyone"
  on public.events for select
  to anon, authenticated
  using (true);

grant select on public.events to anon, authenticated;