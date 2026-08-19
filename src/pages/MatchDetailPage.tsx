import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Goal, HeartPulse, Loader2, Pencil, Square, Trash2, Trophy } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useDeleteMatch, useMatch } from "@/hooks/useMatches"
import { sumMinutes, useMatchSubstitutions } from "@/hooks/useMatchSubstitutions"
import { useMatchCards } from "@/hooks/useMatchCards"
import { useMatchGoals } from "@/hooks/useMatchGoals"
import { useMatchInjuryNotes } from "@/hooks/useMatchInjuryNotes"
import { useTournament } from "@/hooks/useTournaments"
import { usePlayers } from "@/hooks/usePlayers"
import type { MatchCard, MatchGoal, MatchSubstitution } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MatchFormDialog } from "@/components/matches/MatchFormDialog"
import { MatchPlanillaRow } from "@/components/matches/MatchPlanillaRow"
import { MatchResultCard } from "@/components/matches/MatchResultCard"

export function MatchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { data: match, isLoading } = useMatch(id)
  const { data: players } = usePlayers()
  const { data: substitutions } = useMatchSubstitutions(id)
  const { data: cards } = useMatchCards(id)
  const { data: goals } = useMatchGoals(id)
  const { data: injuryNotes } = useMatchInjuryNotes(id)
  const { data: tournament } = useTournament(match?.tournament_id ?? undefined)
  const deleteMatch = useDeleteMatch()
  const [editOpen, setEditOpen] = useState(false)

  const activePlayers = useMemo(
    () => (players ?? []).filter((p) => p.status === "Activo"),
    [players]
  )

  const segmentsByPlayer = useMemo(() => {
    const map = new Map<string, MatchSubstitution[]>()
    for (const s of substitutions ?? []) {
      map.set(s.player_id, [...(map.get(s.player_id) ?? []), s])
    }
    return map
  }, [substitutions])

  const totalMinutes = useMemo(() => sumMinutes(substitutions ?? []), [substitutions])

  const cardsByPlayer = useMemo(() => {
    const map = new Map<string, MatchCard[]>()
    for (const c of cards ?? []) {
      map.set(c.player_id, [...(map.get(c.player_id) ?? []), c])
    }
    return map
  }, [cards])

  const goalsByPlayer = useMemo(() => {
    const map = new Map<string, MatchGoal[]>()
    for (const g of goals ?? []) {
      map.set(g.player_id, [...(map.get(g.player_id) ?? []), g])
    }
    return map
  }, [goals])

  const injuryByPlayer = useMemo(() => {
    const map = new Map<string, string>()
    for (const n of injuryNotes ?? []) {
      map.set(n.player_id, n.note)
    }
    return map
  }, [injuryNotes])

  const summaryRows = useMemo(
    () =>
      activePlayers
        .map((player) => {
          const playerCards = cardsByPlayer.get(player.id) ?? []
          return {
            player,
            minutes: sumMinutes(segmentsByPlayer.get(player.id) ?? []),
            goalCount: goalsByPlayer.get(player.id)?.length ?? 0,
            amarillas: playerCards.filter((c) => c.type === "Amarilla").length,
            azules: playerCards.filter((c) => c.type === "Azul").length,
            injury: injuryByPlayer.get(player.id) ?? "",
          }
        })
        .filter(
          (row) =>
            row.minutes > 0 || row.goalCount > 0 || row.amarillas > 0 || row.azules > 0 || row.injury
        ),
    [activePlayers, segmentsByPlayer, cardsByPlayer, goalsByPlayer, injuryByPlayer]
  )

  const totalGoals = useMemo(() => (goals ?? []).length, [goals])
  const totalAmarillas = useMemo(
    () => (cards ?? []).filter((c) => c.type === "Amarilla").length,
    [cards]
  )
  const totalAzules = useMemo(() => (cards ?? []).filter((c) => c.type === "Azul").length, [cards])

  async function handleDelete() {
    if (!match) return
    if (!confirm(`¿Eliminar el partido vs. ${match.opponent}?`)) return
    try {
      await deleteMatch.mutateAsync(match.id)
      toast.success("Partido eliminado")
      navigate("/calendar")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  if (isLoading || !match) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver" className="shrink-0">
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-xl font-semibold">vs. {match.opponent}</h1>
        </div>
        {role === "dt" && (
          <div className="flex shrink-0 gap-1.5">
            <Button variant="outline" size="icon" onClick={() => setEditOpen(true)} aria-label="Editar">
              <Pencil />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
              <Trash2 />
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm">
            <Trophy className="size-4 text-primary" />
            {format(parseISO(match.date), "EEEE d 'de' MMMM", { locale: es })}
            {match.start_time ? ` · ${match.start_time.slice(0, 5)} hs` : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {match.is_home === false ? "Visitante" : "Local"}
            {match.location ? ` · ${match.location}` : ""}
          </p>
          {tournament && (
            <Link to={`/torneos/${tournament.id}`}>
              <Badge variant="outline">{tournament.name}</Badge>
            </Link>
          )}
          {match.notes && <p className="text-sm text-muted-foreground">{match.notes}</p>}
        </CardContent>
      </Card>

      <MatchResultCard match={match} />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            Planilla del partido
            <span className="text-sm font-normal text-muted-foreground">
              {totalMinutes}' · {totalGoals} goles · {totalAmarillas} amarillas · {totalAzules} azules
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {activePlayers.map((player) => (
            <MatchPlanillaRow
              key={player.id}
              matchId={match.id}
              player={player}
              segments={segmentsByPlayer.get(player.id) ?? []}
              cards={cardsByPlayer.get(player.id) ?? []}
              goals={goalsByPlayer.get(player.id) ?? []}
              injuryNote={injuryByPlayer.get(player.id) ?? ""}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen del partido</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay minutos, goles, tarjetas ni molestias cargadas.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {summaryRows.map(({ player, minutes, goalCount, amarillas, azules, injury }) => (
                <div key={player.id} className="flex flex-col gap-1 py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate text-sm font-medium">
                      {player.first_name} {player.last_name}
                    </span>
                    <div className="flex shrink-0 items-center gap-3 text-sm tabular-nums">
                      <span>{minutes}'</span>
                      {goalCount > 0 && (
                        <span className="flex items-center gap-1 text-success">
                          <Goal className="size-3.5" />
                          {goalCount}
                        </span>
                      )}
                      {amarillas > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <Square className="size-3 fill-current" />
                          {amarillas}
                        </span>
                      )}
                      {azules > 0 && (
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <Square className="size-3 fill-current" />
                          {azules}
                        </span>
                      )}
                    </div>
                  </div>
                  {injury && (
                    <p className="flex items-center gap-1.5 text-xs text-destructive">
                      <HeartPulse className="size-3.5 shrink-0" />
                      {injury}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <MatchFormDialog open={editOpen} onOpenChange={setEditOpen} match={match} />
    </div>
  )
}
