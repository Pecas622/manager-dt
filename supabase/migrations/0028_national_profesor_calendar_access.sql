-- C15 Manager V2 — el Profesor puede planificar lo físico en el Nacional
-- Correr después de 0006_nationals.sql.
--
-- Hasta ahora todo el módulo Nacional era DT-only. El Profesor necesita ver
-- el Nacional (fechas, info) y armar el cronograma físico ahí (Calendario:
-- movilidad, activación, rutinas) igual que ya arma Rutinas para el resto
-- del calendario. Gastos y pagos (national_expenses, national_player_costs,
-- national_payments) siguen siendo exclusivos del DT — son datos
-- financieros, no hace falta que el Profesor los vea ni los toque.

drop policy if exists "nationals_all_dt" on nationals;

create policy "nationals_select" on nationals
  for select to authenticated using (auth_role() in ('dt', 'profesor'));
create policy "nationals_write_dt" on nationals
  for insert to authenticated with check (auth_role() = 'dt');
create policy "nationals_update_dt" on nationals
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "nationals_delete_dt" on nationals
  for delete to authenticated using (auth_role() = 'dt');

drop policy if exists "national_activities_all_dt" on national_activities;

create policy "national_activities_all" on national_activities
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
