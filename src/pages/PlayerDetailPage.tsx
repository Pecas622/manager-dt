import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, ClipboardPlus, FileText, Loader2, Pencil, Plus, Ruler, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { usePlayer, useDeletePlayer } from "@/hooks/usePlayers"
import { usePlayerEvaluations } from "@/hooks/useEvaluations"
import { usePlayerTotalMinutes } from "@/hooks/useMatchSubstitutions"
import { usePlayerCardCounts } from "@/hooks/useMatchCards"
import { usePlayerGoalCount } from "@/hooks/useMatchGoals"
import { useDeletePhysicalTest, usePlayerPhysicalTests } from "@/hooks/usePhysicalTests"
import { PhysicalTestFormDialog } from "@/components/physical-tests/PhysicalTestFormDialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PositionBadge } from "@/components/players/PositionBadge"
import { PlayerDocumentsSection } from "@/components/players/PlayerDocumentsSection"

export function PlayerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: player, isLoading } = usePlayer(id)
  const { data: evaluations } = usePlayerEvaluations(id)
  const { data: totalMinutes } = usePlayerTotalMinutes(id)
  const { data: cardCounts } = usePlayerCardCounts(id)
  const { data: goalCount } = usePlayerGoalCount(id)
  const { data: physicalTests } = usePlayerPhysicalTests(id)
  const deletePhysicalTest = useDeletePhysicalTest()
  const deletePlayer = useDeletePlayer()
  const [testDialogOpen, setTestDialogOpen] = useState(false)

  const sorted = useMemo(
    () => (evaluations ? [...evaluations].reverse() : []),
    [evaluations]
  )
  const latest = sorted[0]

  if (isLoading || !player) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  async function handleDelete() {
    if (!player) return
    if (!confirm(`¿Eliminar a ${player.first_name} ${player.last_name}? Esta acción no se puede deshacer.`)) return
    try {
      await deletePlayer.mutateAsync(player.id)
      toast.success("Jugador eliminado")
      navigate("/players")
    } catch {
      toast.error("No se pudo eliminar el jugador")
    }
  }

  async function handleDeleteTest(testId: string) {
    if (!confirm("¿Eliminar este registro?")) return
    try {
      await deletePhysicalTest.mutateAsync(testId)
      toast.success("Registro eliminado")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold">Ficha del jugador</h1>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            render={<Link to={`/players/${player.id}/report`} aria-label="Ver informe" />}
          >
            <FileText />
          </Button>
          <Button
            variant="outline"
            size="icon"
            render={<Link to={`/players/${player.id}/edit`} aria-label="Editar" />}
          >
            <Pencil />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4">
          <Avatar size="lg" className="size-16">
            {player.photo_url && <AvatarImage src={player.photo_url} alt="" />}
            <AvatarFallback className="text-lg">
              {player.first_name[0]}
              {player.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-semibold">
              {player.first_name} {player.last_name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">#{player.jersey_number ?? "-"}</span>
              <PositionBadge position={player.position} />
              {player.preferred_foot && <span>Pierna {player.preferred_foot.toLowerCase()}</span>}
              {player.status === "Inactivo" && <Badge variant="secondary">Inactivo</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="perfil">
        <TabsList className="w-full">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="evaluaciones">Evaluaciones</TabsTrigger>
          <TabsTrigger value="fisica">Física</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4 flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Fortalezas</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">
              {player.strengths || "Sin registrar."}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Aspectos a mejorar</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">
              {player.weaknesses || "Sin registrar."}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Observaciones</CardTitle>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm">
              {player.notes || "Sin registrar."}
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Nacimiento</p>
                <p className="font-medium">
                  {player.birth_date
                    ? format(parseISO(player.birth_date), "d MMM yyyy", { locale: es })
                    : "-"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Minutos jugados</p>
                <p className="font-medium">{totalMinutes ?? 0}'</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Goles</p>
                <p className="font-medium">{goalCount ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Amarillas</p>
                <p className="font-medium">{cardCounts?.amarillas ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Azules</p>
                <p className="font-medium">{cardCounts?.azules ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Peso</p>
                <p className="font-medium">{player.weight_kg ? `${player.weight_kg} kg` : "-"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-3">
                <p className="text-xs text-muted-foreground">Altura</p>
                <p className="font-medium">{player.height_cm ? `${player.height_cm} cm` : "-"}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluaciones" className="mt-4 flex flex-col gap-4">
          <Button
            render={<Link to={`/evaluations/new?playerId=${player.id}`} />}
            className="h-11 self-start"
          >
            <ClipboardPlus /> Nueva evaluación
          </Button>

          {sorted.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay evaluaciones cargadas para este jugador.
            </p>
          )}

          {latest && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Último check-in — {format(parseISO(latest.date), "MMMM yyyy", { locale: es })}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-[11px] text-muted-foreground">Peso</p>
                    <p className="font-semibold">{player.weight_kg ? `${player.weight_kg} kg` : "-"}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <p className="text-[11px] text-muted-foreground">Altura</p>
                    <p className="font-semibold">{player.height_cm ? `${player.height_cm} cm` : "-"}</p>
                  </div>
                </div>
                {latest.notes && (
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{latest.notes}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 self-start"
                  render={<Link to={`/evaluations/${latest.id}`} />}
                >
                  Ver detalle
                </Button>
              </CardContent>
            </Card>
          )}

          {sorted.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col divide-y divide-border">
                {sorted.map((ev) => (
                  <Link
                    key={ev.id}
                    to={`/evaluations/${ev.id}`}
                    className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {format(parseISO(ev.date), "d MMM yyyy", { locale: es })}
                      </span>
                      {ev.coach && <Badge variant="outline">{ev.coach}</Badge>}
                    </div>
                    {ev.notes && (
                      <p className="truncate text-xs text-muted-foreground">{ev.notes}</p>
                    )}
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="fisica" className="mt-4 flex flex-col gap-3">
          <Button className="h-11 self-start" onClick={() => setTestDialogOpen(true)}>
            <Plus /> Nuevo test
          </Button>

          {(!physicalTests || physicalTests.length === 0) && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay tests físicos cargados para este jugador.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {physicalTests?.map((test) => (
              <Card key={test.id}>
                <CardContent className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Ruler className="size-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{test.test_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(test.date), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-base font-semibold">
                      {test.value}
                      {test.unit ? ` ${test.unit}` : ""}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTest(test.id)}
                      aria-label="Eliminar"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="mt-4">
          <PlayerDocumentsSection playerId={player.id} />
        </TabsContent>
      </Tabs>

      <PhysicalTestFormDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        defaultPlayerId={player.id}
      />
    </div>
  )
}
