import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type {
  National,
  NationalActivity,
  NationalActivityInsert,
  NationalActivityUpdate,
  NationalExpense,
  NationalExpenseInsert,
  NationalInsert,
  NationalPayment,
  NationalPaymentInsert,
  NationalPlayerCost,
  NationalPlayerCostInsert,
  NationalPlayerCostUpdate,
  NationalUpdate,
} from "@/types/database"

const NATIONALS_KEY = ["nationals"] as const

export function useNationals() {
  return useQuery({
    queryKey: NATIONALS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nationals")
        .select("*")
        .order("start_date", { ascending: false })
      if (error) throw error
      return data as National[]
    },
  })
}

export function useNational(id: string | undefined) {
  return useQuery({
    queryKey: [...NATIONALS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nationals")
        .select("*")
        .eq("id", id)
        .single()
      if (error) throw error
      return data as National
    },
    enabled: Boolean(id),
  })
}

export function useCreateNational() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NationalInsert) => {
      const { data, error } = await supabase
        .from("nationals")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as National
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NATIONALS_KEY })
    },
  })
}

export function useUpdateNational() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: NationalUpdate }) => {
      const { data, error } = await supabase
        .from("nationals")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as National
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: NATIONALS_KEY })
      queryClient.invalidateQueries({ queryKey: [...NATIONALS_KEY, data.id] })
    },
  })
}

export function useDeleteNational() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nationals").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NATIONALS_KEY })
    },
  })
}

// ---------- Cronograma ----------

export function useNationalActivities(nationalId: string | undefined) {
  return useQuery({
    queryKey: ["national_activities", nationalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("national_activities")
        .select("*, routine:routines(id, name)")
        .eq("national_id", nationalId)
        .order("date", { ascending: true })
        .order("time", { ascending: true })
      if (error) throw error
      return data as NationalActivity[]
    },
    enabled: Boolean(nationalId),
  })
}

export function useCreateNationalActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NationalActivityInsert) => {
      const { data, error } = await supabase
        .from("national_activities")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as NationalActivity
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["national_activities", data.national_id] })
    },
  })
}

export function useUpdateNationalActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      nationalId,
      input,
    }: {
      id: string
      nationalId: string
      input: NationalActivityUpdate
    }) => {
      const { error } = await supabase.from("national_activities").update(input).eq("id", id)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_activities", nationalId] })
    },
  })
}

export function useDeleteNationalActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nationalId }: { id: string; nationalId: string }) => {
      const { error } = await supabase.from("national_activities").delete().eq("id", id)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_activities", nationalId] })
    },
  })
}

// ---------- Gastos ----------

export function useNationalExpenses(nationalId: string | undefined) {
  return useQuery({
    queryKey: ["national_expenses", nationalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("national_expenses")
        .select("*")
        .eq("national_id", nationalId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as NationalExpense[]
    },
    enabled: Boolean(nationalId),
  })
}

export function useCreateNationalExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NationalExpenseInsert) => {
      const { data, error } = await supabase
        .from("national_expenses")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as NationalExpense
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["national_expenses", data.national_id] })
    },
  })
}

export function useDeleteNationalExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nationalId }: { id: string; nationalId: string }) => {
      const { error } = await supabase.from("national_expenses").delete().eq("id", id)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_expenses", nationalId] })
    },
  })
}

// ---------- Pagos por jugador ----------

export function useNationalPlayerCosts(nationalId: string | undefined) {
  return useQuery({
    queryKey: ["national_player_costs", nationalId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("national_player_costs")
        .select("*, player:players(*), national_payments(*)")
        .eq("national_id", nationalId)
      if (error) throw error
      return data as NationalPlayerCost[]
    },
    enabled: Boolean(nationalId),
  })
}

// Aplica el costo default del Nacional (Vuelo/Alojam./Comida/Traslado) a
// todos los jugadores ya agregados al plantel — pisa lo que tuvieran
// cargado en esos 4 campos, no toca pagos ni el resto.
export function useApplyDefaultCostToAll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      nationalId,
      costIds,
      defaults,
    }: {
      nationalId: string
      costIds: string[]
      defaults: {
        flight_cost: number
        lodging_cost: number
        food_cost: number
        transport_cost: number
      }
    }) => {
      const { error } = await supabase
        .from("national_player_costs")
        .update(defaults)
        .in("id", costIds)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_player_costs", nationalId] })
    },
  })
}

export function useUpsertNationalPlayerCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: NationalPlayerCostInsert) => {
      const { data, error } = await supabase
        .from("national_player_costs")
        .upsert(input, { onConflict: "national_id,player_id" })
        .select()
        .single()
      if (error) throw error
      return data as NationalPlayerCost
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["national_player_costs", data.national_id] })
    },
  })
}

export function useUpdateNationalPlayerCost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      nationalId,
      input,
    }: {
      id: string
      nationalId: string
      input: NationalPlayerCostUpdate
    }) => {
      const { error } = await supabase
        .from("national_player_costs")
        .update(input)
        .eq("id", id)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_player_costs", nationalId] })
    },
  })
}

// ---------- Pagos (historial) ----------

export function useAddNationalPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      nationalId,
      input,
    }: {
      nationalId: string
      input: NationalPaymentInsert
    }) => {
      const { data, error } = await supabase
        .from("national_payments")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return { payment: data as NationalPayment, nationalId }
    },
    onSuccess: ({ nationalId }) => {
      queryClient.invalidateQueries({ queryKey: ["national_player_costs", nationalId] })
    },
  })
}

export function useDeleteNationalPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nationalId }: { id: string; nationalId: string }) => {
      const { error } = await supabase.from("national_payments").delete().eq("id", id)
      if (error) throw error
      return nationalId
    },
    onSuccess: (nationalId) => {
      queryClient.invalidateQueries({ queryKey: ["national_player_costs", nationalId] })
    },
  })
}
