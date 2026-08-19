import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Loader2, Printer } from "lucide-react"
import { toast } from "sonner"
import { usePlayer } from "@/hooks/usePlayers"
import { usePlayerEvaluations } from "@/hooks/useEvaluations"
import { usePlayerTotalMinutes } from "@/hooks/useMatchSubstitutions"
import { usePlayerCardCounts } from "@/hooks/useMatchCards"
import { usePlayerGoalCount } from "@/hooks/useMatchGoals"
import { usePlayerPhysicalTests } from "@/hooks/usePhysicalTests"
import { usePlayerIndividualPlans } from "@/hooks/useIndividualPlans"
import { useAddPlayerReportNote, usePlayerReportNotes } from "@/hooks/usePlayerReportNotes"
import { useAuth } from "@/hooks/useAuth"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { PositionBadge } from "@/components/players/PositionBadge"

export function PlayerReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useAuth()
  const { data: player, isLoading } = usePlayer(id)
  const { data: evaluations } = usePlayerEvaluations(id)
  const { data: totalMinutes } = usePlayerTotalMinutes(id)
  const { data: cardCounts } = usePlayerCardCounts(id)
  const { data: goalCount } = usePlayerGoalCount(id)
  const { data: physicalTests } = usePlayerPhysicalTests(id)
  const { data: plans } = usePlayerIndividualPlans(id)
  const { data: notes } = usePlayerReportNotes(id)
  const addNote = useAddPlayerReportNote()
  const [draft, setDraft] = useState("")

  const latestEvaluation = evaluations?.[evaluations.length - 1]

  const latestTestsByName = useMemo(() => {
    if (!physicalTests) return []
    const seen = new Map<string, (typeof physicalTests)[number]>()
    for (const test of physicalTests) {
      if (!seen.has(test.test_name)) seen.set(test.test_name, test)
    }
    return [...seen.values()]
  }, [physicalTests])

  const activePlans = plans?.filter((p) => p.status === "Activa") ?? []

  async function handleAddNote() {
    if (!id || !draft.trim()) return
    try {
      await addNote.mutateAsync({
        player_id: id,
        note: draft.trim(),
        created_by: session?.user.id ?? null,
      })
      setDraft("")
      toast.success("Comentario guardado")
    } catch {
      toast.error("No se pudo guardar el comentario")
    }
  }

  if (isLoading || !player) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold">Informe del jugador</h1>
        </div>
        <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir">
          <Printer />
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          <p className="text-lg font-semibold">
            {player.first_name} {player.last_name}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-mono">#{player.jersey_number ?? "-"}</span>
            <PositionBadge position={player.position} />
            {player.weight_kg && <span>{player.weight_kg} kg</span>}
            {player.height_cm && <span>{player.height_cm} cm</span>}
          </div>
          <p className="text-xs text-muted-foreground">
            Informe generado el {format(new Date(), "d MMM yyyy", { locale: es })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Último check-in</CardTitle>
        </CardHeader>
        <CardContent>
          {!latestEvaluation ? (
            <p className="text-sm text-muted-foreground">Sin evaluaciones cargadas.</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                {format(parseISO(latestEvaluation.date), "d MMMM yyyy", { locale: es })}
                {latestEvaluation.coach ? ` · ${latestEvaluation.coach}` : ""}
              </p>
              {latestEvaluation.notes && (
                <p className="whitespace-pre-wrap text-sm">{latestEvaluation.notes}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tests físicos</CardTitle>
        </CardHeader>
        <CardContent>
          {latestTestsByName.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin tests cargados.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {latestTestsByName.map((test) => (
                <div key={test.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{test.test_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(test.date), "d MMM yyyy", { locale: es })}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {test.value}
                    {test.unit ? ` ${test.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Minutos jugados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{totalMinutes ?? 0}'</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Goles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{goalCount ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Amarillas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{cardCounts?.amarillas ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Azules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{cardCounts?.azules ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Planes individuales activos</CardTitle>
        </CardHeader>
        <CardContent>
          {activePlans.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin planes activos.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {activePlans.map((plan) => (
                <div key={plan.id} className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{plan.name}</p>
                  <Badge variant="outline">{plan.type}</Badge>
                  <Badge variant="outline">{plan.focus_area}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comentarios</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 print:hidden">
            <Textarea
              placeholder="Qué le falta trabajar, observaciones para hablar con el jugador..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
            />
            <Button
              size="sm"
              className="h-9 self-end"
              disabled={!draft.trim() || addNote.isPending}
              onClick={handleAddNote}
            >
              Agregar comentario
            </Button>
          </div>

          {(!notes || notes.length === 0) ? (
            <p className="text-sm text-muted-foreground">Sin comentarios registrados.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {notes.map((note) => (
                <div key={note.id} className="py-2 first:pt-0 last:pb-0">
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(note.created_at), "d MMM yyyy", { locale: es })}
                    {note.author?.full_name ? ` · ${note.author.full_name}` : ""}
                  </p>
                  <p className="whitespace-pre-wrap text-sm">{note.note}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
