-- ====== MIGRACIÓN 2: galería de imágenes, origen de las visitas y límite anti-spam ======
-- Pegar completo en Supabase > SQL Editor > Run (después de haber ejecutado setup.sql)

alter table solicitudes add column if not exists fuente text;

drop function if exists crear_solicitud(int[],text,text,boolean);
create or replace function crear_solicitud(p_hex int[], p_nombre text, p_contacto text, p_mostrar boolean, p_fuente text default null)
returns json language plpgsql security definer set search_path=public as $$
declare ocupados int[]; sid bigint;
begin
  if p_hex is null or array_length(p_hex,1) is null or array_length(p_hex,1) > 20 then return json_build_object('ok',false,'error','cantidad'); end if;
  update hexagonos set estado='libre', nombre=null, hasta=null, solicitud_id=null where estado='proceso' and hasta < now();
  if (select count(*) from solicitudes where contacto=left(p_contacto,80) and estado='pendiente') >= 3 then return json_build_object('ok',false,'error','limite'); end if;
  select array_agg(numero) into ocupados from hexagonos where numero = any(p_hex) and estado <> 'libre';
  if ocupados is not null then return json_build_object('ok',false,'ocupados',ocupados); end if;
  insert into solicitudes(hexagonos,nombre,contacto,mostrar,fuente) values (p_hex,left(p_nombre,80),left(p_contacto,80),coalesce(p_mostrar,true),left(p_fuente,120)) returning id into sid;
  update hexagonos set estado='proceso', hasta=now()+interval '48 hours', solicitud_id=sid where numero = any(p_hex);
  return json_build_object('ok',true,'id',sid);
end $$;
grant execute on function crear_solicitud(int[],text,text,boolean,text) to anon, authenticated;

create table if not exists galeria(
  id bigint generated always as identity primary key,
  ruta text not null, miniatura text not null, titulo text, ancho int, alto int, creado_en timestamptz default now());
alter table galeria enable row level security;
drop policy if exists "ver galeria" on galeria;
create policy "ver galeria" on galeria for select to anon, authenticated using (true);
drop policy if exists "admin agrega galeria" on galeria;
create policy "admin agrega galeria" on galeria for insert to authenticated with check (es_admin());
drop policy if exists "admin edita galeria" on galeria;
create policy "admin edita galeria" on galeria for update to authenticated using (es_admin()) with check (es_admin());
drop policy if exists "admin borra galeria" on galeria;
create policy "admin borra galeria" on galeria for delete to authenticated using (es_admin());

insert into storage.buckets (id, name, public) values ('galeria','galeria',true) on conflict (id) do update set public = true;
drop policy if exists "admin sube galeria" on storage.objects;
create policy "admin sube galeria" on storage.objects for insert to authenticated with check (bucket_id='galeria' and public.es_admin());
drop policy if exists "admin edita archivos galeria" on storage.objects;
create policy "admin edita archivos galeria" on storage.objects for update to authenticated using (bucket_id='galeria' and public.es_admin());
drop policy if exists "admin borra archivos galeria" on storage.objects;
create policy "admin borra archivos galeria" on storage.objects for delete to authenticated using (bucket_id='galeria' and public.es_admin());