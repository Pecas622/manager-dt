import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useActiveCategory } from "@/hooks/useActiveCategory"
import type {
  SessionExercise,
  SessionExerciseInsert,
  TrainingPlayerNote,
  TrainingPlayerNoteInsert,
  TrainingSession,
  TrainingSessionInsert,
  TrainingSessionUpdate,
} from "@/types/database"

const SESSIONS_KEY = ["training_sessions"] as const

export interface TrainingSessionDetail extends TrainingSession {
  session_exercises: SessionExercise[]
  training_player_notes: TrainingPlayerNote[]
}

export function useTrainingSessions() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...SESSIONS_KEY, activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select("*, session_exercises(id)")
        .eq("category", activeCategory)
        .order("date", { ascending: false })
      if (error) throw error
      return data as (TrainingSession & { session_exercises: { id: string }[] })[]
    },
  })
}

export function useNextTrainingSession() {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...SESSIONS_KEY, activeCategory, "next"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from("training_sessions")
        .select("*")
        .eq("category", activeCategory)
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      return data as TrainingSession | null
    },
  })
}

export function useRecentTrainingSessions(limit = 5) {
  const { activeCategory } = useActiveCategory()
  return useQuery({
    queryKey: [...SESSIONS_KEY, activeCategory, "recent", limit],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from("training_sessions")
        .select("*, session_exercises(id)")
        .eq("category", activeCategory)
        .lt("date", today)
        .order("date", { ascending: false })
        .limit(limit)
      if (error) throw error
      return data as (TrainingSession & { session_exercises: { id: string }[] })[]
    },
  })
}

export function useTrainingSession(id: string | undefined) {
  return useQuery({
    queryKey: [...SESSIONS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select(
          "*, session_exercises(*, exercise:training_exercises(*)), training_player_notes(*, player:players(*))"
        )
        .eq("id", id)
        .order("order", {
          referencedTable: "session_exercises",
          ascending: true,
        })
        .single()
      if (error) throw error
      return data as TrainingSessionDetail
    },
    enabled: Boolean(id),
  })
}

export function useCreateTrainingSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: TrainingSessionInsert) => {
      const { data, error } = await supabase
        .from("training_sessions")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as TrainingSession
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
    },
  })
}

export function useUpdateTrainingSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string
      input: TrainingSessionUpdate
    }) => {
      const { data, error } = await supabase
        .from("training_sessions")
        .update(input)
        .eq("id", id)
        .select()
        .single()
      if (error) throw error
      return data as TrainingSession
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
      queryClient.invalidateQueries({ queryKey: [...SESSIONS_KEY, data.id] })
    },
  })
}

export function useDeleteTrainingSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("training_sessions")
        .delete()
        .eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
    },
  })
}

function invalidateSession(
  queryClient: ReturnType<typeof useQueryClient>,
  sessionId: string
) {
  queryClient.invalidateQueries({ queryKey: [...SESSIONS_KEY, sessionId] })
  queryClient.invalidateQueries({ queryKey: SESSIONS_KEY })
}

export function useAddSessionExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: SessionExerciseInsert) => {
      const { data, error } = await supabase
        .from("session_exercises")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as SessionExercise
    },
    onSuccess: (data) => {
      invalidateSession(queryClient, data.training_session_id)
    },
  })
}

export function useUpdateSessionExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      sessionId,
      input,
    }: {
      id: string
      sessionId: string
      input: Partial<Pick<SessionExercise, "duration" | "order" | "specific_notes">>
    }) => {
      const { error } = await supabase
        .from("session_exercises")
        .update(input)
        .eq("id", id)
      if (error) throw error
      return sessionId
    },
    onSuccess: (sessionId) => {
      invalidateSession(queryClient, sessionId)
    },
  })
}

export function useReorderSessionExercises() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      sessionId,
      orderedIds,
    }: {
      sessionId: string
      orderedIds: string[]
    }) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase.from("session_exercises").update({ order: index }).eq("id", id)
        )
      )
      return sessionId
    },
    onSuccess: (sessionId) => {
      invalidateSession(queryClient, sessionId)
    },
  })
}

export function useRemoveSessionExercise() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, sessionId }: { id: string; sessionId: string }) => {
      const { error } = await supabase
        .from("session_exercises")
        .delete()
        .eq("id", id)
      if (error) throw error
      return sessionId
    },
    onSuccess: (sessionId) => {
      invalidateSession(queryClient, sessionId)
    },
  })
}

export function useAddTrainingPlayerNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: TrainingPlayerNoteInsert) => {
      const { data, error } = await supabase
        .from("training_player_notes")
        .insert(input)
        .select()
        .single()
      if (error) throw error
      return data as TrainingPlayerNote
    },
    onSuccess: (data) => {
      invalidateSession(queryClient, data.training_session_id)
    },
  })
}

export function useRemoveTrainingPlayerNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, sessionId }: { id: string; sessionId: string }) => {
      const { error } = await supabase
        .from("training_player_notes")
        .delete()
        .eq("id", id)
      if (error) throw error
      return sessionId
    },
    onSuccess: (sessionId) => {
      invalidateSession(queryClient, sessionId)
    },
  })
}
