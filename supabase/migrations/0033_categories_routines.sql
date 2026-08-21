-- C15 Manager V3 — Fase C de multi-categoría: Rutinas y Planes individuales
-- Correr después de 0032_categories_calendar.sql.
--
-- `routines` sirve doble función desde 0027 (plantilla si player_id es
-- null, Plan Individual si está seteado). La categoría solo aplica a las
-- plantillas — un Plan hereda la del jugador vía join, no se duplica acá.
-- routine_assignments (asignar una rutina a una fecha) suma su propia
-- categoría, explícita.

-- =========================================================
-- routines
-- =========================================================
alter table routines add column if not exists category text;
update routines set category = 'C15' where category is null and player_id is null;
alter table routines add constraint routines_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
-- Nota: a diferencia de players/matches/etc., category queda NULLABLE acá
-- (obligatoria solo para plantillas — se valida en la app, no con un check
-- de "not null", porque un Plan individual la deja en null a propósito).

create index if not exists idx_routines_category on routines (category);

drop policy if exists "routines_select" on routines;
create policy "routines_select" on routines
  for select to authenticated
  using (
    auth_role() = 'dt'
    or (player_id is null and category = any(auth_categories()))
    or (
      player_id is not null and auth_role() = 'profesor' and exists (
        select 1 from players p where p.id = routines.player_id and p.category = any(auth_categories())
      )
    )
  );

drop policy if exists "routines_write" on routines;
create policy "routines_write" on routines
  for insert to authenticated
  with check (
    auth_role() = 'dt'
    or (
      auth_role() = 'profesor' and (
        (player_id is null and category = any(auth_categories()))
        or (player_id is not null and exists (
          select 1 from players p where p.id = routines.player_id and p.category = any(auth_categories())
        ))
      )
    )
  );

drop policy if exists "routines_update" on routines;
create policy "routines_update" on routines
  for update to authenticated
  using (
    auth_role() = 'dt'
    or (
      auth_role() = 'profesor' and (
        (player_id is null and category = any(auth_categories()))
        or (player_id is not null and exists (
          select 1 from players p where p.id = routines.player_id and p.category = any(auth_categories())
        ))
      )
    )
  )
  with check (
    auth_role() = 'dt'
    or (
      auth_role() = 'profesor' and (
        (player_id is null and category = any(auth_categories()))
        or (player_id is not null and exists (
          select 1 from players p where p.id = routines.player_id and p.category = any(auth_categories())
        ))
      )
    )
  );

drop policy if exists "routines_delete" on routines;
create policy "routines_delete" on routines
  for delete to authenticated
  using (
    auth_role() = 'dt'
    or (
      auth_role() = 'profesor' and (
        (player_id is null and category = any(auth_categories()))
        or (player_id is not null and exists (
          select 1 from players p where p.id = routines.player_id and p.category = any(auth_categories())
        ))
      )
    )
  );

-- Tablas hijas de routines (routine_exercises, routine_groups,
-- routine_circuits, routine_exercise_weeks): su select ya hacía join hasta
-- routines.player_id (0027) — se extiende el mismo join para también
-- respetar la categoría, con la misma lógica de arriba.
drop policy if exists "routine_exercises_select" on routine_exercises;
create policy "routine_exercises_select" on routine_exercises
  for select to authenticated
  using (
    exists (
      select 1 from routines r where r.id = routine_exercises.routine_id
        and (
          auth_role() = 'dt'
          or (r.player_id is null and r.category = any(auth_categories()))
          or (r.player_id is not null and auth_role() = 'profesor' and exists (
            select 1 from players p where p.id = r.player_id and p.category = any(auth_categories())
          ))
        )
    )
  );

drop policy if exists "routine_groups_select" on routine_groups;
create policy "routine_groups_select" on routine_groups
  for select to authenticated
  using (
    exists (
      select 1 from routines r where r.id = routine_groups.routine_id
        and (
          auth_role() = 'dt'
          or (r.player_id is null and r.category = any(auth_categories()))
          or (r.player_id is not null and auth_role() = 'profesor' and exists (
            select 1 from players p where p.id = r.player_id and p.category = any(auth_categories())
          ))
        )
    )
  );

drop policy if exists "routine_circuits_select" on routine_circuits;
create policy "routine_circuits_select" on routine_circuits
  for select to authenticated
  using (
    exists (
      select 1 from routine_groups g join routines r on r.id = g.routine_id
      where g.id = routine_circuits.group_id
        and (
          auth_role() = 'dt'
          or (r.player_id is null and r.category = any(auth_categories()))
          or (r.player_id is not null and auth_role() = 'profesor' and exists (
            select 1 from players p where p.id = r.player_id and p.category = any(auth_categories())
          ))
        )
    )
  );

drop policy if exists "routine_exercise_weeks_select" on routine_exercise_weeks;
create policy "routine_exercise_weeks_select" on routine_exercise_weeks
  for select to authenticated
  using (
    exists (
      select 1 from routine_exercises re join routines r on r.id = re.routine_id
      where re.id = routine_exercise_weeks.routine_exercise_id
        and (
          auth_role() = 'dt'
          or (r.player_id is null and r.category = any(auth_categories()))
          or (r.player_id is not null and auth_role() = 'profesor' and exists (
            select 1 from players p where p.id = r.player_id and p.category = any(auth_categories())
          ))
        )
    )
  );

-- =========================================================
-- routine_assignments (asignar una rutina a una fecha, para toda la
-- categoría o jugadores puntuales)
-- =========================================================
alter table routine_assignments add column if not exists category text;
update routine_assignments set category = 'C15' where category is null;
alter table routine_assignments alter column category set not null;
alter table routine_assignments add constraint routine_assignments_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
create index if not exists idx_routine_assignments_category on routine_assignments (category);

drop policy if exists "routine_assignments_select_team" on routine_assignments;
create policy "routine_assignments_select" on routine_assignments
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));

drop policy if exists "routine_assignments_write" on routine_assignments;
create policy "routine_assignments_write" on routine_assignments
  for insert to authenticated
  with check (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())));

drop policy if exists "routine_assignments_update" on routine_assignments;
create policy "routine_assignments_update" on routine_assignments
  for update to authenticated
  using (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())))
  with check (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())));

drop policy if exists "routine_assignments_delete" on routine_assignments;
create policy "routine_assignments_delete" on routine_assignments
  for delete to authenticated
  using (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())));

drop policy if exists "routine_assignment_players_select_team" on routine_assignment_players;
create policy "routine_assignment_players_select" on routine_assignment_players
  for select to authenticated
  using (
    exists (
      select 1 from routine_assignments a where a.id = routine_assignment_players.routine_assignment_id
        and (auth_role() = 'dt' or a.category = any(auth_categories()))
    )
  );

drop policy if exists "routine_assignment_players_write" on routine_assignment_players;
create policy "routine_assignment_players_write" on routine_assignment_players
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from routine_assignments a where a.id = routine_assignment_players.routine_assignment_id
          and a.category = any(auth_categories())
      )
    )
  );

drop policy if exists "routine_assignment_players_delete" on routine_assignment_players;
create policy "routine_assignment_players_delete" on routine_assignment_players
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from routine_assignments a where a.id = routine_assignment_players.routine_assignment_id
          and a.category = any(auth_categories())
      )
    )
  );
