-- C15 Manager V3 — Fase B de multi-categoría: Calendario
-- Correr después de 0031_categories_foundation.sql.
--
-- Scopea entrenamientos, partidos y torneos por categoría. Todo lo ya
-- cargado pasa a C15 (igual criterio que 0031 para jugadores).

-- =========================================================
-- training_sessions
-- =========================================================
alter table training_sessions add column if not exists category text;
update training_sessions set category = 'C15' where category is null;
alter table training_sessions alter column category set not null;
alter table training_sessions add constraint training_sessions_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
create index if not exists idx_training_sessions_category on training_sessions (category);

drop policy if exists "training_sessions_select_team" on training_sessions;
create policy "training_sessions_select" on training_sessions
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));
-- Alta/edición/borrado siguen exclusivos del DT (sin cambios, 0003_roles.sql).

drop policy if exists "session_exercises_select_team" on session_exercises;
create policy "session_exercises_select" on session_exercises
  for select to authenticated
  using (
    exists (
      select 1 from training_sessions t where t.id = session_exercises.training_session_id
        and (auth_role() = 'dt' or t.category = any(auth_categories()))
    )
  );

drop policy if exists "training_player_notes_select_team" on training_player_notes;
create policy "training_player_notes_select" on training_player_notes
  for select to authenticated
  using (
    exists (
      select 1 from training_sessions t where t.id = training_player_notes.training_session_id
        and (auth_role() = 'dt' or t.category = any(auth_categories()))
    )
  );

-- =========================================================
-- matches
-- =========================================================
alter table matches add column if not exists category text;
update matches set category = 'C15' where category is null;
alter table matches alter column category set not null;
alter table matches add constraint matches_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
create index if not exists idx_matches_category on matches (category);

drop policy if exists "matches_select_team" on matches;
create policy "matches_select" on matches
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));
-- Alta sigue exclusiva del DT (sin cambios).

drop policy if exists "matches_update_dt" on matches;
create policy "matches_update" on matches
  for update to authenticated
  using (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())))
  with check (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())));
-- Borrado sigue exclusivo del DT (sin cambios).

-- Tablas hijas de matches: select por join; escritura (DT+Profesor en las
-- 4) suma el mismo chequeo de categoría para Profesor.
drop policy if exists "match_substitutions_select_team" on match_substitutions;
create policy "match_substitutions_select" on match_substitutions
  for select to authenticated
  using (
    exists (
      select 1 from matches m where m.id = match_substitutions.match_id
        and (auth_role() = 'dt' or m.category = any(auth_categories()))
    )
  );
drop policy if exists "match_substitutions_write" on match_substitutions;
create policy "match_substitutions_write" on match_substitutions
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_substitutions.match_id
          and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_substitutions_update" on match_substitutions;
create policy "match_substitutions_update" on match_substitutions
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_substitutions.match_id
          and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_substitutions_delete" on match_substitutions;
create policy "match_substitutions_delete" on match_substitutions
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_substitutions.match_id
          and m.category = any(auth_categories())
      )
    )
  );

drop policy if exists "match_cards_select_all" on match_cards;
create policy "match_cards_select" on match_cards
  for select to authenticated
  using (
    exists (
      select 1 from matches m where m.id = match_cards.match_id
        and (auth_role() = 'dt' or m.category = any(auth_categories()))
    )
  );
drop policy if exists "match_cards_write" on match_cards;
create policy "match_cards_write" on match_cards
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_cards.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_cards_update" on match_cards;
create policy "match_cards_update" on match_cards
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_cards.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_cards_delete" on match_cards;
create policy "match_cards_delete" on match_cards
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_cards.match_id and m.category = any(auth_categories())
      )
    )
  );

drop policy if exists "match_goals_select_all" on match_goals;
create policy "match_goals_select" on match_goals
  for select to authenticated
  using (
    exists (
      select 1 from matches m where m.id = match_goals.match_id
        and (auth_role() = 'dt' or m.category = any(auth_categories()))
    )
  );
drop policy if exists "match_goals_write" on match_goals;
create policy "match_goals_write" on match_goals
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_goals.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_goals_update" on match_goals;
create policy "match_goals_update" on match_goals
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_goals.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_goals_delete" on match_goals;
create policy "match_goals_delete" on match_goals
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_goals.match_id and m.category = any(auth_categories())
      )
    )
  );

drop policy if exists "match_injury_notes_select_all" on match_injury_notes;
create policy "match_injury_notes_select" on match_injury_notes
  for select to authenticated
  using (
    exists (
      select 1 from matches m where m.id = match_injury_notes.match_id
        and (auth_role() = 'dt' or m.category = any(auth_categories()))
    )
  );
drop policy if exists "match_injury_notes_write" on match_injury_notes;
create policy "match_injury_notes_write" on match_injury_notes
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_injury_notes.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_injury_notes_update" on match_injury_notes;
create policy "match_injury_notes_update" on match_injury_notes
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_injury_notes.match_id and m.category = any(auth_categories())
      )
    )
  );
drop policy if exists "match_injury_notes_delete" on match_injury_notes;
create policy "match_injury_notes_delete" on match_injury_notes
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from matches m where m.id = match_injury_notes.match_id and m.category = any(auth_categories())
      )
    )
  );

-- =========================================================
-- tournaments
-- =========================================================
alter table tournaments add column if not exists category text;
update tournaments set category = 'C15' where category is null;
alter table tournaments alter column category set not null;
alter table tournaments add constraint tournaments_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
create index if not exists idx_tournaments_category on tournaments (category);

-- `tournaments_select_all` (using true) incluía a Coordinador, que no
-- debería ver nada deportivo — de paso se corrige acá.
drop policy if exists "tournaments_select_all" on tournaments;
create policy "tournaments_select" on tournaments
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));
-- Alta/edición/borrado siguen exclusivos del DT (sin cambios, 0017).
