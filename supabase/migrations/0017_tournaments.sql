-- C15 Manager V2 — Torneos (agrupador simple de partidos) + molestias
-- musculares por partido.
-- Correr después de 0005_matches.sql (usa `matches`) y 0003_roles.sql (usa
-- `auth_role()`, `profiles`).
--
-- Distinto de "Nacional" (viaje, cronograma día a día y gastos/pagos,
-- exclusivo del DT): un "torneo" acá es solo nombre + fechas, para agrupar
-- partidos regulares (ej. "Apertura 2026"). Visible para DT y Profesor. Un
-- partido puede no pertenecer a ningún torneo (amistosos sueltos, como ya
-- funcionaba).

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date,
  end_date date,
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tournaments_start_date on tournaments (start_date);

create trigger trg_tournaments_updated_at
  before update on tournaments
  for each row execute function set_updated_at();

alter table matches add column if not exists tournament_id uuid references tournaments (id) on delete set null;
create index if not exists idx_matches_tournament on matches (tournament_id);

alter table tournaments enable row level security;

create policy "tournaments_select_all" on tournaments
  for select to authenticated using (true);
create policy "tournaments_write_dt" on tournaments
  for insert to authenticated with check (auth_role() = 'dt');
create policy "tournaments_update_dt" on tournaments
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "tournaments_delete_dt" on tournaments
  for delete to authenticated using (auth_role() = 'dt');

-- Molestias musculares: un texto libre por jugador y partido (no una lista
-- de entradas — se pisa si se vuelve a editar), mismo criterio de RLS que
-- match_cards/match_substitutions.
create table if not exists match_injury_notes (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  note text not null,
  updated_at timestamptz not null default now(),
  unique (match_id, player_id)
);

create index if not exists idx_match_injury_notes_match on match_injury_notes (match_id);

alter table match_injury_notes enable row level security;

create policy "match_injury_notes_select_all" on match_injury_notes
  for select to authenticated using (true);
create policy "match_injury_notes_write" on match_injury_notes
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "match_injury_notes_update" on match_injury_notes
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "match_injury_notes_delete" on match_injury_notes
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
