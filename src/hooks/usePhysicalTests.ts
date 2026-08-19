import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { PhysicalTest, PhysicalTestInsert } from "@/types/database"

const PHYSICAL_TESTS_KEY = ["physical_tests"] as const

export function usePhysicalTests() {
  return useQuery({
    queryKey: PHYSICAL_TESTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("physical_tests")
        .select("*, player:players(*)")
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
        .select("*")
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
