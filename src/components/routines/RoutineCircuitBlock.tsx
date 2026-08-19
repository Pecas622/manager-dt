import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Clock, GripVertical, Plus, Repeat, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useAddRoutineExercise,
  useDeleteRoutineCircuit,
  useRemoveRoutineExercise,
  useReorderRoutineExercises,
} from "@/hooks/useRoutines"
import type { PhysicalExercise, RoutineExercise } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhysicalExercisePickerDialog } from "@/components/routines/PhysicalExercisePickerDialog"
import { RoutineAdHocExerciseDialog } from "@/components/routines/RoutineAdHocExerciseDialog"

function CircuitExerciseItem({
  item,
  index,
  routineId,
}: {
  item: RoutineExercise
  index: number
  routineId: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  const removeExercise = useRemoveRoutineExercise()

  const style = { transform: CSS.Transform.toString(transform), transition }
  const name = item.exercise?.name ?? item.ad_hoc_name ?? "Ejercicio"
  const sets = item.sets_override ?? item.exercise?.sets
  const reps = item.reps_override ?? item.exercise?.reps
  const rest = item.rest_seconds_override ?? item.exercise?.rest_seconds

  async function handleRemove() {
    if (!confirm(`¿Quitar "${name}" del circuito?`)) return
    try {
      await removeExercise.mutateAsync({ id: item.id, routineId })
    } catch {
      toast.error("No se pudo quitar el ejercicio")
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-60" : undefined}>
      <Card>
        <CardContent className="flex items-center gap-2 py-2.5">
          <button
            {...attributes}
            {...listeners}
            aria-label="Reordenar"
            className="flex size-7 shrink-0 touch-none items-center justify-center text-muted-foreground print:hidden"
          >
            <GripVertical className="size-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium">
              {index + 1}. {name}
            </p>
            {(sets || reps || rest) && (
              <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
                {(sets || reps) && (
                  <span className="flex items-center gap-1">
                    <Repeat className="size-3" /> {sets ?? "-"}×{reps ?? "-"}
                  </span>
                )}
                {rest && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {rest}s
                  </span>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            className="shrink-0 text-destructive hover:text-destructive print:hidden"
            aria-label="Quitar"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function RoutineCircuitBlock({
  routineId,
  circuitId,
  index,
  items,
}: {
  routineId: string
  circuitId: string
  index: number
  items: RoutineExercise[]
}) {
  const addExercise = useAddRoutineExercise()
  const deleteCircuit = useDeleteRoutineCircuit()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [adHocOpen, setAdHocOpen] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = [...items]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reorder(reordered.map((i) => i.id))
  }

  const reorderMutation = useReorderRoutineExercises()
  function reorder(orderedIds: string[]) {
    reorderMutation.mutate({ routineId, orderedIds })
  }

  function addFromLibrary(exercise: PhysicalExercise) {
    addExercise.mutate({
      routine_id: routineId,
      circuit_id: circuitId,
      exercise_id: exercise.id,
      ad_hoc_name: null,
      order: items.length,
      sets_override: null,
      reps_override: null,
      rest_seconds_override: null,
      notes: null,
    })
  }

  function addAdHoc(input: { name: string; sets: string; reps: string }) {
    addExercise.mutate({
      routine_id: routineId,
      circuit_id: circuitId,
      exercise_id: null,
      ad_hoc_name: input.name,
      order: items.length,
      sets_override: input.sets ? Number(input.sets) : null,
      reps_override: input.reps || null,
      rest_seconds_override: null,
      notes: null,
    })
  }

  async function handleDeleteCircuit() {
    if (!confirm(`¿Eliminar el Circuito ${index + 1}? Se borran sus ejercicios.`)) return
    try {
      await deleteCircuit.mutateAsync({ id: circuitId, routineId })
    } catch {
      toast.error("No se pudo eliminar el circuito")
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Circuito {index + 1}
        </p>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleDeleteCircuit}
          className="text-destructive hover:text-destructive print:hidden"
          aria-label="Eliminar circuito"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin ejercicios.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-1.5">
              {items.map((item, i) => (
                <CircuitExerciseItem key={item.id} item={item} index={i} routineId={routineId} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex gap-1.5 print:hidden">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={() => setAdHocOpen(true)}
        >
          <Plus className="size-3.5" /> Suelto
        </Button>
        <Button size="sm" className="h-8 flex-1 text-xs" onClick={() => setPickerOpen(true)}>
          <Plus className="size-3.5" /> Biblioteca
        </Button>
      </div>

      <PhysicalExercisePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={addFromLibrary}
      />
      <RoutineAdHocExerciseDialog open={adHocOpen} onOpenChange={setAdHocOpen} onAdd={addAdHoc} />
    </div>
  )
}
