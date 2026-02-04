
-- Create the games table
create table if not exists public.games (
  id text primary key,
  state jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.games enable row level security;

-- Create policy to allow all access (since we have anonymous users)
create policy "Enable read access for all users" on public.games
  for select using (true);

create policy "Enable insert access for all users" on public.games
  for insert with check (true);

create policy "Enable update access for all users" on public.games
  for update using (true);
