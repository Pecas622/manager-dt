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
  useRemoveSessionExercise,
  useReorderSessionExercises,
  useUpdateSessionExercise,
} from "@/hooks/useTrainingSessions"
import type { SessionExercise } from "@/types/database"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function BlockItem({
  block,
  index,
  sessionId,
}: {
  block: SessionExercise
  index: number
  sessionId: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })
  const updateBlock = useUpdateSessionExercise()
  const removeBlock = useRemoveSessionExercise()
  const [duration, setDuration] = useState(block.duration.toString())

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function commitDuration() {
    const value = Number(duration)
    if (!Number.isFinite(value) || value <= 0 || value === block.duration) {
      setDuration(block.duration.toString())
      return
    }
    updateBlock.mutate({ id: block.id, sessionId, input: { duration: value } })
  }

  async function handleRemove() {
    if (!confirm(`¿Quitar "${block.exercise?.name}" de este entrenamiento?`)) return
    try {
      await removeBlock.mutateAsync({ id: block.id, sessionId })
    } catch {
      toast.error("No se pudo quitar el bloque")
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                BLOQUE {index + 1}
              </span>
              <Badge variant="outline">{block.exercise?.category}</Badge>
            </div>
            <p className="font-medium">{block.exercise?.name}</p>
            {block.exercise?.objective && (
              <p className="text-sm text-muted-foreground">{block.exercise.objective}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onBlur={commitDuration}
              className="h-9 w-16 text-center"
            />
            <span className="text-xs text-muted-foreground">min</span>
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

export function SessionExerciseBlockList({
  sessionId,
  blocks,
}: {
  sessionId: string
  blocks: SessionExercise[]
}) {
  const reorder = useReorderSessionExercises()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = [...blocks]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)
    reorder.mutate({ sessionId, orderedIds: reordered.map((b) => b.id) })
  }

  if (blocks.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Todavía no agregaste bloques a este entrenamiento.
      </p>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {blocks.map((block, index) => (
            <BlockItem key={block.id} block={block} index={index} sessionId={sessionId} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
