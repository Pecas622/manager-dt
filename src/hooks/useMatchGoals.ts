import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { MatchGoal, MatchGoalInsert } from "@/types/database"

const MATCH_GOALS_KEY = ["match_goals"] as const

export function useMatchGoals(matchId: string | undefined) {
  return useQuery({
    queryKey: [...MATCH_GOALS_KEY, "match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_goals")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true })
      if (error) throw error
      return data as MatchGoal[]
    },
    enabled: Boolean(matchId),
  })
}

// Total de goles acumulados por un jugador, sumando todos sus partidos.
export function usePlayerGoalCount(playerId: string | undefined) {
  return useQuery({
    queryKey: [...MATCH_GOALS_KEY, "player", playerId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("match_goals")
        .select("id", { count: "exact", head: true })
        .eq("player_id", playerId)
      if (error) throw error
      return count ?? 0
    },
    enabled: Boolean(playerId),
  })
}

export function useAddGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MatchGoalInsert) => {
      const { data, error } = await supabase
        .from("match_goals")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as MatchGoal
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...MATCH_GOALS_KEY, "match", data.match_id] })
      queryClient.invalidateQueries({ queryKey: [...MATCH_GOALS_KEY, "player", data.player_id] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      matchId,
      playerId,
    }: {
      id: string
      matchId: string
      playerId: string
    }) => {
      const { error } = await supabase.from("match_goals").delete().eq("id", id)
      if (error) throw error
      return { matchId, playerId }
    },
    onSuccess: ({ matchId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: [...MATCH_GOALS_KEY, "match", matchId] })
      queryClient.invalidateQueries({ queryKey: [...MATCH_GOALS_KEY, "player", playerId] })
    },
  })
}
