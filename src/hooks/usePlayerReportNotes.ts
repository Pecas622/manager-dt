import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { PlayerReportNote, PlayerReportNoteInsert } from "@/types/database"

const REPORT_NOTES_KEY = ["player_report_notes"] as const

export function usePlayerReportNotes(playerId: string | undefined) {
  return useQuery({
    queryKey: [...REPORT_NOTES_KEY, playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_report_notes")
        .select("*, author:profiles(full_name)")
        .eq("player_id", playerId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as PlayerReportNote[]
    },
    enabled: Boolean(playerId),
  })
}

export function useAddPlayerReportNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PlayerReportNoteInsert) => {
      const { data, error } = await supabase
        .from("player_report_notes")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as PlayerReportNote
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...REPORT_NOTES_KEY, data.player_id] })
    },
  })
}
