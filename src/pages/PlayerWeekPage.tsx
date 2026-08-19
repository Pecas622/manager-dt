import { useMemo, useState } from "react"
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"
import {
  Clock,
  ImageIcon,
  Loader2,
  Repeat,
  Target,
  Trophy,
  Video,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useTrainingSessions, useTrainingSession } from "@/hooks/useTrainingSessions"
import { useRoutineAssignments, useRoutine } from "@/hooks/useRoutines"
import { useMatches } from "@/hooks/useMatches"
import { Card, CardContent } from "@/components/ui/card"

function ExpandedTraining({ sessionId }: { sessionId: string }) {
  const { data: session, isLoading } = useTrainingSession(sessionId)
  if (isLoading || !session) {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />
  }
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-2">
      {session.secondary_objectives && (
        <p className="text-xs text-muted-foreground">{session.secondary_objectives}</p>
      )}
      {session.session_exercises.map((block, i) => (
        <div key={block.id} className="text-sm">
          <span className="font-medium">
            {i + 1}. {block.exercise?.name}
          </span>{" "}
          <span className="text-muted-foreground">({block.duration} min)</span>
          {block.exercise?.objective && (
            <p className="text-xs text-muted-foreground">{block.exercise.objective}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function ExpandedRoutine({ routineId }: { routineId: string }) {
  const { data: routine, isLoading } = useRoutine(routineId)
  if (isLoading || !routine) {
    return <Loader2 className="size-4 animate-spin text-muted-foreground" />
  }
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-2">
      {routine.routine_exercises.map((item, i) => {
        const sets = item.sets_override ?? item.exercise?.sets
        const reps = item.reps_override ?? item.exercise?.reps
        const rest = item.rest_seconds_override ?? item.exercise?.rest_seconds
        return (
          <div key={item.id} className="text-sm">
            <p className="font-medium">
              {i + 1}. {item.exercise?.name}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {(sets || reps) && (
                <span className="flex items-center gap-1">
                  <Repeat className="size-3.5" /> {sets ?? "-"}×{reps ?? "-"}
                </span>
              )}
              {rest && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {rest}s
                </span>
              )}
              {item.exercise?.video_url && (
                <a
                  href={item.exercise.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary"
                >
                  <Video className="size-3.5" /> Video
                </a>
              )}
              {item.exercise?.image_url && (
                <a
                  href={item.exercise.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-primary"
                >
                  <ImageIcon className="size-3.5" /> Imagen
                </a>
              )}
            </div>
            {item.exercise?.instructions && (
              <p className="text-xs text-muted-foreground">{item.exercise.instructions}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function PlayerWeekPage() {
  const { playerId } = useAuth()
  const { data: sessions, isLoading: sessionsLoading } = useTrainingSessions()
  const { data: assignments, isLoading: assignmentsLoading } = useRoutineAssignments()
  const { data: matches, isLoading: matchesLoading } = useMatches()
  const [expanded, setExpanded] = useState<string | null>(null)

  const days = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 })
    const end = endOfWeek(new Date(), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [])

  const myAssignments = useMemo(
    () =>
      (assignments ?? []).filter(
        (a) =>
          a.assigned_to === "categoria" ||
          (playerId &&
            a.routine_assignment_players?.some((p) => p.player_id === playerId))
      ),
    [assignments, playerId]
  )

  const isLoading = sessionsLoading || assignmentsLoading || matchesLoading

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Mi semana</h1>
        <p className="text-sm text-muted-foreground">
          {format(startOfWeek(new Date(), { weekStartsOn: 1 }), "d MMM", { locale: es })} —{" "}
          {format(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 6), "d MMM", { locale: es })}
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && (
        <div className="flex flex-col gap-4">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd")
            const daySessions = (sessions ?? []).filter((s) => s.date === dateStr)
            const dayAssignments = myAssignments.filter((a) => a.date === dateStr)
            const dayMatches = (matches ?? []).filter((m) => m.date === dateStr)
            const hasAny = daySessions.length + dayAssignments.length + dayMatches.length > 0

            return (
              <div key={dateStr}>
                <p className="mb-1.5 text-sm font-semibold capitalize text-muted-foreground">
                  {format(day, "EEEE d", { locale: es })}
                </p>
                {!hasAny ? (
                  <p className="text-sm text-muted-foreground/70">Sin actividades.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {daySessions.map((s) => {
                      const key = `training-${s.id}`
                      return (
                        <Card
                          key={key}
                          className="cursor-pointer"
                          onClick={() => setExpanded(expanded === key ? null : key)}
                        >
                          <CardContent className="flex flex-col gap-2 py-3">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5">⚽</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">Entrenamiento</p>
                                <p className="flex items-start gap-1 text-sm text-muted-foreground">
                                  <Target className="mt-0.5 size-3.5 shrink-0" />
                                  {s.main_objective}
                                </p>
                              </div>
                            </div>
                            {expanded === key && <ExpandedTraining sessionId={s.id} />}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {dayAssignments.map((a) => {
                      const key = `routine-${a.id}`
                      return (
                        <Card
                          key={key}
                          className="cursor-pointer"
                          onClick={() => setExpanded(expanded === key ? null : key)}
                        >
                          <CardContent className="flex flex-col gap-2 py-3">
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5">🏋️</span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium">
                                  {a.routine?.name ?? "Rutina física"}
                                </p>
                                <p className="text-sm text-muted-foreground">Rutina física</p>
                              </div>
                            </div>
                            {expanded === key && <ExpandedRoutine routineId={a.routine_id} />}
                          </CardContent>
                        </Card>
                      )
                    })}

                    {dayMatches.map((m) => (
                      <Card key={`match-${m.id}`}>
                        <CardContent className="flex items-start gap-2 py-3">
                          <Trophy className="mt-0.5 size-4 shrink-0 text-primary" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">Partido vs. {m.opponent}</p>
                            <p className="text-sm text-muted-foreground">
                              {m.is_home === false ? "Visitante" : "Local"}
                              {m.location ? ` · ${m.location}` : ""}
                              {m.start_time ? ` · ${m.start_time.slice(0, 5)}` : ""}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
