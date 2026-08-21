-- C15 Manager V3 — Fase D de multi-categoría: Nacional
-- Correr después de 0033_categories_routines.sql.
--
-- Gastos/Jugadores del Nacional (national_expenses, national_player_costs,
-- national_payments) siguen siendo 100% DT-only (0006/0026, sin cambios) —
-- el DT bypassea la categoría en cualquier policy, así que no hace falta
-- tocarlas. Solo se scopea lo que ya era visible para Profesor:
-- nationals (info) y national_activities (Calendario, desde 0028).

alter table nationals add column if not exists category text;
update nationals set category = 'C15' where category is null;
alter table nationals alter column category set not null;
alter table nationals add constraint nationals_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));
create index if not exists idx_nationals_category on nationals (category);

drop policy if exists "nationals_select" on nationals;
create policy "nationals_select" on nationals
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));
-- Alta/edición/borrado siguen exclusivos del DT (sin cambios, 0028).

drop policy if exists "national_activities_all" on national_activities;
create policy "national_activities_select" on national_activities
  for select to authenticated
  using (
    exists (
      select 1 from nationals n where n.id = national_activities.national_id
        and (auth_role() = 'dt' or n.category = any(auth_categories()))
    )
  );
create policy "national_activities_write" on national_activities
  for insert to authenticated
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from nationals n where n.id = national_activities.national_id
          and n.category = any(auth_categories())
      )
    )
  );
create policy "national_activities_update" on national_activities
  for update to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from nationals n where n.id = national_activities.national_id
          and n.category = any(auth_categories())
      )
    )
  )
  with check (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from nationals n where n.id = national_activities.national_id
          and n.category = any(auth_categories())
      )
    )
  );
create policy "national_activities_delete" on national_activities
  for delete to authenticated
  using (
    auth_role() = 'dt' or (
      auth_role() = 'profesor' and exists (
        select 1 from nationals n where n.id = national_activities.national_id
          and n.category = any(auth_categories())
      )
    )
  );
