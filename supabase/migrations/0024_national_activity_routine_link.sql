-- C15 Manager V2 — actividades del Nacional: rutina real + tipo "Entrenamiento"
-- Correr después de 0006_nationals.sql y 0004_routines.sql (usa `routines`).
--
-- Rutina diaria de activación en un Nacional (movilidad articular + juego,
-- todos los días a la mañana): la actividad tipo "rutina" ahora puede
-- quedar linkeada a una Rutina real (`routines`), con su lista de
-- ejercicios sin límite (biblioteca o sueltos) y el "juego" como un
-- ejercicio suelto más — reutiliza el editor de Rutinas que ya existe, en
-- vez de duplicar un editor de ejercicios aparte para Nacional.
--
-- Se suma el tipo "entrenamiento" (texto libre: qué trabajar de la parte
-- táctica ese día) — no es un `routine_id`, es solo título + notas, se
-- edita ahí mismo.

alter table national_activities add column if not exists routine_id uuid references routines (id) on delete set null;

alter table national_activities drop constraint if exists national_activities_type_check;
alter table national_activities add constraint national_activities_type_check check (
  type in ('viaje', 'partido', 'rutina', 'entrenamiento', 'comida', 'charla', 'descanso', 'otro')
);
