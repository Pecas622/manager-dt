-- C15 Manager — Row Level Security
-- App mono-usuario (un solo entrenador autenticado). Cualquier usuario
-- autenticado con Supabase Auth tiene acceso completo; el rol anon no
-- tiene ningún acceso.

alter table players enable row level security;
alter table training_sessions enable row level security;
alter table training_exercises enable row level security;
alter table session_exercises enable row level security;
alter table player_evaluations enable row level security;
alter table training_player_notes enable row level security;

create policy "authenticated_all_players" on players
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_training_sessions" on training_sessions
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_training_exercises" on training_exercises
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_session_exercises" on session_exercises
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_player_evaluations" on player_evaluations
  for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_training_player_notes" on training_player_notes
  for all
  to authenticated
  using (true)
  with check (true);
