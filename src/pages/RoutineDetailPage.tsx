import { useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CalendarPlus, Loader2, Plus, Printer, Trash2 } from "lucide-react"
import {
  useAddRoutineExercise,
  useAddRoutineGroup,
  useDeleteRoutine,
  useRoutine,
} from "@/hooks/useRoutines"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RoutineExerciseList } from "@/components/routines/RoutineExerciseList"
import { PhysicalExercisePickerDialog } from "@/components/routines/PhysicalExercisePickerDialog"
import { RoutineAssignDialog } from "@/components/routines/RoutineAssignDialog"
import { RoutineGroupSection } from "@/components/routines/RoutineGroupSection"
import { cn } from "@/lib/utils"

export function RoutineDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: routine, isLoading } = useRoutine(id)
  const addExercise = useAddRoutineExercise()
  const addGroup = useAddRoutineGroup()
  const deleteRoutine = useDeleteRoutine()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)

  const flatExercises = useMemo(
    () => (routine ? routine.routine_exercises.filter((e) => !e.circuit_id) : []),
    [routine]
  )

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
    if (!confirm(`¿Eliminar la rutina "${routine.name}"?`)) return
    try {
      await deleteRoutine.mutateAsync(routine.id)
      toast.success("Rutina eliminada")
      navigate("/routines")
    } catch {
      toast.error("No se pudo eliminar")
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
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            aria-label="Volver"
            className="print:hidden"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-xl font-semibold">{routine.name}</h1>
        </div>
        <div className="flex gap-1.5 print:hidden">
          <Button variant="outline" size="icon" onClick={() => window.print()} aria-label="Imprimir">
            <Printer />
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} aria-label="Eliminar">
            <Trash2 />
          </Button>
        </div>
      </div>

      {routine.notes && (
        <Card>
          <CardContent className="text-sm text-muted-foreground">{routine.notes}</CardContent>
        </Card>
      )}

      <div className={cn("flex items-center justify-between", flatExercises.length === 0 && "print:hidden")}>
        <h2 className="font-semibold">Ejercicios</h2>
        <Button size="sm" className="h-9 print:hidden" onClick={() => setPickerOpen(true)}>
          <Plus /> Agregar
        </Button>
      </div>

      <RoutineExerciseList routineId={routine.id} items={flatExercises} />

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

      <RoutineAssignDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        routineId={routine.id}
      />
    </div>
  )
}
