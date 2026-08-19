-- C15 Manager V2 — Resultado y faltas acumuladas por período
-- Correr después de 0005_matches.sql y 0003_roles.sql (usa `auth_role()`).
--
-- Resultado (goles a favor/en contra) y faltas acumuladas por período
-- (propias de futsal: a partir de la 6ª falta del equipo en el período, el
-- rival ejecuta doble penal a 10 m). Se cargan después del partido, junto
-- con la Planilla — mismo criterio que el número de camiseta (0016): se
-- amplía "update" de matches a Profesor, que es quien suele completar esto.
-- Alta y baja de partidos siguen siendo exclusivas del DT.

alter table matches add column if not exists goals_for smallint check (goals_for >= 0);
alter table matches add column if not exists goals_against smallint check (goals_against >= 0);
alter table matches add column if not exists fouls_us_1h smallint check (fouls_us_1h >= 0);
alter table matches add column if not exists fouls_them_1h smallint check (fouls_them_1h >= 0);
alter table matches add column if not exists fouls_us_2h smallint check (fouls_us_2h >= 0);
alter table matches add column if not exists fouls_them_2h smallint check (fouls_them_2h >= 0);

drop policy if exists "matches_update_dt" on matches;
create policy "matches_update_dt" on matches
  for update to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
