import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function DurationTracker({
  planned,
  used,
}: {
  planned: number
  used: number
}) {
  const remaining = planned - used
  const percent = planned > 0 ? Math.min((used / planned) * 100, 100) : 0
  const exceeded = used > planned

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[11px] text-muted-foreground">Planificado</p>
          <p className="text-base font-semibold">{planned} min</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Utilizado</p>
          <p className="text-base font-semibold">{used} min</p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Restante</p>
          <p
            className={cn(
              "text-base font-semibold",
              exceeded ? "text-destructive" : "text-foreground"
            )}
          >
            {remaining} min
          </p>
        </div>
      </div>

      <Progress
        value={percent}
        className={
          exceeded
            ? "[&_[data-slot=progress-indicator]]:bg-destructive"
            : undefined
        }
      />

      {exceeded && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertTriangle className="size-3.5 shrink-0" />
          La planificación supera los {planned} minutos.
        </p>
      )}
      {!exceeded && remaining > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5 shrink-0" />
          Todavía tenés {remaining} minutos disponibles.
        </p>
      )}
      {!exceeded && remaining === 0 && used > 0 && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-success">
          <CheckCircle2 className="size-3.5 shrink-0" />
          Planificación completa.
        </p>
      )}
    </div>
  )
}
