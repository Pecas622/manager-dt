import type { ReactNode } from "react"
import { Clock, Repeat } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { PhysicalExercise } from "@/types/database"

export function PhysicalExerciseCard({
  exercise,
  onClick,
  action,
}: {
  exercise: PhysicalExercise
  onClick?: () => void
  action?: ReactNode
}) {
  return (
    <Card
      onClick={onClick}
      className={onClick ? "cursor-pointer transition-colors hover:bg-accent/40" : undefined}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{exercise.name}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {(exercise.sets || exercise.reps) && (
              <span className="flex items-center gap-1">
                <Repeat className="size-3.5" />
                {exercise.sets ?? "-"}×{exercise.reps ?? "-"}
              </span>
            )}
            {exercise.rest_seconds && (
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" /> {exercise.rest_seconds}s descanso
              </span>
            )}
          </div>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
