import { useState } from "react"
import { useUpdateNationalPlayerCost } from "@/hooks/useNationals"
import type { NationalPlayerCost } from "@/types/database"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function NationalPlayerStatsRow({
  cost,
  nationalId,
}: {
  cost: NationalPlayerCost
  nationalId: string
}) {
  const update = useUpdateNationalPlayerCost()
  const [values, setValues] = useState({
    minutes_played: cost.minutes_played.toString(),
    goals: cost.goals.toString(),
    yellow_cards: cost.yellow_cards.toString(),
    blue_cards: cost.blue_cards.toString(),
  })
  const [notes, setNotes] = useState(cost.notes ?? "")

  function commit(field: keyof typeof values) {
    const numeric = Number(values[field])
    const original = cost[field as keyof NationalPlayerCost] as number
    if (!Number.isFinite(numeric) || numeric === original) return
    update.mutate({
      id: cost.id,
      nationalId,
      input: { [field]: numeric },
    })
  }

  function commitNotes() {
    if (notes.trim() === (cost.notes ?? "").trim()) return
    update.mutate({
      id: cost.id,
      nationalId,
      input: { notes: notes.trim() || null },
    })
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <p className="font-medium">
          {cost.player?.first_name} {cost.player?.last_name}
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              ["minutes_played", "Minutos"],
              ["goals", "Goles"],
              ["yellow_cards", "Amarillas"],
              ["blue_cards", "Azules"],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">{label}</Label>
              <Input
                type="number"
                min={0}
                className="h-9"
                value={values[field]}
                onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                onBlur={() => commit(field)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-[11px] text-muted-foreground">Observación</Label>
          <Textarea
            placeholder="Sin observaciones"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={commitNotes}
          />
        </div>
      </CardContent>
    </Card>
  )
}
