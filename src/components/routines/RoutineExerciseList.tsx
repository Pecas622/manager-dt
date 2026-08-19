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
import { Clock, GripVertical, Repeat, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useRemoveRoutineExercise,
  useReorderRoutineExercises,
} from "@/hooks/useRoutines"
import type { RoutineExercise } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ExerciseItem({
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
    if (!confirm(`¿Quitar "${name}" de la rutina?`)) return
    try {
      await removeExercise.mutateAsync({ id: item.id, routineId })
    } catch {
      toast.error("No se pudo quitar el ejercicio")
    }
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-60" : undefined}>
      <Card>
        <CardContent className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            aria-label="Reordenar"
            className="flex size-8 shrink-0 touch-none items-center justify-center text-muted-foreground print:hidden"
          >
            <GripVertical className="size-4.5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground">
              {index + 1}. {name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {(sets || reps) && (
                <span className="flex items-center gap-1">
                  <Repeat className="size-3.5" /> {sets ?? "-"}×{reps ?? "-"}
                </span>
              )}
              {rest && (
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" /> {rest}s
                </span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="shrink-0 text-destructive hover:text-destructive print:hidden"
            aria-label="Quitar"
          >
            <Trash2 className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export function RoutineExerciseList({
  routineId,
  items,
}: {
  routineId: string
  items: RoutineExercise[]
}) {
  const reorder = useReorderRoutineExercises()
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
    reorder.mutate({ routineId, orderedIds: reordered.map((i) => i.id) })
  }

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground print:hidden">
        Todavía no agregaste ejercicios a esta rutina.
      </p>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <ExerciseItem key={item.id} item={item} index={index} routineId={routineId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
