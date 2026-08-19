import { useState } from "react"
import { toast } from "sonner"
import { useUpsertNationalPlayerCost } from "@/hooks/useNationals"
import type { National, Player } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function NationalAddPlayersDialog({
  open,
  onOpenChange,
  national,
  availablePlayers,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  national: National
  availablePlayers: Player[]
}) {
  const upsertPlayerCost = useUpsertNationalPlayerCost()
  const [selected, setSelected] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.length === availablePlayers.length ? [] : availablePlayers.map((p) => p.id)
    )
  }

  async function handleSubmit() {
    if (selected.length === 0) {
      toast.error("Seleccioná al menos un jugador")
      return
    }
    setSubmitting(true)
    try {
      await Promise.all(
        selected.map((player_id) =>
          upsertPlayerCost.mutateAsync({
            national_id: national.id,
            player_id,
            flight_cost: national.default_flight_cost,
            lodging_cost: national.default_lodging_cost,
            food_cost: national.default_food_cost,
            transport_cost: national.default_transport_cost,
            minutes_played: 0,
            goals: 0,
            yellow_cards: 0,
            blue_cards: 0,
            notes: null,
          })
        )
      )
      toast.success(
        selected.length === 1 ? "Jugador agregado" : `${selected.length} jugadores agregados`
      )
      setSelected([])
      onOpenChange(false)
    } catch {
      toast.error("No se pudo agregar el plantel")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar jugadores al plantel</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {availablePlayers.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Todos los jugadores activos ya están en el plantel.
            </p>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleAll}
                className="self-start text-sm text-primary hover:underline"
              >
                {selected.length === availablePlayers.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>

              <ScrollArea className="h-64 rounded-lg border border-border">
                <div className="flex flex-col gap-1 p-2">
                  {availablePlayers.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent/40"
                    >
                      <Checkbox
                        checked={selected.includes(p.id)}
                        onCheckedChange={() => toggle(p.id)}
                      />
                      {p.first_name} {p.last_name}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={submitting || selected.length === 0}
              className="h-11"
            >
              {submitting
                ? "Agregando..."
                : selected.length > 0
                  ? `Agregar ${selected.length} jugador${selected.length === 1 ? "" : "es"}`
                  : "Agregar"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
