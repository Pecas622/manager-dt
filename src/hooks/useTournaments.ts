import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type { Match, Tournament, TournamentInsert, TournamentUpdate } from "@/types/database"

const TOURNAMENTS_KEY = ["tournaments"] as const

export function useTournaments() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...TOURNAMENTS_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("category", activeCategory)
        .order("start_date", { ascending: false, nullsFirst: false })
      if (error) throw error
      return data as Tournament[]
    },
  })
}

export function useTournament(id: string | undefined) {
  return useQuery({
    queryKey: [...TOURNAMENTS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as Tournament
    },
    enabled: Boolean(id),
  })
}

export function useTournamentMatches(tournamentId: string | undefined) {
  return useQuery({
    queryKey: [...TOURNAMENTS_KEY, tournamentId, "matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("tournament_id", tournamentId)
        .order("date", { ascending: false })
      if (error) throw error
      return data as Match[]
    },
    enabled: Boolean(tournamentId),
  })
}

export function useCreateTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: TournamentInsert) => {
      const { data, error } = await supabase
        .from("tournaments")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Tournament
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY })
    },
  })
}

export function useUpdateTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: TournamentUpdate }) => {
      const { data, error } = await supabase
        .from("tournaments")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as Tournament
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY })
      queryClient.invalidateQueries({ queryKey: [...TOURNAMENTS_KEY, data.id] })
    },
  })
}

export function useDeleteTournament() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tournaments").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOURNAMENTS_KEY })
    },
  })
}
