-- C15 Manager V2 — Documentos por jugador (DNI, certificado médico, otros)
-- Correr después de 0001_init.sql (usa `players`) y 0003_roles.sql (usa
-- `auth_role()`, `profiles`).
--
-- Guarda el archivo en Supabase Storage (bucket privado "player-documents")
-- y una fila de metadata en `player_documents` con el tipo, nombre original
-- y quién lo subió. Acceso restringido a DT y Profesor — documentación
-- sensible (DNI, certificados médicos), no se expone a Jugador ni Coordinador.

insert into storage.buckets (id, name, public)
values ('player-documents', 'player-documents', false)
on conflict (id) do nothing;

drop policy if exists "player_documents_storage_select" on storage.objects;
create policy "player_documents_storage_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'player-documents' and auth_role() in ('dt', 'profesor'));

drop policy if exists "player_documents_storage_insert" on storage.objects;
create policy "player_documents_storage_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'player-documents' and auth_role() in ('dt', 'profesor'));

drop policy if exists "player_documents_storage_delete" on storage.objects;
create policy "player_documents_storage_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'player-documents' and auth_role() in ('dt', 'profesor'));

create table if not exists player_documents (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players (id) on delete cascade,
  type text not null check (type in ('DNI', 'Certificado médico', 'Otro')),
  file_path text not null,
  file_name text not null,
  uploaded_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_player_documents_player on player_documents (player_id);

alter table player_documents enable row level security;

create policy "player_documents_all" on player_documents
  for all to authenticated
  using (auth_role() in ('dt', 'profesor'))
  with check (auth_role() in ('dt', 'profesor'));
