import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { Profile, ProfileInsert } from "@/types/database"

const PROFILES_KEY = ["profiles"] as const

export function useProfiles() {
  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, player:players(*)")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Profile[]
    },
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: ProfileInsert) => {
      const { data, error } = await supabase
        .from("profiles")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as Profile
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY })
    },
  })
}

export function useDeleteProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("profiles").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY })
    },
  })
}
