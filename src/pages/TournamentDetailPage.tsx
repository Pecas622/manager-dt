import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Loader2, Pencil, Plus, Trophy } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useTournament, useTournamentMatches } from "@/hooks/useTournaments"
import type { Match } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TournamentFormDialog } from "@/components/matches/TournamentFormDialog"
import { MatchFormDialog } from "@/components/matches/MatchFormDialog"

export function TournamentDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { role } = useAuth()
  const { data: tournament, isLoading } = useTournament(id)
  const { data: matches } = useTournamentMatches(id)
  const [editOpen, setEditOpen] = useState(false)
  const [matchFormOpen, setMatchFormOpen] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | undefined>(undefined)

  function openNewMatch() {
    setEditingMatch(undefined)
    setMatchFormOpen(true)
  }

  function openEditMatch(match: Match) {
    setEditingMatch(match)
    setMatchFormOpen(true)
  }

  if (isLoading || !tournament) {
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
          <h1 className="truncate text-xl font-semibold">{tournament.name}</h1>
        </div>
        {role === "dt" && (
          <Button variant="outline" size="icon" onClick={() => setEditOpen(true)} aria-label="Editar" className="shrink-0">
            <Pencil />
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2">
          {(tournament.start_date || tournament.end_date) && (
            <p className="flex items-center gap-2 text-sm">
              <Trophy className="size-4 text-primary" />
              {tournament.start_date
                ? format(parseISO(tournament.start_date), "d MMM", { locale: es })
                : "?"}
              {" – "}
              {tournament.end_date
                ? format(parseISO(tournament.end_date), "d MMM yyyy", { locale: es })
                : "?"}
            </p>
          )}
          {tournament.notes && <p className="text-sm text-muted-foreground">{tournament.notes}</p>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Partidos</h2>
        {role === "dt" && (
          <Button size="sm" className="h-9" onClick={openNewMatch}>
            <Plus /> Partido
          </Button>
        )}
      </div>

      {(!matches || matches.length === 0) && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Todavía no hay partidos cargados en este torneo.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {matches?.map((match) => (
          <Card key={match.id} className="transition-colors hover:bg-accent/40">
            <CardContent className="flex items-center gap-3">
              <Link to={`/matches/${match.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium">vs. {match.opponent}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(match.date), "d MMM yyyy", { locale: es })}
                    {match.start_time ? ` · ${match.start_time.slice(0, 5)} hs` : ""}
                  </p>
                </div>
                <Badge variant="outline">{match.is_home === false ? "Visitante" : "Local"}</Badge>
              </Link>
              {(role === "dt" || role === "profesor") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditMatch(match)}
                  className="shrink-0"
                  aria-label="Editar partido"
                >
                  <Pencil className="size-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <TournamentFormDialog open={editOpen} onOpenChange={setEditOpen} tournament={tournament} />
      <MatchFormDialog
        open={matchFormOpen}
        onOpenChange={setMatchFormOpen}
        tournamentId={tournament.id}
        match={editingMatch}
      />
    </div>
  )
}
