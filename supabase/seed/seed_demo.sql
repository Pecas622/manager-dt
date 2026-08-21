-- C15 Manager — datos demo: "Regatas C15"
-- Corré esto en el SQL editor de Supabase DESPUÉS de aplicar TODAS las
-- migraciones (0001 a 0010, en orden).
-- Es idempotente: usa UUIDs fijos con prefijos por tabla, así se puede volver a
-- correr sin duplicar (hace upsert) y se puede borrar entero con cleanup_demo.sql.
-- No incluye cuentas de usuario (profiles): esas se crean a mano siguiendo el
-- README, porque requieren un usuario real de Supabase Auth.

-- =========================================================
-- players (18) — prefijo 10000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into players (id, category, first_name, last_name, photo_url, birth_date, jersey_number, position, preferred_foot, join_date, status, weight_kg, height_cm, strengths, weaknesses, notes) values
('10000000-0000-0000-0000-000000000001', 'C15', 'Juan', 'Pérez', null, '2011-03-14', 10, 'Ala', 'Derecha', '2024-02-01', 'Activo', 63.8, 168, 'Buen 1 vs 1, velocidad y buena intensidad defensiva.', 'Mejorar toma de decisiones bajo presión.', 'Capitán del equipo.'),
('10000000-0000-0000-0000-000000000002', 'C15', 'Mateo', 'Gómez', null, '2011-06-02', 7, 'Pivot', 'Izquierda', '2024-02-01', 'Activo', null, null, 'Buen juego de espaldas y protección de pelota.', 'Definición con la pierna izquierda.', null),
('10000000-0000-0000-0000-000000000003', 'C15', 'Benjamín', 'Fernández', null, '2011-01-22', 1, 'Arquero', 'Derecha', '2024-02-01', 'Activo', 65, 172, 'Buenos reflejos y salida de pelota jugando con los pies.', 'Colocación en tiros de media distancia.', null),
('10000000-0000-0000-0000-000000000004', 'C15', 'Santino', 'Rodríguez', null, '2011-09-10', 4, 'Cierre', 'Derecha', '2024-08-15', 'Activo', 58, 165, 'Buena lectura defensiva y marca.', 'Salida jugando bajo presión.', null),
('10000000-0000-0000-0000-000000000005', 'C15', 'Thiago', 'Martínez', null, '2011-04-18', 8, 'Ala', 'Izquierda', '2024-02-01', 'Activo', 60.2, 170, 'Desequilibrante en el 1 vs 1, buen remate de media distancia.', 'Trabajo defensivo tras pérdida.', null),
('10000000-0000-0000-0000-000000000006', 'C15', 'Valentino', 'López', null, '2011-11-05', 5, 'Universal', 'Derecha', '2025-02-03', 'Activo', null, null, 'Versátil, entiende bien los sistemas de juego.', 'Consistencia en los pases largos.', null),
('10000000-0000-0000-0000-000000000007', 'C15', 'Lautaro', 'Díaz', null, '2011-07-29', 12, 'Pivot', 'Derecha', '2025-02-03', 'Activo', null, null, 'Fuerza y buen juego aéreo.', 'Movilidad sin la pelota.', null),
('10000000-0000-0000-0000-000000000008', 'C15', 'Bautista', 'Sánchez', null, '2011-02-14', 2, 'Cierre', 'Izquierda', '2024-02-01', 'Activo', null, null, 'Anticipación y buena salida con la pelota dominada.', 'Duelos individuales cuerpo a cuerpo.', null),
('10000000-0000-0000-0000-000000000009', 'C15', 'Joaquín', 'Romero', null, '2011-05-20', 11, 'Ala', 'Derecha', '2025-08-01', 'Activo', null, null, 'Buena pierna derecha, remata bien de media distancia.', 'Intensidad en la marca.', 'Incorporación reciente.'),
('10000000-0000-0000-0000-00000000000a', 'C15', 'Ignacio', 'Torres', null, '2011-10-08', 3, 'Cierre', 'Derecha', '2024-02-01', 'Activo', null, null, 'Buen líder defensivo, marca fuerte.', 'Tranquilidad con la pelota dominada.', null),
('10000000-0000-0000-0000-00000000000b', 'C15', 'Facundo', 'Álvarez', null, '2011-03-30', 9, 'Universal', 'Izquierda', '2025-02-03', 'Activo', null, null, 'Polivalente, buen manejo de ambas piernas.', 'Toma de decisión en el último tercio.', null),
('10000000-0000-0000-0000-00000000000c', 'C15', 'Agustín', 'Ramírez', null, '2011-08-16', 13, 'Arquero', 'Derecha', '2025-02-03', 'Activo', null, null, 'Bueno debajo de los tres palos, buenos reflejos.', 'Juego con los pies.', null),
('10000000-0000-0000-0000-00000000000d', 'C15', 'Franco', 'Flores', null, '2011-12-01', 6, 'Ala', 'Derecha', '2024-02-01', 'Activo', null, null, 'Buena progresión con la pelota dominada.', 'Definición de gol.', null),
('10000000-0000-0000-0000-00000000000e', 'C15', 'Dante', 'Acosta', null, '2011-01-09', 14, 'Pivot', 'Izquierda', '2025-08-01', 'Activo', null, null, 'Buen socio de juego, da profundidad.', 'Juego aéreo.', null),
('10000000-0000-0000-0000-00000000000f', 'C15', 'Ciro', 'Benítez', null, '2011-06-25', 15, 'Universal', 'Derecha', '2024-08-15', 'Activo', null, null, 'Buen recorrido de cancha, gran esfuerzo.', 'Precisión en el último pase.', null),
('10000000-0000-0000-0000-000000000010', 'C15', 'Simón', 'Molina', null, '2011-04-03', 16, 'Ala', 'Izquierda', '2025-02-03', 'Activo', null, null, 'Encarador, buena gambeta corta.', 'Ida y vuelta en transición.', null),
('10000000-0000-0000-0000-000000000011', 'C15', 'Máximo', 'Castro', null, '2011-09-27', 17, 'Cierre', 'Derecha', '2025-08-01', 'Inactivo', null, null, 'Fuerte en el mano a mano.', 'Salida jugando desde el fondo.', 'Lesionado, en recuperación.'),
('10000000-0000-0000-0000-000000000012', 'C15', 'Julián', 'Ortiz', null, '2011-11-19', 18, 'Arquero', 'Izquierda', '2025-08-01', 'Activo', null, null, 'Buena estatura y cobertura del arco.', 'Comunicación con la defensa.', 'Suplente, en desarrollo.')
on conflict (id) do update set
  category = excluded.category, first_name = excluded.first_name, last_name = excluded.last_name,
  photo_url = excluded.photo_url, birth_date = excluded.birth_date, jersey_number = excluded.jersey_number,
  position = excluded.position, preferred_foot = excluded.preferred_foot, join_date = excluded.join_date,
  status = excluded.status, weight_kg = excluded.weight_kg, height_cm = excluded.height_cm,
  strengths = excluded.strengths, weaknesses = excluded.weaknesses, notes = excluded.notes;

-- =========================================================
-- training_exercises (14) — prefijo 20000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into training_exercises (id, name, category, duration, objective, description, players_count, materials, notes) values
('20000000-0000-0000-0000-000000000001', 'Rondo 4v1', 'Técnica', 15, 'Conservación y movilidad de la pelota.', 'Cuatro jugadores en rondo alrededor de un defensor, dos toques máximo.', '5', 'Conos, pecheras', null),
('20000000-0000-0000-0000-000000000002', 'Rondo 5v2', 'Técnica', 15, 'Conservación bajo presión.', 'Cinco atacantes conservan la pelota ante dos defensores dentro de un espacio reducido.', '7', 'Conos, pecheras', null),
('20000000-0000-0000-0000-000000000003', '1 vs 1', 'Técnica', 10, 'Desequilibrio y definición.', 'Duelos individuales hacia un arco chico, salida desde el entrenador.', '2-4', 'Conos, arcos chicos', null),
('20000000-0000-0000-0000-000000000004', '2 vs 1', 'Transición', 10, 'Superioridad numérica y definición rápida.', 'Dos atacantes contra un defensor en espacio reducido hacia el arco.', '3', 'Conos', null),
('20000000-0000-0000-0000-000000000005', '2 vs 2', 'Táctica', 15, 'Juego asociado en espacios reducidos.', 'Dos parejas enfrentadas trabajando apoyos y desmarques.', '4', 'Conos, pecheras', null),
('20000000-0000-0000-0000-000000000006', '3v2 transición', 'Transición', 20, 'Transición ataque-defensa.', 'Tres atacantes contra dos defensores, con repliegue inmediato tras la definición.', '5', 'Conos, arcos', null),
('20000000-0000-0000-0000-000000000007', '4v3', 'Táctica', 15, 'Superioridad numérica y ocupación de espacios.', 'Cuatro atacantes contra tres defensores en media cancha.', '7', 'Conos, pecheras', null),
('20000000-0000-0000-0000-000000000008', 'Finalización', 'Definición', 15, 'Precisión y definición ante el arquero.', 'Circuito de centros y remates variando ángulos de definición.', '6-8', 'Conos, arcos, pelotas', null),
('20000000-0000-0000-0000-000000000009', '4v4 presión', 'Presión', 25, 'Presión tras pérdida.', 'Juego 4v4 con arcos, foco en la presión inmediata tras perder la pelota.', '8', 'Conos, pecheras, arcos', null),
('20000000-0000-0000-0000-00000000000a', 'Salida de presión', 'Presión', 15, 'Salida limpia ante presión rival.', 'Construcción desde el arquero con presión alta del rival.', '8-10', 'Conos, pecheras', null),
('20000000-0000-0000-0000-00000000000b', 'Partido condicionado', 'Juego reducido', 15, 'Aplicar los conceptos trabajados en el entrenamiento.', 'Partido con una o dos condiciones tácticas ligadas al objetivo del día.', '10-12', 'Pecheras, arcos', null),
('20000000-0000-0000-0000-00000000000c', 'Pelota parada', 'Pelota parada', 10, 'Definición y organización en jugadas de pelota detenida.', 'Ensayo de córners y laterales ofensivos y defensivos.', '10', 'Conos, pecheras', null),
('20000000-0000-0000-0000-00000000000d', 'Activación + movilidad', 'Activación', 10, 'Activación general y prevención de lesiones.', 'Movilidad articular, skipping y activación con pelota.', 'Todo el plantel', 'Conos, escalera de velocidad', null),
('20000000-0000-0000-0000-00000000000e', 'Juego reducido 5v5', 'Juego reducido', 20, 'Ocupación de espacios y circulación rápida.', 'Partido reducido 5v5 en espacio acotado con transiciones rápidas.', '10', 'Pecheras, arcos', null)
on conflict (id) do update set
  name = excluded.name, category = excluded.category, duration = excluded.duration, objective = excluded.objective,
  description = excluded.description, players_count = excluded.players_count, materials = excluded.materials, notes = excluded.notes;

-- =========================================================
-- training_sessions (3) — prefijo 30000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into training_sessions (id, category, date, start_time, duration, main_objective, secondary_objectives, notes, observations, focus_areas) values
('30000000-0000-0000-0000-000000000001', 'C15', '2026-08-03', '18:00', 75, 'Conservación y transición ofensiva.', 'Trabajar la salida corta y la presión tras pérdida.', 'Cancha techada, primer entrenamiento de la semana.',
 'El equipo mostró buena intensidad en el rondo. En el 3v2 costó mantener el orden en la transición defensiva las primeras series, mejoró hacia el final.',
 'Reforzar la cobertura del segundo defensor en la transición defensiva.'),
('30000000-0000-0000-0000-000000000002', 'C15', '2026-08-05', '18:00', 75, 'Circulación de pelota y definición.', 'Mejorar la puntería en situaciones de finalización.', null,
 'Buena circulación en el rondo 5v2. En finalización faltó precisión con la pierna izquierda en varios jugadores.',
 'Sumar trabajo específico de definición con pierna izquierda en la próxima semana.'),
('30000000-0000-0000-0000-000000000003', 'C15', '2026-08-07', '18:00', 75, 'Salida de presión y juego reducido.', 'Sostener la intensidad en los últimos minutos.', null,
 'Muy buena salida de presión ante el bloque alto simulado. El partido condicionado mostró cansancio acumulado en el último tramo.',
 'Trabajar resistencia específica para sostener la intensidad los 75 minutos.')
on conflict (id) do update set
  category = excluded.category, date = excluded.date, start_time = excluded.start_time, duration = excluded.duration, main_objective = excluded.main_objective,
  secondary_objectives = excluded.secondary_objectives, notes = excluded.notes, observations = excluded.observations, focus_areas = excluded.focus_areas;

-- =========================================================
-- session_exercises (bloques) — prefijo 40000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into session_exercises (id, training_session_id, exercise_id, "order", duration, specific_notes) values
-- Entrenamiento 1 (lunes 03/08) — 15+20+25+15 = 75
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 1, 15, null),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 2, 20, null),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000009', 3, 25, null),
('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-00000000000b', 4, 15, 'Condición: gol solo tras 3 pases.'),
-- Entrenamiento 2 (miércoles 05/08) — 10+15+20+15+15 = 75
('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-00000000000d', 1, 10, null),
('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 2, 15, null),
('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000007', 3, 20, null),
('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000008', 4, 15, 'Foco en definición con pierna izquierda.'),
('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-00000000000b', 5, 15, null),
-- Entrenamiento 3 (viernes 07/08) — 10+15+20+20+10 = 75
('40000000-0000-0000-0000-00000000000a', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-00000000000d', 1, 10, null),
('40000000-0000-0000-0000-00000000000b', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000005', 2, 15, null),
('40000000-0000-0000-0000-00000000000c', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-00000000000a', 3, 20, 'Presión alta simulada con 4 jugadores.'),
('40000000-0000-0000-0000-00000000000d', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-00000000000e', 4, 20, null),
('40000000-0000-0000-0000-00000000000e', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-00000000000b', 5, 10, null)
on conflict (id) do update set
  training_session_id = excluded.training_session_id, exercise_id = excluded.exercise_id, "order" = excluded."order",
  duration = excluded.duration, specific_notes = excluded.specific_notes;

-- =========================================================
-- training_player_notes (jugadores destacados) — prefijo 60000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into training_player_notes (id, training_session_id, player_id, note) values
('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Muy buena presión tras pérdida, se recuperó dos veces en el 4v4.'),
('60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-00000000000a', 'Ordenó bien la línea defensiva en el 3v2.'),
('60000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 'Mejoró mucho la definición de media distancia con la derecha.'),
('60000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000006', 'Buena toma de decisiones en el 4v3, eligió bien el último pase.'),
('60000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Gran actuación en el mano a mano durante el partido condicionado.'),
('60000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-00000000000b', 'Sostuvo la intensidad en los últimos minutos mejor que el resto del grupo.')
on conflict (id) do update set
  training_session_id = excluded.training_session_id, player_id = excluded.player_id, note = excluded.note;

-- =========================================================
-- player_evaluations — prefijo 50000000-0000-0000-0000-0000000000xx
-- Check-in físico periódico (fecha + entrenador + observaciones) — los
-- números de peso/altura/salto/velocidad van de la mano de la ficha del
-- jugador y de Tests físicos, no se duplican acá.
-- =========================================================
insert into player_evaluations (id, player_id, date, coach, notes) values
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026-04-14', 'Coach Diego', 'Buen arranque de temporada, líder dentro de la cancha. Sigue creciendo en fuerza de piernas.'),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '2026-07-21', 'Coach Diego', 'Progreso claro en velocidad y salto respecto al check-in anterior.'),
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', '2026-04-14', 'Coach Diego', 'Sólido físicamente, sumar trabajo de movilidad de cadera.'),
('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '2026-04-14', 'Coach Diego', 'Buen salto vertical, trabajar resistencia para sostenerlo los 40 minutos.'),
('50000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', '2026-04-14', 'Coach Diego', 'Buenos reflejos, estatura acorde a la categoría.'),
('50000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000009', '2026-08-04', 'Coach Diego', 'Check-in inicial tras su incorporación, arranca el seguimiento físico desde acá.'),
('50000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-00000000000a', '2026-07-21', 'Coach Diego', 'Buena recuperación física post-esguince, acorde al plan individual en curso.')
on conflict (id) do update set
  player_id = excluded.player_id, date = excluded.date, coach = excluded.coach, notes = excluded.notes;

-- =========================================================
-- physical_exercises (6) — prefijo 70000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into physical_exercises (id, name, sets, reps, rest_seconds, video_url, image_url, instructions) values
('70000000-0000-0000-0000-000000000001', 'Sentadilla', 3, '10', 60, null, null, 'Pies al ancho de hombros, bajar controlado sin que la rodilla supere la punta del pie.'),
('70000000-0000-0000-0000-000000000002', 'Zancadas', 3, '8 por pierna', 60, null, null, 'Paso largo, bajar hasta 90° en ambas rodillas.'),
('70000000-0000-0000-0000-000000000003', 'Salto (pliometría)', 3, '6', 90, null, null, 'Salto vertical máximo, aterrizaje suave con rodillas semi-flexionadas.'),
('70000000-0000-0000-0000-000000000004', 'Plancha (core)', 3, '30"', 45, null, null, 'Cuerpo alineado, sin elevar cadera.'),
('70000000-0000-0000-0000-000000000005', 'Elevación de talones', 3, '15', 45, null, null, 'Subir en punta de pie de forma controlada.'),
('70000000-0000-0000-0000-000000000006', 'Movilidad de cadera', 2, '10', 30, null, null, 'Círculos amplios de cadera, ambos sentidos.')
on conflict (id) do update set
  name = excluded.name, sets = excluded.sets, reps = excluded.reps, rest_seconds = excluded.rest_seconds,
  video_url = excluded.video_url, image_url = excluded.image_url, instructions = excluded.instructions;

-- =========================================================
-- routines (3 de plantilla + 1 plan individual) — prefijo 80000000-0000-0000-0000-0000000000xx
-- La última (...004) es un Plan Individual: player_id seteado (Ignacio
-- Torres), privada de él, con metadata de plan. Requiere haber corrido
-- 0027_individual_plans_as_routines.sql.
-- =========================================================
insert into routines (id, category, name, notes, created_by, player_id, objective, plan_type, focus_area, intensity, start_date, duration_weeks, session_duration_minutes, status) values
('80000000-0000-0000-0000-000000000001', 'C15', 'Fuerza de piernas', 'Rutina de fuerza general, dos veces por semana.', null, null, null, null, null, null, null, null, null, 'Activa'),
('80000000-0000-0000-0000-000000000002', 'C15', 'Activación pre-partido', 'Rutina corta de activación para el día previo al partido.', null, null, null, null, null, null, null, null, null, 'Activa'),
('80000000-0000-0000-0000-000000000003', 'C15', 'Rutina de grupos — Semanas 1 y 2 (Día MD-4)', 'Split por grupo físico, formato circuito.', null, null, null, null, null, null, null, null, null, 'Activa'),
('80000000-0000-0000-0000-000000000004', null, 'Fuerza de piernas post-esguince', null, null, '10000000-0000-0000-0000-00000000000a', 'Recuperar fuerza y estabilidad de tobillo tras esguince leve.', 'Rehabilitación', 'Tren inferior', 'Media', '2026-07-01', 4, 30, 'Activa')
on conflict (id) do update set
  category = excluded.category, name = excluded.name, notes = excluded.notes, player_id = excluded.player_id, objective = excluded.objective,
  plan_type = excluded.plan_type, focus_area = excluded.focus_area, intensity = excluded.intensity,
  start_date = excluded.start_date, duration_weeks = excluded.duration_weeks,
  session_duration_minutes = excluded.session_duration_minutes, status = excluded.status;

-- =========================================================
-- routine_groups — prefijo 1d000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into routine_groups (id, routine_id, name, focus, "order") values
('1d000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000003', 'Grupo 1', 'Fuerza & Potencia', 0),
('1d000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000003', 'Grupo 2', 'Velocidad & Pliometría alto impacto', 1),
('1d000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000003', 'Grupo 3', 'Mixto / Reactivo', 2)
on conflict (id) do update set name = excluded.name, focus = excluded.focus, "order" = excluded."order";

-- =========================================================
-- routine_circuits — prefijo 1e000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into routine_circuits (id, group_id, "order") values
('1e000000-0000-0000-0000-000000000001', '1d000000-0000-0000-0000-000000000001', 0),
('1e000000-0000-0000-0000-000000000002', '1d000000-0000-0000-0000-000000000002', 0),
('1e000000-0000-0000-0000-000000000003', '1d000000-0000-0000-0000-000000000003', 0)
on conflict (id) do update set group_id = excluded.group_id, "order" = excluded."order";

-- =========================================================
-- routine_exercises — prefijo 90000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into routine_exercises (id, routine_id, circuit_id, exercise_id, ad_hoc_name, "order", sets_override, reps_override, rest_seconds_override, notes) values
('90000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', null, '70000000-0000-0000-0000-000000000001', null, 1, null, null, null, null),
('90000000-0000-0000-0000-000000000002', '80000000-0000-0000-0000-000000000001', null, '70000000-0000-0000-0000-000000000002', null, 2, null, null, null, null),
('90000000-0000-0000-0000-000000000003', '80000000-0000-0000-0000-000000000001', null, '70000000-0000-0000-0000-000000000003', null, 3, null, null, null, null),
('90000000-0000-0000-0000-000000000004', '80000000-0000-0000-0000-000000000001', null, '70000000-0000-0000-0000-000000000004', null, 4, null, null, null, null),
('90000000-0000-0000-0000-000000000005', '80000000-0000-0000-0000-000000000002', null, '70000000-0000-0000-0000-000000000006', null, 1, null, null, null, null),
('90000000-0000-0000-0000-000000000006', '80000000-0000-0000-0000-000000000002', null, '70000000-0000-0000-0000-000000000005', null, 2, 2, null, 30, null),
('90000000-0000-0000-0000-000000000007', '80000000-0000-0000-0000-000000000002', null, '70000000-0000-0000-0000-000000000004', null, 3, 2, '20"', 30, null),
('90000000-0000-0000-0000-000000000008', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000001', null, 'Hip Thrust', 0, 3, '4-6', null, null),
('90000000-0000-0000-0000-000000000009', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000001', null, 'Dominadas supinas', 1, 3, '8', null, null),
('90000000-0000-0000-0000-00000000000a', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000001', null, 'Remo sentado', 2, 3, '12', null, null),
('90000000-0000-0000-0000-00000000000b', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000002', null, 'Saltos plio al step con lastre', 0, 3, '15', null, null),
('90000000-0000-0000-0000-00000000000c', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000002', null, 'Drop jumps desde cajón (30-40cm)', 1, 3, '5', null, 'Poco tiempo de contacto.'),
('90000000-0000-0000-0000-00000000000d', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000002', null, 'Aperturas planas', 2, 3, '8', null, null),
('90000000-0000-0000-0000-00000000000e', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000003', null, 'Zancadas búlgaras', 0, 3, '6 por pierna', null, null),
('90000000-0000-0000-0000-00000000000f', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000003', null, 'Press de banca', 1, 3, '12', null, null),
('90000000-0000-0000-0000-000000000010', '80000000-0000-0000-0000-000000000003', '1e000000-0000-0000-0000-000000000003', null, 'Push up al step', 2, 3, '8', null, null),
-- Plan individual (Ignacio Torres) — uno de biblioteca + dos sueltos.
('90000000-0000-0000-0000-000000000011', '80000000-0000-0000-0000-000000000004', null, '70000000-0000-0000-0000-000000000006', null, 0, 1, '10 min', null, null),
('90000000-0000-0000-0000-000000000012', '80000000-0000-0000-0000-000000000004', null, null, 'Elevación de talones unipodal', 1, 3, '15', null, null),
('90000000-0000-0000-0000-000000000013', '80000000-0000-0000-0000-000000000004', null, null, 'Sentadilla búlgara', 2, 3, '10', null, null)
on conflict (id) do update set
  routine_id = excluded.routine_id, circuit_id = excluded.circuit_id, exercise_id = excluded.exercise_id,
  ad_hoc_name = excluded.ad_hoc_name, "order" = excluded."order",
  sets_override = excluded.sets_override, reps_override = excluded.reps_override,
  rest_seconds_override = excluded.rest_seconds_override, notes = excluded.notes;

-- =========================================================
-- routine_exercise_weeks (progresión del plan individual) — prefijo 17000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into routine_exercise_weeks (id, routine_exercise_id, week_number, sets, reps) values
('17000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000012', 1, 3, '12'),
('17000000-0000-0000-0000-000000000002', '90000000-0000-0000-0000-000000000012', 2, 3, '15'),
('17000000-0000-0000-0000-000000000003', '90000000-0000-0000-0000-000000000012', 3, 4, '15'),
('17000000-0000-0000-0000-000000000004', '90000000-0000-0000-0000-000000000012', 4, 4, '20'),
('17000000-0000-0000-0000-000000000005', '90000000-0000-0000-0000-000000000013', 1, 2, '8'),
('17000000-0000-0000-0000-000000000006', '90000000-0000-0000-0000-000000000013', 2, 3, '10'),
('17000000-0000-0000-0000-000000000007', '90000000-0000-0000-0000-000000000013', 3, 3, '12'),
('17000000-0000-0000-0000-000000000008', '90000000-0000-0000-0000-000000000013', 4, 4, '12')
on conflict (id) do update set
  routine_exercise_id = excluded.routine_exercise_id, week_number = excluded.week_number,
  sets = excluded.sets, reps = excluded.reps;

-- =========================================================
-- routine_assignments — prefijo a0000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into routine_assignments (id, category, routine_id, date, assigned_to, created_by, notes) values
('a0000000-0000-0000-0000-000000000001', 'C15', '80000000-0000-0000-0000-000000000001', '2026-08-11', 'categoria', null, null),
('a0000000-0000-0000-0000-000000000002', 'C15', '80000000-0000-0000-0000-000000000002', '2026-08-14', 'categoria', null, null)
on conflict (id) do update set
  category = excluded.category, routine_id = excluded.routine_id, date = excluded.date, assigned_to = excluded.assigned_to, notes = excluded.notes;

-- =========================================================
-- tournaments (1) — prefijo 1a000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into tournaments (id, category, name, start_date, end_date, notes) values
('1a000000-0000-0000-0000-000000000001', 'C15', 'Apertura 2026', '2026-03-01', '2026-09-30', 'Torneo local regular de la categoría.')
on conflict (id) do update set
  category = excluded.category, name = excluded.name, start_date = excluded.start_date, end_date = excluded.end_date, notes = excluded.notes;

-- =========================================================
-- matches (2) — prefijo c0000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into matches (id, category, date, start_time, opponent, location, is_home, national_id, tournament_id, notes) values
('c0000000-0000-0000-0000-000000000001', 'C15', '2026-08-15', '15:00', 'Andes', 'Cancha Regatas', true, null, '1a000000-0000-0000-0000-000000000001', null),
('c0000000-0000-0000-0000-000000000002', 'C15', '2026-10-06', '15:00', 'Sportivo Norte', 'Córdoba', false, 'd0000000-0000-0000-0000-000000000001', null, 'Partido de fase de grupos del Nacional.')
on conflict (id) do update set
  category = excluded.category, date = excluded.date, start_time = excluded.start_time, opponent = excluded.opponent,
  location = excluded.location, is_home = excluded.is_home, national_id = excluded.national_id,
  tournament_id = excluded.tournament_id, notes = excluded.notes;

-- =========================================================
-- match_substitutions (tramos entrada/salida, partido vs. Andes)
-- prefijo 12000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into match_substitutions (id, match_id, player_id, in_minute, out_minute) values
('12000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 0, 40),
('12000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 0, 15),
('12000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 30, 40),
('12000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 0, 40),
('12000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 0, 35),
('12000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 0, 20),
('12000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 25, 35),
('12000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006', 0, 38),
('12000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000007', 20, 40),
('12000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', 0, 32),
('12000000-0000-0000-0000-00000000000b', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000009', 25, 40),
('12000000-0000-0000-0000-00000000000c', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-00000000000a', 0, 28),
('12000000-0000-0000-0000-00000000000d', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 0, 40),
('12000000-0000-0000-0000-00000000000e', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004', 0, 30),
('12000000-0000-0000-0000-00000000000f', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 10, 40)
on conflict (id) do update set
  match_id = excluded.match_id, player_id = excluded.player_id,
  in_minute = excluded.in_minute, out_minute = excluded.out_minute;

-- =========================================================
-- match_cards (partido vs. Andes y vs. Sportivo Norte)
-- prefijo 19000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into match_cards (id, match_id, player_id, type, minute, notes) values
('19000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-00000000000a', 'Amarilla', 22, null),
('19000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Amarilla', 15, null),
('19000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Azul', 30, null)
on conflict (id) do update set
  match_id = excluded.match_id, player_id = excluded.player_id, type = excluded.type, minute = excluded.minute;

-- =========================================================
-- match_goals (partido vs. Sportivo Norte, del Nacional)
-- prefijo 1c000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into match_goals (id, match_id, player_id, minute, notes) values
('1c000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 12, null),
('1c000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', 34, null),
('1c000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 25, null)
on conflict (id) do update set
  match_id = excluded.match_id, player_id = excluded.player_id, minute = excluded.minute;

-- =========================================================
-- match_injury_notes (molestias musculares, partido vs. Andes)
-- prefijo 1b000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into match_injury_notes (id, match_id, player_id, note) values
('1b000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Molestia leve en isquiotibial derecho, terminó el partido con precaución.')
on conflict (id) do update set
  match_id = excluded.match_id, player_id = excluded.player_id, note = excluded.note;

-- =========================================================
-- nationals (1) — prefijo d0000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into nationals (id, category, name, city, start_date, end_date, travel_date, return_date, info, default_flight_cost, default_lodging_cost, default_food_cost, default_transport_cost) values
('d0000000-0000-0000-0000-000000000001', 'C15', 'Nacional 2026', 'Córdoba', '2026-10-05', '2026-10-10', '2026-10-04', '2026-10-11', 'Torneo nacional de la categoría, fase de grupos + playoffs.', 150000, 120000, 40000, 20000)
on conflict (id) do update set
  category = excluded.category, name = excluded.name, city = excluded.city, start_date = excluded.start_date, end_date = excluded.end_date,
  travel_date = excluded.travel_date, return_date = excluded.return_date, info = excluded.info,
  default_flight_cost = excluded.default_flight_cost, default_lodging_cost = excluded.default_lodging_cost,
  default_food_cost = excluded.default_food_cost, default_transport_cost = excluded.default_transport_cost;

-- =========================================================
-- national_activities — prefijo e0000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into national_activities (id, national_id, date, time, type, title, notes, match_id, routine_id) values
('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '2026-10-04', '08:00', 'viaje', 'Viaje a Córdoba', null, null, null),
('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '2026-10-06', '10:00', 'rutina', 'Activación pre-partido', null, null, '80000000-0000-0000-0000-000000000002'),
('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '2026-10-06', '12:00', 'entrenamiento', 'Táctica pre-partido', 'Trabajar achique en el 4-0 y salida jugando ante presión alta.', null, null),
('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', '2026-10-06', '15:00', 'partido', 'Partido vs. Sportivo Norte', null, 'c0000000-0000-0000-0000-000000000002', null),
('e0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', '2026-10-07', '09:00', 'rutina', 'Recuperación post partido', null, null, null),
('e0000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000001', '2026-10-07', '13:00', 'comida', 'Almuerzo del equipo', null, null, null),
('e0000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000001', '2026-10-11', '09:00', 'viaje', 'Regreso', null, null, null)
on conflict (id) do update set
  national_id = excluded.national_id, date = excluded.date, time = excluded.time, type = excluded.type,
  title = excluded.title, notes = excluded.notes, match_id = excluded.match_id, routine_id = excluded.routine_id;

-- =========================================================
-- national_expenses — prefijo f0000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into national_expenses (id, national_id, category, description, amount) values
('f0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Vuelos', 'Pasajes ida y vuelta del plantel', 1200000),
('f0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'Alojamiento', 'Hotel, 6 noches', 900000),
('f0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'Inscripción', 'Inscripción al torneo', 150000)
on conflict (id) do update set
  national_id = excluded.national_id, category = excluded.category, description = excluded.description, amount = excluded.amount;

-- =========================================================
-- national_player_costs — prefijo 11000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into national_player_costs (id, national_id, player_id, flight_cost, lodging_cost, food_cost, transport_cost, minutes_played, goals, yellow_cards, blue_cards, notes) values
('11000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 150000, 120000, 40000, 20000, 40, 1, 0, 1, 'Capitán, referente del grupo en la gira.'),
('11000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 150000, 120000, 40000, 20000, 30, 0, 0, 0, null),
('11000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 150000, 120000, 40000, 20000, 40, 2, 0, 0, null),
('11000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 150000, 120000, 40000, 20000, 0, 0, 1, 0, null)
on conflict (id) do update set
  national_id = excluded.national_id, player_id = excluded.player_id, flight_cost = excluded.flight_cost,
  lodging_cost = excluded.lodging_cost, food_cost = excluded.food_cost, transport_cost = excluded.transport_cost,
  minutes_played = excluded.minutes_played, goals = excluded.goals,
  yellow_cards = excluded.yellow_cards, blue_cards = excluded.blue_cards, notes = excluded.notes;

-- =========================================================
-- national_payments (historial de pagos) — prefijo 1f000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into national_payments (id, national_player_cost_id, amount, date, notes) values
('1f000000-0000-0000-0000-000000000001', '11000000-0000-0000-0000-000000000001', 150000, '2026-09-15', null),
('1f000000-0000-0000-0000-000000000002', '11000000-0000-0000-0000-000000000001', 180000, '2026-09-28', null),
('1f000000-0000-0000-0000-000000000003', '11000000-0000-0000-0000-000000000002', 150000, '2026-09-20', 'Seña.'),
('1f000000-0000-0000-0000-000000000004', '11000000-0000-0000-0000-000000000004', 330000, '2026-09-10', null)
on conflict (id) do update set
  national_player_cost_id = excluded.national_player_cost_id, amount = excluded.amount,
  date = excluded.date, notes = excluded.notes;

-- =========================================================
-- physical_tests (salto y velocidad — peso/altura viven en players)
-- prefijo 13000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into physical_tests (id, player_id, date, test_name, value, unit, notes, created_by) values
('13000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '2026-04-01', 'Salto vertical (CMJ)', 42, 'cm', null, null),
('13000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '2026-04-01', 'Velocidad 15m', 2.35, 's', null, null),
('13000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '2026-07-15', 'Salto vertical (CMJ)', 44, 'cm', null, null),
('13000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '2026-04-01', 'Velocidad 20m', 3.10, 's', null, null),
('13000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '2026-04-01', 'Salto vertical (CMJ)', 46, 'cm', null, null),
('13000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000005', '2026-04-01', 'Velocidad 15m', 2.28, 's', null, null),
('13000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '2026-07-15', 'Squat Jump', 34.44, 'cm', null, null)
on conflict (id) do update set
  player_id = excluded.player_id, date = excluded.date, test_name = excluded.test_name,
  value = excluded.value, unit = excluded.unit, notes = excluded.notes;

-- =========================================================
-- physical_test_reps (repeticiones cm+ms del Squat Jump de arriba)
-- prefijo 13100000-0000-0000-0000-0000000000xx
-- Requiere haber corrido 0029_physical_test_reps.sql.
-- =========================================================
insert into physical_test_reps (id, test_id, rep_number, value_cm, value_ms) values
('13100000-0000-0000-0000-000000000001', '13000000-0000-0000-0000-000000000007', 1, 34.18, 528),
('13100000-0000-0000-0000-000000000002', '13000000-0000-0000-0000-000000000007', 2, 34.44, 530)
on conflict (id) do update set
  test_id = excluded.test_id, rep_number = excluded.rep_number,
  value_cm = excluded.value_cm, value_ms = excluded.value_ms;

-- =========================================================
-- becados y socios con cuota (DNIs ficticios)
-- prefijo 14000000-0000-0000-0000-0000000000xx
-- Requiere haber corrido 0009_coordinador_becados.sql y 0011_becados_tipo.sql.
-- =========================================================
insert into becados (id, first_name, last_name, dni, type, status, notes) values
('14000000-0000-0000-0000-000000000001', 'Camila', 'Suárez', '40111222', 'Becado', 'Activo', null),
('14000000-0000-0000-0000-000000000002', 'Tomás', 'Herrera', '41222333', 'Becado', 'Activo', null),
('14000000-0000-0000-0000-000000000003', 'Rocío', 'Paz', '39555666', 'Becado', 'Inactivo', 'Beca vencida en julio 2026.'),
('14000000-0000-0000-0000-000000000004', 'Nicolás', 'Vega', '42333444', 'Cuota', 'Activo', null),
('14000000-0000-0000-0000-000000000005', 'Agustina', 'Ríos', '43444555', 'Cuota', 'Inactivo', 'Atrasada dos meses.')
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, dni = excluded.dni,
  type = excluded.type, status = excluded.status, notes = excluded.notes;

-- =========================================================
-- player_report_notes — prefijo 18000000-0000-0000-0000-0000000000xx
-- =========================================================
insert into player_report_notes (id, player_id, note, created_by) values
('18000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-00000000000a', 'Buena evolución en el plan de fuerza post-esguince. Falta trabajar la confianza para encarar 1 vs 1 del lado lesionado.', null)
on conflict (id) do update set
  player_id = excluded.player_id, note = excluded.note;
