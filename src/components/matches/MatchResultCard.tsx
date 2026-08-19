import { useState } from "react"
import { toast } from "sonner"
import { useUpdateMatch } from "@/hooks/useMatches"
import type { Match } from "@/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type NumericField =
  | "goals_for"
  | "goals_against"
  | "fouls_us_1h"
  | "fouls_them_1h"
  | "fouls_us_2h"
  | "fouls_them_2h"

export function MatchResultCard({ match }: { match: Match }) {
  const updateMatch = useUpdateMatch()
  const [values, setValues] = useState<Record<NumericField, string>>({
    goals_for: match.goals_for?.toString() ?? "",
    goals_against: match.goals_against?.toString() ?? "",
    fouls_us_1h: match.fouls_us_1h?.toString() ?? "",
    fouls_them_1h: match.fouls_them_1h?.toString() ?? "",
    fouls_us_2h: match.fouls_us_2h?.toString() ?? "",
    fouls_them_2h: match.fouls_them_2h?.toString() ?? "",
  })

  async function commit(field: NumericField) {
    const raw = values[field]
    const numeric = raw ? Number(raw) : null
    if (numeric !== null && !Number.isFinite(numeric)) return
    if (numeric === (match[field] ?? null)) return
    try {
      await updateMatch.mutateAsync({ id: match.id, input: { [field]: numeric } })
    } catch {
      toast.error("No se pudo guardar")
      setValues((v) => ({ ...v, [field]: match[field]?.toString() ?? "" }))
    }
  }

  function field(key: NumericField, placeholder = "0") {
    return (
      <Input
        type="number"
        min={0}
        placeholder={placeholder}
        value={values[key]}
        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
        onBlur={() => commit(key)}
        className="h-9 text-center"
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultado y faltas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">Resultado</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Goles a favor</Label>
              {field("goals_for")}
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Goles en contra</Label>
              {field("goals_against")}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
            Faltas acumuladas por período
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">1er tiempo</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Nuestras</Label>
                  {field("fouls_us_1h")}
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Rival</Label>
                  {field("fouls_them_1h")}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">2do tiempo</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Nuestras</Label>
                  {field("fouls_us_2h")}
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Rival</Label>
                  {field("fouls_them_2h")}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Desde la 6ª falta del equipo en el período, el rival ejecuta doble penal a 10 m.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
