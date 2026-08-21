import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type { Match, MatchInsert, MatchUpdate } from "@/types/database"

const MATCHES_KEY = ["matches"] as const

export function useMatches() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...MATCHES_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("category", activeCategory)
        .order("date", { ascending: false })
      if (error) throw error
      return data as Match[]
    },
  })
}

export function useMatch(id: string | undefined) {
  return useQuery({
    queryKey: [...MATCHES_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as Match
    },
    enabled: Boolean(id),
  })
}

export function useCreateMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: MatchInsert) => {
      const { data, error } = await supabase
        .from("matches")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Match
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY })
    },
  })
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: MatchUpdate }) => {
      const { data, error } = await supabase
        .from("matches")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as Match
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY })
      queryClient.invalidateQueries({ queryKey: [...MATCHES_KEY, data.id] })
    },
  })
}

export function useDeleteMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("matches").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MATCHES_KEY })
    },
  })
}
