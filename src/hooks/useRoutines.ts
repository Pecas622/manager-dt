import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type {
  PhysicalExercise,
  PhysicalExerciseInsert,
  PhysicalExerciseUpdate,
  Routine,
  RoutineAssignment,
  RoutineAssignmentInsert,
  RoutineCircuit,
  RoutineCircuitInsert,
  RoutineExercise,
  RoutineExerciseInsert,
  RoutineGroup,
  RoutineGroupInsert,
  RoutineGroupUpdate,
  RoutineInsert,
} from "@/types/database"

const PHYSICAL_EXERCISES_KEY = ["physical_exercises"] as const
const ROUTINES_KEY = ["routines"] as const
const ROUTINE_ASSIGNMENTS_KEY = ["routine_assignments"] as const
// Sub-key de ROUTINES_KEY (prefijo) — invalidar ["routines"] invalida esto también.
const PLANS_KEY = [...ROUTINES_KEY, "plans"] as const

// ---------- Ejercicios físicos ----------

export function usePhysicalExercises() {
  return useQuery({
    queryKey: PHYSICAL_EXERCISES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("physical_exercises")
        .select("*")
        .order("name", { ascending: true })
      if (error) throw error
      return data as PhysicalExercise[]
    },
  })
}

export function useCreatePhysicalExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PhysicalExerciseInsert) => {
      const { data, error } = await supabase
        .from("physical_exercises")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as PhysicalExercise
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_EXERCISES_KEY })
    },
  })
}

export function useUpdatePhysicalExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: PhysicalExerciseUpdate
    }) => {
      const { data, error } = await supabase
        .from("physical_exercises")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as PhysicalExercise
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_EXERCISES_KEY })
    },
  })
}

export function useDeletePhysicalExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("physical_exercises")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_EXERCISES_KEY })
    },
  })
}

// ---------- Rutinas ----------

export function useRoutines() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...ROUTINES_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select("*, routine_exercises(id)")
        .is("player_id", null)
        .eq("category", activeCategory)
        .order("name", { ascending: true })
      if (error) throw error
      return data as (Routine & { routine_exercises: { id: string }[] })[]
    },
  })
}

export interface RoutineDetail extends Routine {
  routine_exercises: RoutineExercise[]
  routine_groups: (RoutineGroup & { routine_circuits: RoutineCircuit[] })[]
}

export function useRoutine(id: string | undefined) {
  return useQuery({
    queryKey: [...ROUTINES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select(
          "*, routine_exercises(*, exercise:physical_exercises(*), weeks:routine_exercise_weeks(*)), routine_groups(*, routine_circuits(*))"
        )
        .eq("id", id)
        .order("order", { referencedTable: "routine_exercises", ascending: true })
        .order("order", { referencedTable: "routine_groups", ascending: true })
        .order("order", {
          referencedTable: "routine_groups.routine_circuits",
          ascending: true,
        })
        .single()
      if (error) throw error
      return data as RoutineDetail
    },
    enabled: Boolean(id),
  })
}

// ---------- Planes individuales (rutinas con player_id) ----------

export function usePlans() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...PLANS_KEY, activeCategory],
    queryFn: async () => {
      // Un plan no tiene category propia — hereda la del jugador. `!inner`
      // fuerza el join para poder filtrar por una columna del embed.
      const { data, error } = await supabase
        .from("routines")
        .select("*, player:players!inner(*), routine_exercises(id)")
        .not("player_id", "is", null)
        .eq("player.category", activeCategory)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as (Routine & { routine_exercises: { id: string }[] })[]
    },
  })
}

export function usePlayerPlans(playerId: string | undefined) {
  return useQuery({
    queryKey: [...PLANS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("player_id", playerId)
        .order("status", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Routine[]
    },
    enabled: Boolean(playerId),
  })
}

// Clona un plan completo (datos + ejercicios planos + progresión semanal)
// como uno nuevo, activo, con "(copia)" en el nombre.
export function useDuplicatePlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: original, error: fetchError } = await supabase
        .from("routines")
        .select("*, routine_exercises(*, weeks:routine_exercise_weeks(*))")
        .eq("id", id)
        .single()
      if (fetchError) throw fetchError
      const source = original as RoutineDetail

      const { data: newPlan, error: createError } = await supabase
        .from("routines")
        .insert({
          category: source.category,
          player_id: source.player_id,
          name: `${source.name} (copia)`,
          notes: source.notes,
          objective: source.objective,
          plan_type: source.plan_type,
          focus_area: source.focus_area,
          intensity: source.intensity,
          start_date: source.start_date,
          duration_weeks: source.duration_weeks,
          session_duration_minutes: source.session_duration_minutes,
          status: "Activa",
          created_by: source.created_by,
        })
        .select()
        .single()
      if (createError) throw createError

      const flatExercises = source.routine_exercises.filter((e) => !e.circuit_id)
      for (const exercise of flatExercises) {
        const { data: newExercise, error: exError } = await supabase
          .from("routine_exercises")
          .insert({
            routine_id: newPlan.id,
            circuit_id: null,
            exercise_id: exercise.exercise_id,
            ad_hoc_name: exercise.ad_hoc_name,
            order: exercise.order,
            sets_override: exercise.sets_override,
            reps_override: exercise.reps_override,
            rest_seconds_override: exercise.rest_seconds_override,
            notes: exercise.notes,
          })
          .select()
          .single()
        if (exError) throw exError

        const weeks = exercise.weeks ?? []
        if (weeks.length > 0) {
          const { error: weeksError } = await supabase.from("routine_exercise_weeks").insert(
            weeks.map((w) => ({
              routine_exercise_id: newExercise.id,
              week_number: w.week_number,
              sets: w.sets,
              reps: w.reps,
            }))
          )
          if (weeksError) throw weeksError
        }
      }

      return newPlan as Routine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTINES_KEY })
    },
  })
}

export function useSetRoutineExerciseWeek() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      routineId,
      routineExerciseId,
      weekNumber,
      sets,
      reps,
    }: {
      routineId: string
      routineExerciseId: string
      weekNumber: number
      sets: number | null
      reps: string | null
    }) => {
      const { error } = await supabase.from("routine_exercise_weeks").upsert(
        { routine_exercise_id: routineExerciseId, week_number: weekNumber, sets, reps },
        { onConflict: "routine_exercise_id,week_number" }
      )
      if (error) throw error
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

export function useCreateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: RoutineInsert) => {
      const { data, error } = await supabase
        .from("routines")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Routine
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTINES_KEY })
    },
  })
}

export function useUpdateRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: Partial<RoutineInsert>
    }) => {
      const { data, error } = await supabase
        .from("routines")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as Routine
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ROUTINES_KEY })
      queryClient.invalidateQueries({ queryKey: [...ROUTINES_KEY, data.id] })
    },
  })
}

export function useDeleteRoutine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("routines").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTINES_KEY })
    },
  })
}

function invalidateRoutine(
  queryClient: ReturnType<typeof useQueryClient>,
  routineId: string
) {
  queryClient.invalidateQueries({ queryKey: [...ROUTINES_KEY, routineId] })
  queryClient.invalidateQueries({ queryKey: ROUTINES_KEY })
}

// ---------- Grupos y circuitos ----------

export function useAddRoutineGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: RoutineGroupInsert) => {
      const { data, error } = await supabase
        .from("routine_groups")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as RoutineGroup
    },
    onSuccess: (data) => invalidateRoutine(queryClient, data.routine_id),
  })
}

export function useUpdateRoutineGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      routineId,
      input,
    }: {
      id: string
      routineId: string
      input: RoutineGroupUpdate
    }) => {
      const { error } = await supabase.from("routine_groups").update(input).eq("id", id)
      if (error) throw error
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

export function useDeleteRoutineGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routineId }: { id: string; routineId: string }) => {
      const { error } = await supabase.from("routine_groups").delete().eq("id", id)
      if (error) throw error
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

export function useAddRoutineCircuit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      input,
      routineId,
    }: {
      input: RoutineCircuitInsert
      routineId: string
    }) => {
      const { data, error } = await supabase
        .from("routine_circuits")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return { circuit: data as RoutineCircuit, routineId }
    },
    onSuccess: ({ routineId }) => invalidateRoutine(queryClient, routineId),
  })
}

export function useDeleteRoutineCircuit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routineId }: { id: string; routineId: string }) => {
      const { error } = await supabase.from("routine_circuits").delete().eq("id", id)
      if (error) throw error
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

export function useAddRoutineExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: RoutineExerciseInsert) => {
      const { data, error } = await supabase
        .from("routine_exercises")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as RoutineExercise
    },
    onSuccess: (data) => invalidateRoutine(queryClient, data.routine_id),
  })
}

export function useReorderRoutineExercises() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      routineId,
      orderedIds,
    }: {
      routineId: string
      orderedIds: string[]
    }) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase.from("routine_exercises").update({ order: index }).eq("id", id)
        )
      )
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

export function useRemoveRoutineExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, routineId }: { id: string; routineId: string }) => {
      const { error } = await supabase
        .from("routine_exercises")
        .delete()
        .eq("id", id)
      if (error) throw error
      return routineId
    },
    onSuccess: (routineId) => invalidateRoutine(queryClient, routineId),
  })
}

// ---------- Asignaciones ----------

export function useRoutineAssignments() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...ROUTINE_ASSIGNMENTS_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routine_assignments")
        .select("*, routine:routines(*), routine_assignment_players(player_id)")
        .eq("category", activeCategory)
        .order("date", { ascending: false })
      if (error) throw error
      return data as RoutineAssignment[]
    },
  })
}

export function useCreateRoutineAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      input,
      playerIds,
    }: {
      input: RoutineAssignmentInsert
      playerIds: string[]
    }) => {
      const { data, error } = await supabase
        .from("routine_assignments")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      const assignment = data as RoutineAssignment
      if (input.assigned_to === "jugadores" && playerIds.length > 0) {
        const { error: playersError } = await supabase
          .from("routine_assignment_players")
          .insert(
            playerIds.map((player_id) => ({
              routine_assignment_id: assignment.id,
              player_id,
            }))
          )
        if (playersError) throw playersError
      }
      return assignment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTINE_ASSIGNMENTS_KEY })
    },
  })
}

export function useDeleteRoutineAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("routine_assignments")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTINE_ASSIGNMENTS_KEY })
    },
  })
}
