-- C15 Manager V2 — Goles por partido + estadísticas manuales en Nacional
-- Correr después de 0005_matches.sql, 0006_nationals.sql y 0003_roles.sql.
--
-- 1) match_goals: gol como evento de partido, mismo criterio que
--    match_cards (jugador + minuto opcional). Sin asistencias — fuera de
--    alcance, igual que la tarjeta roja.
-- 2) national_player_costs suma minutos/amarillas/azules/goles como campos
--    manuales (igual que Vuelo/Alojamiento/Comida/Traslado) — a pedido del
--    DT, en vez de sumarse solos desde la Planilla de cada partido del
--    Nacional. Quedan sueltos: cargar la Planilla de un partido de este
--    Nacional no actualiza estos campos, y viceversa.

create table if not exists match_goals (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  minute smallint check (minute >= 0),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_match_goals_match on match_goals (match_id);
create index if not exists idx_match_goals_player on match_goals (player_id);

alter table match_goals enable row level security;

create policy "match_goals_select_all" on match_goals
  for select to authenticated using (true);
create policy "match_goals_write" on match_goals
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "match_goals_update" on match_goals
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "match_goals_delete" on match_goals
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

alter table national_player_costs add column if not exists minutes_played smallint not null default 0;
alter table national_player_costs add column if not exists yellow_cards smallint not null default 0;
alter table national_player_costs add column if not exists blue_cards smallint not null default 0;
alter table national_player_costs add column if not exists goals smallint not null default 0;
