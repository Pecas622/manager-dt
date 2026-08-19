import { useEffect } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  useCreateTrainingSession,
  useTrainingSession,
  useUpdateTrainingSession,
} from "@/hooks/useTrainingSessions"
import { DEFAULT_TRAINING_DURATION, DEFAULT_TRAINING_START_TIME } from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const sessionSchema = z.object({
  date: z.string().min(1, "Requerido"),
  start_time: z.string().min(1, "Requerido"),
  duration: z.string().min(1, "Requerido"),
  main_objective: z.string().min(1, "Requerido"),
  secondary_objectives: z.string().optional(),
  notes: z.string().optional(),
})

type SessionFormValues = z.infer<typeof sessionSchema>

export function TrainingFormPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { data: session, isLoading } = useTrainingSession(id)
  const createSession = useCreateTrainingSession()
  const updateSession = useUpdateTrainingSession()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      date: searchParams.get("date") ?? "",
      start_time: DEFAULT_TRAINING_START_TIME,
      duration: DEFAULT_TRAINING_DURATION.toString(),
      main_objective: "",
      secondary_objectives: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (session) {
      reset({
        date: session.date,
        start_time: session.start_time.slice(0, 5),
        duration: session.duration.toString(),
        main_objective: session.main_objective,
        secondary_objectives: session.secondary_objectives ?? "",
        notes: session.notes ?? "",
      })
    }
  }, [session, reset])

  const watchedDate = watch("date")
  const weekdayLabel = watchedDate
    ? format(parseISO(watchedDate), "EEEE", { locale: es })
    : null

  async function onSubmit(values: SessionFormValues) {
    const payload = {
      date: values.date,
      start_time: values.start_time,
      duration: Number(values.duration),
      main_objective: values.main_objective,
      secondary_objectives: values.secondary_objectives || null,
      notes: values.notes || null,
      observations: session?.observations ?? null,
      focus_areas: session?.focus_areas ?? null,
    }
    try {
      if (isEditing && id) {
        const updated = await updateSession.mutateAsync({ id, input: payload })
        toast.success("Entrenamiento actualizado")
        navigate(`/trainings/${updated.id}`)
      } else {
        const created = await createSession.mutateAsync(payload)
        toast.success("Entrenamiento creado")
        navigate(`/trainings/${created.id}`)
      }
    } catch {
      toast.error("No se pudo guardar el entrenamiento")
    }
  }

  if (isEditing && isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEditing ? "Editar entrenamiento" : "Nuevo entrenamiento"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" className="h-12" {...register("date")} />
              {weekdayLabel && (
                <p className="text-xs capitalize text-muted-foreground">{weekdayLabel}</p>
              )}
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="start_time">Horario</Label>
                <Input id="start_time" type="time" className="h-12" {...register("start_time")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="duration">Duración (min)</Label>
                <Input id="duration" type="number" className="h-12" {...register("duration")} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="main_objective">Objetivo principal</Label>
              <Input id="main_objective" className="h-12" {...register("main_objective")} />
              {errors.main_objective && (
                <p className="text-xs text-destructive">{errors.main_objective.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="secondary_objectives">Objetivos secundarios</Label>
              <Textarea id="secondary_objectives" rows={2} {...register("secondary_objectives")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Observaciones del entrenador</Label>
              <Textarea id="notes" rows={3} {...register("notes")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          {isSubmitting ? "Guardando..." : "Guardar y planificar"}
        </Button>
      </form>
    </div>
  )
}
