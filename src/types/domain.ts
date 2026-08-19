export const USER_ROLES = ["dt", "profesor", "jugador", "coordinador"] as const
export type UserRole = (typeof USER_ROLES)[number]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  dt: "DT",
  profesor: "Profesor",
  jugador: "Jugador",
  coordinador: "Coordinador",
}

export const BECADO_STATUSES = ["Activo", "Inactivo"] as const
export type BecadoStatus = (typeof BECADO_STATUSES)[number]

// El becado no paga cuota. Un socio "Cuota" sí paga, pero acá no se
// registran montos: el estado (Activo/Inactivo) dice si está al día.
export const MEMBER_TYPES = ["Becado", "Cuota"] as const
export type MemberType = (typeof MEMBER_TYPES)[number]

export const POSITIONS = [
  "Arquero",
  "Cierre",
  "Ala",
  "Pivot",
  "Universal",
  "Poste-ala",
  "Sin definir",
] as const
export type Position = (typeof POSITIONS)[number]

export const PLAYER_DOCUMENT_TYPES = ["DNI", "Certificado médico", "Otro"] as const
export type PlayerDocumentType = (typeof PLAYER_DOCUMENT_TYPES)[number]

// Presets del panel de tests físicos. La tabla en la base no restringe el
// nombre del test — esto es solo para el formulario, que carga peso, altura,
// salto y velocidad como secciones independientes: se puede completar
// cualquier combinación y se guarda todo junto de una sola vez.
export const WEIGHT_UNIT = "kg"
export const HEIGHT_UNIT = "cm"

export const JUMP_TEST_TYPES = [
  "Salto vertical (CMJ)",
  "Salto horizontal",
  "Squat Jump",
  "Drop Jump",
  "Otro",
] as const
export const JUMP_UNIT = "cm"
export const JUMP_MS_UNIT = "ms"

// Tests que se toman en varias repeticiones (cm + ms cada una, tipo
// plataforma de salto) en vez de un solo valor — Squat Jump y Drop Jump,
// tal cual llegan de la planilla del profe.
export const REP_JUMP_TEST_TYPES = ["Squat Jump", "Drop Jump"] as const

export const SPEED_TEST_TYPES = [
  "Velocidad 15m",
  "Velocidad 20m",
  "Velocidad 30m",
  "Otro",
] as const
export const SPEED_UNIT = "s"

export const PREFERRED_FEET = ["Derecha", "Izquierda", "Ambidiestro"] as const
export type PreferredFoot = (typeof PREFERRED_FEET)[number]

export const PLAYER_STATUSES = ["Activo", "Inactivo"] as const
export type PlayerStatus = (typeof PLAYER_STATUSES)[number]

export const EXERCISE_CATEGORIES = [
  "Técnica",
  "Táctica",
  "Física",
  "Definición",
  "Transición",
  "Presión",
  "Pelota parada",
  "Juego reducido",
  "Activación",
  "Otro",
] as const
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number]

export const TRAINING_WEEKDAYS = ["Lunes", "Miércoles", "Viernes"] as const

export const ROUTINE_ASSIGNMENT_TARGETS = ["categoria", "jugadores"] as const
export type RoutineAssignmentTarget = (typeof ROUTINE_ASSIGNMENT_TARGETS)[number]

// Amarilla = amonestación. Azul = exclusión temporal (2 min), regla de
// futsal — no es lo mismo que la roja (expulsión directa), que sigue fuera
// de alcance.
export const CARD_TYPES = ["Amarilla", "Azul"] as const
export type CardType = (typeof CARD_TYPES)[number]

export const NATIONAL_ACTIVITY_TYPES = [
  "viaje",
  "partido",
  "rutina",
  "entrenamiento",
  "comida",
  "charla",
  "descanso",
  "otro",
] as const
export type NationalActivityType = (typeof NATIONAL_ACTIVITY_TYPES)[number]

export const NATIONAL_ACTIVITY_LABELS: Record<NationalActivityType, string> = {
  viaje: "Viaje",
  partido: "Partido",
  rutina: "Rutina",
  entrenamiento: "Entrenamiento (táctica)",
  comida: "Comida",
  charla: "Charla",
  descanso: "Descanso",
  otro: "Otro",
}

export const NATIONAL_EXPENSE_CATEGORIES = [
  "Vuelos",
  "Alojamiento",
  "Comidas",
  "Traslados",
  "Inscripción",
  "Canchas",
  "Otros",
] as const
export type NationalExpenseCategory = (typeof NATIONAL_EXPENSE_CATEGORIES)[number]

// Planes individuales por jugador (distinto de "Rutinas", que arma el
// Profesor y asigna a una fecha del calendario para toda la categoría o
// jugadores puntuales). Un plan individual es un programa propio de UN
// jugador con progresión de series/reps semana a semana.
export const INDIVIDUAL_PLAN_TYPES = [
  "Fuerza",
  "Movilidad",
  "Rehabilitación",
  "Resistencia",
  "Prevención",
] as const
export type IndividualPlanType = (typeof INDIVIDUAL_PLAN_TYPES)[number]

export const INDIVIDUAL_PLAN_FOCUS_AREAS = [
  "Tren inferior",
  "Tren superior",
  "Core",
  "General",
] as const
export type IndividualPlanFocusArea = (typeof INDIVIDUAL_PLAN_FOCUS_AREAS)[number]

export const INDIVIDUAL_PLAN_INTENSITIES = ["Baja", "Media", "Alta"] as const
export type IndividualPlanIntensity = (typeof INDIVIDUAL_PLAN_INTENSITIES)[number]

export const INDIVIDUAL_PLAN_STATUSES = ["Activa", "Archivada"] as const
export type IndividualPlanStatus = (typeof INDIVIDUAL_PLAN_STATUSES)[number]

export const DEFAULT_TRAINING_DURATION = 75
export const DEFAULT_TRAINING_START_TIME = "18:00"

// Evaluaciones: check-in periódico solo de lo físico (fecha + entrenador +
// observaciones) — sin puntajes propios. Los números (peso, altura, salto,
// velocidad) ya se cargan en la ficha del jugador y en Tests físicos; una
// evaluación puntual muestra ese contexto en vez de duplicar la carga.
