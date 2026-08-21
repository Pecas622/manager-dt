-- C15 Manager V3 — fundacional: categorías (C15/C17/C20/Primera)
-- Correr después de 0030_position_poste_ala.sql.
--
-- Fase A del pase a multi-categoría: el club maneja varias categorías desde
-- la misma app, cada una como si fuera su propio equipo. No hay tabla
-- `categories` — son 4 valores fijos (mismo patrón que `position`, `type`
-- de becado, etc.), validados con un check en cada tabla que la usa.
--
-- Acceso: el DT sigue viendo TODAS las categorías sin restricción (no
-- necesita filas en `profile_categories`). Una cuenta Profesor se limita a
-- las categorías que tenga vinculadas ahí. Una cuenta Jugador ve solo la
-- categoría de su propio jugador (ya alcanza con `profiles.player_id`, no
-- hace falta vincularla aparte).
--
-- Esta migración solo toca `players` (Fase A). El resto de las tablas
-- (entrenamientos, partidos, rutinas, Nacional, evaluaciones, tests) se
-- suman en fases siguientes — hasta entonces siguen sin distinguir
-- categoría, como hoy.

create table if not exists profile_categories (
  profile_id uuid not null references profiles (id) on delete cascade,
  category text not null check (category in ('C15', 'C17', 'C20', 'Primera')),
  primary key (profile_id, category)
);

alter table profile_categories enable row level security;

-- Mismo criterio que `profiles`: cada uno lee su propio vínculo, el DT lee
-- todos; solo el DT escribe.
create policy "profile_categories_select_own_or_dt" on profile_categories
  for select to authenticated using (profile_id = auth.uid() or auth_role() = 'dt');
create policy "profile_categories_write_dt" on profile_categories
  for insert to authenticated with check (auth_role() = 'dt');
create policy "profile_categories_delete_dt" on profile_categories
  for delete to authenticated using (auth_role() = 'dt');

-- Categorías visibles para el usuario actual. Jugador las resuelve solo
-- (vía su jugador vinculado); el resto (Profesor, Coordinador) sale de
-- profile_categories. El DT bypassea esto en cada policy (auth_role() =
-- 'dt' siempre gana), así que no necesita filas acá.
create or replace function auth_categories()
returns text[]
language sql
security definer
stable
set search_path = public
as $$
  select case
    when (select role from profiles where id = auth.uid()) = 'jugador' then
      array(
        select p.category from players p
        join profiles pr on pr.player_id = p.id
        where pr.id = auth.uid()
      )
    else
      coalesce(
        (select array_agg(category) from profile_categories where profile_id = auth.uid()),
        '{}'
      )
  end
$$;

-- `players`: agrega la categoría. Todo lo ya cargado (17+ jugadores
-- reales) pasa a C15 — es el plantel e historial que ya venían manejando.
alter table players add column if not exists category text;
update players set category = 'C15' where category is null;
alter table players alter column category set not null;
alter table players add constraint players_category_check
  check (category in ('C15', 'C17', 'C20', 'Primera'));

create index if not exists idx_players_category on players (category);

drop policy if exists "players_select_team" on players;
create policy "players_select" on players
  for select to authenticated
  using (auth_role() = 'dt' or category = any(auth_categories()));

-- Alta sigue siendo exclusiva del DT (sin cambios respecto a
-- `players_write_dt` de 0003_roles.sql — el DT ya bypassea cualquier
-- policy por rol, esta no necesita tocarse).

drop policy if exists "players_update_dt" on players;
create policy "players_update" on players
  for update to authenticated
  using (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())))
  with check (auth_role() = 'dt' or (auth_role() = 'profesor' and category = any(auth_categories())));

-- Eliminar sigue siendo exclusivo del DT (sin cambios, ver 0003_roles.sql).
