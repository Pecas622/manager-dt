import type { ReactNode } from "react"
import { Clock, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { TrainingExercise } from "@/types/database"

export function ExerciseCard({
  exercise,
  onClick,
  action,
}: {
  exercise: TrainingExercise
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
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{exercise.name}</p>
            <Badge variant="outline">{exercise.category}</Badge>
          </div>
          {exercise.objective && (
            <p className="mt-1 text-sm text-muted-foreground">{exercise.objective}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {exercise.duration} min
            </span>
            {exercise.players_count && (
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {exercise.players_count}
              </span>
            )}
          </div>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
