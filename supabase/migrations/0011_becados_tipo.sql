-- C15 Manager V2 — distingue Becados de socios con Cuota
-- Correr después de 0009_coordinador_becados.sql.
--
-- El becado no paga cuota. Un socio con cuota sí paga, pero acá no se
-- registran montos ni pagos sueltos: el Coordinador solo marca el estado
-- (Activo = al día / puede entrar, Inactivo = atrasado / no puede entrar),
-- igual que ya hacía con los becados. Es la misma lista y el mismo
-- buscador por DNI para seguridad, ahora con un tipo por persona.

alter table becados add column if not exists type text not null default 'Becado'
  check (type in ('Becado', 'Cuota'));

-- Actualiza la función pública para que devuelva también el tipo, así la
-- pantalla de seguridad puede mostrar el motivo ("Becado" o "Cuota al día").
create or replace function check_becado(p_dni text)
returns table (is_becado boolean, first_name text, last_name text, member_type text)
language sql
security definer
stable
set search_path = public
as $$
  select
    exists (
      select 1 from becados b
      where b.dni = p_dni and b.status = 'Activo'
    ) as is_becado,
    b.first_name,
    b.last_name,
    b.type as member_type
  from becados b
  where b.dni = p_dni and b.status = 'Activo'
  union all
  select false, null, null, null
  where not exists (
    select 1 from becados b where b.dni = p_dni and b.status = 'Activo'
  )
  limit 1;
$$;

grant execute on function check_becado(text) to anon, authenticated;
