import type {
  BecadoStatus,
  CardType,
  ExerciseCategory,
  IndividualPlanFocusArea,
  IndividualPlanIntensity,
  IndividualPlanStatus,
  IndividualPlanType,
  MemberType,
  NationalActivityType,
  NationalExpenseCategory,
  PlayerDocumentType,
  PlayerStatus,
  Position,
  PreferredFoot,
  RoutineAssignmentTarget,
  UserRole,
} from "@/types/domain"

export interface Profile {
  id: string
  role: UserRole
  player_id: string | null
  full_name: string | null
  created_at: string
  player?: Player
}

export type ProfileInsert = Omit<Profile, "created_at" | "player">

export interface Player {
  id: string
  first_name: string
  last_name: string
  photo_url: string | null
  birth_date: string | null
  jersey_number: number | null
  position: Position
  preferred_foot: PreferredFoot | null
  join_date: string | null
  status: PlayerStatus
  weight_kg: number | null
  height_cm: number | null
  strengths: string | null
  weaknesses: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type PlayerInsert = Omit<Player, "id" | "created_at" | "updated_at">
export type PlayerUpdate = Partial<PlayerInsert>

export interface PlayerDocument {
  id: string
  player_id: string
  type: PlayerDocumentType
  file_path: string
  file_name: string
  uploaded_by: string | null
  created_at: string
}

export type PlayerDocumentInsert = Omit<PlayerDocument, "id" | "created_at">

export interface TrainingSession {
  id: string
  date: string
  start_time: string
  duration: number
  main_objective: string
  secondary_objectives: string | null
  notes: string | null
  observations: string | null
  focus_areas: string | null
  created_at: string
  updated_at: string
}

export type TrainingSessionInsert = Omit<
  TrainingSession,
  "id" | "created_at" | "updated_at"
>
export type TrainingSessionUpdate = Partial<TrainingSessionInsert>

export interface TrainingExercise {
  id: string
  name: string
  category: ExerciseCategory
  duration: number
  objective: string | null
  description: string | null
  players_count: string | null
  materials: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TrainingExerciseInsert = Omit<
  TrainingExercise,
  "id" | "created_at" | "updated_at"
>
export type TrainingExerciseUpdate = Partial<TrainingExerciseInsert>

export interface SessionExercise {
  id: string
  training_session_id: string
  exercise_id: string
  order: number
  duration: number
  specific_notes: string | null
  created_at: string
  exercise?: TrainingExercise
}

export type SessionExerciseInsert = Omit<
  SessionExercise,
  "id" | "created_at" | "exercise"
>

export interface PlayerEvaluation {
  id: string
  player_id: string
  date: string
  coach: string | null
  notes: string | null
  created_at: string
  player?: Player
}

export type PlayerEvaluationInsert = Omit<PlayerEvaluation, "id" | "created_at" | "player">

export interface TrainingPlayerNote {
  id: string
  training_session_id: string
  player_id: string
  note: string
  created_at: string
  player?: Player
}

export type TrainingPlayerNoteInsert = Omit<
  TrainingPlayerNote,
  "id" | "created_at" | "player"
>

export interface PhysicalExercise {
  id: string
  name: string
  sets: number | null
  reps: string | null
  rest_seconds: number | null
  video_url: string | null
  image_url: string | null
  instructions: string | null
  created_at: string
  updated_at: string
}

export type PhysicalExerciseInsert = Omit<
  PhysicalExercise,
  "id" | "created_at" | "updated_at"
>
export type PhysicalExerciseUpdate = Partial<PhysicalExerciseInsert>

export interface Routine {
  id: string
  name: string
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type RoutineInsert = Omit<Routine, "id" | "created_at" | "updated_at">

export interface RoutineGroup {
  id: string
  routine_id: string
  name: string
  focus: string | null
  order: number
}

export type RoutineGroupInsert = Omit<RoutineGroup, "id">
export type RoutineGroupUpdate = Partial<Pick<RoutineGroup, "name" | "focus">>

export interface RoutineCircuit {
  id: string
  group_id: string
  order: number
}

export type RoutineCircuitInsert = Omit<RoutineCircuit, "id">

export interface RoutineExercise {
  id: string
  routine_id: string
  exercise_id: string | null
  ad_hoc_name: string | null
  circuit_id: string | null
  order: number
  sets_override: number | null
  reps_override: string | null
  rest_seconds_override: number | null
  notes: string | null
  created_at: string
  exercise?: PhysicalExercise
}

export type RoutineExerciseInsert = Omit<
  RoutineExercise,
  "id" | "created_at" | "exercise"
>

export interface RoutineAssignment {
  id: string
  routine_id: string
  date: string
  assigned_to: RoutineAssignmentTarget
  created_by: string | null
  notes: string | null
  created_at: string
  routine?: Routine
  routine_assignment_players?: { player_id: string }[]
}

export type RoutineAssignmentInsert = Omit<
  RoutineAssignment,
  "id" | "created_at" | "routine" | "routine_assignment_players"
>

export interface Match {
  id: string
  date: string
  start_time: string | null
  opponent: string
  location: string | null
  is_home: boolean | null
  national_id: string | null
  tournament_id: string | null
  notes: string | null
  goals_for: number | null
  goals_against: number | null
  fouls_us_1h: number | null
  fouls_them_1h: number | null
  fouls_us_2h: number | null
  fouls_them_2h: number | null
  created_at: string
  updated_at: string
}

// Resultado y faltas se cargan después, por separado (ver MatchResultCard) —
// no forman parte del alta inicial del partido.
export type MatchInsert = Omit<
  Match,
  | "id"
  | "created_at"
  | "updated_at"
  | "goals_for"
  | "goals_against"
  | "fouls_us_1h"
  | "fouls_them_1h"
  | "fouls_us_2h"
  | "fouls_them_2h"
>
export type MatchUpdate = Partial<Omit<Match, "id" | "created_at" | "updated_at">>

export interface Tournament {
  id: string
  name: string
  start_date: string | null
  end_date: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type TournamentInsert = Omit<Tournament, "id" | "created_at" | "updated_at">
export type TournamentUpdate = Partial<TournamentInsert>

export interface MatchInjuryNote {
  id: string
  match_id: string
  player_id: string
  note: string
  updated_at: string
}

export type MatchInjuryNoteInsert = Omit<MatchInjuryNote, "id" | "updated_at">

export interface MatchSubstitution {
  id: string
  match_id: string
  player_id: string
  in_minute: number
  out_minute: number
  created_at: string
  player?: Player
}

export type MatchSubstitutionInsert = Omit<
  MatchSubstitution,
  "id" | "created_at" | "player"
>

export interface MatchCard {
  id: string
  match_id: string
  player_id: string
  type: CardType
  minute: number | null
  notes: string | null
  created_at: string
  player?: Player
}

export type MatchCardInsert = Omit<MatchCard, "id" | "created_at" | "player">

export interface MatchGoal {
  id: string
  match_id: string
  player_id: string
  minute: number | null
  notes: string | null
  created_at: string
  player?: Player
}

export type MatchGoalInsert = Omit<MatchGoal, "id" | "created_at" | "player">

export interface PhysicalTest {
  id: string
  player_id: string
  date: string
  test_name: string
  value: number
  unit: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  player?: Player
}

export type PhysicalTestInsert = Omit<
  PhysicalTest,
  "id" | "created_at" | "player"
>

export interface Becado {
  id: string
  first_name: string
  last_name: string
  dni: string
  type: MemberType
  status: BecadoStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export type BecadoInsert = Omit<Becado, "id" | "created_at" | "updated_at">
export type BecadoUpdate = Partial<BecadoInsert>

export interface CheckBecadoResult {
  is_becado: boolean
  first_name: string | null
  last_name: string | null
  member_type: MemberType | null
}

export interface National {
  id: string
  name: string
  city: string | null
  start_date: string
  end_date: string
  travel_date: string | null
  return_date: string | null
  info: string | null
  default_flight_cost: number
  default_lodging_cost: number
  default_food_cost: number
  default_transport_cost: number
  created_at: string
  updated_at: string
}

// El costo default del viaje se edita después de creado el Nacional (pestaña
// Gastos), no forma parte del alta inicial.
export type NationalInsert = Omit<
  National,
  | "id"
  | "created_at"
  | "updated_at"
  | "default_flight_cost"
  | "default_lodging_cost"
  | "default_food_cost"
  | "default_transport_cost"
>
export type NationalUpdate = Partial<Omit<National, "id" | "created_at" | "updated_at">>

export interface NationalActivity {
  id: string
  national_id: string
  date: string
  time: string | null
  type: NationalActivityType
  title: string
  notes: string | null
  match_id: string | null
  routine_id: string | null
  created_at: string
  routine?: Pick<Routine, "id" | "name"> | null
}

export type NationalActivityInsert = Omit<NationalActivity, "id" | "created_at" | "routine">
export type NationalActivityUpdate = Partial<
  Pick<NationalActivity, "date" | "time" | "title" | "notes">
>

export interface NationalExpense {
  id: string
  national_id: string
  category: NationalExpenseCategory
  description: string | null
  amount: number
  created_at: string
}

export type NationalExpenseInsert = Omit<NationalExpense, "id" | "created_at">

export interface NationalPlayerCost {
  id: string
  national_id: string
  player_id: string
  flight_cost: number
  lodging_cost: number
  food_cost: number
  transport_cost: number
  total_cost: number
  minutes_played: number
  yellow_cards: number
  blue_cards: number
  goals: number
  notes: string | null
  created_at: string
  updated_at: string
  player?: Player
  national_payments?: NationalPayment[]
}

export type NationalPlayerCostInsert = Omit<
  NationalPlayerCost,
  "id" | "created_at" | "updated_at" | "total_cost" | "player" | "national_payments"
>
export type NationalPlayerCostUpdate = Partial<
  Pick<
    NationalPlayerCost,
    | "flight_cost"
    | "lodging_cost"
    | "food_cost"
    | "transport_cost"
    | "minutes_played"
    | "yellow_cards"
    | "blue_cards"
    | "goals"
    | "notes"
  >
>

export interface NationalPayment {
  id: string
  national_player_cost_id: string
  amount: number
  date: string
  notes: string | null
  created_at: string
}

export type NationalPaymentInsert = Omit<NationalPayment, "id" | "created_at">

export interface IndividualPlan {
  id: string
  player_id: string
  name: string
  objective: string | null
  description: string | null
  type: IndividualPlanType
  focus_area: IndividualPlanFocusArea
  start_date: string
  duration_weeks: number
  session_duration_minutes: number | null
  intensity: IndividualPlanIntensity
  status: IndividualPlanStatus
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  player?: Player
}

export type IndividualPlanInsert = Omit<
  IndividualPlan,
  "id" | "created_at" | "updated_at" | "player"
>
export type IndividualPlanUpdate = Partial<IndividualPlanInsert>

export interface IndividualPlanExercise {
  id: string
  plan_id: string
  exercise_id: string | null
  ad_hoc_name: string | null
  order: number
  base_sets: number | null
  base_reps: string | null
  notes: string | null
  created_at: string
  exercise?: TrainingExercise
  weeks?: IndividualPlanExerciseWeek[]
}

export type IndividualPlanExerciseInsert = Omit<
  IndividualPlanExercise,
  "id" | "created_at" | "exercise" | "weeks"
>

export interface IndividualPlanExerciseWeek {
  id: string
  plan_exercise_id: string
  week_number: number
  sets: number | null
  reps: string | null
}

export type IndividualPlanExerciseWeekInsert = Omit<IndividualPlanExerciseWeek, "id">

export interface PlayerReportNote {
  id: string
  player_id: string
  note: string
  created_by: string | null
  created_at: string
  author?: Pick<Profile, "full_name"> | null
}

export type PlayerReportNoteInsert = Omit<PlayerReportNote, "id" | "created_at" | "author">
