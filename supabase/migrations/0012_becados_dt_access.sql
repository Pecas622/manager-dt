-- C15 Manager V2 — el DT también puede ver y administrar Accesos (becados)
-- Correr después de 0011_becados_tipo.sql.
--
-- El Coordinador sigue existiendo para cuando esta tarea la lleve otra
-- persona sin darle el resto de la app — ahora el DT (superadmin) también
-- puede hacerlo desde su propia cuenta, sin necesitar una segunda cuenta.

drop policy if exists "becados_all_coordinador" on becados;
create policy "becados_all_coordinador_dt" on becados
  for all
  to authenticated
  using (auth_role() in ('coordinador', 'dt'))
  with check (auth_role() in ('coordinador', 'dt'));
