import { useMemo } from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  CalendarPlus,
  ClipboardPlus,
  Dumbbell,
  IdCard,
  Library,
  Ruler,
  Trophy,
  UserCog,
  UserPlus,
  UserSquare2,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { usePlayers } from "@/hooks/usePlayers"
import { useEvaluations } from "@/hooks/useEvaluations"
import {
  useNextTrainingSession,
  useRecentTrainingSessions,
} from "@/hooks/useTrainingSessions"
import { Card, CardContent } from "@/components/ui/card"
import { NextTrainingCard } from "@/components/dashboard/NextTrainingCard"
import { TrainingCard } from "@/components/trainings/TrainingCard"

export function DashboardPage() {
  const { role } = useAuth()
  const isDt = role === "dt"
  const { data: players } = usePlayers()
  const { data: nextSession } = useNextTrainingSession()
  const { data: recentSessions } = useRecentTrainingSessions(5)
  const { data: evaluations } = useEvaluations({ enabled: isDt })

  const evaluatedPlayerIds = useMemo(
    () => new Set((evaluations ?? []).map((ev) => ev.player_id)),
    [evaluations]
  )
  const activePlayers = useMemo(
    () => (players ?? []).filter((p) => p.status === "Activo"),
    [players]
  )
  const pendingCount = activePlayers.filter((p) => !evaluatedPlayerIds.has(p.id)).length
  const lastEvaluated = evaluations?.[0]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">Hola, coach</h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      <NextTrainingCard session={nextSession} />

      <div>
        <h2 className="mb-2 font-semibold">Últimos entrenamientos</h2>
        {recentSessions && recentSessions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentSessions.map((session) => (
              <TrainingCard
                key={session.id}
                session={session}
                exerciseCount={session.session_exercises.length}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Todavía no hay entrenamientos registrados.</p>
        )}
      </div>

      <div>
        <h2 className="mb-2 font-semibold">Jugadores</h2>
        <div className={`grid gap-2 ${isDt ? "grid-cols-3" : "grid-cols-1"}`}>
          <Card>
            <CardContent className="py-3 text-center">
              <p className="text-2xl font-semibold">{activePlayers.length}</p>
              <p className="text-[11px] text-muted-foreground">En plantel</p>
            </CardContent>
          </Card>
          {isDt && (
            <>
              <Card>
                <CardContent className="py-3 text-center">
                  <p className="text-2xl font-semibold">{pendingCount}</p>
                  <p className="text-[11px] text-muted-foreground">Evaluaciones pendientes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-3 text-center">
                  <p className="truncate text-sm font-semibold">
                    {lastEvaluated
                      ? `${lastEvaluated.player?.first_name ?? ""} ${lastEvaluated.player?.last_name ?? ""}`
                      : "-"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Último evaluado</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-2 font-semibold">Acciones rápidas</h2>
        <div className="grid grid-cols-2 gap-3">
          {isDt && (
            <QuickAction to="/trainings/new" icon={CalendarPlus} label="Nuevo entrenamiento" />
          )}
          {isDt && <QuickAction to="/players/new" icon={UserPlus} label="Nuevo jugador" />}
          {isDt && (
            <QuickAction to="/evaluations/new" icon={ClipboardPlus} label="Nueva evaluación" />
          )}
          <QuickAction to="/routines/new" icon={Dumbbell} label="Nueva rutina" />
          <QuickAction to="/planes/new" icon={UserSquare2} label="Nuevo plan individual" />
          <QuickAction to="/physical-tests" icon={Ruler} label="Tests físicos" />
          <QuickAction to="/exercises" icon={Library} label="Biblioteca de ejercicios" />
          {isDt && <QuickAction to="/nationals" icon={Trophy} label="Nacional" />}
          {isDt && <QuickAction to="/becados" icon={IdCard} label="Ingreso" />}
          {isDt && <QuickAction to="/users" icon={UserCog} label="Usuarios" />}
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: typeof CalendarPlus
  label: string
}) {
  return (
    <Link to={to}>
      <Card className="h-full transition-colors hover:bg-accent/40">
        <CardContent className="flex h-full flex-col items-start justify-center gap-2 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Icon className="size-4.5" />
          </div>
          <p className="text-sm font-medium leading-tight">{label}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
