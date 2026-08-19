import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { MatchSubstitution, MatchSubstitutionInsert } from "@/types/database"

const SUBSTITUTIONS_KEY = ["match_substitutions"] as const

export function sumMinutes(segments: { in_minute: number; out_minute: number }[]) {
  return segments.reduce((sum, s) => sum + (s.out_minute - s.in_minute), 0)
}

export function useMatchSubstitutions(matchId: string | undefined) {
  return useQuery({
    queryKey: [...SUBSTITUTIONS_KEY, "match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_substitutions")
        .select("*")
        .eq("match_id", matchId)
        .order("in_minute", { ascending: true })
      if (error) throw error
      return data as MatchSubstitution[]
    },
    enabled: Boolean(matchId),
  })
}

// Minutos acumulados de un jugador, sumando los tramos de todos los partidos.
export function usePlayerTotalMinutes(playerId: string | undefined) {
  return useQuery({
    queryKey: [...SUBSTITUTIONS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_substitutions")
        .select("in_minute, out_minute")
        .eq("player_id", playerId)
      if (error) throw error
      return sumMinutes(data as { in_minute: number; out_minute: number }[])
    },
    enabled: Boolean(playerId),
  })
}

export function useAddSubstitution() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MatchSubstitutionInsert) => {
      const { data, error } = await supabase
        .from("match_substitutions")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as MatchSubstitution
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...SUBSTITUTIONS_KEY, "match", data.match_id] })
      queryClient.invalidateQueries({ queryKey: [...SUBSTITUTIONS_KEY, "player", data.player_id] })
    },
  })
}

export function useDeleteSubstitution() {
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
      const { error } = await supabase.from("match_substitutions").delete().eq("id", id)
      if (error) throw error
      return { matchId, playerId }
    },
    onSuccess: ({ matchId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: [...SUBSTITUTIONS_KEY, "match", matchId] })
      queryClient.invalidateQueries({ queryKey: [...SUBSTITUTIONS_KEY, "player", playerId] })
    },
  })
}
