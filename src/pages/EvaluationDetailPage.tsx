import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Loader2, Ruler, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useDeleteEvaluation, useEvaluation } from "@/hooks/useEvaluations"
import { usePlayerPhysicalTests } from "@/hooks/usePhysicalTests"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EvaluationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: evaluation, isLoading } = useEvaluation(id)
  const { data: physicalTests } = usePlayerPhysicalTests(evaluation?.player_id)
  const deleteEvaluation = useDeleteEvaluation()

  const latestTestsByName = (() => {
    if (!physicalTests) return []
    const seen = new Map<string, (typeof physicalTests)[number]>()
    for (const test of physicalTests) {
      if (!seen.has(test.test_name)) seen.set(test.test_name, test)
    }
    return [...seen.values()]
  })()

  async function handleDelete() {
    if (!evaluation) return
    if (!confirm("¿Eliminar esta evaluación?")) return
    try {
      await deleteEvaluation.mutateAsync(evaluation.id)
      toast.success("Evaluación eliminada")
      navigate(`/players/${evaluation.player_id}`)
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  if (isLoading || !evaluation) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              <Link to={`/players/${evaluation.player_id}`} className="hover:underline">
                {evaluation.player?.first_name} {evaluation.player?.last_name}
              </Link>
            </h1>
            <p className="text-sm text-muted-foreground">
              {format(parseISO(evaluation.date), "d 'de' MMMM yyyy", { locale: es })}
              {evaluation.coach ? ` · ${evaluation.coach}` : ""}
            </p>
          </div>
        </div>
        <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
          <Trash2 />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos físicos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-muted p-2.5">
              <p className="text-[11px] text-muted-foreground">Peso</p>
              <p className="font-semibold">
                {evaluation.player?.weight_kg ? `${evaluation.player.weight_kg} kg` : "-"}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-2.5">
              <p className="text-[11px] text-muted-foreground">Altura</p>
              <p className="font-semibold">
                {evaluation.player?.height_cm ? `${evaluation.player.height_cm} cm` : "-"}
              </p>
            </div>
          </div>

          {latestTestsByName.length > 0 && (
            <div className="flex flex-col divide-y divide-border">
              {latestTestsByName.map((test) => (
                <div key={test.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Ruler className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{test.test_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(test.date), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    {test.value}
                    {test.unit ? ` ${test.unit}` : ""}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-9 self-start"
            render={<Link to={`/players/${evaluation.player_id}`} />}
          >
            Ver ficha completa
          </Button>
        </CardContent>
      </Card>

      {evaluation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Observaciones</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm">{evaluation.notes}</CardContent>
        </Card>
      )}
    </div>
  )
}
