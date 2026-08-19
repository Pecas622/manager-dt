import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { MatchSubstitution, MatchSubstitutionInsert } from "@/types/database"

const SUBSTITUTIONS_KEY = ["match_substitutions"] as const

// Cada tiempo de futsal arranca de 0 (igual que en la planilla de papel del
// profe) — in_minute/out_minute siguen siendo un cronómetro corrido de
// partido completo en la base (0 a 2×MATCH_HALF_MINUTES), pero la carga y
// la lectura por tiempo se hacen relativas a esta marca.
export const MATCH_HALF_MINUTES = 20

export function sumMinutes(segments: { in_minute: number; out_minute: number }[]) {
  return segments.reduce((sum, s) => sum + (s.out_minute - s.in_minute), 0)
}

// Minutos que aporta un tramo a cada tiempo, partiéndolo en la marca de
// entretiempo si la cruza — un tramo cargado desde la planilla nueva nunca
// cruza (se carga por tiempo), pero uno viejo, corrido de partido completo,
// puede hacerlo.
export function sumMinutesByHalf(segments: { in_minute: number; out_minute: number }[]) {
  return segments.reduce(
    (totals, s) => {
      const first = Math.max(
        0,
        Math.min(s.out_minute, MATCH_HALF_MINUTES) - Math.min(s.in_minute, MATCH_HALF_MINUTES)
      )
      const second = Math.max(0, s.out_minute - Math.max(s.in_minute, MATCH_HALF_MINUTES))
      totals.firstHalf += first
      totals.secondHalf += second
      return totals
    },
    { firstHalf: 0, secondHalf: 0 }
  )
}

// Un tramo para mostrar como chip, ya ubicado en su tiempo (1 o 2) con
// minutos relativos a ese tiempo (0-MATCH_HALF_MINUTES). Un tramo viejo que
// cruza el entretiempo se parte en dos chips.
export function segmentDisplayParts(segment: { in_minute: number; out_minute: number }) {
  const half = MATCH_HALF_MINUTES
  const parts: { half: 1 | 2; from: number; to: number }[] = []
  if (segment.in_minute < half) {
    parts.push({ half: 1, from: segment.in_minute, to: Math.min(segment.out_minute, half) })
  }
  if (segment.out_minute > half) {
    parts.push({ half: 2, from: Math.max(segment.in_minute, half) - half, to: segment.out_minute - half })
  }
  return parts
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
