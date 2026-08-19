import { useRef, useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { FileText, Loader2, Trash2, Upload } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/hooks/useAuth"
import {
  PLAYER_DOCUMENTS_BUCKET,
  useDeletePlayerDocument,
  usePlayerDocuments,
  useUploadPlayerDocument,
} from "@/hooks/usePlayerDocuments"
import { PLAYER_DOCUMENT_TYPES, type PlayerDocumentType } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PlayerDocumentsSection({ playerId }: { playerId: string }) {
  const { session } = useAuth()
  const { data: documents } = usePlayerDocuments(playerId)
  const uploadDoc = useUploadPlayerDocument()
  const deleteDoc = useDeletePlayerDocument()
  const [pendingType, setPendingType] = useState<PlayerDocumentType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function triggerUpload(type: PlayerDocumentType) {
    setPendingType(type)
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !pendingType) return
    try {
      await uploadDoc.mutateAsync({
        playerId,
        type: pendingType,
        file,
        uploadedBy: session?.user.id ?? null,
      })
      toast.success("Documento subido")
    } catch {
      toast.error("No se pudo subir el documento")
    } finally {
      setPendingType(null)
    }
  }

  async function handleView(filePath: string) {
    const { data, error } = await supabase.storage
      .from(PLAYER_DOCUMENTS_BUCKET)
      .createSignedUrl(filePath, 300)
    if (error || !data) {
      toast.error("No se pudo abrir el archivo")
      return
    }
    window.open(data.signedUrl, "_blank")
  }

  async function handleDelete(id: string, filePath: string) {
    if (!confirm("¿Eliminar este documento?")) return
    try {
      await deleteDoc.mutateAsync({ id, playerId, filePath })
      toast.success("Documento eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
      />
      {PLAYER_DOCUMENT_TYPES.map((type) => {
        const docsOfType = (documents ?? []).filter((d) => d.type === type)
        const uploadingThis = uploadDoc.isPending && pendingType === type

        return (
          <Card key={type}>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{type}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={() => triggerUpload(type)}
                  disabled={uploadDoc.isPending}
                >
                  {uploadingThis ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                  Subir
                </Button>
              </div>

              {docsOfType.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin archivos.</p>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {docsOfType.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0"
                    >
                      <button
                        onClick={() => handleView(doc.file_path)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm hover:underline"
                      >
                        <FileText className="size-4 shrink-0 text-muted-foreground" />
                        <span className="truncate">{doc.file_name}</span>
                      </button>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {format(parseISO(doc.created_at), "d MMM yyyy", { locale: es })}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                        className="shrink-0 text-destructive hover:text-destructive"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
