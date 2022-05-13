INSERT INTO public.data_sources (id, name, slug, query, created_by, updated_by, created_at, updated_at) VALUES (1, 'Cantidad de usuarios por unidad organizacional', 'cantidad-de-usuarios-por-unidad-organizacional', 'select coalesce(ou.name,''Sin Unidad Organizacional'') as organizational_unit,count(*) as total_workers from workers wo left join job_positions jp on wo.job_position=jp.id left join organizational_units ou on jp.organizational_unit = ou.id group by ou.name', 1, 1, '2022-02-11 20:22:11.958000', '2022-02-17 22:58:53.928000');
INSERT INTO public.data_sources (id, name, slug, query, created_by, updated_by, created_at, updated_at) VALUES (4, 'servidores públicos', 'servidores-publicos', 'select identification_number as dni,
       last_names||'' ''||first_names as names,
       sex,
       coalesce(jp.title,'''') as job_position,
       coalesce(ou.name,'''') as organizational_unit
from workers wo
left outer join job_positions jp on wo.job_position=jp.id
left outer join organizational_units ou on jp.organizational_unit=ou.id
{{where}}', 1, 1, '2022-02-17 23:48:11.412000', '2022-02-18 04:22:39.519000');
INSERT INTO public.data_sources (id, name, slug, query, created_by, updated_by, created_at, updated_at) VALUES (2, 'total trabajadores por puesto', 'total-trabajadores-por-puesto', 'select coalesce(jp.title,''Sin Puesto'') as job_position,count(*) as total_workers from workers wo left join job_positions jp on wo.job_position=jp.id group by jp.title', 1, 1, '2022-02-11 21:38:37.764000', '2022-02-17 22:59:21.529000');
INSERT INTO public.data_sources (id, name, slug, query, created_by, updated_by, created_at, updated_at) VALUES (3, 'resumen de licencias', 'resumen-de-licencias', 'select type,status,count(*) as total from work_licenses group by type,status', 1, 1, '2022-02-11 21:48:49.036000', '2022-02-17 23:09:31.062000');