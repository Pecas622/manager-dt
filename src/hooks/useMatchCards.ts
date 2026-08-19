import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { MatchCard, MatchCardInsert } from "@/types/database"

const MATCH_CARDS_KEY = ["match_cards"] as const

export function useMatchCards(matchId: string | undefined) {
  return useQuery({
    queryKey: [...MATCH_CARDS_KEY, "match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_cards")
        .select("*")
        .eq("match_id", matchId)
        .order("created_at", { ascending: true })
      if (error) throw error
      return data as MatchCard[]
    },
    enabled: Boolean(matchId),
  })
}

// Total de tarjetas acumuladas por un jugador, por tipo, sumando todos sus partidos.
export function usePlayerCardCounts(playerId: string | undefined) {
  return useQuery({
    queryKey: [...MATCH_CARDS_KEY, "player", playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_cards")
        .select("type")
        .eq("player_id", playerId)
      if (error) throw error
      const rows = data as { type: MatchCard["type"] }[]
      return {
        amarillas: rows.filter((r) => r.type === "Amarilla").length,
        azules: rows.filter((r) => r.type === "Azul").length,
      }
    },
    enabled: Boolean(playerId),
  })
}

export function useAddCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MatchCardInsert) => {
      const { data, error } = await supabase
        .from("match_cards")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as MatchCard
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...MATCH_CARDS_KEY, "match", data.match_id] })
      queryClient.invalidateQueries({ queryKey: [...MATCH_CARDS_KEY, "player", data.player_id] })
    },
  })
}

export function useDeleteCard() {
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
      const { error } = await supabase.from("match_cards").delete().eq("id", id)
      if (error) throw error
      return { matchId, playerId }
    },
    onSuccess: ({ matchId, playerId }) => {
      queryClient.invalidateQueries({ queryKey: [...MATCH_CARDS_KEY, "match", matchId] })
      queryClient.invalidateQueries({ queryKey: [...MATCH_CARDS_KEY, "player", playerId] })
    },
  })
}
