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
import { GripVertical, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  useRemovePlanExercise,
  useReorderPlanExercises,
  useSetPlanExerciseWeek,
} from "@/hooks/useIndividualPlans"
import type { IndividualPlanExercise } from "@/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function ExerciseRow({
  item,
  index,
  planId,
  week,
}: {
  item: IndividualPlanExercise
  index: number
  planId: string
  week: number
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  const removeExercise = useRemovePlanExercise()
  const setWeek = useSetPlanExerciseWeek()

  const weekData = item.weeks?.find((w) => w.week_number === week)
  const [sets, setSets] = useState(weekData?.sets?.toString() ?? "")
  const [reps, setReps] = useState(weekData?.reps ?? "")

  const style = { transform: CSS.Transform.toString(transform), transition }
  const name = item.exercise?.name ?? item.ad_hoc_name ?? "Ejercicio"

  function commit() {
    setWeek.mutate({
      planId,
      planExerciseId: item.id,
      weekNumber: week,
      sets: sets ? Number(sets) : null,
      reps: reps || null,
    })
  }

  async function handleRemove() {
    if (!confirm(`¿Quitar "${name}" del plan?`)) return
    try {
      await removeExercise.mutateAsync({ id: item.id, planId })
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
            className="flex size-8 shrink-0 touch-none items-center justify-center text-muted-foreground"
          >
            <GripVertical className="size-4.5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">
              {index + 1}. {name}
            </p>
            {(item.base_sets || item.base_reps) && (
              <p className="text-xs text-muted-foreground">
                Base: {item.base_sets ?? "-"}×{item.base_reps ?? "-"}
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Input
              type="number"
              placeholder="series"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              onBlur={commit}
              className="h-9 w-16 text-center"
            />
            <span className="text-xs text-muted-foreground">×</span>
            <Input
              placeholder="reps"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              onBlur={commit}
              className="h-9 w-16 text-center"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-destructive hover:text-destructive"
              aria-label="Quitar"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PlanExerciseList({
  planId,
  items,
  week,
}: {
  planId: string
  items: IndividualPlanExercise[]
  week: number
}) {
  const reorder = useReorderPlanExercises()
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
    reorder.mutate({ planId, orderedIds: reordered.map((i) => i.id) })
  }

  if (items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Todavía no agregaste ejercicios a este plan.
      </p>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <ExerciseRow
              key={`${item.id}-${week}`}
              item={item}
              index={index}
              planId={planId}
              week={week}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
