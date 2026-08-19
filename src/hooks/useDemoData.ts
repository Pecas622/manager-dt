import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import {
  DEMO_ID_RANGES,
  DEMO_INDIVIDUAL_PLANS,
  DEMO_INDIVIDUAL_PLAN_EXERCISES,
  DEMO_INDIVIDUAL_PLAN_EXERCISE_WEEKS,
  DEMO_MATCHES,
  DEMO_MATCH_CARDS,
  DEMO_MATCH_GOALS,
  DEMO_MATCH_INJURY_NOTES,
  DEMO_MATCH_SUBSTITUTIONS,
  DEMO_NATIONALS,
  DEMO_NATIONAL_ACTIVITIES,
  DEMO_NATIONAL_EXPENSES,
  DEMO_NATIONAL_PAYMENTS,
  DEMO_NATIONAL_PLAYER_COSTS,
  DEMO_PHYSICAL_EXERCISES,
  DEMO_PHYSICAL_TESTS,
  DEMO_PLAYERS,
  DEMO_PLAYER_EVALUATIONS,
  DEMO_PLAYER_REPORT_NOTES,
  DEMO_ROUTINES,
  DEMO_ROUTINE_ASSIGNMENTS,
  DEMO_ROUTINE_CIRCUITS,
  DEMO_ROUTINE_EXERCISES,
  DEMO_ROUTINE_GROUPS,
  DEMO_SESSION_EXERCISES,
  DEMO_TRAINING_EXERCISES,
  DEMO_TRAINING_PLAYER_NOTES,
  DEMO_TRAINING_SESSIONS,
  DEMO_TOURNAMENTS,
} from "@/lib/demoData"

// Orden de carga: respeta las foreign keys (padres antes que hijos).
const SEED_STEPS: [table: string, rows: Record<string, unknown>[]][] = [
  ["players", DEMO_PLAYERS],
  ["training_exercises", DEMO_TRAINING_EXERCISES],
  ["training_sessions", DEMO_TRAINING_SESSIONS],
  ["session_exercises", DEMO_SESSION_EXERCISES],
  ["training_player_notes", DEMO_TRAINING_PLAYER_NOTES],
  ["player_evaluations", DEMO_PLAYER_EVALUATIONS],
  ["physical_exercises", DEMO_PHYSICAL_EXERCISES],
  ["routines", DEMO_ROUTINES],
  ["routine_groups", DEMO_ROUTINE_GROUPS],
  ["routine_circuits", DEMO_ROUTINE_CIRCUITS],
  ["routine_exercises", DEMO_ROUTINE_EXERCISES],
  ["routine_assignments", DEMO_ROUTINE_ASSIGNMENTS],
  ["nationals", DEMO_NATIONALS],
  ["tournaments", DEMO_TOURNAMENTS],
  ["matches", DEMO_MATCHES],
  ["match_substitutions", DEMO_MATCH_SUBSTITUTIONS],
  ["match_cards", DEMO_MATCH_CARDS],
  ["match_goals", DEMO_MATCH_GOALS],
  ["match_injury_notes", DEMO_MATCH_INJURY_NOTES],
  ["national_activities", DEMO_NATIONAL_ACTIVITIES],
  ["national_expenses", DEMO_NATIONAL_EXPENSES],
  ["national_player_costs", DEMO_NATIONAL_PLAYER_COSTS],
  ["national_payments", DEMO_NATIONAL_PAYMENTS],
  ["physical_tests", DEMO_PHYSICAL_TESTS],
  ["individual_plans", DEMO_INDIVIDUAL_PLANS],
  ["individual_plan_exercises", DEMO_INDIVIDUAL_PLAN_EXERCISES],
  ["individual_plan_exercise_weeks", DEMO_INDIVIDUAL_PLAN_EXERCISE_WEEKS],
  ["player_report_notes", DEMO_PLAYER_REPORT_NOTES],
]

export function useSeedDemoData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      for (const [table, rows] of SEED_STEPS) {
        const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" })
        if (error) throw new Error(`${table}: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

export function useCleanupDemoData() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      for (const [table, start, end] of DEMO_ID_RANGES) {
        const { error } = await supabase.from(table).delete().gte("id", start).lte("id", end)
        if (error) throw new Error(`${table}: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}
