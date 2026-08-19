-- C15 Manager V2 — módulo Rutinas físicas (Profesor)
-- Correr después de 0003_roles.sql.

create table if not exists physical_exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sets smallint,
  reps text,
  rest_seconds smallint,
  video_url text,
  image_url text,
  instructions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_physical_exercises_updated_at
  before update on physical_exercises
  for each row execute function set_updated_at();

create table if not exists routines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_routines_updated_at
  before update on routines
  for each row execute function set_updated_at();

create table if not exists routine_exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references routines (id) on delete cascade,
  exercise_id uuid not null references physical_exercises (id) on delete restrict,
  "order" smallint not null default 0,
  sets_override smallint,
  reps_override text,
  rest_seconds_override smallint,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_routine_exercises_routine on routine_exercises (routine_id, "order");

create table if not exists routine_assignments (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references routines (id) on delete cascade,
  date date not null,
  assigned_to text not null check (assigned_to in ('categoria', 'jugadores')),
  created_by uuid references profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_routine_assignments_date on routine_assignments (date);

create table if not exists routine_assignment_players (
  id uuid primary key default gen_random_uuid(),
  routine_assignment_id uuid not null references routine_assignments (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade
);

create index if not exists idx_routine_assignment_players_assignment on routine_assignment_players (routine_assignment_id);
create index if not exists idx_routine_assignment_players_player on routine_assignment_players (player_id);

-- =========================================================
-- RLS: lectura para todo autenticado, escritura para dt y profesor.
-- =========================================================

alter table physical_exercises enable row level security;
alter table routines enable row level security;
alter table routine_exercises enable row level security;
alter table routine_assignments enable row level security;
alter table routine_assignment_players enable row level security;

create policy "physical_exercises_select_all" on physical_exercises
  for select to authenticated using (true);
create policy "physical_exercises_write" on physical_exercises
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "physical_exercises_update" on physical_exercises
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "physical_exercises_delete" on physical_exercises
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

create policy "routines_select_all" on routines
  for select to authenticated using (true);
create policy "routines_write" on routines
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routines_update" on routines
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "routines_delete" on routines
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

create policy "routine_exercises_select_all" on routine_exercises
  for select to authenticated using (true);
create policy "routine_exercises_write" on routine_exercises
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_exercises_update" on routine_exercises
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "routine_exercises_delete" on routine_exercises
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

create policy "routine_assignments_select_all" on routine_assignments
  for select to authenticated using (true);
create policy "routine_assignments_write" on routine_assignments
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_assignments_update" on routine_assignments
  for update to authenticated using (auth_role() in ('dt', 'profesor')) with check (auth_role() in ('dt', 'profesor'));
create policy "routine_assignments_delete" on routine_assignments
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));

create policy "routine_assignment_players_select_all" on routine_assignment_players
  for select to authenticated using (true);
create policy "routine_assignment_players_write" on routine_assignment_players
  for insert to authenticated with check (auth_role() in ('dt', 'profesor'));
create policy "routine_assignment_players_delete" on routine_assignment_players
  for delete to authenticated using (auth_role() in ('dt', 'profesor'));
