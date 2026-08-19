import { format, isToday } from "date-fns"
import { es } from "date-fns/locale"
import { Plus, Trophy } from "lucide-react"
import type { Match, RoutineAssignment, TrainingSession } from "@/types/database"
import type { UserRole } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CalendarDayCard({
  day,
  sessions,
  assignments,
  matches,
  role,
  onOpenTraining,
  onOpenRoutine,
  onOpenMatch,
  onNewTraining,
  onNewMatch,
  onNewRoutine,
}: {
  day: Date
  sessions: TrainingSession[]
  assignments: RoutineAssignment[]
  matches: Match[]
  role: UserRole | null
  onOpenTraining: (id: string) => void
  onOpenRoutine: (routineId: string) => void
  onOpenMatch: (id: string) => void
  onNewTraining: () => void
  onNewMatch: () => void
  onNewRoutine: () => void
}) {
  const hasAny = sessions.length + assignments.length + matches.length > 0
  const canAdd = role === "dt" || role === "profesor"

  return (
    <Card className={isToday(day) ? "ring-1 ring-primary/40" : undefined}>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold capitalize">
            {format(day, "EEEE d", { locale: es })}
          </p>
          {canAdd ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Agregar">
                    <Plus className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent>
                {role === "dt" && (
                  <DropdownMenuItem onClick={onNewTraining}>🟢 Entrenamiento</DropdownMenuItem>
                )}
                {role === "dt" && (
                  <DropdownMenuItem onClick={onNewMatch}>🏆 Partido</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onNewRoutine}>🏋️ Rutina</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {!hasAny && <p className="text-xs text-muted-foreground/70">Sin actividades.</p>}

        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => onOpenTraining(s.id)}
            className="flex items-start gap-2 rounded-lg bg-muted p-2.5 text-left text-sm hover:bg-accent/60"
          >
            <span>🟢</span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">Entrenamiento</span>
              <span className="block truncate text-muted-foreground">{s.main_objective}</span>
            </span>
          </button>
        ))}

        {assignments.map((a) => (
          <button
            key={a.id}
            onClick={() => onOpenRoutine(a.routine_id)}
            className="flex items-start gap-2 rounded-lg bg-muted p-2.5 text-left text-sm hover:bg-accent/60"
          >
            <span>🏋️</span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{a.routine?.name ?? "Rutina"}</span>
              <span className="block text-muted-foreground">
                {a.assigned_to === "categoria"
                  ? "Toda la categoría"
                  : `${a.routine_assignment_players?.length ?? 0} jugador(es)`}
              </span>
            </span>
          </button>
        ))}

        {matches.map((m) => (
          <button
            key={m.id}
            onClick={() => onOpenMatch(m.id)}
            className="flex items-start gap-2 rounded-lg bg-primary/10 p-2.5 text-left text-sm hover:bg-primary/15"
          >
            <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">vs. {m.opponent}</span>
              <span className="block text-muted-foreground">
                {m.is_home === false ? "Visitante" : "Local"}
                {m.location ? ` · ${m.location}` : ""}
                {m.start_time ? ` · ${m.start_time.slice(0, 5)}` : ""}
              </span>
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
