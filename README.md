# C15 Manager

Aplicación privada, mobile-first, para gestionar una categoría C15 de futsal:
jugadores, calendario semanal (entrenamientos, rutinas físicas, partidos),
biblioteca de ejercicios tácticos y rutinas físicas, check-ins físicos
periódicos por jugador, y un módulo aparte para torneos "Nacionales"
(cronograma, gastos y pagos por jugador).

**V2** — suma roles (DT / Profesor / Jugador / Coordinador), Rutinas, Planes
individuales por jugador, Torneos con sus Partidos (planilla de minutos por
tramos, goles, tarjetas amarillas/azules y molestias musculares, con
resumen automático por partido), peso/altura en la ficha del jugador, tests
físicos de salto y velocidad, Calendario central, Nacional (con minutos,
goles, tarjetas y una observación libre por jugador, cargados a mano ahí
mismo junto con los pagos), un control de acceso de becados para la
seguridad del club, y un informe imprimible por jugador, sobre la V1
original. Deliberadamente no incluye asistencias, tarjeta roja, fixture
oficial, IA, video, WhatsApp, informes automáticos (programados/enviados
solos) ni multi-club.

## Stack

React + TypeScript + Vite · Tailwind CSS + shadcn/ui · Supabase (Postgres + Auth) · TanStack Query · React Router · React Hook Form + Zod · Recharts · dnd-kit · Lucide.

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [supabase.com](https://supabase.com).

3. En el SQL editor de Supabase, correr **en orden**:
   - `supabase/migrations/0001_init.sql` (schema base: jugadores, entrenamientos, ejercicios, evaluaciones)
   - `supabase/migrations/0002_rls.sql` (RLS inicial)
   - `supabase/migrations/0003_roles.sql` (roles DT/Profesor/Jugador y ajuste de permisos)
   - `supabase/migrations/0004_routines.sql` (rutinas físicas)
   - `supabase/migrations/0005_matches.sql` (partidos)
   - `supabase/migrations/0006_nationals.sql` (módulo Nacional)
   - `supabase/migrations/0007_match_minutes.sql` (minutos jugados por partido, por tramos de entrada/salida)
   - `supabase/migrations/0008_physical_tests.sql` (tests físicos: salto, velocidad)
   - `supabase/migrations/0009_coordinador_becados.sql` (rol Coordinador, becados, control de acceso)
   - `supabase/migrations/0010_player_weight_height.sql` (peso y altura en la ficha del jugador)
   - `supabase/migrations/0011_becados_tipo.sql` (distingue Becados de socios con Cuota)
   - `supabase/migrations/0012_becados_dt_access.sql` (el DT también puede administrar Ingreso)
   - `supabase/migrations/0013_individual_plans.sql` (Planes individuales por jugador)
   - `supabase/migrations/0014_player_report_notes.sql` (comentarios para el informe del jugador)
   - `supabase/migrations/0015_match_cards.sql` (tarjetas amarillas por partido)
   - `supabase/migrations/0016_players_profesor_update.sql` (el Profesor también puede editar jugadores)
   - `supabase/migrations/0017_tournaments.sql` (Torneos y molestias musculares por partido)
   - `supabase/migrations/0018_card_types_national_observations.sql` (tarjetas azules + observaciones por jugador en Nacional)
   - `supabase/migrations/0019_goals_and_national_manual_stats.sql` (goles por partido; minutos/goles/tarjetas manuales en Nacional)
   - `supabase/migrations/0020_player_documents.sql` (documentos por jugador: DNI, certificado médico, otros — crea el bucket de Storage `player-documents`)
   - `supabase/migrations/0021_match_result_fouls.sql` (resultado y faltas acumuladas por período en Partidos; el Profesor también puede editar partidos)
   - `supabase/migrations/0022_routine_groups_circuits.sql` (Grupos y Circuitos dentro de una Rutina, formato cartel de entrenamiento)
   - `supabase/migrations/0023_position_undefined.sql` (permite "Sin definir" como posición del jugador)
   - `supabase/migrations/0024_national_activity_routine_link.sql` (rutina real linkeada a la actividad del Nacional; tipo "Entrenamiento" para la parte táctica)
   - `supabase/migrations/0025_evaluations_physical_only.sql` (Evaluaciones pasa a ser un check-in físico simple, sin puntajes 1-10 ni radar — **borra los puntajes técnica/táctica/física/mental ya cargados**)
   - `supabase/migrations/0026_national_default_cost_payments.sql` (costo del viaje por defecto en Nacional; pagos como historial en vez de un solo número — **borra el "Pagado" ya cargado en pagos existentes**, hay que recargarlo como pagos)

4. Crear las cuentas en **Authentication → Users** (email + contraseña):
   - Tu propia cuenta de **DT**.
   - Opcionalmente, una cuenta por cada **Profesor** o **Jugador** al que quieras dar acceso.

   No hay flujo de invitación automática por email: cada cuenta se crea a mano
   acá. Supabase te muestra el **UUID** de cada usuario creado — lo vas a
   necesitar en el paso siguiente.

5. Copiar `.env.example` a `.env.local` y completar con la Project URL y la anon key del proyecto (Settings → API):

   ```bash
   cp .env.example .env.local
   ```

6. Levantar el servidor de desarrollo y entrar con tu cuenta de DT:

   ```bash
   npm run dev
   ```

7. **Vincular roles**: entrá a la app con tu cuenta de DT y andá a
   **Usuarios** (sidebar en desktop, o "Acciones rápidas" del Dashboard en
   mobile). Ahí:
   - Vinculá tu propia cuenta con rol **DT** (pegando tu propio UUID).
   - Vinculá cada cuenta de Profesor/Jugador que hayas creado en el paso 4,
     eligiendo su rol y, si es Jugador, el jugador de la lista al que
     corresponde.

   Hasta que una cuenta no tenga una fila en `profiles`, puede loguearse pero
   no va a tener rol asignado — no verá nada útil en la app.

8. **(Opcional) Datos demo**: en la misma pantalla de **Usuarios**, con tu
   cuenta de DT, tocá "Cargar datos demo" para poblar la app con el plantel
   ficticio de "Regatas C15" (18 jugadores, entrenamientos, ejercicios,
   rutinas, evaluaciones, un partido y un Nacional de ejemplo) directo desde
   el frontend, sin tocar el SQL editor. Se puede volver a correr sin
   duplicar, y "Borrar datos demo" lo saca todo sin afectar datos reales
   cargados después. (Si preferís SQL puro, `supabase/seed/seed_demo.sql` y
   `cleanup_demo.sql` hacen lo mismo desde el SQL editor.)

   La lista de accesos (becados y socios con cuota, DNIs ficticios) no entra
   en ese botón — como solo el rol Coordinador puede escribir en esa tabla
   por RLS, cargala corriendo directamente el bloque `becados` de
   `seed_demo.sql` en el SQL editor.

Si `.env.local` no está configurado, la app muestra una pantalla de instrucciones en vez de romper.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — chequeo de TypeScript + build de producción
- `npm run preview` — sirve el build de producción localmente
- `npm run lint` — oxlint

## Roles

- **DT**: acceso total. Único rol que puede dar de alta o baja jugadores,
  crear/editar/eliminar Torneos y Partidos, entrenamientos, evaluaciones, el
  módulo Nacional y vincular cuentas en Usuarios. También puede administrar
  **Ingreso** (becados/cuota), lo mismo que el Coordinador.
- **Profesor**: gestiona ejercicios físicos y rutinas, las asigna a días del
  calendario (a toda la categoría o a jugadores puntuales); completa la
  **Planilla del partido** (en el detalle de cada partido, dentro de
  **Partidos**) con los minutos jugados de cada jugador por tramos de
  entrada/salida (el total sale de sumarlos), sus goles, sus tarjetas
  —amarilla (amonestación) o azul (exclusión temporal de 2 minutos, no hay
  roja)—, cada evento con el minuto opcional, molestias musculares (texto
  libre) y el número de camiseta si hace falta corregirlo — todo se ve
  acumulado en un **Resumen del partido** automático y en la ficha del
  jugador. También carga, en la misma pantalla del partido, el
  **Resultado** (goles a favor/en contra) y las **Faltas acumuladas por
  período** (propias de futsal: desde la 6ª falta del equipo en el período,
  el rival ejecuta doble penal a 10 m); carga
  tests de salto y velocidad (con distintas variantes, o cualquier otra que
  necesite) en el panel de **Tests físicos** o desde la ficha de cada
  jugador — un mismo registro puede incluir salto y velocidad juntos. Peso y
  altura no son un "test": se cargan una vez en la ficha del jugador, junto
  con el resto de sus datos. También carga (junto con el DT) **Planes
  individuales** por jugador, los **Documentos** de cada jugador (DNI,
  certificado médico, otros), y el **Informe** imprimible de cada jugador.
  Puede editar datos de la ficha del jugador (incluido el número de
  camiseta) y de un partido ya cargado (resultado, faltas), pero no dar de
  alta ni eliminar jugadores, ni crear/eliminar Torneos o Partidos — eso
  sigue siendo exclusivo del DT.
- **Jugador**: solo lectura. Ve "Mi semana" — sus entrenamientos, rutinas y
  partidos de la semana actual, con el detalle al tocar cada actividad (series,
  repeticiones, descansos, video, imagen, indicaciones). Sin evaluaciones, sin
  botón de confirmar cumplimiento de rutina (se descartó a propósito).
- **Coordinador**: rol de club, no de la categoría C15 — no ve entrenamientos,
  evaluaciones ni nada deportivo. Solo administra la lista de **Ingreso**
  (becados y socios con cuota: nombre + DNI + tipo + estado), para que
  seguridad los deje entrar. Pensado para cuando esta tarea la lleve alguien
  que no debería ver el resto de la app; si preferís, el DT puede hacerlo
  todo desde su propia cuenta sin crear un Coordinador aparte.

## Control de acceso (Becados y Cuota)

Pensado para que seguridad, en la puerta, pueda confirmar si alguien puede
entrar sin necesitar una cuenta ni loguearse. Cada persona en la lista tiene
un **tipo**:

- **Becado**: no paga cuota. Activo = puede entrar; Inactivo = beca vencida.
- **Cuota**: paga cuota, pero acá no se registran montos ni pagos sueltos —
  el Coordinador solo marca el estado a mano: Activo = al día, puede entrar;
  Inactivo = atrasado.

Funcionamiento:

- El **DT** (desde "Ingreso" en el sidebar/Dashboard) o el **Coordinador**
  (desde su propia pantalla al entrar a la app) cargan y mantienen esa lista
  (nombre, apellido, DNI, tipo, estado).
- Seguridad usa **`/seguridad`** — una pantalla pública, sin login, pensada
  para dejarla abierta en un celular o tablet en la entrada. Tipea el DNI y
  ve "Becado ✅", "Cuota al día ✅" o "No autorizado ❌" (con el nombre para
  confirmar identidad si corresponde) — nunca la lista completa ni datos de
  otras personas.
- Por dentro, esa pantalla no lee la tabla directamente: llama a una función
  de Postgres (`check_becado`) que solo devuelve el resultado de un DNI
  puntual. La tabla en sí solo la puede leer o editar el Coordinador.

## Rutinas vs. Planes individuales

Dos secciones separadas a propósito, no confundir:

- **Rutinas** (`/routines`): el Profesor arma una rutina de ejercicios
  físicos (`physical_exercises`, biblioteca propia) y la **asigna a una
  fecha** del calendario, para toda la categoría o jugadores puntuales.
  Sin progresión semana a semana — es "lo que se hace ese día".
- **Planes individuales** (`/planes`): un programa propio de **un jugador**
  (fuerza, movilidad, rehabilitación, resistencia, prevención) que corre en
  paralelo al entrenamiento grupal, con **progresión de series/reps semana a
  semana** por ejercicio. Reutiliza la biblioteca táctica ya existente
  (`training_exercises`, la misma de "Ejercicios"/Entrenamientos) o permite
  cargar un ejercicio suelto sin pasar por ninguna biblioteca. No se asigna
  a una fecha puntual — tiene una fecha de inicio y una duración en semanas.
  Se puede duplicar (para arrancar un plan nuevo a partir de uno existente)
  y archivar (sin borrarlo) cuando el jugador lo termina.

### Grupos y circuitos dentro de una Rutina

Capa opcional sobre una Rutina, pensada para el formato real de
planificación física por grupos (ej. un cartel "Grupo 1 (Fuerza &
Potencia)", "Grupo 2 (Velocidad & Pliometría)"...). Adentro de una rutina,
además de la lista plana de "Ejercicios" de siempre (para rutinas simples,
un solo bloque), se pueden agregar **Grupos** — cada uno con nombre y un
enfoque opcional — y adentro de cada grupo, **Circuitos** numerados
automáticamente (Circuito 1, 2, 3...) con sus ejercicios, también
numerados. Los ejercicios de un circuito salen de la biblioteca de
`physical_exercises` o son sueltos (nombre libre, sin pasar por la
biblioteca) — igual mecánica que Planes individuales, porque estos carteles
suelen tener ejercicios muy puntuales que no vale la pena precargar. Se ve
como 3 columnas en escritorio (una por grupo) y apilado en mobile, y es
imprimible (botón Imprimir). Es opcional: una rutina sin grupos se sigue
viendo como lista plana, sin forzar la estructura en rutinas simples.

## Torneos vs. Nacional

También separados a propósito:

- **Partidos** (`/torneos`): un **Torneo** es solo nombre + fechas (ej.
  "Apertura 2026"), para agrupar los partidos de una competencia local
  regular. Adentro se cargan los **Partidos** de ese torneo, cada uno con su
  **Planilla** (minutos, goles, tarjetas amarilla/azul, molestias
  musculares, número de camiseta) y su **Resumen** automático — todo sale
  de sumar lo cargado ahí, jugador por jugador. Visible para DT y Profesor;
  sin viaje, cronograma día a día ni gastos/pagos. Un partido puede no
  pertenecer a ningún torneo (amistoso suelto), y se puede seguir creando
  partidos sueltos desde el Calendario, igual que antes.
- **Nacional** (`/nationals`, exclusivo del DT): para un torneo puntual que
  implica viaje — tiene cronograma día a día, plantel que viaja, gastos y
  pagos por jugador. Sus partidos también quedan en la tabla general de
  partidos (se ven en Calendario, en su propia Planilla, y en la ficha del
  jugador), pero el resto del módulo (costos, pagos, cronograma) no se
  mezcla con Torneos. Adentro de un Nacional, la pestaña **Jugadores** solo
  administra el plantel (alta/baja) y campos manuales de minutos, goles,
  amarillas, azules y una **Observación** libre por jugador (actitud, estado
  físico); la pestaña **Gastos** junta todo lo económico — el desglose de
  costo por jugador (Vuelo/Alojam./Comida/Traslado) y los gastos generales
  del viaje. A diferencia de Torneos, estos campos manuales **no** se
  calculan solos desde la Planilla de los partidos del Nacional — se
  cargan sueltos, son dos lugares de carga independientes a propósito.

  Como el costo del viaje suele ser el mismo para todo el plantel, la
  pestaña Gastos tiene una tarjeta **"Costo del viaje"** para cargarlo una
  sola vez y aplicarlo a todos los jugadores de un toque ("Aplicar a todo
  el plantel") — también se usa como default para cada jugador nuevo que
  agregás al plantel. Se puede seguir corrigiendo por jugador para las
  excepciones. Y "Pagado" ya no es un número que se pisa: cada jugador
  tiene un **historial de pagos** (monto + fecha), sumados para el total —
  se va agregando "primer pago", "segundo pago", etc. sin perder el
  rastro de lo que ya se cargó.

  La pestaña **Calendario** del Nacional es una grilla de mes (igual a la
  del Calendario central), con un punto bajo cada día que tiene actividades
  — se abre en el mes del `start_date` del Nacional. Tocando un día se ve
  (y se agrega) el detalle de ese día, ahí es donde se arma la rutina
  diaria del plantel. Una actividad tipo **Rutina** (ej. la
  activación de la mañana: movilidad articular + juego) se linkea a una
  Rutina real de `/routines` — nueva o existente — así se le cargan
  ejercicios sin límite (biblioteca o sueltos, el "juego" es un ejercicio
  suelto más) reutilizando el mismo editor de Rutinas, en vez de duplicarlo
  adentro de Nacional. Una actividad tipo **Entrenamiento** es más simple:
  solo título + notas, pensada para anotar qué trabajar de la parte
  táctica ese día. Las actividades del Calendario se pueden editar
  (fecha/hora/notas) sin borrar y volver a cargar.

## Informe del jugador

`/players/:id/report` (botón con ícono de hoja en la ficha del jugador,
visible para DT y Profesor). Junta en una sola pantalla imprimible lo que ya
está cargado en la ficha — último check-in de Evaluaciones, últimos tests
físicos (uno por tipo), minutos jugados totales, planes individuales
activos — más un campo donde el Profesor/DT puede escribir un comentario
libre ("qué le falta trabajar") que queda guardado con fecha y autor, sin
pisar los anteriores. Se "descarga" con el botón Imprimir del navegador
(imprimir a PDF), igual que Planes individuales — no genera ni envía nada
solo. No confundir con "informes automáticos", que sigue fuera de alcance:
esto no corre en background, no se programa ni se manda por WhatsApp/email;
es un resumen bajo demanda de datos que el Profesor ya cargó a mano.

## Evaluaciones

`/evaluations` — check-in físico periódico por jugador: fecha, quién lo
hizo y observaciones. A propósito **no** tiene campos propios de peso,
altura, salto ni velocidad — esos ya se cargan en la ficha del jugador
(peso/altura) y en **Tests físicos** (salto/velocidad), y no hace falta
repetir esa carga. Al abrir una evaluación puntual, se muestra junto a la
nota el peso/altura actuales del jugador y sus últimos tests físicos, como
contexto de ese momento — nada se duplica ni se vuelve a escribir. Antes
Evaluaciones tenía 4 categorías con puntajes 1-10 (Técnica, Táctica,
Física, Mental) y un gráfico de radar; se sacó por completo — no tiene
sentido puntuar 1-10 algo que ya es un número real (cm, kg, s), y un radar
de una sola categoría no es legible. Deliberadamente no vuelve a evaluar
técnica de fútsal.

## Documentos del jugador

Pestaña **Documentos** en la ficha del jugador (visible para DT y
Profesor). Permite subir archivos (foto o PDF) en tres categorías fijas:
**DNI**, **Certificado médico** y **Otro**. Los archivos se guardan en un
bucket privado de Supabase Storage (`player-documents`, creado por la
migración 0020) — no son públicos, solo se pueden ver con un link firmado
que se genera al tocar "Ver" (vence a los 5 minutos). Mismo criterio de
RLS que el resto de la ficha administrativa: exclusivo de DT y Profesor,
no lo ve Jugador ni Coordinador. No entra en "Cargar datos demo" — no hay
forma de precargar archivos reales de ejemplo en Storage desde ahí.

## Estructura

- `src/pages/` — una página por ruta
- `src/components/` — `ui/` (shadcn) + carpetas por dominio (`players`, `trainings`, `exercises`, `routines`, `individual-plans`, `matches`, `nationals`, `evaluations`, `physical-tests`, `becados`, `calendar`, `dashboard`, `layout`)
- El sidebar de escritorio agrupa los ítems por función (Plantel,
  Entrenamiento, Competencia, Club) — se define en
  `src/components/layout/navItems.ts` (`group` por ítem, orden en
  `NAV_GROUP_ORDER`). El bottom nav de mobile queda plano a propósito (solo
  los 5 ítems marcados sin `desktopOnly`), sin agrupar.
- `src/hooks/` — data fetching con TanStack Query sobre Supabase
- `src/types/` — tipos de dominio (`domain.ts`) y de base de datos (`database.ts`)
- `src/lib/demoData.ts` — el dataset demo de "Regatas C15", cargable desde Usuarios en la app
- `supabase/migrations/` — schema y RLS, en orden numerado
- `supabase/seed/` — el mismo dataset demo en SQL puro, por si preferís cargarlo desde el SQL editor

## Seguridad

Autenticación con Supabase Auth (email + contraseña). Row Level Security
habilitado en todas las tablas. El acceso por rol se resuelve con funciones
`security definer` (`auth_role()`, `auth_player_id()`) que leen la tabla
`profiles` sin caer en recursión de RLS. El módulo Nacional (info, gastos,
pagos) es exclusivo del rol DT; los partidos que salen de un Nacional siguen
siendo visibles para todos vía la tabla `matches`, sin exponer costos ni
pagos. No se usa ninguna service role key en el frontend — solo la anon key,
pensada para exponerse en el cliente.
