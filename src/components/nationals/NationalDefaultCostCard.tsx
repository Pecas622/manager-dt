import { useState } from "react"
import { toast } from "sonner"
import { useApplyDefaultCostToAll, useUpdateNational } from "@/hooks/useNationals"
import type { National, NationalPlayerCost } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FIELDS = [
  ["default_flight_cost", "flight_cost", "Vuelo"],
  ["default_lodging_cost", "lodging_cost", "Alojam."],
  ["default_food_cost", "food_cost", "Comida"],
  ["default_transport_cost", "transport_cost", "Traslado"],
] as const

export function NationalDefaultCostCard({
  national,
  playerCosts,
}: {
  national: National
  playerCosts: NationalPlayerCost[]
}) {
  const updateNational = useUpdateNational()
  const applyToAll = useApplyDefaultCostToAll()
  const [values, setValues] = useState({
    default_flight_cost: national.default_flight_cost.toString(),
    default_lodging_cost: national.default_lodging_cost.toString(),
    default_food_cost: national.default_food_cost.toString(),
    default_transport_cost: national.default_transport_cost.toString(),
  })

  function commit(field: keyof typeof values) {
    const numeric = Number(values[field])
    if (!Number.isFinite(numeric) || numeric === national[field]) return
    updateNational.mutate({ id: national.id, input: { [field]: numeric } })
  }

  async function handleApplyToAll() {
    if (playerCosts.length === 0) {
      toast.error("Todavía no hay jugadores en el plantel")
      return
    }
    if (
      !confirm(
        `¿Aplicar este costo a los ${playerCosts.length} jugadores del plantel? Pisa lo que tengan cargado en Vuelo/Alojam./Comida/Traslado.`
      )
    )
      return
    try {
      await applyToAll.mutateAsync({
        nationalId: national.id,
        costIds: playerCosts.map((c) => c.id),
        defaults: {
          flight_cost: Number(values.default_flight_cost) || 0,
          lodging_cost: Number(values.default_lodging_cost) || 0,
          food_cost: Number(values.default_food_cost) || 0,
          transport_cost: Number(values.default_transport_cost) || 0,
        },
      })
      toast.success("Costo aplicado a todo el plantel")
    } catch {
      toast.error("No se pudo aplicar el costo")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Costo del viaje</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground">
          Si el costo es el mismo para todo el plantel, cargalo una vez acá y aplicalo a todos —
          después podés corregir jugador por jugador las excepciones.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FIELDS.map(([field, , label]) => (
            <div key={field} className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">{label}</Label>
              <Input
                type="number"
                className="h-9"
                value={values[field]}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                onBlur={() => commit(field)}
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="h-10 self-start"
          onClick={handleApplyToAll}
          disabled={applyToAll.isPending}
        >
          Aplicar a todo el plantel
        </Button>
      </CardContent>
    </Card>
  )
}
