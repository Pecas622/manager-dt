-- C15 Manager V2 — rol Coordinador + becados del club + control de acceso
-- Correr después de 0003_roles.sql.
--
-- El Coordinador es un rol de club, no de la categoría C15: gestiona la
-- lista de becados (nombre + DNI) para que seguridad los deje pasar, y no
-- tiene por qué ver entrenamientos, evaluaciones, rutinas, etc. Por eso acá
-- también se endurecen las policies de "select_all" que antes le daban
-- lectura a *cualquier* usuario autenticado — ahora quedan limitadas a
-- dt/profesor/jugador, que son los roles que sí forman parte del día a día
-- de la categoría.

-- =========================================================
-- 1) Habilitar el rol 'coordinador'
-- =========================================================
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('dt', 'profesor', 'jugador', 'coordinador'));

-- =========================================================
-- 2) Endurecer lectura: excluir a 'coordinador' de las tablas deportivas
-- =========================================================
drop policy if exists "players_select_all" on players;
create policy "players_select_team" on players
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "training_sessions_select_all" on training_sessions;
create policy "training_sessions_select_team" on training_sessions
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "training_exercises_select_all" on training_exercises;
create policy "training_exercises_select_team" on training_exercises
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "session_exercises_select_all" on session_exercises;
create policy "session_exercises_select_team" on session_exercises
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "training_player_notes_select_all" on training_player_notes;
create policy "training_player_notes_select_team" on training_player_notes
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "physical_exercises_select_all" on physical_exercises;
create policy "physical_exercises_select_team" on physical_exercises
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "routines_select_all" on routines;
create policy "routines_select_team" on routines
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "routine_exercises_select_all" on routine_exercises;
create policy "routine_exercises_select_team" on routine_exercises
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "routine_assignments_select_all" on routine_assignments;
create policy "routine_assignments_select_team" on routine_assignments
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "routine_assignment_players_select_all" on routine_assignment_players;
create policy "routine_assignment_players_select_team" on routine_assignment_players
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "matches_select_all" on matches;
create policy "matches_select_team" on matches
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "match_substitutions_select_all" on match_substitutions;
create policy "match_substitutions_select_team" on match_substitutions
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

drop policy if exists "physical_tests_select_all" on physical_tests;
create policy "physical_tests_select_team" on physical_tests
  for select to authenticated using (auth_role() in ('dt', 'profesor', 'jugador'));

-- =========================================================
-- 3) Tabla de becados
-- =========================================================
create table if not exists becados (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  dni text not null unique,
  status text not null default 'Activo' check (status in ('Activo', 'Inactivo')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_becados_dni on becados (dni);

create trigger trg_becados_updated_at
  before update on becados
  for each row execute function set_updated_at();

alter table becados enable row level security;

-- Solo el Coordinador puede ver y editar la lista completa. Nadie más
-- (ni siquiera DT) tiene una policy que le dé acceso a esta tabla — RLS
-- deniega por default. La consulta de seguridad en la puerta NO pasa por
-- acá: usa la función `check_becado` de abajo, que no expone la tabla.
create policy "becados_all_coordinador" on becados
  for all
  to authenticated
  using (auth_role() = 'coordinador')
  with check (auth_role() = 'coordinador');

-- =========================================================
-- 4) Función pública de consulta (para la pantalla de seguridad, sin login)
-- =========================================================
-- Devuelve solo si el DNI corresponde a un becado activo, y su nombre para
-- que seguridad pueda confirmar identidad — nunca la tabla completa ni el
-- DNI de otras personas. `security definer` para poder leer `becados` pese
-- a que su RLS solo permite `coordinador`.
create or replace function check_becado(p_dni text)
returns table (is_becado boolean, first_name text, last_name text)
language sql
security definer
stable
set search_path = public
as $$
  select
    exists (
      select 1 from becados b
      where b.dni = p_dni and b.status = 'Activo'
    ) as is_becado,
    b.first_name,
    b.last_name
  from becados b
  where b.dni = p_dni and b.status = 'Activo'
  union all
  select false, null, null
  where not exists (
    select 1 from becados b where b.dni = p_dni and b.status = 'Activo'
  )
  limit 1;
$$;

-- Ejecutable sin login (la pantalla de seguridad no autentica) y también
-- estando autenticado.
grant execute on function check_becado(text) to anon, authenticated;
