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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function WeekCell({
  item,
  planId,
  week,
}: {
  item: IndividualPlanExercise
  planId: string
  week: number
}) {
  const setWeek = useSetPlanExerciseWeek()
  const weekData = item.weeks?.find((w) => w.week_number === week)
  const [sets, setSets] = useState(weekData?.sets?.toString() ?? "")
  const [reps, setReps] = useState(weekData?.reps ?? "")

  function commit() {
    setWeek.mutate({
      planId,
      planExerciseId: item.id,
      weekNumber: week,
      sets: sets ? Number(sets) : null,
      reps: reps || null,
    })
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Input
        type="number"
        placeholder="ser."
        value={sets}
        onChange={(e) => setSets(e.target.value)}
        onBlur={commit}
        className="h-8 w-12 px-1 text-center text-xs"
      />
      <span className="text-xs text-muted-foreground">×</span>
      <Input
        placeholder="reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        onBlur={commit}
        className="h-8 w-14 px-1 text-center text-xs"
      />
    </div>
  )
}

function ExerciseTableRow({
  item,
  index,
  planId,
  weeks,
}: {
  item: IndividualPlanExercise
  index: number
  planId: string
  weeks: number[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id })
  const removeExercise = useRemovePlanExercise()
  const style = { transform: CSS.Transform.toString(transform), transition }
  const name = item.exercise?.name ?? item.ad_hoc_name ?? "Ejercicio"

  async function handleRemove() {
    if (!confirm(`¿Quitar "${name}" del plan?`)) return
    try {
      await removeExercise.mutateAsync({ id: item.id, planId })
    } catch {
      toast.error("No se pudo quitar el ejercicio")
    }
  }

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? "opacity-60" : undefined}>
      <td className="border-b py-2 pr-2">
        <div className="flex items-center gap-1.5">
          <button
            {...attributes}
            {...listeners}
            aria-label="Reordenar"
            className="flex size-6 shrink-0 touch-none items-center justify-center text-muted-foreground"
          >
            <GripVertical className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {index + 1}. {name}
            </p>
            {item.exercise?.category && (
              <Badge variant="outline" className="mt-0.5 text-[10px]">
                {item.exercise.category}
              </Badge>
            )}
          </div>
        </div>
      </td>
      <td className="border-b py-2 text-center text-xs text-muted-foreground">
        {item.base_sets || item.base_reps ? `${item.base_sets ?? "-"}×${item.base_reps ?? "-"}` : "-"}
      </td>
      {weeks.map((week) => (
        <td key={week} className="border-b py-2">
          <WeekCell item={item} planId={planId} week={week} />
        </td>
      ))}
      <td className="border-b py-2 text-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRemove}
          className="text-destructive hover:text-destructive"
          aria-label="Quitar"
        >
          <Trash2 className="size-4" />
        </Button>
      </td>
    </tr>
  )
}

export function PlanExerciseTable({
  planId,
  items,
  durationWeeks,
}: {
  planId: string
  items: IndividualPlanExercise[]
  durationWeeks: number
}) {
  const reorder = useReorderPlanExercises()
  const weeks = Array.from({ length: durationWeeks }, (_, i) => i + 1)
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
    <div className="overflow-x-auto">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground">
              <th className="border-b pb-2 pr-2 font-medium">Ejercicio</th>
              <th className="border-b pb-2 font-medium">Base</th>
              {weeks.map((week) => (
                <th key={week} className="border-b pb-2 text-center font-medium">
                  Semana {week}
                </th>
              ))}
              <th className="border-b pb-2 font-medium" />
            </tr>
          </thead>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {items.map((item, index) => (
                <ExerciseTableRow
                  key={item.id}
                  item={item}
                  index={index}
                  planId={planId}
                  weeks={weeks}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  )
}
