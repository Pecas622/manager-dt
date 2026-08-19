-- C15 Manager V2 — tarjetas amarillas por partido
-- Correr después de 0005_matches.sql (usa `matches`, `players`) y
-- 0003_roles.sql (usa `auth_role()`).
--
-- Solo tarjetas amarillas (así lo pidió el DT) — sin distinguir roja ni
-- doble amarilla. Atada a un partido, igual que los minutos jugados
-- (`match_substitutions`): el total de cada jugador sale de sumar las de
-- todos sus partidos, no se guarda un contador aparte.

create table if not exists match_cards (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  minute smallint check (minute >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_match_cards_match on match_cards (match_id);
create index if not exists idx_match_cards_player on match_cards (player_id);

alter table match_cards enable row level security;

-- Lectura general (el jugador puede ver sus propias tarjetas); escritura
-- para DT y Profesor, igual que match_substitutions.
create policy "match_cards_select_all" on match_cards
  for select to authenticated using (true);
create policy "match_cards_write" on match_cards
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "match_cards_update" on match_cards
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "match_cards_delete" on match_cards
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
