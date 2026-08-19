-- C15 Manager V2 — peso y altura en la ficha del jugador
-- Correr después de 0001_init.sql.
--
-- Se cargan una vez en la ficha (como el nombre o la posición), no como un
-- test fechado — así el profe ya los tiene a mano al cargar un test de
-- salto o velocidad, sin tener que volver a preguntarlos cada vez.

alter table players add column if not exists weight_kg numeric(5, 2);
alter table players add column if not exists height_cm numeric(5, 1);
