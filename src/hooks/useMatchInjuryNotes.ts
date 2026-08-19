import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { MatchInjuryNote } from "@/types/database"

const INJURY_NOTES_KEY = ["match_injury_notes"] as const

export function useMatchInjuryNotes(matchId: string | undefined) {
  return useQuery({
    queryKey: [...INJURY_NOTES_KEY, "match", matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("match_injury_notes")
        .select("*")
        .eq("match_id", matchId)
      if (error) throw error
      return data as MatchInjuryNote[]
    },
    enabled: Boolean(matchId),
  })
}

// Un solo registro por (match, jugador) — cargarlo de nuevo pisa el texto
// anterior. Si el texto queda vacío, se borra el registro.
export function useSetInjuryNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      matchId,
      playerId,
      note,
    }: {
      matchId: string
      playerId: string
      note: string
    }) => {
      if (!note.trim()) {
        const { error } = await supabase
          .from("match_injury_notes")
          .delete()
          .eq("match_id", matchId)
          .eq("player_id", playerId)
        if (error) throw error
        return matchId
      }
      const { error } = await supabase
        .from("match_injury_notes")
        .upsert(
          { match_id: matchId, player_id: playerId, note: note.trim() },
          { onConflict: "match_id,player_id" }
        )
      if (error) throw error
      return matchId
    },
    onSuccess: (matchId) => {
      queryClient.invalidateQueries({ queryKey: [...INJURY_NOTES_KEY, "match", matchId] })
    },
  })
}
