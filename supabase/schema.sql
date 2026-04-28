create table public.memes (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  recipe jsonb not null,
  background jsonb not null,
  phrase jsonb not null,
  created_at timestamp with time zone default timezone('utc', now())
);

create index memes_user_id_idx on public.memes(user_id);

-- RLS 비활성화 (MVP 단계)
alter table public.memes disable row level security;
