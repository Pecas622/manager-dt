-- C15 Manager V2 — permite "Sin definir" como posición del jugador
-- Correr después de 0001_init.sql (crea `players` con el check original).
--
-- La posición era obligatoria con 5 valores fijos. Al cargar un plantel
-- real donde todavía no se definió la posición de cada jugador, hacía
-- falta un valor de "todavía no sé" en vez de forzar a elegir una
-- posición cualquiera. Se puede corregir después, jugador por jugador,
-- desde su ficha.

alter table players drop constraint if exists players_position_check;
alter table players add constraint players_position_check check (
  position in ('Arquero', 'Cierre', 'Ala', 'Pivot', 'Universal', 'Sin definir')
);
