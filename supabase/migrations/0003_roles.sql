-- C15 Manager V2 — roles (DT / Profesor / Jugador)
-- Correr después de 0001_init.sql y 0002_rls.sql.

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('dt', 'profesor', 'jugador')),
  player_id uuid references players (id) on delete set null,
  full_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on profiles (role);
create index if not exists idx_profiles_player on profiles (player_id);

-- Funciones security definer: permiten que las policies de RLS lean el rol
-- del usuario actual sin caer en recursión (una policy de `profiles` que
-- consultara `profiles` directamente se llamaría a sí misma).
create or replace function auth_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from profiles where id = auth.uid()
$$;

create or replace function auth_player_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select player_id from profiles where id = auth.uid()
$$;

alter table profiles enable row level security;

create policy "profiles_select_own_or_dt" on profiles
  for select
  to authenticated
  using (id = auth.uid() or auth_role() = 'dt');

create policy "profiles_write_dt" on profiles
  for insert
  to authenticated
  with check (auth_role() = 'dt');

create policy "profiles_update_dt" on profiles
  for update
  to authenticated
  using (auth_role() = 'dt')
  with check (auth_role() = 'dt');

create policy "profiles_delete_dt" on profiles
  for delete
  to authenticated
  using (auth_role() = 'dt');

-- =========================================================
-- Restringe las tablas V1: antes cualquier autenticado podía escribir
-- (0002_rls.sql), ahora solo el DT. Profesor y Jugador quedan con lectura
-- general para poder ver jugadores, el plan de entrenamiento y sumar sus
-- propios módulos (rutinas) sin pisar lo del DT.
-- =========================================================

drop policy if exists "authenticated_all_players" on players;
create policy "players_select_all" on players
  for select to authenticated using (true);
create policy "players_write_dt" on players
  for insert to authenticated with check (auth_role() = 'dt');
create policy "players_update_dt" on players
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "players_delete_dt" on players
  for delete to authenticated using (auth_role() = 'dt');

drop policy if exists "authenticated_all_training_sessions" on training_sessions;
create policy "training_sessions_select_all" on training_sessions
  for select to authenticated using (true);
create policy "training_sessions_write_dt" on training_sessions
  for insert to authenticated with check (auth_role() = 'dt');
create policy "training_sessions_update_dt" on training_sessions
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "training_sessions_delete_dt" on training_sessions
  for delete to authenticated using (auth_role() = 'dt');

drop policy if exists "authenticated_all_training_exercises" on training_exercises;
create policy "training_exercises_select_all" on training_exercises
  for select to authenticated using (true);
create policy "training_exercises_write_dt" on training_exercises
  for insert to authenticated with check (auth_role() = 'dt');
create policy "training_exercises_update_dt" on training_exercises
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "training_exercises_delete_dt" on training_exercises
  for delete to authenticated using (auth_role() = 'dt');

drop policy if exists "authenticated_all_session_exercises" on session_exercises;
create policy "session_exercises_select_all" on session_exercises
  for select to authenticated using (true);
create policy "session_exercises_write_dt" on session_exercises
  for insert to authenticated with check (auth_role() = 'dt');
create policy "session_exercises_update_dt" on session_exercises
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "session_exercises_delete_dt" on session_exercises
  for delete to authenticated using (auth_role() = 'dt');

drop policy if exists "authenticated_all_training_player_notes" on training_player_notes;
create policy "training_player_notes_select_all" on training_player_notes
  for select to authenticated using (true);
create policy "training_player_notes_write_dt" on training_player_notes
  for insert to authenticated with check (auth_role() = 'dt');
create policy "training_player_notes_update_dt" on training_player_notes
  for update to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
create policy "training_player_notes_delete_dt" on training_player_notes
  for delete to authenticated using (auth_role() = 'dt');

-- player_evaluations sigue siendo 100% DT-only (lectura y escritura).
drop policy if exists "authenticated_all_player_evaluations" on player_evaluations;
create policy "player_evaluations_all_dt" on player_evaluations
  for all
  to authenticated
  using (auth_role() = 'dt')
  with check (auth_role() = 'dt');
