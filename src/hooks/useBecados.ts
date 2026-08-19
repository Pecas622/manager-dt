import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type {
  Becado,
  BecadoInsert,
  BecadoUpdate,
  CheckBecadoResult,
} from "@/types/database"

const BECADOS_KEY = ["becados"] as const

function normalizeDni(dni: string) {
  return dni.replace(/\D/g, "")
}

export function useBecados() {
  return useQuery({
    queryKey: BECADOS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("becados")
        .select("*")
        .order("last_name", { ascending: true })
      if (error) throw error
      return data as Becado[]
    },
  })
}

export function useCreateBecado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: BecadoInsert) => {
      const { data, error } = await supabase
        .from("becados")
        .insert({ ...input, dni: normalizeDni(input.dni) })
        .select()
        .single()
      if (error) throw error
      return data as Becado
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BECADOS_KEY })
    },
  })
}

export function useUpdateBecado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: BecadoUpdate }) => {
      const payload = input.dni ? { ...input, dni: normalizeDni(input.dni) } : input
      const { data, error } = await supabase
        .from("becados")
        .update(payload)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as Becado
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BECADOS_KEY })
    },
  })
}

export function useDeleteBecado() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("becados").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BECADOS_KEY })
    },
  })
}

// Consulta pública (funciona con o sin sesión): usa la función de Postgres
// `check_becado`, que solo devuelve el resultado de UN dni, nunca la lista.
export function useCheckBecado() {
  return useMutation({
    mutationFn: async (dni: string) => {
      const { data, error } = await supabase
        .rpc("check_becado", { p_dni: normalizeDni(dni) })
        .single()
      if (error) throw error
      return data as CheckBecadoResult
    },
  })
}
