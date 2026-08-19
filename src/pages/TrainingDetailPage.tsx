import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useAddSessionExercise,
  useDeleteTrainingSession,
  useTrainingSession,
  useUpdateTrainingSession,
} from "@/hooks/useTrainingSessions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DurationTracker } from "@/components/trainings/DurationTracker"
import { SessionExerciseBlockList } from "@/components/trainings/SessionExerciseBlockList"
import { PlayerHighlightsEditor } from "@/components/trainings/PlayerHighlightsEditor"
import { ExercisePickerDialog } from "@/components/exercises/ExercisePickerDialog"

export function TrainingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: session, isLoading } = useTrainingSession(id)
  const addBlock = useAddSessionExercise()
  const updateSession = useUpdateTrainingSession()
  const deleteSession = useDeleteTrainingSession()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [observations, setObservations] = useState("")
  const [focusAreas, setFocusAreas] = useState("")

  useEffect(() => {
    if (session) {
      setObservations(session.observations ?? "")
      setFocusAreas(session.focus_areas ?? "")
    }
  }, [session])

  const used = useMemo(
    () => session?.session_exercises.reduce((sum, b) => sum + b.duration, 0) ?? 0,
    [session]
  )

  const dirty =
    session &&
    (observations !== (session.observations ?? "") || focusAreas !== (session.focus_areas ?? ""))

  async function handleSaveObservations() {
    if (!session) return
    try {
      await updateSession.mutateAsync({
        id: session.id,
        input: { observations: observations || null, focus_areas: focusAreas || null },
      })
      toast.success("Observaciones guardadas")
    } catch {
      toast.error("No se pudo guardar")
    }
  }

  async function handleDelete() {
    if (!session) return
    if (!confirm("¿Eliminar este entrenamiento? Se perderá toda su planificación.")) return
    try {
      await deleteSession.mutateAsync(session.id)
      toast.success("Entrenamiento eliminado")
      navigate("/trainings")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  if (isLoading || !session) {
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
          <h1 className="text-xl font-semibold capitalize">
            {format(parseISO(session.date), "EEEE d 'de' MMMM", { locale: es })}
          </h1>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            render={<Link to={`/trainings/${session.id}/edit`} aria-label="Editar" />}
          >
            <Pencil />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Objetivo principal</p>
            <p className="font-medium">{session.main_objective}</p>
          </div>
          {session.secondary_objectives && (
            <div>
              <p className="text-xs text-muted-foreground">Objetivos secundarios</p>
              <p className="text-sm">{session.secondary_objectives}</p>
            </div>
          )}
          {session.notes && (
            <div>
              <p className="text-xs text-muted-foreground">Observaciones del entrenador</p>
              <p className="text-sm">{session.notes}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {session.start_time.slice(0, 5)} hs
          </p>
        </CardContent>
      </Card>

      <DurationTracker planned={session.duration} used={used} />

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Planificación</h2>
        <Button size="sm" className="h-9" onClick={() => setPickerOpen(true)}>
          <Plus /> Agregar ejercicio
        </Button>
      </div>

      <SessionExerciseBlockList sessionId={session.id} blocks={session.session_exercises} />

      <Card>
        <CardHeader>
          <CardTitle>¿Qué observé?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            rows={4}
            placeholder="Cosas que funcionaron, errores del equipo, jugadores destacados, conceptos que no quedaron claros, ideas para el próximo entrenamiento..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <Label>Aspectos a trabajar</Label>
            <Textarea
              rows={3}
              placeholder="Tenemos que mejorar la cobertura del segundo palo."
              value={focusAreas}
              onChange={(e) => setFocusAreas(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSaveObservations}
            disabled={!dirty || updateSession.isPending}
            className="h-11 self-start"
          >
            <Save /> Guardar observaciones
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Jugadores destacados</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerHighlightsEditor
            sessionId={session.id}
            notes={session.training_player_notes}
          />
        </CardContent>
      </Card>

      <ExercisePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(exercise) => {
          addBlock.mutate({
            training_session_id: session.id,
            exercise_id: exercise.id,
            order: session.session_exercises.length,
            duration: exercise.duration,
            specific_notes: null,
          })
        }}
      />
    </div>
  )
}
