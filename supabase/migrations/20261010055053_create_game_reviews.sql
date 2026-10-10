create table public.game_reviews (
  game_id text not null references public.games (id) on delete cascade,
  id text not null,
  sort_order int not null,
  author text not null,
  avatar_src text not null,
  time_label text not null,
  rating int check (rating between 1 and 5),
  text text not null,
  likes int not null default 0 check (likes >= 0),
  liked boolean not null default false,
  primary key (game_id, id),
  unique (game_id, sort_order)
);

alter table public.game_reviews enable row level security;

create policy "Game reviews are readable by everyone"
  on public.game_reviews for select
  to anon, authenticated
  using (true);

grant select on public.game_reviews to anon, authenticated;