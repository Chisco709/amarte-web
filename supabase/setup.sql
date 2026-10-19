-- ============ FUNDACIÓN AMARTE · base de datos (pegar completo en Supabase > SQL Editor > Run) ============
-- 1) CAMBIA ESTE CORREO por el tuyo (el mismo con el que entrarás al panel /admin/)
create table if not exists admins(email text primary key);
insert into admins values ('juanjosechisco008@gmail.com') on conflict do nothing;

create table if not exists hexagonos(
  numero int primary key check (numero between 1 and 880),
  estado text not null default 'libre' check (estado in ('libre','tejido','proceso','apadrinado')),
  nombre text, hasta timestamptz, solicitud_id bigint);
create table if not exists solicitudes(
  id bigint generated always as identity primary key,
  hexagonos int[] not null, nombre text not null, contacto text not null, mostrar boolean default true,
  estado text not null default 'pendiente' check (estado in ('pendiente','pagada','cancelada')),
  creado_en timestamptz default now());

insert into hexagonos(numero) select g from generate_series(1,880) g on conflict do nothing;
update hexagonos set estado='tejido' where numero between 1 and 80 and estado='libre';   -- los 80 ya tejidos

alter table admins enable row level security;
alter table hexagonos enable row level security;
alter table solicitudes enable row level security;

create or replace function es_admin() returns boolean language sql security definer stable set search_path=public as
$$ select exists(select 1 from admins where lower(email)=lower(coalesce(auth.jwt()->>'email',''))) $$;

drop policy if exists "ver hexagonos" on hexagonos;
create policy "ver hexagonos" on hexagonos for select to anon, authenticated using (true);
drop policy if exists "admin ve solicitudes" on solicitudes;
create policy "admin ve solicitudes" on solicitudes for select to authenticated using (es_admin());

-- El visitante crea una solicitud: reserva sus hexágonos 48 horas (si no paga, se liberan solos)
create or replace function crear_solicitud(p_hex int[], p_nombre text, p_contacto text, p_mostrar boolean)
returns json language plpgsql security definer set search_path=public as $$
declare ocupados int[]; sid bigint;
begin
  if p_hex is null or array_length(p_hex,1) is null or array_length(p_hex,1) > 20 then return json_build_object('ok',false,'error','cantidad'); end if;
  update hexagonos set estado='libre', nombre=null, hasta=null, solicitud_id=null where estado='proceso' and hasta < now();
  select array_agg(numero) into ocupados from hexagonos where numero = any(p_hex) and estado <> 'libre';
  if ocupados is not null then return json_build_object('ok',false,'ocupados',ocupados); end if;
  insert into solicitudes(hexagonos,nombre,contacto,mostrar) values (p_hex,left(p_nombre,80),left(p_contacto,80),coalesce(p_mostrar,true)) returning id into sid;
  update hexagonos set estado='proceso', hasta=now()+interval '48 hours', solicitud_id=sid where numero = any(p_hex);
  return json_build_object('ok',true,'id',sid);
end $$;
grant execute on function crear_solicitud(int[],text,text,boolean) to anon, authenticated;

-- Funciones del panel (solo el administrador puede usarlas)
create or replace function aprobar_solicitud(p_id bigint) returns void language plpgsql security definer set search_path=public as $$
declare s solicitudes;
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  select * into s from solicitudes where id=p_id and estado='pendiente';
  if not found then raise exception 'Solicitud no encontrada'; end if;
  if exists(select 1 from hexagonos where numero=any(s.hexagonos) and (estado in ('tejido','apadrinado') or (estado='proceso' and solicitud_id is distinct from p_id and hasta>now())))
    then raise exception 'Algún hexágono ya fue tomado por otra persona'; end if;
  update hexagonos set estado='apadrinado', nombre=case when s.mostrar then s.nombre else 'Anónimo' end, hasta=null, solicitud_id=p_id where numero=any(s.hexagonos);
  update solicitudes set estado='pagada' where id=p_id;
end $$;

create or replace function cancelar_solicitud(p_id bigint) returns void language plpgsql security definer set search_path=public as $$
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  update hexagonos set estado='libre', nombre=null, hasta=null, solicitud_id=null where solicitud_id=p_id and estado='proceso';
  update solicitudes set estado='cancelada' where id=p_id and estado='pendiente';
end $$;

create or replace function apadrinar_manual(p_hex int[], p_nombre text) returns void language plpgsql security definer set search_path=public as $$
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  update hexagonos set estado='apadrinado', nombre=left(p_nombre,80), hasta=null, solicitud_id=null where numero=any(p_hex) and estado in ('libre','proceso');
end $$;

create or replace function marcar_tejidos(p_desde int, p_hasta int, p_tejido boolean) returns void language plpgsql security definer set search_path=public as $$
begin
  if not es_admin() then raise exception 'No autorizado'; end if;
  if p_tejido then update hexagonos set estado='tejido' where numero between p_desde and p_hasta and estado='libre';
  else update hexagonos set estado='libre' where numero between p_desde and p_hasta and estado='tejido'; end if;
end $$;
grant execute on function aprobar_solicitud(bigint), cancelar_solicitud(bigint), apadrinar_manual(int[],text), marcar_tejidos(int,int,boolean) to authenticated;