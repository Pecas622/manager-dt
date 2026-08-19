-- C15 Manager V2 — módulo Nacional (torneos, DT-only)
-- Correr después de 0005_matches.sql.

create table if not exists nationals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  start_date date not null,
  end_date date not null,
  travel_date date,
  return_date date,
  info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_nationals_start_date on nationals (start_date desc);

create trigger trg_nationals_updated_at
  before update on nationals
  for each row execute function set_updated_at();

-- Ahora que `nationals` existe, se completa la referencia que `matches`
-- dejó pendiente en 0005_matches.sql.
alter table matches
  add constraint matches_national_id_fkey
  foreign key (national_id) references nationals (id) on delete set null;

create table if not exists national_activities (
  id uuid primary key default gen_random_uuid(),
  national_id uuid not null references nationals (id) on delete cascade,
  date date not null,
  time time,
  type text not null check (type in (
    'viaje', 'partido', 'rutina', 'comida', 'charla', 'descanso', 'otro'
  )),
  title text not null,
  notes text,
  match_id uuid references matches (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_national_activities_national on national_activities (national_id, date, time);

create table if not exists national_expenses (
  id uuid primary key default gen_random_uuid(),
  national_id uuid not null references nationals (id) on delete cascade,
  category text not null check (category in (
    'Vuelos', 'Alojamiento', 'Comidas', 'Traslados', 'Inscripción', 'Canchas', 'Otros'
  )),
  description text,
  amount numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_national_expenses_national on national_expenses (national_id);

create table if not exists national_player_costs (
  id uuid primary key default gen_random_uuid(),
  national_id uuid not null references nationals (id) on delete cascade,
  player_id uuid not null references players (id) on delete cascade,
  flight_cost numeric(12, 2) not null default 0,
  lodging_cost numeric(12, 2) not null default 0,
  food_cost numeric(12, 2) not null default 0,
  transport_cost numeric(12, 2) not null default 0,
  total_cost numeric(12, 2) generated always as (
    flight_cost + lodging_cost + food_cost + transport_cost
  ) stored,
  amount_paid numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (national_id, player_id)
);

create index if not exists idx_national_player_costs_national on national_player_costs (national_id);

create trigger trg_national_player_costs_updated_at
  before update on national_player_costs
  for each row execute function set_updated_at();

-- =========================================================
-- RLS: todo el módulo Nacional (info, cronograma, gastos, pagos) es
-- exclusivo del DT. Los partidos que salen de un Nacional se siguen viendo
-- en `matches` (lectura general) — así el jugador ve el partido en su
-- calendario sin acceder a costos ni pagos.
-- =========================================================

alter table nationals enable row level security;
alter table national_activities enable row level security;
alter table national_expenses enable row level security;
alter table national_player_costs enable row level security;

create policy "nationals_all_dt" on nationals
  for all to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');

create policy "national_activities_all_dt" on national_activities
  for all to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');

create policy "national_expenses_all_dt" on national_expenses
  for all to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');

create policy "national_player_costs_all_dt" on national_player_costs
  for all to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
