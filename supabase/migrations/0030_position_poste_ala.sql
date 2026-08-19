-- C15 Manager V2 — agrega "Poste-ala" como posición
-- Correr después de 0023_position_undefined.sql.
--
-- Híbrido Poste (= Cierre, ya existía) + Ala que usa el profe en la
-- planilla de tests físicos — no encajaba en ninguna posición existente.

alter table players drop constraint if exists players_position_check;
alter table players add constraint players_position_check check (
  position in ('Arquero', 'Cierre', 'Ala', 'Pivot', 'Universal', 'Poste-ala', 'Sin definir')
);
