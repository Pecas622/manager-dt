-- C15 Manager V2 — Evaluaciones: solo lo físico, sin puntajes 1-10
-- Correr después de 0001_init.sql (crea `player_evaluations`).
--
-- Se sacan técnica/táctica/mental por completo (y sus promedios), y física
-- deja de ser un puntaje subjetivo 1-10 — pasa a ser un check-in periódico
-- simple (fecha + entrenador + observaciones) que va de la mano de lo que
-- ya se carga en Tests físicos (salto, velocidad) y en la ficha del
-- jugador (peso, altura): no se duplica esa carga acá, se muestra junto a
-- la nota. Los promedios generados (technical_avg, tactical_avg,
-- physical_avg, mental_avg, overall_avg) no tienen reemplazo — no se puede
-- promediar cm, kg y segundos entre sí.
--
-- OJO: esto borra permanentemente cualquier puntaje técnica/táctica/física/
-- mental ya cargado en evaluaciones existentes. Solo sobrevive
-- fecha/entrenador/observaciones.

alter table player_evaluations drop column if exists overall_avg;
alter table player_evaluations drop column if exists mental_avg;
alter table player_evaluations drop column if exists physical_avg;
alter table player_evaluations drop column if exists tactical_avg;
alter table player_evaluations drop column if exists technical_avg;

alter table player_evaluations drop column if exists pass;
alter table player_evaluations drop column if exists control;
alter table player_evaluations drop column if exists dribbling;
alter table player_evaluations drop column if exists one_vs_one;
alter table player_evaluations drop column if exists finishing;
alter table player_evaluations drop column if exists positioning;
alter table player_evaluations drop column if exists decision_making;
alter table player_evaluations drop column if exists game_reading;
alter table player_evaluations drop column if exists defending;
alter table player_evaluations drop column if exists transitions;
alter table player_evaluations drop column if exists speed;
alter table player_evaluations drop column if exists endurance;
alter table player_evaluations drop column if exists coordination;
alter table player_evaluations drop column if exists agility;
alter table player_evaluations drop column if exists concentration;
alter table player_evaluations drop column if exists attitude;
alter table player_evaluations drop column if exists competitiveness;
alter table player_evaluations drop column if exists discipline;
alter table player_evaluations drop column if exists teamwork;

alter table player_evaluations rename column general_notes to notes;
