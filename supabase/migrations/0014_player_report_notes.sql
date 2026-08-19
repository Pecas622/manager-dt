-- C15 Manager V2 — Notas de informe por jugador
-- Correr después de 0001_init.sql (usa `players`) y 0003_roles.sql (usa
-- `auth_role()`, `profiles`).
--
-- No es un "informe automático": no se genera ni se envía solo. Es un
-- comentario que el DT/Profesor escribe a mano (ej. "qué le falta trabajar"),
-- se guarda con fecha, y se combina con datos ya existentes (evaluaciones,
-- tests físicos, minutos, planes individuales) en una pantalla imprimible
-- bajo demanda (`/players/:id/report`, botón "Imprimir" del navegador).

create table if not exists player_report_notes (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players (id) on delete cascade,
  note text not null,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_player_report_notes_player on player_report_notes (player_id, created_at desc);

alter table player_report_notes enable row level security;

create policy "player_report_notes_all" on player_report_notes
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
