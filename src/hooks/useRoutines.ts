import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
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
  return useQuery({
    queryKey: ROUTINES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routines")
        .select("*, routine_exercises(id)")
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
          "*, routine_exercises(*, exercise:physical_exercises(*)), routine_groups(*, routine_circuits(*))"
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
  return useQuery({
    queryKey: ROUTINE_ASSIGNMENTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("routine_assignments")
        .select("*, routine:routines(*), routine_assignment_players(player_id)")
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
