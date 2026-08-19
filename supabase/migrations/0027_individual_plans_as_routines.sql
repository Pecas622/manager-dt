-- C15 Manager V2 — Planes individuales pasan a ser Rutinas
-- Correr después de 0022_routine_groups_circuits.sql y 0013_individual_plans.sql.
--
-- Un Plan Individual deja de ser un sistema aparte (con su propia biblioteca
-- de ejercicios tácticos): pasa a ser una Rutina más — mismo editor de
-- ejercicios/grupos/circuitos, misma biblioteca physical_exercises — pero
-- con `player_id` seteado (privada de ESE jugador, no una plantilla
-- reutilizable) más metadata de plan (objetivo, tipo, zona, intensidad,
-- duración, estado) y progresión de series/reps semana a semana por
-- ejercicio. Las rutinas "de plantilla" (player_id null, asignables por
-- fecha a categoría/jugadores vía routine_assignments) siguen igual.

alter table routines add column if not exists player_id uuid references players (id) on delete cascade;
alter table routines add column if not exists objective text;
alter table routines add column if not exists plan_type text check (plan_type in (
  'Fuerza', 'Movilidad', 'Rehabilitación', 'Resistencia', 'Prevención'
));
alter table routines add column if not exists focus_area text check (focus_area in (
  'Tren inferior', 'Tren superior', 'Core', 'General'
));
alter table routines add column if not exists intensity text check (intensity in ('Baja', 'Media', 'Alta'));
alter table routines add column if not exists start_date date;
alter table routines add column if not exists duration_weeks smallint check (duration_weeks is null or duration_weeks > 0);
alter table routines add column if not exists session_duration_minutes smallint;
alter table routines add column if not exists status text not null default 'Activa' check (status in ('Activa', 'Archivada'));

create index if not exists idx_routines_player on routines (player_id);

-- Progresión semana a semana por ejercicio de rutina (reemplaza a
-- individual_plan_exercise_weeks). La tabla aplica a cualquier
-- routine_exercise, aunque en la práctica solo se usa en rutinas con
-- player_id (planes individuales).
create table if not exists routine_exercise_weeks (
  id uuid primary key default gen_random_uuid(),
  routine_exercise_id uuid not null references routine_exercises (id) on delete cascade,
  week_number smallint not null check (week_number > 0),
  sets smallint,
  reps text,
  unique (routine_exercise_id, week_number)
);

create index if not exists idx_routine_exercise_weeks_exercise on routine_exercise_weeks (routine_exercise_id);

-- No hay forma de migrar 1 a 1 individual_plans -> routines (nombres de
-- columna distintos, `type`/`description` -> `plan_type`/`notes`). Si ya
-- hay planes individuales cargados en producción, hay que recrearlos a
-- mano después de correr esta migración.
drop table if exists individual_plan_exercise_weeks;
drop table if exists individual_plan_exercises;
drop table if exists individual_plans;

-- =========================================================
-- RLS: una rutina privada (player_id seteado = plan individual) deja de
-- ser visible para "todo autenticado" — mismo criterio que tenían los
-- planes individuales (solo dt/profesor). Las rutinas de plantilla
-- (player_id null) siguen visibles para todos como hasta ahora.
-- =========================================================

drop policy if exists "routines_select_all" on routines;
create policy "routines_select" on routines
  for select to authenticated
  using (player_id is null or auth_role() in ('dt', 'profesor'));

drop policy if exists "routine_exercises_select_all" on routine_exercises;
create policy "routine_exercises_select" on routine_exercises
  for select to authenticated
  using (
    exists (
      select 1 from routines r
      where r.id = routine_exercises.routine_id
        and (r.player_id is null or auth_role() in ('dt', 'profesor'))
    )
  );

drop policy if exists "routine_groups_select_all" on routine_groups;
create policy "routine_groups_select" on routine_groups
  for select to authenticated
  using (
    exists (
      select 1 from routines r
      where r.id = routine_groups.routine_id
        and (r.player_id is null or auth_role() in ('dt', 'profesor'))
    )
  );

drop policy if exists "routine_circuits_select_all" on routine_circuits;
create policy "routine_circuits_select" on routine_circuits
  for select to authenticated
  using (
    exists (
      select 1 from routine_groups g
      join routines r on r.id = g.routine_id
      where g.id = routine_circuits.group_id
        and (r.player_id is null or auth_role() in ('dt', 'profesor'))
    )
  );

alter table routine_exercise_weeks enable row level security;

create policy "routine_exercise_weeks_select" on routine_exercise_weeks
  for select to authenticated
  using (
    exists (
      select 1 from routine_exercises re
      join routines r on r.id = re.routine_id
      where re.id = routine_exercise_weeks.routine_exercise_id
        and (r.player_id is null or auth_role() in ('dt', 'profesor'))
    )
  );
create policy "routine_exercise_weeks_write" on routine_exercise_weeks
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_exercise_weeks_update" on routine_exercise_weeks
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "routine_exercise_weeks_delete" on routine_exercise_weeks
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
