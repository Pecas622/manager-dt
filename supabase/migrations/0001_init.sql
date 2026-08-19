-- C15 Manager — schema inicial
-- Correr en el SQL editor de Supabase (o via `supabase db push`).

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- players
-- =========================================================
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  photo_url text,
  birth_date date,
  jersey_number smallint,
  position text not null check (position in ('Arquero', 'Cierre', 'Ala', 'Pivot', 'Universal')),
  preferred_foot text check (preferred_foot in ('Derecha', 'Izquierda', 'Ambidiestro')),
  join_date date,
  status text not null default 'Activo' check (status in ('Activo', 'Inactivo')),
  strengths text,
  weaknesses text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_players_status on players (status);
create index if not exists idx_players_position on players (position);

create trigger trg_players_updated_at
  before update on players
  for each row execute function set_updated_at();

-- =========================================================
-- training_sessions
-- =========================================================
create table if not exists training_sessions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null default '18:00',
  duration smallint not null default 75,
  main_objective text not null,
  secondary_objectives text,
  notes text,
  observations text,
  focus_areas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_training_sessions_date on training_sessions (date desc);

create trigger trg_training_sessions_updated_at
  before update on training_sessions
  for each row execute function set_updated_at();

-- =========================================================
-- training_exercises (biblioteca)
-- =========================================================
create table if not exists training_exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in (
    'Técnica', 'Táctica', 'Física', 'Definición', 'Transición',
    'Presión', 'Pelota parada', 'Juego reducido', 'Activación', 'Otro'
  )),
  duration smallint not null default 15,
  objective text,
  description text,
  players_count text,
  materials text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_training_exercises_category on training_exercises (category);

create trigger trg_training_exercises_updated_at
  before update on training_exercises
  for each row execute function set_updated_at();

-- =========================================================
-- session_exercises (bloques de un entrenamiento)
-- =========================================================
create table if not exists session_exercises (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null references training_sessions (id) on delete cascade,
  exercise_id uuid not null references training_exercises (id) on delete restrict,
  "order" smallint not null default 0,
  duration smallint not null,
  specific_notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_session_exercises_session on session_exercises (training_session_id, "order");

-- =========================================================
-- player_evaluations
-- =========================================================
create table if not exists player_evaluations (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players (id) on delete cascade,
  date date not null default current_date,
  coach text,
  -- técnica
  pass smallint not null check (pass between 1 and 10),
  control smallint not null check (control between 1 and 10),
  dribbling smallint not null check (dribbling between 1 and 10),
  one_vs_one smallint not null check (one_vs_one between 1 and 10),
  finishing smallint not null check (finishing between 1 and 10),
  -- táctica
  positioning smallint not null check (positioning between 1 and 10),
  decision_making smallint not null check (decision_making between 1 and 10),
  game_reading smallint not null check (game_reading between 1 and 10),
  defending smallint not null check (defending between 1 and 10),
  transitions smallint not null check (transitions between 1 and 10),
  -- física
  speed smallint not null check (speed between 1 and 10),
  endurance smallint not null check (endurance between 1 and 10),
  coordination smallint not null check (coordination between 1 and 10),
  agility smallint not null check (agility between 1 and 10),
  -- mental
  concentration smallint not null check (concentration between 1 and 10),
  attitude smallint not null check (attitude between 1 and 10),
  competitiveness smallint not null check (competitiveness between 1 and 10),
  discipline smallint not null check (discipline between 1 and 10),
  teamwork smallint not null check (teamwork between 1 and 10),
  general_notes text,
  technical_avg numeric(4, 2) generated always as (
    round((pass + control + dribbling + one_vs_one + finishing)::numeric / 5, 2)
  ) stored,
  tactical_avg numeric(4, 2) generated always as (
    round((positioning + decision_making + game_reading + defending + transitions)::numeric / 5, 2)
  ) stored,
  physical_avg numeric(4, 2) generated always as (
    round((speed + endurance + coordination + agility)::numeric / 4, 2)
  ) stored,
  mental_avg numeric(4, 2) generated always as (
    round((concentration + attitude + competitiveness + discipline + teamwork)::numeric / 5, 2)
  ) stored,
  overall_avg numeric(4, 2) generated always as (
    round((
      (pass + control + dribbling + one_vs_one + finishing)::numeric / 5 +
      (positioning + decision_making + game_reading + defending + transitions)::numeric / 5 +
      (speed + endurance + coordination + agility)::numeric / 4 +
      (concentration + attitude + competitiveness + discipline + teamwork)::numeric / 5
    ) / 4, 2)
  ) stored,
  created_at timestamptz not null default now()
);

create index if not exists idx_player_evaluations_player_date on player_evaluations (player_id, date desc);

-- =========================================================
-- training_player_notes (jugadores destacados por entrenamiento)
-- =========================================================
create table if not exists training_player_notes (
  id uuid primary key default gen_random_uuid(),
  training_session_id uuid not null references training_sessions (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_training_player_notes_session on training_player_notes (training_session_id);
create index if not exists idx_training_player_notes_player on training_player_notes (player_id);
