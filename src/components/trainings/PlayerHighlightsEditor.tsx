import { useState } from "react"
import { Plus, X } from "lucide-react"
import { toast } from "sonner"
import { usePlayers } from "@/hooks/usePlayers"
import {
  useAddTrainingPlayerNote,
  useRemoveTrainingPlayerNote,
} from "@/hooks/useTrainingSessions"
import type { TrainingPlayerNote } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PlayerHighlightsEditor({
  sessionId,
  notes,
}: {
  sessionId: string
  notes: TrainingPlayerNote[]
}) {
  const { data: players } = usePlayers()
  const addNote = useAddTrainingPlayerNote()
  const removeNote = useRemoveTrainingPlayerNote()
  const [playerId, setPlayerId] = useState("")
  const [note, setNote] = useState("")

  async function handleAdd() {
    if (!playerId || !note.trim()) return
    try {
      await addNote.mutateAsync({
        training_session_id: sessionId,
        player_id: playerId,
        note: note.trim(),
      })
      setPlayerId("")
      setNote("")
    } catch {
      toast.error("No se pudo agregar la observación")
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeNote.mutateAsync({ id, sessionId })
    } catch {
      toast.error("No se pudo quitar la observación")
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.length > 0 && (
        <div className="flex flex-col gap-2">
          {notes.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between gap-2 rounded-lg bg-muted p-3 text-sm"
            >
              <p>
                <span className="font-semibold">
                  {n.player?.first_name} {n.player?.last_name}:
                </span>{" "}
                {n.note}
              </p>
              <button
                onClick={() => handleRemove(n.id)}
                aria-label="Quitar"
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select value={playerId} onValueChange={(v) => setPlayerId(v ?? "")}>
          <SelectTrigger className="h-11 sm:w-48">
            <SelectValue placeholder="Jugador" />
          </SelectTrigger>
          <SelectContent>
            {players?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Observación breve..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-11 flex-1"
        />
        <Button onClick={handleAdd} className="h-11" disabled={!playerId || !note.trim()}>
          <Plus /> Agregar
        </Button>
      </div>
    </div>
  )
}
