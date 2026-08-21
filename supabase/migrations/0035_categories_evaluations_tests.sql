-- C15 Manager V3 — Fase E de multi-categoría: Evaluaciones y Tests físicos
-- Correr después de 0034_categories_nationals.sql.
--
-- Ninguna de las dos tablas suma columna propia — se scopean vía
-- players.category, uniendo por player_id (mismo criterio que
-- routine_exercises desde 0027).
--
-- `player_evaluations` NO se toca: sigue siendo 100% DT-only (select y
-- escritura), como quedó definido a propósito desde el inicio — el DT
-- bypassea la categoría en cualquier policy, y ningún otro rol tiene ni
-- tendrá acceso acá, así que no hay nada que scopear por categoría.

drop policy if exists "physical_tests_select_team" on physical_tests;
create policy "physical_tests_select" on physical_tests
  for select to authenticated
  using (
    exists (
      select 1 from players p where p.id = physical_tests.player_id
        and (auth_role() = 'dt' or p.category = any(auth_categories()))
    )
  );

drop policy if exists "physical_tests_write" on physical_tests;
create policy "physical_tests_write" on physical_tests
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from players p where p.id = physical_tests.player_id and p.category = any(auth_categories())
      )
    )
  );

drop policy if exists "physical_tests_update" on physical_tests;
create policy "physical_tests_update" on physical_tests
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from players p where p.id = physical_tests.player_id and p.category = any(auth_categories())
      )
    )
  )
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from players p where p.id = physical_tests.player_id and p.category = any(auth_categories())
      )
    )
  );

drop policy if exists "physical_tests_delete" on physical_tests;
create policy "physical_tests_delete" on physical_tests
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from players p where p.id = physical_tests.player_id and p.category = any(auth_categories())
      )
    )
  );

-- physical_test_reps: select estaba abierto a cualquier autenticado
-- (using true, incluía a Coordinador) — se corrige de paso, mismo join
-- hasta el jugador vía physical_tests.
drop policy if exists "physical_test_reps_select_all" on physical_test_reps;
create policy "physical_test_reps_select" on physical_test_reps
  for select to authenticated
  using (
    exists (
      select 1 from physical_tests t join players p on p.id = t.player_id
      where t.id = physical_test_reps.test_id
        and (auth_role() = 'dt' or p.category = any(auth_categories()))
    )
  );

drop policy if exists "physical_test_reps_write" on physical_test_reps;
create policy "physical_test_reps_write" on physical_test_reps
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from physical_tests t join players p on p.id = t.player_id
        where t.id = physical_test_reps.test_id and p.category = any(auth_categories())
      )
    )
  );

drop policy if exists "physical_test_reps_update" on physical_test_reps;
create policy "physical_test_reps_update" on physical_test_reps
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from physical_tests t join players p on p.id = t.player_id
        where t.id = physical_test_reps.test_id and p.category = any(auth_categories())
      )
    )
  )
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from physical_tests t join players p on p.id = t.player_id
        where t.id = physical_test_reps.test_id and p.category = any(auth_categories())
      )
    )
  );

drop policy if exists "physical_test_reps_delete" on physical_test_reps;
create policy "physical_test_reps_delete" on physical_test_reps
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from physical_tests t join players p on p.id = t.player_id
        where t.id = physical_test_reps.test_id and p.category = any(auth_categories())
      )
    )
  );
