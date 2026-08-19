import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type {
  IndividualPlan,
  IndividualPlanExercise,
  IndividualPlanExerciseInsert,
  IndividualPlanInsert,
  IndividualPlanUpdate,
} from "@/types/database"

const PLANS_KEY = ["individual_plans"] as const

export interface IndividualPlanDetail extends IndividualPlan {
  individual_plan_exercises: IndividualPlanExercise[]
}

export function useIndividualPlans() {
  return useQuery({
    queryKey: PLANS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("individual_plans")
        .select("*, player:players(*), individual_plan_exercises(id)")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as (IndividualPlan & { individual_plan_exercises: { id: string }[] })[]
    },
  })
}

export function usePlayerIndividualPlans(playerId: string | undefined) {
  return useQuery({
    queryKey: [...PLANS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("individual_plans")
        .select("*")
        .eq("player_id", playerId)
        .order("status", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as IndividualPlan[]
    },
    enabled: Boolean(playerId),
  })
}

export function useIndividualPlan(id: string | undefined) {
  return useQuery({
    queryKey: [...PLANS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("individual_plans")
        .select(
          "*, player:players(*), individual_plan_exercises(*, exercise:training_exercises(*), weeks:individual_plan_exercise_weeks(*))"
        )
        .eq("id", id)
        .order("order", {
          referencedTable: "individual_plan_exercises",
          ascending: true,
        })
        .single()
      if (error) throw error
      return data as IndividualPlanDetail
    },
    enabled: Boolean(id),
  })
}

export function useCreateIndividualPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: IndividualPlanInsert) => {
      const { data, error } = await supabase
        .from("individual_plans")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as IndividualPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_KEY })
    },
  })
}

export function useUpdateIndividualPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: IndividualPlanUpdate }) => {
      const { data, error } = await supabase
        .from("individual_plans")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as IndividualPlan
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PLANS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PLANS_KEY, data.id] })
    },
  })
}

export function useDeleteIndividualPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("individual_plans").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_KEY })
    },
  })
}

// Clona un plan completo (datos + ejercicios + progresión semanal) como uno
// nuevo, activo, con "(copia)" en el nombre.
export function useDuplicateIndividualPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: original, error: fetchError } = await supabase
        .from("individual_plans")
        .select("*, individual_plan_exercises(*, weeks:individual_plan_exercise_weeks(*))")
        .eq("id", id)
        .single()
      if (fetchError) throw fetchError
      const source = original as IndividualPlanDetail

      const { data: newPlan, error: createError } = await supabase
        .from("individual_plans")
        .insert({
          player_id: source.player_id,
          name: `${source.name} (copia)`,
          objective: source.objective,
          description: source.description,
          type: source.type,
          focus_area: source.focus_area,
          start_date: source.start_date,
          duration_weeks: source.duration_weeks,
          session_duration_minutes: source.session_duration_minutes,
          intensity: source.intensity,
          status: "Activa",
          notes: source.notes,
          created_by: source.created_by,
        })
        .select()
        .single()
      if (createError) throw createError

      for (const exercise of source.individual_plan_exercises) {
        const { data: newExercise, error: exError } = await supabase
          .from("individual_plan_exercises")
          .insert({
            plan_id: newPlan.id,
            exercise_id: exercise.exercise_id,
            ad_hoc_name: exercise.ad_hoc_name,
            order: exercise.order,
            base_sets: exercise.base_sets,
            base_reps: exercise.base_reps,
            notes: exercise.notes,
          })
          .select()
          .single()
        if (exError) throw exError

        const weeks = exercise.weeks ?? []
        if (weeks.length > 0) {
          const { error: weeksError } = await supabase
            .from("individual_plan_exercise_weeks")
            .insert(
              weeks.map((w) => ({
                plan_exercise_id: newExercise.id,
                week_number: w.week_number,
                sets: w.sets,
                reps: w.reps,
              }))
            )
          if (weeksError) throw weeksError
        }
      }

      return newPlan as IndividualPlan
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLANS_KEY })
    },
  })
}

function invalidatePlan(queryClient: ReturnType<typeof useQueryClient>, planId: string) {
  queryClient.invalidateQueries({ queryKey: [...PLANS_KEY, planId] })
  queryClient.invalidateQueries({ queryKey: PLANS_KEY })
}

export function useAddPlanExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: IndividualPlanExerciseInsert) => {
      const { data, error } = await supabase
        .from("individual_plan_exercises")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as IndividualPlanExercise
    },
    onSuccess: (data) => invalidatePlan(queryClient, data.plan_id),
  })
}

export function useUpdatePlanExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      planId,
      input,
    }: {
      id: string
      planId: string
      input: Partial<Pick<IndividualPlanExercise, "base_sets" | "base_reps" | "notes">>
    }) => {
      const { error } = await supabase
        .from("individual_plan_exercises")
        .update(input)
        .eq("id", id)
      if (error) throw error
      return planId
    },
    onSuccess: (planId) => invalidatePlan(queryClient, planId),
  })
}

export function useReorderPlanExercises() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      planId,
      orderedIds,
    }: {
      planId: string
      orderedIds: string[]
    }) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase.from("individual_plan_exercises").update({ order: index }).eq("id", id)
        )
      )
      return planId
    },
    onSuccess: (planId) => invalidatePlan(queryClient, planId),
  })
}

export function useRemovePlanExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, planId }: { id: string; planId: string }) => {
      const { error } = await supabase
        .from("individual_plan_exercises")
        .delete()
        .eq("id", id)
      if (error) throw error
      return planId
    },
    onSuccess: (planId) => invalidatePlan(queryClient, planId),
  })
}

export function useSetPlanExerciseWeek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      planId,
      planExerciseId,
      weekNumber,
      sets,
      reps,
    }: {
      planId: string
      planExerciseId: string
      weekNumber: number
      sets: number | null
      reps: string | null
    }) => {
      const { error } = await supabase.from("individual_plan_exercise_weeks").upsert(
        { plan_exercise_id: planExerciseId, week_number: weekNumber, sets, reps },
        { onConflict: "plan_exercise_id,week_number" }
      )
      if (error) throw error
      return planId
    },
    onSuccess: (planId) => invalidatePlan(queryClient, planId),
  })
}
