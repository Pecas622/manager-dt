-- C15 Manager V2 — tarjetas azules + observaciones por jugador en Nacional
-- Correr después de 0015_match_cards.sql y 0006_nationals.sql.
--
-- 1) match_cards suma un "type": Amarilla (amonestación) o Azul (exclusión
--    temporal de 2 minutos, regla de futsal) — no roja, que sigue fuera de
--    alcance. Las tarjetas ya cargadas quedan como 'Amarilla' (default).
-- 2) national_player_costs suma "notes": una observación libre por jugador
--    dentro de ese Nacional (ej. actitud, estado físico), visible junto al
--    resumen de minutos/tarjetas de esos partidos en la pestaña Jugadores.

alter table match_cards add column if not exists type text not null default 'Amarilla'
  check (type in ('Amarilla', 'Azul'));

alter table national_player_costs add column if not exists notes text;
