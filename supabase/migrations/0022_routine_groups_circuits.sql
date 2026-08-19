-- C15 Manager V2 — Grupos y circuitos dentro de una Rutina
-- Correr después de 0004_routines.sql y 0003_roles.sql (usa `auth_role()`).
--
-- Capa OPCIONAL encima de lo que ya existe: una rutina sigue pudiendo ser
-- una lista plana de ejercicios (routine_exercises.circuit_id null, se
-- muestra como siempre). Si se le agregan Grupos, cada uno con sus
-- Circuitos numerados y ejercicios adentro, se muestra como un cartel de
-- entrenamiento por grupos (ej. "Grupo 1 (Fuerza & Potencia)", Circuito 1,
-- 2, 3...) — formato real de planificación física en clubes de fútsal.
--
-- Los ejercicios de un circuito pueden salir de la biblioteca
-- (physical_exercises) o ser sueltos (ad_hoc_name), igual que ya funciona
-- en Planes individuales — el cartel de referencia tiene ejercicios muy
-- puntuales que no vale la pena forzar a precargar en la biblioteca.

create table if not exists routine_groups (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references routines (id) on delete cascade,
  name text not null,
  focus text,
  "order" smallint not null default 0
);

create index if not exists idx_routine_groups_routine on routine_groups (routine_id, "order");

create table if not exists routine_circuits (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references routine_groups (id) on delete cascade,
  "order" smallint not null default 0
);

create index if not exists idx_routine_circuits_group on routine_circuits (group_id, "order");

alter table routine_exercises add column if not exists circuit_id uuid references routine_circuits (id) on delete cascade;
alter table routine_exercises add column if not exists ad_hoc_name text;
alter table routine_exercises alter column exercise_id drop not null;

alter table routine_exercises drop constraint if exists routine_exercises_source;
alter table routine_exercises add constraint routine_exercises_source check (
  exercise_id is not null or ad_hoc_name is not null
);

create index if not exists idx_routine_exercises_circuit on routine_exercises (circuit_id, "order");

alter table routine_groups enable row level security;
alter table routine_circuits enable row level security;

create policy "routine_groups_select_all" on routine_groups
  for select to authenticated using (true);
create policy "routine_groups_write" on routine_groups
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_groups_update" on routine_groups
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "routine_groups_delete" on routine_groups
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

create policy "routine_circuits_select_all" on routine_circuits
  for select to authenticated using (true);
create policy "routine_circuits_write" on routine_circuits
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_circuits_delete" on routine_circuits
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
