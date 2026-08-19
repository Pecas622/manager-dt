import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  CalendarPlus,
  Copy,
  Loader2,
  Pencil,
  Plus,
  Printer,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import {
  useAddRoutineExercise,
  useAddRoutineGroup,
  useDeleteRoutine,
  useDuplicatePlan,
  useRoutine,
  useUpdateRoutine,
} from "@/hooks/useRoutines"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoutineExerciseList } from "@/components/routines/RoutineExerciseList"
import { PhysicalExercisePickerDialog } from "@/components/routines/PhysicalExercisePickerDialog"
import { RoutineAdHocExerciseDialog } from "@/components/routines/RoutineAdHocExerciseDialog"
import { RoutineAssignDialog } from "@/components/routines/RoutineAssignDialog"
import { RoutineGroupSection } from "@/components/routines/RoutineGroupSection"
import { WeekSelector } from "@/components/routines/WeekSelector"
import { RoutinePlanExerciseList } from "@/components/routines/RoutinePlanExerciseList"
import { RoutinePlanExerciseTable } from "@/components/routines/RoutinePlanExerciseTable"
import { cn } from "@/lib/utils"

export function RoutineDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: routine, isLoading } = useRoutine(id)
  const addExercise = useAddRoutineExercise()
  const addGroup = useAddRoutineGroup()
  const deleteRoutine = useDeleteRoutine()
  const duplicatePlan = useDuplicatePlan()
  const updateRoutine = useUpdateRoutine()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [adHocOpen, setAdHocOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState(1)

  const flatExercises = useMemo(
    () => (routine ? routine.routine_exercises.filter((e) => !e.circuit_id) : []),
    [routine]
  )

  const isPlan = Boolean(routine?.player_id)

  function handleAddGroup() {
    if (!routine) return
    addGroup.mutate({
      routine_id: routine.id,
      name: `Grupo ${routine.routine_groups.length + 1}`,
      focus: null,
      order: routine.routine_groups.length,
    })
  }

  async function handleDelete() {
    if (!routine) return
    const label = isPlan ? "el plan" : "la rutina"
    if (!confirm(`¿Eliminar ${label} "${routine.name}"?`)) return
    try {
      await deleteRoutine.mutateAsync(routine.id)
      toast.success(isPlan ? "Plan eliminado" : "Rutina eliminada")
      navigate(isPlan ? "/planes" : "/routines")
    } catch {
      toast.error("No se pudo eliminar")
    }
  }

  async function handleDuplicate() {
    if (!routine) return
    try {
      const copy = await duplicatePlan.mutateAsync(routine.id)
      toast.success("Plan duplicado")
      navigate(`/planes/${copy.id}`)
    } catch {
      toast.error("No se pudo duplicar")
    }
  }

  async function handleToggleArchive() {
    if (!routine) return
    try {
      await updateRoutine.mutateAsync({
        id: routine.id,
        input: { status: routine.status === "Activa" ? "Archivada" : "Activa" },
      })
      toast.success(routine.status === "Activa" ? "Plan archivado" : "Plan reactivado")
    } catch {
      toast.error("No se pudo actualizar")
    }
  }

  if (isLoading || !routine) {
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="shrink-0 print:hidden"
          >
            <ArrowLeft />
          </Button>
          <h1 className="truncate text-xl font-semibold">{routine.name}</h1>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5 print:hidden">
          <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir">
            <Printer />
          </Button>
          {isPlan && (
            <>
              <Button
                variant="outline"
                size="icon"
                render={<Link to={`/planes/${routine.id}/edit`} aria-label="Editar" />}
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
                aria-label={routine.status === "Activa" ? "Archivar" : "Reactivar"}
              >
                {routine.status === "Activa" ? <Archive /> : <ArchiveRestore />}
              </Button>
            </>
          )}
          <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      {isPlan && (
        <Card>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">
                {routine.player?.first_name} {routine.player?.last_name}
              </p>
              {routine.plan_type && <Badge variant="outline">{routine.plan_type}</Badge>}
              {routine.focus_area && <Badge variant="outline">{routine.focus_area}</Badge>}
              {routine.intensity && <Badge variant="outline">{routine.intensity}</Badge>}
              {routine.status === "Archivada" && <Badge variant="secondary">Archivada</Badge>}
            </div>
            {routine.objective && <p className="text-sm">{routine.objective}</p>}
            {routine.notes && <p className="text-sm text-muted-foreground">{routine.notes}</p>}
            {routine.start_date && (
              <p className="text-xs text-muted-foreground">
                Desde {format(parseISO(routine.start_date), "d MMM yyyy", { locale: es })}
                {routine.duration_weeks != null &&
                  ` · ${routine.duration_weeks} semana${routine.duration_weeks === 1 ? "" : "s"}`}
                {routine.session_duration_minutes
                  ? ` · ${routine.session_duration_minutes} min/sesión`
                  : ""}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {!isPlan && routine.notes && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">{routine.notes}</CardContent>
        </Card>
      )}

      <div className={cn("flex items-center justify-between", flatExercises.length === 0 && "print:hidden")}>
        <h2 className="font-semibold">Ejercicios</h2>
        <div className="flex gap-2 print:hidden">
          <Button size="sm" variant="outline" className="h-9" onClick={() => setAdHocOpen(true)}>
            <Plus /> Uno solo
          </Button>
          <Button size="sm" className="h-9" onClick={() => setPickerOpen(true)}>
            <Plus /> Desde biblioteca
          </Button>
        </div>
      </div>

      {isPlan ? (
        <>
          <div className="flex flex-col gap-3 sm:hidden">
            <div className="print:hidden">
              <WeekSelector
                durationWeeks={routine.duration_weeks ?? 1}
                selectedWeek={selectedWeek}
                onSelect={setSelectedWeek}
              />
            </div>
            <RoutinePlanExerciseList
              routineId={routine.id}
              items={flatExercises}
              week={selectedWeek}
            />
          </div>
          <div className="hidden sm:block">
            <RoutinePlanExerciseTable
              routineId={routine.id}
              items={flatExercises}
              durationWeeks={routine.duration_weeks ?? 1}
            />
          </div>
        </>
      ) : (
        <RoutineExerciseList routineId={routine.id} items={flatExercises} />
      )}

      <div
        className={cn(
          "flex items-center justify-between",
          routine.routine_groups.length === 0 && "print:hidden"
        )}
      >
        <h2 className="font-semibold">Grupos</h2>
        <Button
          variant="outline"
          size="sm"
          className="h-9 print:hidden"
          onClick={handleAddGroup}
        >
          <Plus /> Grupo
        </Button>
      </div>

      {routine.routine_groups.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground print:hidden">
          Sin grupos — usalos para armar circuitos en paralelo por perfil (fuerza, velocidad,
          etc.), como un cartel de entrenamiento por grupos.
        </p>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-3",
            routine.routine_groups.length >= 3
              ? "sm:grid-cols-3"
              : routine.routine_groups.length === 2
                ? "sm:grid-cols-2"
                : ""
          )}
        >
          {routine.routine_groups.map((group) => (
            <RoutineGroupSection
              key={group.id}
              routineId={routine.id}
              group={group}
              exercises={routine.routine_exercises}
            />
          ))}
        </div>
      )}

      {!isPlan && (
        <Card className="print:hidden">
          <CardHeader>
            <CardTitle>Asignar al calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="h-11" onClick={() => setAssignOpen(true)}>
              <CalendarPlus /> Asignar rutina a un día
            </Button>
          </CardContent>
        </Card>
      )}

      <PhysicalExercisePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(exercise) => {
          addExercise.mutate({
            routine_id: routine.id,
            circuit_id: null,
            exercise_id: exercise.id,
            ad_hoc_name: null,
            order: flatExercises.length,
            sets_override: null,
            reps_override: null,
            rest_seconds_override: null,
            notes: null,
          })
        }}
      />

      <RoutineAdHocExerciseDialog
        open={adHocOpen}
        onOpenChange={setAdHocOpen}
        onAdd={({ name, sets, reps }) => {
          addExercise.mutate({
            routine_id: routine.id,
            circuit_id: null,
            exercise_id: null,
            ad_hoc_name: name,
            order: flatExercises.length,
            sets_override: sets ? Number(sets) : null,
            reps_override: reps || null,
            rest_seconds_override: null,
            notes: null,
          })
        }}
      />

      {!isPlan && (
        <RoutineAssignDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          routineId={routine.id}
        />
      )}
    </div>
  )
}
