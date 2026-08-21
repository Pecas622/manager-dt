import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type { Player, PlayerInsert, PlayerUpdate } from "@/types/database"

const PLAYERS_KEY = ["players"] as const

export function usePlayers() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...PLAYERS_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("category", activeCategory)
        .order("jersey_number", { ascending: true })
      if (error) throw error
      return data as Player[]
    },
  })
}

// Sin filtro de categoría — solo para pantallas de administración (ej.
// vincular una cuenta a un jugador de cualquier categoría), no para las
// listas normales de la app.
export function usePlayersAllCategories() {
  return useQuery({
    queryKey: [...PLAYERS_KEY, "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("category", { ascending: true })
        .order("jersey_number", { ascending: true })
      if (error) throw error
      return data as Player[]
    },
  })
}

export function usePlayer(id: string | undefined) {
  return useQuery({
    queryKey: [...PLAYERS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as Player
    },
    enabled: Boolean(id),
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: PlayerInsert) => {
      const { data, error } = await supabase
        .from("players")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Player
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_KEY })
    },
  })
}

export function useUpdatePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: PlayerUpdate }) => {
      const { data, error } = await supabase
        .from("players")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as Player
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_KEY })
      queryClient.invalidateQueries({ queryKey: [...PLAYERS_KEY, data.id] })
    },
  })
}

export function useDeletePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("players").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PLAYERS_KEY })
    },
  })
}
