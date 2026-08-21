import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type { PlayerEvaluation, PlayerEvaluationInsert } from "@/types/database"

const EVALUATIONS_KEY = ["evaluations"] as const

export function useEvaluations(options?: { enabled?: boolean }) {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...EVALUATIONS_KEY, activeCategory],
    queryFn: async () => {
      // player_evaluations sigue siendo 100% DT-only por RLS — el filtro acá
      // es solo para que el DT vea una categoría a la vez, no un permiso.
      const { data, error } = await supabase
        .from("player_evaluations")
        .select("*, player:players!inner(*)")
        .eq("player.category", activeCategory)
        .order("date", { ascending: false })
      if (error) throw error
      return data as PlayerEvaluation[]
    },
    enabled: options?.enabled ?? true,
  })
}

export function usePlayerEvaluations(playerId: string | undefined) {
  return useQuery({
    queryKey: [...EVALUATIONS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_evaluations")
        .select("*")
        .eq("player_id", playerId)
        .order("date", { ascending: true })
      if (error) throw error
      return data as PlayerEvaluation[]
    },
    enabled: Boolean(playerId),
  })
}

export function useEvaluation(id: string | undefined) {
  return useQuery({
    queryKey: [...EVALUATIONS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_evaluations")
        .select("*, player:players(*)")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as PlayerEvaluation
    },
    enabled: Boolean(id),
  })
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PlayerEvaluationInsert) => {
      const { data, error } = await supabase
        .from("player_evaluations")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as PlayerEvaluation
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY })
    },
  })
}

export function useDeleteEvaluation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("player_evaluations")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVALUATIONS_KEY })
    },
  })
}
