import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type {
  TrainingExercise,
  TrainingExerciseInsert,
  TrainingExerciseUpdate,
} from "@/types/database"

const EXERCISES_KEY = ["exercises"] as const

export function useExercises() {
  return useQuery({
    queryKey: EXERCISES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_exercises")
        .select("*")
        .order("name", { ascending: true })
      if (error) throw error
      return data as TrainingExercise[]
    },
  })
}

export function useExercise(id: string | undefined) {
  return useQuery({
    queryKey: [...EXERCISES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_exercises")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as TrainingExercise
    },
    enabled: Boolean(id),
  })
}

export function useCreateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: TrainingExerciseInsert) => {
      const { data, error } = await supabase
        .from("training_exercises")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as TrainingExercise
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY })
    },
  })
}

export function useUpdateExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: TrainingExerciseUpdate
    }) => {
      const { data, error } = await supabase
        .from("training_exercises")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as TrainingExercise
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY })
    },
  })
}

export function useDeleteExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("training_exercises")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEY })
    },
  })
}
