create table public.tournaments (
  id text primary key,
  sort_order int not null unique,
  game text not null,
  title text not null,
  starts_at timestamptz not null,
  starts_in_seconds int not null check (starts_in_seconds > 0),
  prize_amount int not null check (prize_amount > 0),
  prize_currency text not null check (prize_currency in ('USDC')),
  mode text check (mode in ('Battle Royale', 'Eliminación', 'Liga')),
  format text not null check (format in ('1v1', '3v3', '4v4', '5v5', '6v6')),
  joined int not null check (joined >= 0),
  capacity int not null check (capacity > 0),
  host text not null,
  official boolean not null default false,
  about text not null,
  image_src text not null,
  hero_src text not null,
  banner_src text not null,
  check (joined <= capacity)
);

alter table public.tournaments enable row level security;

create policy "Tournaments are readable by everyone"
  on public.tournaments for select
  to anon, authenticated
  using (true);

grant select on public.tournaments to anon, authenticated;