-- C15 Manager V2 — tests físicos (peso, altura, salto, velocidad, etc.)
-- Correr después de 0003_roles.sql.
--
-- Es una tabla flexible a propósito: el profe puede anotar cualquier tipo
-- de test (no hay una lista cerrada en la base), con su valor y unidad.
-- El frontend ofrece presets comunes (Peso, Altura, Salto vertical,
-- Velocidad 15m, etc.) pero también permite un nombre libre.

create table if not exists physical_tests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players (id) on delete cascade,
  date date not null default current_date,
  test_name text not null,
  value numeric(7, 2) not null,
  unit text,
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_physical_tests_player_date on physical_tests (player_id, date desc);
create index if not exists idx_physical_tests_name on physical_tests (test_name);

alter table physical_tests enable row level security;

-- Lectura general (el jugador puede ver su propia evolución física);
-- escritura para DT y Profesor.
create policy "physical_tests_select_all" on physical_tests
  for select to authenticated using (true);
create policy "physical_tests_write" on physical_tests
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "physical_tests_update" on physical_tests
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "physical_tests_delete" on physical_tests
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
