-- C15 Manager V2 — el Profesor también puede editar jugadores
-- Correr después de 0003_roles.sql (crea "players_update_dt").
--
-- Motivo: la planilla del partido (Minutos/Amarillas, en /matches/:id) ahora
-- también permite cargar el número de camiseta ahí mismo, y la completa
-- normalmente el Profesor el día del partido — no tiene sentido que ese
-- campo puntual quede bloqueado por RLS solo porque el resto de la ficha es
-- DT-only. Se amplía "update" (editar) a Profesor; alta y baja de jugadores
-- (insert/delete) siguen siendo exclusivas del DT.

drop policy if exists "players_update_dt" on players;
create policy "players_update_dt" on players
  for update to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
