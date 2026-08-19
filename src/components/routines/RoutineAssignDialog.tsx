import { useState } from "react"
import { toast } from "sonner"
import { usePlayers } from "@/hooks/usePlayers"
import { useCreateRoutineAssignment } from "@/hooks/useRoutines"
import { useAuth } from "@/hooks/useAuth"
import { ROUTINE_ASSIGNMENT_TARGETS } from "@/types/domain"
import type { RoutineAssignmentTarget } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function RoutineAssignDialog({
  open,
  onOpenChange,
  routineId,
  defaultDate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  routineId: string
  defaultDate?: string
}) {
  const { session } = useAuth()
  const { data: players } = usePlayers()
  const createAssignment = useCreateRoutineAssignment()
  const [date, setDate] = useState(defaultDate ?? new Date().toISOString().slice(0, 10))
  const [assignedTo, setAssignedTo] = useState<RoutineAssignmentTarget>("categoria")
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  function togglePlayer(id: string) {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleSubmit() {
    if (assignedTo === "jugadores" && selectedPlayers.length === 0) {
      toast.error("Seleccioná al menos un jugador")
      return
    }
    setSubmitting(true)
    try {
      await createAssignment.mutateAsync({
        input: {
          routine_id: routineId,
          date,
          assigned_to: assignedTo,
          created_by: session?.user.id ?? null,
          notes: null,
        },
        playerIds: selectedPlayers,
      })
      toast.success("Rutina asignada")
      onOpenChange(false)
      setSelectedPlayers([])
    } catch {
      toast.error("No se pudo asignar la rutina")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar rutina</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="assign-date">Fecha</Label>
            <Input
              id="assign-date"
              type="date"
              className="h-11"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Asignar a</Label>
            <RadioGroup
              value={assignedTo}
              onValueChange={(v) => v && setAssignedTo(v as RoutineAssignmentTarget)}
              className="flex flex-col gap-2"
            >
              {ROUTINE_ASSIGNMENT_TARGETS.map((target) => (
                <label
                  key={target}
                  className="flex items-center gap-2 rounded-lg border border-input px-3 py-2.5 text-sm"
                >
                  <RadioGroupItem value={target} />
                  {target === "categoria" ? "Toda la categoría" : "Jugadores específicos"}
                </label>
              ))}
            </RadioGroup>
          </div>

          {assignedTo === "jugadores" && (
            <ScrollArea className="h-48 rounded-lg border border-border">
              <div className="flex flex-col gap-1 p-2">
                {players?.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent/40"
                  >
                    <Checkbox
                      checked={selectedPlayers.includes(p.id)}
                      onCheckedChange={() => togglePlayer(p.id)}
                    />
                    {p.first_name} {p.last_name}
                  </label>
                ))}
              </div>
            </ScrollArea>
          )}

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={submitting} className="h-11">
              {submitting ? "Asignando..." : "Asignar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
