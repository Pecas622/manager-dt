-- C15 Manager V2 — costo del viaje por defecto + pagos como historial
-- Correr después de 0006_nationals.sql.
--
-- 1) El Nacional suma un costo "default" (vuelo/alojamiento/comida/
--    traslado) que se aplica a cada jugador nuevo del plantel — evita
--    cargar los mismos 4 números jugador por jugador. Sigue siendo
--    editable por jugador para las excepciones.
-- 2) "Pagado" deja de ser un solo número que se pisa cada vez: pasa a ser
--    un historial de pagos (national_payments, fecha + monto), sumados
--    para el total pagado. No se pierde el rastro de quién pagó qué y
--    cuándo.

alter table nationals add column if not exists default_flight_cost numeric(12, 2) not null default 0;
alter table nationals add column if not exists default_lodging_cost numeric(12, 2) not null default 0;
alter table nationals add column if not exists default_food_cost numeric(12, 2) not null default 0;
alter table nationals add column if not exists default_transport_cost numeric(12, 2) not null default 0;

create table if not exists national_payments (
  id uuid primary key default gen_random_uuid(),
  national_player_cost_id uuid not null references national_player_costs (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_national_payments_cost on national_payments (national_player_cost_id);

-- El total pagado ahora sale de sumar national_payments — se cargaban
-- montos sueltos, no acumulativos, así que no hay una migración de datos
-- 1 a 1 posible; el valor viejo de `amount_paid` no se traslada.
alter table national_player_costs drop column if exists amount_paid;

alter table national_payments enable row level security;

create policy "national_payments_all_dt" on national_payments
  for all to authenticated using (auth_role() = 'dt') with check (auth_role() = 'dt');
