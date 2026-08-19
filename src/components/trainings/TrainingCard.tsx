import { Link } from "react-router-dom"
import { format, isPast, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, ListChecks } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { TrainingSession } from "@/types/database"

export function TrainingCard({
  session,
  exerciseCount,
}: {
  session: TrainingSession
  exerciseCount?: number
}) {
  const date = parseISO(session.date)
  const past = isPast(date) && format(date, "yyyy-MM-dd") !== format(new Date(), "yyyy-MM-dd")

  return (
    <Link to={`/trainings/${session.id}`}>
      <Card className="transition-colors hover:bg-accent/40">
        <CardContent className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium capitalize">
                {format(date, "EEEE d MMM", { locale: es })}
              </p>
              <Badge variant={past ? "secondary" : "outline"} className={past ? "" : "border-success/40 text-success"}>
                {past ? "Realizado" : "Programado"}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {session.main_objective}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {session.start_time.slice(0, 5)} · {session.duration} min
              </span>
              {typeof exerciseCount === "number" && (
                <span className="flex items-center gap-1">
                  <ListChecks className="size-3.5" /> {exerciseCount} ejercicios
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
