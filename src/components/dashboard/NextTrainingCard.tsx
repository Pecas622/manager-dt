import { Link } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarDays, Clock, Plus, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TrainingSession } from "@/types/database"

export function NextTrainingCard({ session }: { session: TrainingSession | null | undefined }) {
  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Próximo entrenamiento</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-sm text-muted-foreground">
            No tenés ningún entrenamiento programado.
          </p>
          <Button render={<Link to="/trainings/new" />} className="h-11">
            <Plus /> Nuevo entrenamiento
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="ring-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <CardTitle>Próximo entrenamiento</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          <span className="flex items-center gap-1.5 font-medium capitalize">
            <CalendarDays className="size-4 text-primary" />
            {format(parseISO(session.date), "EEEE d MMM", { locale: es })}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-4" />
            {session.start_time.slice(0, 5)} hs · {session.duration} min
          </span>
        </div>
        <p className="flex items-start gap-1.5 text-sm">
          <Target className="mt-0.5 size-4 shrink-0 text-primary" />
          {session.main_objective}
        </p>
        <Button render={<Link to={`/trainings/${session.id}`} />} className="h-11 self-start">
          Ver entrenamiento
        </Button>
      </CardContent>
    </Card>
  )
}
