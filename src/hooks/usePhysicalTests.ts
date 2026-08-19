import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type {
  PhysicalTest,
  PhysicalTestInsert,
  PhysicalTestRepInsert,
} from "@/types/database"

const PHYSICAL_TESTS_KEY = ["physical_tests"] as const

export function usePhysicalTests() {
  return useQuery({
    queryKey: PHYSICAL_TESTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("physical_tests")
        .select("*, player:players(*), reps:physical_test_reps(*)")
        .order("date", { ascending: false })
      if (error) throw error
      return data as PhysicalTest[]
    },
  })
}

export function usePlayerPhysicalTests(playerId: string | undefined) {
  return useQuery({
    queryKey: [...PHYSICAL_TESTS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("physical_tests")
        .select("*, reps:physical_test_reps(*)")
        .eq("player_id", playerId)
        .order("date", { ascending: false })
      if (error) throw error
      return data as PhysicalTest[]
    },
    enabled: Boolean(playerId),
  })
}

export function useCreatePhysicalTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PhysicalTestInsert) => {
      const { data, error } = await supabase
        .from("physical_tests")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as PhysicalTest
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_TESTS_KEY })
      queryClient.invalidateQueries({
        queryKey: [...PHYSICAL_TESTS_KEY, "player", data.player_id],
      })
    },
  })
}

// Crea el test (value = mayor valor en cm) y, si trae repeticiones, las
// inserta encadenadas al test recién creado.
export function useCreatePhysicalTestWithReps() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      input,
      reps,
    }: {
      input: PhysicalTestInsert
      reps?: Omit<PhysicalTestRepInsert, "test_id">[]
    }) => {
      const { data: test, error } = await supabase
        .from("physical_tests")
        .insert(input)
        .select()
        .single()
      if (error) throw error

      if (reps && reps.length > 0) {
        const { error: repsError } = await supabase.from("physical_test_reps").insert(
          reps.map((r) => ({ ...r, test_id: test.id }))
        )
        if (repsError) throw repsError
      }

      return test as PhysicalTest
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_TESTS_KEY })
      queryClient.invalidateQueries({
        queryKey: [...PHYSICAL_TESTS_KEY, "player", data.player_id],
      })
    },
  })
}

export function summarizeReps(reps: { value_cm: number | null; value_ms: number | null }[]) {
  const cmValues = reps.map((r) => r.value_cm).filter((v): v is number => v != null)
  const msValues = reps.map((r) => r.value_ms).filter((v): v is number => v != null)
  const avg = (values: number[]) =>
    values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : null
  return {
    bestCm: cmValues.length > 0 ? Math.max(...cmValues) : null,
    avgCm: avg(cmValues),
    bestMs: msValues.length > 0 ? Math.max(...msValues) : null,
    avgMs: avg(msValues),
  }
}

export function useDeletePhysicalTest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("physical_tests").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHYSICAL_TESTS_KEY })
    },
  })
}
