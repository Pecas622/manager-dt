-- C15 Manager V2 — minutos jugados por partido, por tramos de entrada/salida
-- Correr después de 0005_matches.sql (y 0003_roles.sql para auth_role()).
--
-- El profe anota cada tramo que un jugador estuvo en cancha en un partido
-- (entró al min X, salió al min Y — puede haber varios tramos por jugador
-- si volvió a entrar). El total jugado sale de sumar los tramos, no se
-- guarda un número aparte que se pueda desincronizar.
--
-- Si ya habías corrido una versión anterior de esta migración (con una
-- tabla `match_player_minutes` de un solo campo `minutes`), este script la
-- reemplaza sin problema.

drop table if exists match_player_minutes cascade;

create table if not exists match_substitutions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  in_minute smallint not null check (in_minute >= 0),
  out_minute smallint not null check (out_minute >= in_minute),
  created_at timestamptz not null default now()
);

create index if not exists idx_match_substitutions_match on match_substitutions (match_id);
create index if not exists idx_match_substitutions_player on match_substitutions (player_id);

alter table match_substitutions enable row level security;

-- Lectura general (el jugador puede ver sus propios tramos); escritura para
-- DT y Profesor, igual que el resto de la planificación física/deportiva.
create policy "match_substitutions_select_all" on match_substitutions
  for select to authenticated using (true);
create policy "match_substitutions_write" on match_substitutions
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "match_substitutions_update" on match_substitutions
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "match_substitutions_delete" on match_substitutions
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
