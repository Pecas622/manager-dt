-- C15 Manager V2 — repeticiones (cm + ms) por test físico
-- Correr después de 0008_physical_tests.sql.
--
-- Tests de salto tipo Squat Jump / Drop Jump se toman en varias
-- repeticiones, cada una con dos lecturas (cm y ms — el tiempo de vuelo en
-- ms es otra forma de medir el mismo salto), y de ahí se sacan el mayor
-- valor y el promedio — igual que la planilla del profe. `physical_tests`
-- sigue guardando UN valor (`value`/`unit`) que representa el test — para
-- estos casos, el mayor valor en cm — así el resto de la app (ficha,
-- evaluaciones, informe) sigue funcionando sin cambios. Esta tabla nueva es
-- el detalle de repeticiones, opcional: un test de velocidad (una sola
-- lectura) no la usa.

create table if not exists physical_test_reps (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references physical_tests (id) on delete cascade,
  rep_number smallint not null check (rep_number > 0),
  value_cm numeric(7, 2),
  value_ms numeric(7, 2),
  unique (test_id, rep_number)
);

create index if not exists idx_physical_test_reps_test on physical_test_reps (test_id);

alter table physical_test_reps enable row level security;

create policy "physical_test_reps_select_all" on physical_test_reps
  for select to authenticated using (true);
create policy "physical_test_reps_write" on physical_test_reps
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "physical_test_reps_update" on physical_test_reps
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "physical_test_reps_delete" on physical_test_reps
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
