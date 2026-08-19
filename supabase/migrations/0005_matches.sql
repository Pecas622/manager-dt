-- C15 Manager V2 — Partidos
-- Correr después de 0003_roles.sql. `national_id` referencia a `nationals`,
-- que se crea recién en 0006_nationals.sql — por eso esta tabla no tiene la
-- foreign key todavía; se agrega al final de 0006_nationals.sql con
-- `alter table`.

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time,
  opponent text not null,
  location text,
  is_home boolean,
  national_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_matches_date on matches (date);

create trigger trg_matches_updated_at
  before update on matches
  for each row execute function set_updated_at();

alter table matches enable row level security;

create policy "matches_select_all" on matches
  for select to authenticated using (true);
create policy "matches_write_dt" on matches
  for insert to authenticated with check (auth_role() = 'dt');
create policy "matches_update_dt" on matches
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "matches_delete_dt" on matches
  for delete to authenticated using (auth_role() = 'dt');
