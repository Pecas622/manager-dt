import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import type { PlayerDocument } from "@/types/database"
import type { PlayerDocumentType } from "@/types/domain"

const DOCUMENTS_KEY = ["player_documents"] as const
export const PLAYER_DOCUMENTS_BUCKET = "player-documents"

export function usePlayerDocuments(playerId: string | undefined) {
  return useQuery({
    queryKey: [...DOCUMENTS_KEY, playerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("player_documents")
        .select("*")
        .eq("player_id", playerId)
        .order("created_at", { ascending: false })
      if (error) throw error
      return data as PlayerDocument[]
    },
    enabled: Boolean(playerId),
  })
}

export function useUploadPlayerDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      playerId,
      type,
      file,
      uploadedBy,
    }: {
      playerId: string
      type: PlayerDocumentType
      file: File
      uploadedBy: string | null
    }) => {
      const path = `${playerId}/${crypto.randomUUID()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from(PLAYER_DOCUMENTS_BUCKET)
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data, error } = await supabase
        .from("player_documents")
        .insert({
          player_id: playerId,
          type,
          file_path: path,
          file_name: file.name,
          uploaded_by: uploadedBy,
        })
        .select()
        .single()
      if (error) throw error
      return data as PlayerDocument
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [...DOCUMENTS_KEY, data.player_id] })
    },
  })
}

export function useDeletePlayerDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      playerId,
      filePath,
    }: {
      id: string
      playerId: string
      filePath: string
    }) => {
      await supabase.storage.from(PLAYER_DOCUMENTS_BUCKET).remove([filePath])
      const { error } = await supabase.from("player_documents").delete().eq("id", id)
      if (error) throw error
      return playerId
    },
    onSuccess: (playerId) => {
      queryClient.invalidateQueries({ queryKey: [...DOCUMENTS_KEY, playerId] })
    },
  })
}
