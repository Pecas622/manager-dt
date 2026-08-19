import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import {
  useAddPlanExercise,
  useDeleteIndividualPlan,
  useDuplicateIndividualPlan,
  useIndividualPlan,
  useUpdateIndividualPlan,
} from "@/hooks/useIndividualPlans"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeekSelector } from "@/components/individual-plans/WeekSelector"
import { PlanExerciseList } from "@/components/individual-plans/PlanExerciseList"
import { PlanExerciseTable } from "@/components/individual-plans/PlanExerciseTable"
import { AdHocExerciseDialog } from "@/components/individual-plans/AdHocExerciseDialog"
import { ExercisePickerDialog } from "@/components/exercises/ExercisePickerDialog"

export function IndividualPlanDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: plan, isLoading } = useIndividualPlan(id)
  const addExercise = useAddPlanExercise()
  const deletePlan = useDeleteIndividualPlan()
  const duplicatePlan = useDuplicateIndividualPlan()
  const updatePlan = useUpdateIndividualPlan()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [adHocOpen, setAdHocOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)

  async function handleDelete() {
    if (!plan) return
    if (!confirm(`¿Eliminar el plan "${plan.name}"?`)) return
    try {
      await deletePlan.mutateAsync(plan.id)
      toast.success("Plan eliminado")
      navigate("/planes")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  async function handleDuplicate() {
    if (!plan) return
    try {
      const copy = await duplicatePlan.mutateAsync(plan.id)
      toast.success("Plan duplicado")
      navigate(`/planes/${copy.id}`)
    } catch {
      toast.error("No se pudo duplicar")
    }
  }

  async function handleToggleArchive() {
    if (!plan) return
    try {
      await updatePlan.mutateAsync({
        id: plan.id,
        input: { status: plan.status === "Activa" ? "Archivada" : "Activa" },
      })
      toast.success(plan.status === "Activa" ? "Plan archivado" : "Plan reactivado")
    } catch {
      toast.error("No se pudo actualizar")
    }
  }

  if (isLoading || !plan) {
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
          <h1 className="text-xl font-semibold">{plan.name}</h1>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir">
            <Printer />
          </Button>
          <Button
            variant="outline"
            size="icon"
            render={<Link to={`/planes/${plan.id}/edit`} aria-label="Editar" />}
          >
            <Pencil />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDuplicate} aria-label="Duplicar">
            <Copy />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleToggleArchive}
            aria-label={plan.status === "Activa" ? "Archivar" : "Reactivar"}
          >
            {plan.status === "Activa" ? <Archive /> : <ArchiveRestore />}
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">
              {plan.player?.first_name} {plan.player?.last_name}
            </p>
            <Badge variant="outline">{plan.type}</Badge>
            <Badge variant="outline">{plan.focus_area}</Badge>
            <Badge variant="outline">{plan.intensity}</Badge>
            {plan.status === "Archivada" && <Badge variant="secondary">Archivada</Badge>}
          </div>
          {plan.objective && <p className="text-sm">{plan.objective}</p>}
          {plan.description && (
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Desde {format(parseISO(plan.start_date), "d MMM yyyy", { locale: es })} ·{" "}
            {plan.duration_weeks} semana{plan.duration_weeks === 1 ? "" : "s"}
            {plan.session_duration_minutes ? ` · ${plan.session_duration_minutes} min/sesión` : ""}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between print:hidden">
            Ejercicios
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-9" onClick={() => setAdHocOpen(true)}>
                <Plus /> Uno solo
              </Button>
              <Button size="sm" className="h-9" onClick={() => setPickerOpen(true)}>
                <Plus /> Desde biblioteca
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="print:hidden">
              <WeekSelector
                durationWeeks={plan.duration_weeks}
                selectedWeek={selectedWeek}
                onSelect={setSelectedWeek}
              />
            </div>
            <PlanExerciseList
              planId={plan.id}
              items={plan.individual_plan_exercises}
              week={selectedWeek}
            />
          </div>
          <div className="hidden sm:block">
            <PlanExerciseTable
              planId={plan.id}
              items={plan.individual_plan_exercises}
              durationWeeks={plan.duration_weeks}
            />
          </div>
        </CardContent>
      </Card>

      <ExercisePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(exercise) => {
          addExercise.mutate({
            plan_id: plan.id,
            exercise_id: exercise.id,
            ad_hoc_name: null,
            order: plan.individual_plan_exercises.length,
            base_sets: null,
            base_reps: null,
            notes: null,
          })
        }}
      />

      <AdHocExerciseDialog
        open={adHocOpen}
        onOpenChange={setAdHocOpen}
        onAdd={({ name, sets, reps }) => {
          addExercise.mutate({
            plan_id: plan.id,
            exercise_id: null,
            ad_hoc_name: name,
            order: plan.individual_plan_exercises.length,
            base_sets: sets ? Number(sets) : null,
            base_reps: reps || null,
            notes: null,
          })
        }}
      />
    </div>
  )
}
