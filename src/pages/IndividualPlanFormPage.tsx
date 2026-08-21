import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCreateRoutine, useRoutine, useUpdateRoutine } from "@/hooks/useRoutines"
import { usePlayers } from "@/hooks/usePlayers"
import { useAuth } from "@/hooks/useAuth"
import {
  INDIVIDUAL_PLAN_FOCUS_AREAS,
  INDIVIDUAL_PLAN_INTENSITIES,
  INDIVIDUAL_PLAN_TYPES,
} from "@/types/domain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const planSchema = z.object({
  player_id: z.string().min(1, "Seleccioná un jugador"),
  name: z.string().min(1, "Requerido"),
  objective: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(INDIVIDUAL_PLAN_TYPES, { message: "Seleccioná un tipo" }),
  focus_area: z.enum(INDIVIDUAL_PLAN_FOCUS_AREAS, { message: "Seleccioná una zona" }),
  start_date: z.string().min(1, "Requerido"),
  duration_weeks: z.string().min(1, "Requerido"),
  session_duration_minutes: z.string().optional(),
  intensity: z.enum(INDIVIDUAL_PLAN_INTENSITIES),
})

type PlanFormValues = z.infer<typeof planSchema>

const emptyValues: PlanFormValues = {
  player_id: "",
  name: "",
  objective: "",
  description: "",
  type: "Fuerza",
  focus_area: "General",
  start_date: new Date().toISOString().slice(0, 10),
  duration_weeks: "4",
  session_duration_minutes: "",
  intensity: "Media",
}

export function IndividualPlanFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()
  const { session } = useAuth()
  const { data: players } = usePlayers()
  const { data: plan, isLoading } = useRoutine(id)
  const createPlan = useCreateRoutine()
  const updatePlan = useUpdateRoutine()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    if (plan && plan.plan_type && plan.focus_area && plan.intensity && plan.start_date) {
      reset({
        player_id: plan.player_id ?? "",
        name: plan.name,
        objective: plan.objective ?? "",
        description: plan.notes ?? "",
        type: plan.plan_type,
        focus_area: plan.focus_area,
        start_date: plan.start_date,
        duration_weeks: (plan.duration_weeks ?? 4).toString(),
        session_duration_minutes: plan.session_duration_minutes?.toString() ?? "",
        intensity: plan.intensity,
      })
    }
  }, [plan, reset])

  async function onSubmit(values: PlanFormValues) {
    const payload = {
      category: null,
      player_id: values.player_id,
      name: values.name,
      objective: values.objective || null,
      notes: values.description || null,
      plan_type: values.type,
      focus_area: values.focus_area,
      start_date: values.start_date,
      duration_weeks: Number(values.duration_weeks),
      session_duration_minutes: values.session_duration_minutes
        ? Number(values.session_duration_minutes)
        : null,
      intensity: values.intensity,
      status: (plan?.status ?? "Activa") as "Activa" | "Archivada",
      created_by: plan?.created_by ?? session?.user.id ?? null,
    }

    try {
      if (isEditing && id) {
        const updated = await updatePlan.mutateAsync({ id, input: payload })
        toast.success("Plan actualizado")
        navigate(`/planes/${updated.id}`)
      } else {
        const created = await createPlan.mutateAsync(payload)
        toast.success("Plan creado")
        navigate(`/planes/${created.id}`)
      }
    } catch {
      toast.error("No se pudo guardar el plan")
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
          {isEditing ? "Editar plan" : "Nuevo plan individual"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Jugador</Label>
              <Select
                value={watch("player_id")}
                onValueChange={(v) => v && setValue("player_id", v)}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {players?.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.first_name} {p.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.player_id && (
                <p className="text-xs text-destructive">{errors.player_id.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Nombre del plan</Label>
              <Input
                id="name"
                placeholder="Fortalecimiento de tobillo"
                className="h-12"
                {...register("name")}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label>Tipo</Label>
                <Select
                  value={watch("type")}
                  onValueChange={(v) => v && setValue("type", v as PlanFormValues["type"])}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIVIDUAL_PLAN_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Zona / foco</Label>
                <Select
                  value={watch("focus_area")}
                  onValueChange={(v) =>
                    v && setValue("focus_area", v as PlanFormValues["focus_area"])
                  }
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIVIDUAL_PLAN_FOCUS_AREAS.map((z) => (
                      <SelectItem key={z} value={z}>
                        {z}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="start_date">Fecha de inicio</Label>
                <Input id="start_date" type="date" className="h-12" {...register("start_date")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="duration_weeks">Duración (semanas)</Label>
                <Input
                  id="duration_weeks"
                  type="number"
                  min={1}
                  className="h-12"
                  {...register("duration_weeks")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="session_duration_minutes">Duración de sesión (min)</Label>
                <Input
                  id="session_duration_minutes"
                  type="number"
                  className="h-12"
                  {...register("session_duration_minutes")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Intensidad</Label>
                <Select
                  value={watch("intensity")}
                  onValueChange={(v) =>
                    v && setValue("intensity", v as PlanFormValues["intensity"])
                  }
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIVIDUAL_PLAN_INTENSITIES.map((i) => (
                      <SelectItem key={i} value={i}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="objective">Objetivo</Label>
              <Textarea id="objective" rows={2} {...register("objective")} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting} className="h-12 text-base">
          {isSubmitting ? "Guardando..." : "Guardar y agregar ejercicios"}
        </Button>
      </form>
    </div>
  )
}
