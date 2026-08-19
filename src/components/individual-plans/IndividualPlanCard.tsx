import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { CalendarRange, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { IndividualPlan } from "@/types/database"

export function IndividualPlanCard({
  plan,
  exerciseCount,
  action,
}: {
  plan: IndividualPlan
  exerciseCount?: number
  action?: ReactNode
}) {
  return (
    <Card className={plan.status === "Archivada" ? "opacity-70" : undefined}>
      <CardContent className="flex items-start justify-between gap-3">
        <Link to={`/planes/${plan.id}`} className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{plan.name}</p>
            <Badge variant="outline">{plan.type}</Badge>
            <Badge variant="outline">{plan.focus_area}</Badge>
            {plan.status === "Archivada" && <Badge variant="secondary">Archivada</Badge>}
          </div>
          {plan.objective && (
            <p className="mt-1 truncate text-sm text-muted-foreground">{plan.objective}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {plan.player && (
              <span className="flex items-center gap-1">
                <User className="size-3.5" />
                {plan.player.first_name} {plan.player.last_name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarRange className="size-3.5" />
              {plan.duration_weeks} semana{plan.duration_weeks === 1 ? "" : "s"}
            </span>
            {typeof exerciseCount === "number" && (
              <span>{exerciseCount} ejercicios</span>
            )}
          </div>
        </Link>
        {action}
      </CardContent>
    </Card>
  )
}
