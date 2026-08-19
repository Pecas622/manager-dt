-- C15 Manager V2 — Planes individuales por jugador
-- Correr después de 0001_init.sql (usa `training_exercises` y `players`) y
-- 0003_roles.sql (usa `auth_role()`).
--
-- Distinto de "Rutinas" (que arma el Profesor y asigna a una fecha del
-- calendario para toda la categoría o jugadores puntuales, con ejercicios
-- físicos propios en `physical_exercises`). Un "plan individual" es un
-- programa propio de UN jugador (fuerza, movilidad, rehabilitación,
-- resistencia, prevención), con progresión de series/reps semana a semana,
-- y reutiliza la biblioteca táctica ya existente (`training_exercises`) o
-- un ejercicio suelto sin pasar por la biblioteca.

create table if not exists individual_plans (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players (id) on delete cascade,
  name text not null,
  objective text,
  description text,
  type text not null check (type in (
    'Fuerza', 'Movilidad', 'Rehabilitación', 'Resistencia', 'Prevención'
  )),
  focus_area text not null check (focus_area in (
    'Tren inferior', 'Tren superior', 'Core', 'General'
  )),
  start_date date not null default current_date,
  duration_weeks smallint not null default 4 check (duration_weeks > 0),
  session_duration_minutes smallint,
  intensity text not null default 'Media' check (intensity in ('Baja', 'Media', 'Alta')),
  status text not null default 'Activa' check (status in ('Activa', 'Archivada')),
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_individual_plans_player on individual_plans (player_id);
create index if not exists idx_individual_plans_status on individual_plans (status);

create trigger trg_individual_plans_updated_at
  before update on individual_plans
  for each row execute function set_updated_at();

create table if not exists individual_plan_exercises (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references individual_plans (id) on delete cascade,
  exercise_id uuid references training_exercises (id) on delete restrict,
  ad_hoc_name text,
  "order" smallint not null default 0,
  base_sets smallint,
  base_reps text,
  notes text,
  created_at timestamptz not null default now(),
  constraint individual_plan_exercises_source check (
    exercise_id is not null or ad_hoc_name is not null
  )
);

create index if not exists idx_individual_plan_exercises_plan on individual_plan_exercises (plan_id, "order");

-- Progresión: series/reps de cada ejercicio del plan, semana a semana. Una
-- tabla aparte (en vez de columnas fijas por semana) para no limitar la
-- cantidad de semanas que puede durar un plan.
create table if not exists individual_plan_exercise_weeks (
  id uuid primary key default gen_random_uuid(),
  plan_exercise_id uuid not null references individual_plan_exercises (id) on delete cascade,
  week_number smallint not null check (week_number > 0),
  sets smallint,
  reps text,
  unique (plan_exercise_id, week_number)
);

create index if not exists idx_individual_plan_exercise_weeks_exercise on individual_plan_exercise_weeks (plan_exercise_id);

-- =========================================================
-- RLS: lectura y escritura para DT y Profesor (mismo criterio que Rutinas).
-- =========================================================

alter table individual_plans enable row level security;
alter table individual_plan_exercises enable row level security;
alter table individual_plan_exercise_weeks enable row level security;

create policy "individual_plans_all" on individual_plans
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));

create policy "individual_plan_exercises_all" on individual_plan_exercises
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));

create policy "individual_plan_exercise_weeks_all" on individual_plan_exercise_weeks
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
