import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { Profile, ProfileInsert } from "@/types/database"
import type { Category } from "@/types/domain"

const PROFILES_KEY = ["profiles"] as const

export function useProfiles() {
  return useQuery({
    queryKey: PROFILES_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, player:players(*), profile_categories(category)")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as Profile[]
    },
  })
}

// Reemplaza el set de categorías vinculadas a un profile (borra todo lo
// anterior e inserta lo nuevo — más simple que un diff para un set chico).
export function useSetProfileCategories() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      profileId,
      categories,
    }: {
      profileId: string
      categories: Category[]
    }) => {
      const { error: deleteError } = await supabase
        .from("profile_categories")
        .delete()
        .eq("profile_id", profileId)
      if (deleteError) throw deleteError

      if (categories.length > 0) {
        const { error: insertError } = await supabase
          .from("profile_categories")
          .insert(categories.map((category) => ({ profile_id: profileId, category })))
        if (insertError) throw insertError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_KEY })
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
