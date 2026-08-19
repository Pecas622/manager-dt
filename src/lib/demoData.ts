// Datos demo del club "Regatas C15" — el mismo contenido que
// supabase/seed/seed_demo.sql, pero como objetos JS para poder cargarlos
// desde el frontend (con el cliente de Supabase ya autenticado como DT,
// respetando las mismas policies de RLS que un insert manual).
//
// Usa los mismos UUIDs fijos que el script SQL, así ambos caminos son
// intercambiables y `cleanup_demo.sql` borra igual los datos cargados
// desde acá.

export const DEMO_PLAYERS = [
  { id: "10000000-0000-0000-0000-000000000001", first_name: "Juan", last_name: "Pérez", photo_url: null, birth_date: "2011-03-14", jersey_number: 10, position: "Ala", preferred_foot: "Derecha", join_date: "2024-02-01", status: "Activo", weight_kg: 63.8, height_cm: 168, strengths: "Buen 1 vs 1, velocidad y buena intensidad defensiva.", weaknesses: "Mejorar toma de decisiones bajo presión.", notes: "Capitán del equipo." },
  { id: "10000000-0000-0000-0000-000000000002", first_name: "Mateo", last_name: "Gómez", photo_url: null, birth_date: "2011-06-02", jersey_number: 7, position: "Pivot", preferred_foot: "Izquierda", join_date: "2024-02-01", status: "Activo", strengths: "Buen juego de espaldas y protección de pelota.", weaknesses: "Definición con la pierna izquierda.", notes: null },
  { id: "10000000-0000-0000-0000-000000000003", first_name: "Benjamín", last_name: "Fernández", photo_url: null, birth_date: "2011-01-22", jersey_number: 1, position: "Arquero", preferred_foot: "Derecha", join_date: "2024-02-01", status: "Activo", weight_kg: 65, height_cm: 172, strengths: "Buenos reflejos y salida de pelota jugando con los pies.", weaknesses: "Colocación en tiros de media distancia.", notes: null },
  { id: "10000000-0000-0000-0000-000000000004", first_name: "Santino", last_name: "Rodríguez", photo_url: null, birth_date: "2011-09-10", jersey_number: 4, position: "Cierre", preferred_foot: "Derecha", join_date: "2024-08-15", status: "Activo", weight_kg: 58, height_cm: 165, strengths: "Buena lectura defensiva y marca.", weaknesses: "Salida jugando bajo presión.", notes: null },
  { id: "10000000-0000-0000-0000-000000000005", first_name: "Thiago", last_name: "Martínez", photo_url: null, birth_date: "2011-04-18", jersey_number: 8, position: "Ala", preferred_foot: "Izquierda", join_date: "2024-02-01", status: "Activo", weight_kg: 60.2, height_cm: 170, strengths: "Desequilibrante en el 1 vs 1, buen remate de media distancia.", weaknesses: "Trabajo defensivo tras pérdida.", notes: null },
  { id: "10000000-0000-0000-0000-000000000006", first_name: "Valentino", last_name: "López", photo_url: null, birth_date: "2011-11-05", jersey_number: 5, position: "Universal", preferred_foot: "Derecha", join_date: "2025-02-03", status: "Activo", strengths: "Versátil, entiende bien los sistemas de juego.", weaknesses: "Consistencia en los pases largos.", notes: null },
  { id: "10000000-0000-0000-0000-000000000007", first_name: "Lautaro", last_name: "Díaz", photo_url: null, birth_date: "2011-07-29", jersey_number: 12, position: "Pivot", preferred_foot: "Derecha", join_date: "2025-02-03", status: "Activo", strengths: "Fuerza y buen juego aéreo.", weaknesses: "Movilidad sin la pelota.", notes: null },
  { id: "10000000-0000-0000-0000-000000000008", first_name: "Bautista", last_name: "Sánchez", photo_url: null, birth_date: "2011-02-14", jersey_number: 2, position: "Cierre", preferred_foot: "Izquierda", join_date: "2024-02-01", status: "Activo", strengths: "Anticipación y buena salida con la pelota dominada.", weaknesses: "Duelos individuales cuerpo a cuerpo.", notes: null },
  { id: "10000000-0000-0000-0000-000000000009", first_name: "Joaquín", last_name: "Romero", photo_url: null, birth_date: "2011-05-20", jersey_number: 11, position: "Ala", preferred_foot: "Derecha", join_date: "2025-08-01", status: "Activo", strengths: "Buena pierna derecha, remata bien de media distancia.", weaknesses: "Intensidad en la marca.", notes: "Incorporación reciente." },
  { id: "10000000-0000-0000-0000-00000000000a", first_name: "Ignacio", last_name: "Torres", photo_url: null, birth_date: "2011-10-08", jersey_number: 3, position: "Cierre", preferred_foot: "Derecha", join_date: "2024-02-01", status: "Activo", strengths: "Buen líder defensivo, marca fuerte.", weaknesses: "Tranquilidad con la pelota dominada.", notes: null },
  { id: "10000000-0000-0000-0000-00000000000b", first_name: "Facundo", last_name: "Álvarez", photo_url: null, birth_date: "2011-03-30", jersey_number: 9, position: "Universal", preferred_foot: "Izquierda", join_date: "2025-02-03", status: "Activo", strengths: "Polivalente, buen manejo de ambas piernas.", weaknesses: "Toma de decisión en el último tercio.", notes: null },
  { id: "10000000-0000-0000-0000-00000000000c", first_name: "Agustín", last_name: "Ramírez", photo_url: null, birth_date: "2011-08-16", jersey_number: 13, position: "Arquero", preferred_foot: "Derecha", join_date: "2025-02-03", status: "Activo", strengths: "Bueno debajo de los tres palos, buenos reflejos.", weaknesses: "Juego con los pies.", notes: null },
  { id: "10000000-0000-0000-0000-00000000000d", first_name: "Franco", last_name: "Flores", photo_url: null, birth_date: "2011-12-01", jersey_number: 6, position: "Ala", preferred_foot: "Derecha", join_date: "2024-02-01", status: "Activo", strengths: "Buena progresión con la pelota dominada.", weaknesses: "Definición de gol.", notes: null },
  { id: "10000000-0000-0000-0000-00000000000e", first_name: "Dante", last_name: "Acosta", photo_url: null, birth_date: "2011-01-09", jersey_number: 14, position: "Pivot", preferred_foot: "Izquierda", join_date: "2025-08-01", status: "Activo", strengths: "Buen socio de juego, da profundidad.", weaknesses: "Juego aéreo.", notes: null },
  { id: "10000000-0000-0000-0000-00000000000f", first_name: "Ciro", last_name: "Benítez", photo_url: null, birth_date: "2011-06-25", jersey_number: 15, position: "Universal", preferred_foot: "Derecha", join_date: "2024-08-15", status: "Activo", strengths: "Buen recorrido de cancha, gran esfuerzo.", weaknesses: "Precisión en el último pase.", notes: null },
  { id: "10000000-0000-0000-0000-000000000010", first_name: "Simón", last_name: "Molina", photo_url: null, birth_date: "2011-04-03", jersey_number: 16, position: "Ala", preferred_foot: "Izquierda", join_date: "2025-02-03", status: "Activo", strengths: "Encarador, buena gambeta corta.", weaknesses: "Ida y vuelta en transición.", notes: null },
  { id: "10000000-0000-0000-0000-000000000011", first_name: "Máximo", last_name: "Castro", photo_url: null, birth_date: "2011-09-27", jersey_number: 17, position: "Cierre", preferred_foot: "Derecha", join_date: "2025-08-01", status: "Inactivo", strengths: "Fuerte en el mano a mano.", weaknesses: "Salida jugando desde el fondo.", notes: "Lesionado, en recuperación." },
  { id: "10000000-0000-0000-0000-000000000012", first_name: "Julián", last_name: "Ortiz", photo_url: null, birth_date: "2011-11-19", jersey_number: 18, position: "Arquero", preferred_foot: "Izquierda", join_date: "2025-08-01", status: "Activo", strengths: "Buena estatura y cobertura del arco.", weaknesses: "Comunicación con la defensa.", notes: "Suplente, en desarrollo." },
]

export const DEMO_TRAINING_EXERCISES = [
  { id: "20000000-0000-0000-0000-000000000001", name: "Rondo 4v1", category: "Técnica", duration: 15, objective: "Conservación y movilidad de la pelota.", description: "Cuatro jugadores en rondo alrededor de un defensor, dos toques máximo.", players_count: "5", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-000000000002", name: "Rondo 5v2", category: "Técnica", duration: 15, objective: "Conservación bajo presión.", description: "Cinco atacantes conservan la pelota ante dos defensores dentro de un espacio reducido.", players_count: "7", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-000000000003", name: "1 vs 1", category: "Técnica", duration: 10, objective: "Desequilibrio y definición.", description: "Duelos individuales hacia un arco chico, salida desde el entrenador.", players_count: "2-4", materials: "Conos, arcos chicos", notes: null },
  { id: "20000000-0000-0000-0000-000000000004", name: "2 vs 1", category: "Transición", duration: 10, objective: "Superioridad numérica y definición rápida.", description: "Dos atacantes contra un defensor en espacio reducido hacia el arco.", players_count: "3", materials: "Conos", notes: null },
  { id: "20000000-0000-0000-0000-000000000005", name: "2 vs 2", category: "Táctica", duration: 15, objective: "Juego asociado en espacios reducidos.", description: "Dos parejas enfrentadas trabajando apoyos y desmarques.", players_count: "4", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-000000000006", name: "3v2 transición", category: "Transición", duration: 20, objective: "Transición ataque-defensa.", description: "Tres atacantes contra dos defensores, con repliegue inmediato tras la definición.", players_count: "5", materials: "Conos, arcos", notes: null },
  { id: "20000000-0000-0000-0000-000000000007", name: "4v3", category: "Táctica", duration: 15, objective: "Superioridad numérica y ocupación de espacios.", description: "Cuatro atacantes contra tres defensores en media cancha.", players_count: "7", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-000000000008", name: "Finalización", category: "Definición", duration: 15, objective: "Precisión y definición ante el arquero.", description: "Circuito de centros y remates variando ángulos de definición.", players_count: "6-8", materials: "Conos, arcos, pelotas", notes: null },
  { id: "20000000-0000-0000-0000-000000000009", name: "4v4 presión", category: "Presión", duration: 25, objective: "Presión tras pérdida.", description: "Juego 4v4 con arcos, foco en la presión inmediata tras perder la pelota.", players_count: "8", materials: "Conos, pecheras, arcos", notes: null },
  { id: "20000000-0000-0000-0000-00000000000a", name: "Salida de presión", category: "Presión", duration: 15, objective: "Salida limpia ante presión rival.", description: "Construcción desde el arquero con presión alta del rival.", players_count: "8-10", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-00000000000b", name: "Partido condicionado", category: "Juego reducido", duration: 15, objective: "Aplicar los conceptos trabajados en el entrenamiento.", description: "Partido con una o dos condiciones tácticas ligadas al objetivo del día.", players_count: "10-12", materials: "Pecheras, arcos", notes: null },
  { id: "20000000-0000-0000-0000-00000000000c", name: "Pelota parada", category: "Pelota parada", duration: 10, objective: "Definición y organización en jugadas de pelota detenida.", description: "Ensayo de córners y laterales ofensivos y defensivos.", players_count: "10", materials: "Conos, pecheras", notes: null },
  { id: "20000000-0000-0000-0000-00000000000d", name: "Activación + movilidad", category: "Activación", duration: 10, objective: "Activación general y prevención de lesiones.", description: "Movilidad articular, skipping y activación con pelota.", players_count: "Todo el plantel", materials: "Conos, escalera de velocidad", notes: null },
  { id: "20000000-0000-0000-0000-00000000000e", name: "Juego reducido 5v5", category: "Juego reducido", duration: 20, objective: "Ocupación de espacios y circulación rápida.", description: "Partido reducido 5v5 en espacio acotado con transiciones rápidas.", players_count: "10", materials: "Pecheras, arcos", notes: null },
]

export const DEMO_TRAINING_SESSIONS = [
  { id: "30000000-0000-0000-0000-000000000001", date: "2026-08-03", start_time: "18:00", duration: 75, main_objective: "Conservación y transición ofensiva.", secondary_objectives: "Trabajar la salida corta y la presión tras pérdida.", notes: "Cancha techada, primer entrenamiento de la semana.", observations: "El equipo mostró buena intensidad en el rondo. En el 3v2 costó mantener el orden en la transición defensiva las primeras series, mejoró hacia el final.", focus_areas: "Reforzar la cobertura del segundo defensor en la transición defensiva." },
  { id: "30000000-0000-0000-0000-000000000002", date: "2026-08-05", start_time: "18:00", duration: 75, main_objective: "Circulación de pelota y definición.", secondary_objectives: "Mejorar la puntería en situaciones de finalización.", notes: null, observations: "Buena circulación en el rondo 5v2. En finalización faltó precisión con la pierna izquierda en varios jugadores.", focus_areas: "Sumar trabajo específico de definición con pierna izquierda en la próxima semana." },
  { id: "30000000-0000-0000-0000-000000000003", date: "2026-08-07", start_time: "18:00", duration: 75, main_objective: "Salida de presión y juego reducido.", secondary_objectives: "Sostener la intensidad en los últimos minutos.", notes: null, observations: "Muy buena salida de presión ante el bloque alto simulado. El partido condicionado mostró cansancio acumulado en el último tramo.", focus_areas: "Trabajar resistencia específica para sostener la intensidad los 75 minutos." },
]

export const DEMO_SESSION_EXERCISES = [
  { id: "40000000-0000-0000-0000-000000000001", training_session_id: "30000000-0000-0000-0000-000000000001", exercise_id: "20000000-0000-0000-0000-000000000001", order: 1, duration: 15, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000002", training_session_id: "30000000-0000-0000-0000-000000000001", exercise_id: "20000000-0000-0000-0000-000000000006", order: 2, duration: 20, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000003", training_session_id: "30000000-0000-0000-0000-000000000001", exercise_id: "20000000-0000-0000-0000-000000000009", order: 3, duration: 25, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000004", training_session_id: "30000000-0000-0000-0000-000000000001", exercise_id: "20000000-0000-0000-0000-00000000000b", order: 4, duration: 15, specific_notes: "Condición: gol solo tras 3 pases." },
  { id: "40000000-0000-0000-0000-000000000005", training_session_id: "30000000-0000-0000-0000-000000000002", exercise_id: "20000000-0000-0000-0000-00000000000d", order: 1, duration: 10, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000006", training_session_id: "30000000-0000-0000-0000-000000000002", exercise_id: "20000000-0000-0000-0000-000000000002", order: 2, duration: 15, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000007", training_session_id: "30000000-0000-0000-0000-000000000002", exercise_id: "20000000-0000-0000-0000-000000000007", order: 3, duration: 20, specific_notes: null },
  { id: "40000000-0000-0000-0000-000000000008", training_session_id: "30000000-0000-0000-0000-000000000002", exercise_id: "20000000-0000-0000-0000-000000000008", order: 4, duration: 15, specific_notes: "Foco en definición con pierna izquierda." },
  { id: "40000000-0000-0000-0000-000000000009", training_session_id: "30000000-0000-0000-0000-000000000002", exercise_id: "20000000-0000-0000-0000-00000000000b", order: 5, duration: 15, specific_notes: null },
  { id: "40000000-0000-0000-0000-00000000000a", training_session_id: "30000000-0000-0000-0000-000000000003", exercise_id: "20000000-0000-0000-0000-00000000000d", order: 1, duration: 10, specific_notes: null },
  { id: "40000000-0000-0000-0000-00000000000b", training_session_id: "30000000-0000-0000-0000-000000000003", exercise_id: "20000000-0000-0000-0000-000000000005", order: 2, duration: 15, specific_notes: null },
  { id: "40000000-0000-0000-0000-00000000000c", training_session_id: "30000000-0000-0000-0000-000000000003", exercise_id: "20000000-0000-0000-0000-00000000000a", order: 3, duration: 20, specific_notes: "Presión alta simulada con 4 jugadores." },
  { id: "40000000-0000-0000-0000-00000000000d", training_session_id: "30000000-0000-0000-0000-000000000003", exercise_id: "20000000-0000-0000-0000-00000000000e", order: 4, duration: 20, specific_notes: null },
  { id: "40000000-0000-0000-0000-00000000000e", training_session_id: "30000000-0000-0000-0000-000000000003", exercise_id: "20000000-0000-0000-0000-00000000000b", order: 5, duration: 10, specific_notes: null },
]

export const DEMO_TRAINING_PLAYER_NOTES = [
  { id: "60000000-0000-0000-0000-000000000001", training_session_id: "30000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000001", note: "Muy buena presión tras pérdida, se recuperó dos veces en el 4v4." },
  { id: "60000000-0000-0000-0000-000000000002", training_session_id: "30000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-00000000000a", note: "Ordenó bien la línea defensiva en el 3v2." },
  { id: "60000000-0000-0000-0000-000000000003", training_session_id: "30000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000005", note: "Mejoró mucho la definición de media distancia con la derecha." },
  { id: "60000000-0000-0000-0000-000000000004", training_session_id: "30000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000006", note: "Buena toma de decisiones en el 4v3, eligió bien el último pase." },
  { id: "60000000-0000-0000-0000-000000000005", training_session_id: "30000000-0000-0000-0000-000000000003", player_id: "10000000-0000-0000-0000-000000000003", note: "Gran actuación en el mano a mano durante el partido condicionado." },
  { id: "60000000-0000-0000-0000-000000000006", training_session_id: "30000000-0000-0000-0000-000000000003", player_id: "10000000-0000-0000-0000-00000000000b", note: "Sostuvo la intensidad en los últimos minutos mejor que el resto del grupo." },
]

// Check-in físico periódico (fecha + entrenador + observaciones) — los
// números (peso, altura, salto, velocidad) van de la mano de lo que ya
// carga Tests físicos y la ficha del jugador, no se duplican acá.
export const DEMO_PLAYER_EVALUATIONS = [
  { id: "50000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-04-14", coach: "Coach Diego", notes: "Buen arranque de temporada, líder dentro de la cancha. Sigue creciendo en fuerza de piernas." },
  { id: "50000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-07-21", coach: "Coach Diego", notes: "Progreso claro en velocidad y salto respecto al check-in anterior." },
  { id: "50000000-0000-0000-0000-000000000003", player_id: "10000000-0000-0000-0000-000000000004", date: "2026-04-14", coach: "Coach Diego", notes: "Sólido físicamente, sumar trabajo de movilidad de cadera." },
  { id: "50000000-0000-0000-0000-000000000005", player_id: "10000000-0000-0000-0000-000000000005", date: "2026-04-14", coach: "Coach Diego", notes: "Buen salto vertical, trabajar resistencia para sostenerlo los 40 minutos." },
  { id: "50000000-0000-0000-0000-000000000007", player_id: "10000000-0000-0000-0000-000000000003", date: "2026-04-14", coach: "Coach Diego", notes: "Buenos reflejos, estatura acorde a la categoría." },
  { id: "50000000-0000-0000-0000-000000000013", player_id: "10000000-0000-0000-0000-000000000009", date: "2026-08-04", coach: "Coach Diego", notes: "Check-in inicial tras su incorporación, arranca el seguimiento físico desde acá." },
  { id: "50000000-0000-0000-0000-000000000014", player_id: "10000000-0000-0000-0000-00000000000a", date: "2026-07-21", coach: "Coach Diego", notes: "Buena recuperación física post-esguince, acorde al plan individual en curso." },
]

export const DEMO_PHYSICAL_EXERCISES = [
  { id: "70000000-0000-0000-0000-000000000001", name: "Sentadilla", sets: 3, reps: "10", rest_seconds: 60, video_url: null, image_url: null, instructions: "Pies al ancho de hombros, bajar controlado sin que la rodilla supere la punta del pie." },
  { id: "70000000-0000-0000-0000-000000000002", name: "Zancadas", sets: 3, reps: "8 por pierna", rest_seconds: 60, video_url: null, image_url: null, instructions: "Paso largo, bajar hasta 90° en ambas rodillas." },
  { id: "70000000-0000-0000-0000-000000000003", name: "Salto (pliometría)", sets: 3, reps: "6", rest_seconds: 90, video_url: null, image_url: null, instructions: "Salto vertical máximo, aterrizaje suave con rodillas semi-flexionadas." },
  { id: "70000000-0000-0000-0000-000000000004", name: "Plancha (core)", sets: 3, reps: '30"', rest_seconds: 45, video_url: null, image_url: null, instructions: "Cuerpo alineado, sin elevar cadera." },
  { id: "70000000-0000-0000-0000-000000000005", name: "Elevación de talones", sets: 3, reps: "15", rest_seconds: 45, video_url: null, image_url: null, instructions: "Subir en punta de pie de forma controlada." },
  { id: "70000000-0000-0000-0000-000000000006", name: "Movilidad de cadera", sets: 2, reps: "10", rest_seconds: 30, video_url: null, image_url: null, instructions: "Círculos amplios de cadera, ambos sentidos." },
]

// La última (id ...004) es un Plan Individual: una rutina con player_id
// seteado — privada de Ignacio Torres, con metadata de plan y progresión
// semanal en sus ejercicios (ver DEMO_ROUTINE_EXERCISE_WEEKS).
export const DEMO_ROUTINES = [
  { id: "80000000-0000-0000-0000-000000000001", name: "Fuerza de piernas", notes: "Rutina de fuerza general, dos veces por semana.", created_by: null, player_id: null, objective: null, plan_type: null, focus_area: null, intensity: null, start_date: null, duration_weeks: null, session_duration_minutes: null, status: "Activa" },
  { id: "80000000-0000-0000-0000-000000000002", name: "Activación pre-partido", notes: "Rutina corta de activación para el día previo al partido.", created_by: null, player_id: null, objective: null, plan_type: null, focus_area: null, intensity: null, start_date: null, duration_weeks: null, session_duration_minutes: null, status: "Activa" },
  { id: "80000000-0000-0000-0000-000000000003", name: "Rutina de grupos — Semanas 1 y 2 (Día MD-4)", notes: "Split por grupo físico, formato circuito.", created_by: null, player_id: null, objective: null, plan_type: null, focus_area: null, intensity: null, start_date: null, duration_weeks: null, session_duration_minutes: null, status: "Activa" },
  { id: "80000000-0000-0000-0000-000000000004", name: "Fuerza de piernas post-esguince", notes: null, created_by: null, player_id: "10000000-0000-0000-0000-00000000000a", objective: "Recuperar fuerza y estabilidad de tobillo tras esguince leve.", plan_type: "Rehabilitación", focus_area: "Tren inferior", intensity: "Media", start_date: "2026-07-01", duration_weeks: 4, session_duration_minutes: 30, status: "Activa" },
]

// Grupos y circuitos de la rutina "de grupos" — muestra el formato de
// cartel de entrenamiento (3 grupos en paralelo, cada uno con su circuito).
export const DEMO_ROUTINE_GROUPS = [
  { id: "1d000000-0000-0000-0000-000000000001", routine_id: "80000000-0000-0000-0000-000000000003", name: "Grupo 1", focus: "Fuerza & Potencia", order: 0 },
  { id: "1d000000-0000-0000-0000-000000000002", routine_id: "80000000-0000-0000-0000-000000000003", name: "Grupo 2", focus: "Velocidad & Pliometría alto impacto", order: 1 },
  { id: "1d000000-0000-0000-0000-000000000003", routine_id: "80000000-0000-0000-0000-000000000003", name: "Grupo 3", focus: "Mixto / Reactivo", order: 2 },
]

export const DEMO_ROUTINE_CIRCUITS = [
  { id: "1e000000-0000-0000-0000-000000000001", group_id: "1d000000-0000-0000-0000-000000000001", order: 0 },
  { id: "1e000000-0000-0000-0000-000000000002", group_id: "1d000000-0000-0000-0000-000000000002", order: 0 },
  { id: "1e000000-0000-0000-0000-000000000003", group_id: "1d000000-0000-0000-0000-000000000003", order: 0 },
]

export const DEMO_ROUTINE_EXERCISES = [
  { id: "90000000-0000-0000-0000-000000000001", routine_id: "80000000-0000-0000-0000-000000000001", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000001", ad_hoc_name: null, order: 1, sets_override: null, reps_override: null, rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000002", routine_id: "80000000-0000-0000-0000-000000000001", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000002", ad_hoc_name: null, order: 2, sets_override: null, reps_override: null, rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000003", routine_id: "80000000-0000-0000-0000-000000000001", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000003", ad_hoc_name: null, order: 3, sets_override: null, reps_override: null, rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000004", routine_id: "80000000-0000-0000-0000-000000000001", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000004", ad_hoc_name: null, order: 4, sets_override: null, reps_override: null, rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000005", routine_id: "80000000-0000-0000-0000-000000000002", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000006", ad_hoc_name: null, order: 1, sets_override: null, reps_override: null, rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000006", routine_id: "80000000-0000-0000-0000-000000000002", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000005", ad_hoc_name: null, order: 2, sets_override: 2, reps_override: null, rest_seconds_override: 30, notes: null },
  { id: "90000000-0000-0000-0000-000000000007", routine_id: "80000000-0000-0000-0000-000000000002", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000004", ad_hoc_name: null, order: 3, sets_override: 2, reps_override: '20"', rest_seconds_override: 30, notes: null },
  // Grupo 1 (Fuerza & Potencia) — Circuito 1
  { id: "90000000-0000-0000-0000-000000000008", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000001", exercise_id: null, ad_hoc_name: "Hip Thrust", order: 0, sets_override: 3, reps_override: "4-6", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000009", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000001", exercise_id: null, ad_hoc_name: "Dominadas supinas", order: 1, sets_override: 3, reps_override: "8", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-00000000000a", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000001", exercise_id: null, ad_hoc_name: "Remo sentado", order: 2, sets_override: 3, reps_override: "12", rest_seconds_override: null, notes: null },
  // Grupo 2 (Velocidad & Pliometría) — Circuito 1
  { id: "90000000-0000-0000-0000-00000000000b", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000002", exercise_id: null, ad_hoc_name: "Saltos plio al step con lastre", order: 0, sets_override: 3, reps_override: "15", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-00000000000c", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000002", exercise_id: null, ad_hoc_name: "Drop jumps desde cajón (30-40cm)", order: 1, sets_override: 3, reps_override: "5", rest_seconds_override: null, notes: "Poco tiempo de contacto." },
  { id: "90000000-0000-0000-0000-00000000000d", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000002", exercise_id: null, ad_hoc_name: "Aperturas planas", order: 2, sets_override: 3, reps_override: "8", rest_seconds_override: null, notes: null },
  // Grupo 3 (Mixto / Reactivo) — Circuito 1
  { id: "90000000-0000-0000-0000-00000000000e", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000003", exercise_id: null, ad_hoc_name: "Zancadas búlgaras", order: 0, sets_override: 3, reps_override: "6 por pierna", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-00000000000f", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000003", exercise_id: null, ad_hoc_name: "Press de banca", order: 1, sets_override: 3, reps_override: "12", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000010", routine_id: "80000000-0000-0000-0000-000000000003", circuit_id: "1e000000-0000-0000-0000-000000000003", exercise_id: null, ad_hoc_name: "Push up al step", order: 2, sets_override: 3, reps_override: "8", rest_seconds_override: null, notes: null },
  // Plan individual (Ignacio Torres) — un ejercicio de la biblioteca física
  // + dos sueltos, con progresión de series/reps semana a semana (ver
  // DEMO_ROUTINE_EXERCISE_WEEKS) en los dos sueltos.
  { id: "90000000-0000-0000-0000-000000000011", routine_id: "80000000-0000-0000-0000-000000000004", circuit_id: null, exercise_id: "70000000-0000-0000-0000-000000000006", ad_hoc_name: null, order: 0, sets_override: 1, reps_override: "10 min", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000012", routine_id: "80000000-0000-0000-0000-000000000004", circuit_id: null, exercise_id: null, ad_hoc_name: "Elevación de talones unipodal", order: 1, sets_override: 3, reps_override: "15", rest_seconds_override: null, notes: null },
  { id: "90000000-0000-0000-0000-000000000013", routine_id: "80000000-0000-0000-0000-000000000004", circuit_id: null, exercise_id: null, ad_hoc_name: "Sentadilla búlgara", order: 2, sets_override: 3, reps_override: "10", rest_seconds_override: null, notes: null },
]

export const DEMO_ROUTINE_EXERCISE_WEEKS = [
  { id: "17000000-0000-0000-0000-000000000001", routine_exercise_id: "90000000-0000-0000-0000-000000000012", week_number: 1, sets: 3, reps: "12" },
  { id: "17000000-0000-0000-0000-000000000002", routine_exercise_id: "90000000-0000-0000-0000-000000000012", week_number: 2, sets: 3, reps: "15" },
  { id: "17000000-0000-0000-0000-000000000003", routine_exercise_id: "90000000-0000-0000-0000-000000000012", week_number: 3, sets: 4, reps: "15" },
  { id: "17000000-0000-0000-0000-000000000004", routine_exercise_id: "90000000-0000-0000-0000-000000000012", week_number: 4, sets: 4, reps: "20" },
  { id: "17000000-0000-0000-0000-000000000005", routine_exercise_id: "90000000-0000-0000-0000-000000000013", week_number: 1, sets: 2, reps: "8" },
  { id: "17000000-0000-0000-0000-000000000006", routine_exercise_id: "90000000-0000-0000-0000-000000000013", week_number: 2, sets: 3, reps: "10" },
  { id: "17000000-0000-0000-0000-000000000007", routine_exercise_id: "90000000-0000-0000-0000-000000000013", week_number: 3, sets: 3, reps: "12" },
  { id: "17000000-0000-0000-0000-000000000008", routine_exercise_id: "90000000-0000-0000-0000-000000000013", week_number: 4, sets: 4, reps: "12" },
]

export const DEMO_ROUTINE_ASSIGNMENTS = [
  { id: "a0000000-0000-0000-0000-000000000001", routine_id: "80000000-0000-0000-0000-000000000001", date: "2026-08-11", assigned_to: "categoria", created_by: null, notes: null },
  { id: "a0000000-0000-0000-0000-000000000002", routine_id: "80000000-0000-0000-0000-000000000002", date: "2026-08-14", assigned_to: "categoria", created_by: null, notes: null },
]

export const DEMO_NATIONALS = [
  { id: "d0000000-0000-0000-0000-000000000001", name: "Nacional 2026", city: "Córdoba", start_date: "2026-10-05", end_date: "2026-10-10", travel_date: "2026-10-04", return_date: "2026-10-11", info: "Torneo nacional de la categoría, fase de grupos + playoffs.", default_flight_cost: 150000, default_lodging_cost: 120000, default_food_cost: 40000, default_transport_cost: 20000 },
]

export const DEMO_TOURNAMENTS = [
  { id: "1a000000-0000-0000-0000-000000000001", name: "Apertura 2026", start_date: "2026-03-01", end_date: "2026-09-30", notes: "Torneo local regular de la categoría.", created_by: null },
]

export const DEMO_MATCHES = [
  { id: "c0000000-0000-0000-0000-000000000001", date: "2026-08-15", start_time: "15:00", opponent: "Andes", location: "Cancha Regatas", is_home: true, national_id: null, tournament_id: "1a000000-0000-0000-0000-000000000001", notes: null },
  { id: "c0000000-0000-0000-0000-000000000002", date: "2026-10-06", start_time: "15:00", opponent: "Sportivo Norte", location: "Córdoba", is_home: false, national_id: "d0000000-0000-0000-0000-000000000001", tournament_id: null, notes: "Partido de fase de grupos del Nacional." },
]

export const DEMO_NATIONAL_ACTIVITIES = [
  { id: "e0000000-0000-0000-0000-000000000001", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-04", time: "08:00", type: "viaje", title: "Viaje a Córdoba", notes: null, match_id: null, routine_id: null },
  { id: "e0000000-0000-0000-0000-000000000002", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-06", time: "10:00", type: "rutina", title: "Activación pre-partido", notes: null, match_id: null, routine_id: "80000000-0000-0000-0000-000000000002" },
  { id: "e0000000-0000-0000-0000-000000000003", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-06", time: "12:00", type: "entrenamiento", title: "Táctica pre-partido", notes: "Trabajar achique en el 4-0 y salida jugando ante presión alta.", match_id: null, routine_id: null },
  { id: "e0000000-0000-0000-0000-000000000004", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-06", time: "15:00", type: "partido", title: "Partido vs. Sportivo Norte", notes: null, match_id: "c0000000-0000-0000-0000-000000000002", routine_id: null },
  { id: "e0000000-0000-0000-0000-000000000005", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-07", time: "09:00", type: "rutina", title: "Recuperación post partido", notes: null, match_id: null, routine_id: null },
  { id: "e0000000-0000-0000-0000-000000000006", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-07", time: "13:00", type: "comida", title: "Almuerzo del equipo", notes: null, match_id: null, routine_id: null },
  { id: "e0000000-0000-0000-0000-000000000007", national_id: "d0000000-0000-0000-0000-000000000001", date: "2026-10-11", time: "09:00", type: "viaje", title: "Regreso", notes: null, match_id: null, routine_id: null },
]

export const DEMO_NATIONAL_EXPENSES = [
  { id: "f0000000-0000-0000-0000-000000000001", national_id: "d0000000-0000-0000-0000-000000000001", category: "Vuelos", description: "Pasajes ida y vuelta del plantel", amount: 1200000 },
  { id: "f0000000-0000-0000-0000-000000000002", national_id: "d0000000-0000-0000-0000-000000000001", category: "Alojamiento", description: "Hotel, 6 noches", amount: 900000 },
  { id: "f0000000-0000-0000-0000-000000000003", national_id: "d0000000-0000-0000-0000-000000000001", category: "Inscripción", description: "Inscripción al torneo", amount: 150000 },
]

// Minutos/goles/tarjetas son campos manuales acá (no se calculan solos
// desde la Planilla de los partidos del Nacional) — a pedido del DT, para
// cargarlos de un vistazo junto con los pagos, sin depender de si ya se
// cargó o no el partido.
export const DEMO_NATIONAL_PLAYER_COSTS = [
  { id: "11000000-0000-0000-0000-000000000001", national_id: "d0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000001", flight_cost: 150000, lodging_cost: 120000, food_cost: 40000, transport_cost: 20000, minutes_played: 40, goals: 1, yellow_cards: 0, blue_cards: 1, notes: "Capitán, referente del grupo en la gira." },
  { id: "11000000-0000-0000-0000-000000000002", national_id: "d0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000004", flight_cost: 150000, lodging_cost: 120000, food_cost: 40000, transport_cost: 20000, minutes_played: 30, goals: 0, yellow_cards: 0, blue_cards: 0, notes: null },
  { id: "11000000-0000-0000-0000-000000000003", national_id: "d0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000005", flight_cost: 150000, lodging_cost: 120000, food_cost: 40000, transport_cost: 20000, minutes_played: 40, goals: 2, yellow_cards: 0, blue_cards: 0, notes: null },
  { id: "11000000-0000-0000-0000-000000000004", national_id: "d0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000003", flight_cost: 150000, lodging_cost: 120000, food_cost: 40000, transport_cost: 20000, minutes_played: 0, goals: 0, yellow_cards: 1, blue_cards: 0, notes: null },
]

// Historial de pagos — Juan Pérez pagó en 2 cuotas (llega al total),
// Santino pagó una seña, Thiago todavía no pagó nada, Benjamín pagó todo junto.
export const DEMO_NATIONAL_PAYMENTS = [
  { id: "1f000000-0000-0000-0000-000000000001", national_player_cost_id: "11000000-0000-0000-0000-000000000001", amount: 150000, date: "2026-09-15", notes: null },
  { id: "1f000000-0000-0000-0000-000000000002", national_player_cost_id: "11000000-0000-0000-0000-000000000001", amount: 180000, date: "2026-09-28", notes: null },
  { id: "1f000000-0000-0000-0000-000000000003", national_player_cost_id: "11000000-0000-0000-0000-000000000002", amount: 150000, date: "2026-09-20", notes: "Seña." },
  { id: "1f000000-0000-0000-0000-000000000004", national_player_cost_id: "11000000-0000-0000-0000-000000000004", amount: 330000, date: "2026-09-10", notes: null },
]

// Tramos de entrada/salida por partido (partido vs. Andes y vs. Sportivo
// Norte, del Nacional). Mateo y Thiago tienen dos tramos cada uno, para
// mostrar el caso de un jugador que reingresa, con el total sumado
// automáticamente en la Planilla de cada partido.
export const DEMO_MATCH_SUBSTITUTIONS = [
  { id: "12000000-0000-0000-0000-000000000001", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000001", in_minute: 0, out_minute: 40 },
  { id: "12000000-0000-0000-0000-000000000002", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000002", in_minute: 0, out_minute: 15 },
  { id: "12000000-0000-0000-0000-000000000003", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000002", in_minute: 30, out_minute: 40 },
  { id: "12000000-0000-0000-0000-000000000004", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000003", in_minute: 0, out_minute: 40 },
  { id: "12000000-0000-0000-0000-000000000005", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000004", in_minute: 0, out_minute: 35 },
  { id: "12000000-0000-0000-0000-000000000006", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000005", in_minute: 0, out_minute: 20 },
  { id: "12000000-0000-0000-0000-000000000007", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000005", in_minute: 25, out_minute: 35 },
  { id: "12000000-0000-0000-0000-000000000008", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000006", in_minute: 0, out_minute: 38 },
  { id: "12000000-0000-0000-0000-000000000009", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000007", in_minute: 20, out_minute: 40 },
  { id: "12000000-0000-0000-0000-00000000000a", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000008", in_minute: 0, out_minute: 32 },
  { id: "12000000-0000-0000-0000-00000000000b", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000009", in_minute: 25, out_minute: 40 },
  { id: "12000000-0000-0000-0000-00000000000c", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-00000000000a", in_minute: 0, out_minute: 28 },
  // Partido del Nacional (vs. Sportivo Norte).
  { id: "12000000-0000-0000-0000-00000000000d", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000001", in_minute: 0, out_minute: 40 },
  { id: "12000000-0000-0000-0000-00000000000e", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000004", in_minute: 0, out_minute: 30 },
  { id: "12000000-0000-0000-0000-00000000000f", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000005", in_minute: 10, out_minute: 40 },
]

// Tarjetas del partido vs. Andes (torneo local) y vs. Sportivo Norte (Nacional).
export const DEMO_MATCH_CARDS = [
  { id: "19000000-0000-0000-0000-000000000001", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-00000000000a", type: "Amarilla", minute: 22, notes: null },
  { id: "19000000-0000-0000-0000-000000000002", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000003", type: "Amarilla", minute: 15, notes: null },
  { id: "19000000-0000-0000-0000-000000000003", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000001", type: "Azul", minute: 30, notes: null },
]

// Goles del partido vs. Sportivo Norte (Nacional).
export const DEMO_MATCH_GOALS = [
  { id: "1c000000-0000-0000-0000-000000000001", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000005", minute: 12, notes: null },
  { id: "1c000000-0000-0000-0000-000000000002", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000005", minute: 34, notes: null },
  { id: "1c000000-0000-0000-0000-000000000003", match_id: "c0000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000001", minute: 25, notes: null },
]

// Molestias musculares del partido vs. Andes.
export const DEMO_MATCH_INJURY_NOTES = [
  { id: "1b000000-0000-0000-0000-000000000001", match_id: "c0000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000005", note: "Molestia leve en isquiotibial derecho, terminó el partido con precaución." },
]

// Peso y altura ahora viven en la ficha del jugador (players.weight_kg /
// height_cm) — acá solo quedan salto y velocidad, que sí se repiten en el
// tiempo.
export const DEMO_PHYSICAL_TESTS = [
  { id: "13000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-04-01", test_name: "Salto vertical (CMJ)", value: 42, unit: "cm", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000002", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-04-01", test_name: "Velocidad 15m", value: 2.35, unit: "s", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000003", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-07-15", test_name: "Salto vertical (CMJ)", value: 44, unit: "cm", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000004", player_id: "10000000-0000-0000-0000-000000000004", date: "2026-04-01", test_name: "Velocidad 20m", value: 3.1, unit: "s", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000005", player_id: "10000000-0000-0000-0000-000000000005", date: "2026-04-01", test_name: "Salto vertical (CMJ)", value: 46, unit: "cm", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000006", player_id: "10000000-0000-0000-0000-000000000005", date: "2026-04-01", test_name: "Velocidad 15m", value: 2.28, unit: "s", notes: null, created_by: null },
  { id: "13000000-0000-0000-0000-000000000007", player_id: "10000000-0000-0000-0000-000000000001", date: "2026-07-15", test_name: "Squat Jump", value: 34.44, unit: "cm", notes: null, created_by: null },
]

// Repeticiones (cm + ms) del Squat Jump de arriba — mismo formato que la
// planilla del profe (Mayor Valor = 34.44 cm de la repetición 2).
export const DEMO_PHYSICAL_TEST_REPS = [
  { id: "13100000-0000-0000-0000-000000000001", test_id: "13000000-0000-0000-0000-000000000007", rep_number: 1, value_cm: 34.18, value_ms: 528 },
  { id: "13100000-0000-0000-0000-000000000002", test_id: "13000000-0000-0000-0000-000000000007", rep_number: 2, value_cm: 34.44, value_ms: 530 },
]

// Becados de ejemplo (DNIs ficticios, no corresponden a personas reales).
// Ojo: `becados` solo se puede escribir con rol Coordinador (RLS), así que
// esto NO se incluye en el botón "Cargar datos demo" de Usuarios (ese lo
// usa el DT) — solo está disponible corriendo seed_demo.sql a mano, que
// pasa por el SQL editor y no depende de RLS.
export const DEMO_BECADOS = [
  { id: "14000000-0000-0000-0000-000000000001", first_name: "Camila", last_name: "Suárez", dni: "40111222", type: "Becado", status: "Activo", notes: null },
  { id: "14000000-0000-0000-0000-000000000002", first_name: "Tomás", last_name: "Herrera", dni: "41222333", type: "Becado", status: "Activo", notes: null },
  { id: "14000000-0000-0000-0000-000000000003", first_name: "Rocío", last_name: "Paz", dni: "39555666", type: "Becado", status: "Inactivo", notes: "Beca vencida en julio 2026." },
  { id: "14000000-0000-0000-0000-000000000004", first_name: "Nicolás", last_name: "Vega", dni: "42333444", type: "Cuota", status: "Activo", notes: null },
  { id: "14000000-0000-0000-0000-000000000005", first_name: "Agustina", last_name: "Ríos", dni: "43444555", type: "Cuota", status: "Inactivo", notes: "Atrasada dos meses." },
]

// Comentarios de informe de ejemplo (mismo jugador que el plan individual,
// para mostrar cómo se combinan en /players/:id/report).
export const DEMO_PLAYER_REPORT_NOTES = [
  { id: "18000000-0000-0000-0000-000000000001", player_id: "10000000-0000-0000-0000-00000000000a", note: "Buena evolución en el plan de fuerza post-esguince. Falta trabajar la confianza para encarar 1 vs 1 del lado lesionado.", created_by: null },
]

// UUID de cada tabla: [inicio, fin] del rango usado por los datos demo,
// para poder borrarlos con `.gte(...).lte(...)` sin afectar datos reales.
// Nota: `becados` no entra en este rango: se limpia por separado con
// cleanup_demo.sql (SQL editor), no con el botón "Borrar datos demo" del
// DT, por la misma razón de RLS que arriba.
export const DEMO_ID_RANGES: [table: string, start: string, end: string][] = [
  ["match_injury_notes", "1b000000-0000-0000-0000-000000000000", "1b000000-0000-0000-0000-ffffffffffff"],
  ["match_goals", "1c000000-0000-0000-0000-000000000000", "1c000000-0000-0000-0000-ffffffffffff"],
  ["match_cards", "19000000-0000-0000-0000-000000000000", "19000000-0000-0000-0000-ffffffffffff"],
  ["player_report_notes", "18000000-0000-0000-0000-000000000000", "18000000-0000-0000-0000-ffffffffffff"],
  ["routine_exercise_weeks", "17000000-0000-0000-0000-000000000000", "17000000-0000-0000-0000-ffffffffffff"],
  ["physical_test_reps", "13100000-0000-0000-0000-000000000000", "13100000-0000-0000-0000-ffffffffffff"],
  ["physical_tests", "13000000-0000-0000-0000-000000000000", "13000000-0000-0000-0000-ffffffffffff"],
  ["match_substitutions", "12000000-0000-0000-0000-000000000000", "12000000-0000-0000-0000-ffffffffffff"],
  ["national_payments", "1f000000-0000-0000-0000-000000000000", "1f000000-0000-0000-0000-ffffffffffff"],
  ["national_player_costs", "11000000-0000-0000-0000-000000000000", "11000000-0000-0000-0000-ffffffffffff"],
  ["national_expenses", "f0000000-0000-0000-0000-000000000000", "f0000000-0000-0000-0000-ffffffffffff"],
  ["national_activities", "e0000000-0000-0000-0000-000000000000", "e0000000-0000-0000-0000-ffffffffffff"],
  ["matches", "c0000000-0000-0000-0000-000000000000", "c0000000-0000-0000-0000-ffffffffffff"],
  ["nationals", "d0000000-0000-0000-0000-000000000000", "d0000000-0000-0000-0000-ffffffffffff"],
  ["tournaments", "1a000000-0000-0000-0000-000000000000", "1a000000-0000-0000-0000-ffffffffffff"],
  ["routine_assignments", "a0000000-0000-0000-0000-000000000000", "a0000000-0000-0000-0000-ffffffffffff"],
  ["routine_exercises", "90000000-0000-0000-0000-000000000000", "90000000-0000-0000-0000-ffffffffffff"],
  ["routine_circuits", "1e000000-0000-0000-0000-000000000000", "1e000000-0000-0000-0000-ffffffffffff"],
  ["routine_groups", "1d000000-0000-0000-0000-000000000000", "1d000000-0000-0000-0000-ffffffffffff"],
  ["routines", "80000000-0000-0000-0000-000000000000", "80000000-0000-0000-0000-ffffffffffff"],
  ["physical_exercises", "70000000-0000-0000-0000-000000000000", "70000000-0000-0000-0000-ffffffffffff"],
  ["training_player_notes", "60000000-0000-0000-0000-000000000000", "60000000-0000-0000-0000-ffffffffffff"],
  ["session_exercises", "40000000-0000-0000-0000-000000000000", "40000000-0000-0000-0000-ffffffffffff"],
  ["player_evaluations", "50000000-0000-0000-0000-000000000000", "50000000-0000-0000-0000-ffffffffffff"],
  ["training_sessions", "30000000-0000-0000-0000-000000000000", "30000000-0000-0000-0000-ffffffffffff"],
  ["training_exercises", "20000000-0000-0000-0000-000000000000", "20000000-0000-0000-0000-ffffffffffff"],
  ["players", "10000000-0000-0000-0000-000000000000", "10000000-0000-0000-0000-ffffffffffff"],
]
